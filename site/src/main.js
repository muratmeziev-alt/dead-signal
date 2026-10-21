import { init as initHero } from './sections/hero/hero.js';
import { init as initGame } from './sections/game/game.js';
import { init as initWorld } from './sections/world/world.js';
import { init as initMedia } from './sections/media/media.js';
import { init as initFinal } from './sections/final/final.js';

const FX = {
  idle: 0.3,   // how often idle glitch bursts happen
  scroll: 1.3, // strength of the burst when a section scrolls into view
  cursor: true,
};

// The glitch is a full-viewport SVG filter and is expensive to render, so it only
// runs in short bursts, never while the page is scrolling, and only on desktop.
const SCROLL_SETTLE_MS = 160;

const page = document.getElementById('page');

initHero(page.querySelector('.hero'));
initGame(page.querySelector('.game'));
initWorld(page.querySelector('.world'));
initMedia(page.querySelector('.media'));
initFinal(page.querySelector('.final'));

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initSmoothScroll();
  if (matchMedia('(pointer: fine)').matches) initGlitch();
  if (FX.cursor && matchMedia('(pointer: fine)').matches) initCursor();
}

/* ---------- Smooth wheel scrolling + anchor links ---------- */

let cur = page.scrollTop;
let target = cur;
let raf = 0;
let ease = 0.1;

const maxScroll = () => Math.max(0, page.scrollHeight - page.clientHeight);

function loop() {
  const d = target - cur;
  if (Math.abs(d) < 0.5) {
    cur = target;
    raf = 0;
  } else {
    cur += d * ease;
    raf = requestAnimationFrame(loop);
  }
  page.scrollTop = cur;
}

function go(y, k) {
  ease = k;
  target = Math.max(0, Math.min(maxScroll(), y));
  if (!raf) {
    cur = page.scrollTop;
    raf = requestAnimationFrame(loop);
  }
}

function initSmoothScroll() {
  window.dsScrollTo = (y) => go(y, 0.08);

  page.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? page.clientHeight : 1;
    const dy = e.deltaY * unit;
    if (!dy) return;
    e.preventDefault();
    if (!raf) cur = target = page.scrollTop;
    const lead = page.clientHeight * 0.35;
    let t = target + dy;
    if (t - cur > lead) t = cur + lead;
    if (cur - t > lead) t = cur - lead;
    go(t, 0.1);
  }, { passive: false });

  page.addEventListener('scroll', () => {
    if (!raf && Math.abs(page.scrollTop - cur) > 1) cur = target = page.scrollTop;
  }, { passive: true });

  page.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const dest = id && document.getElementById(id);
    if (!dest || !page.contains(dest)) return;
    e.preventDefault();
    go(page.scrollTop + dest.getBoundingClientRect().top - page.getBoundingClientRect().top, 0.08);
  });
}

/* ---------- Page glitch (SVG displacement filter) ---------- */

let glitch = 0;       // current scroll-driven glitch energy
let cursorGlitch = 0; // cursor-driven local distortion
let px = -1;
let py = -1;

function createFilter() {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const svg = mk('svg', { width: '0', height: '0', 'aria-hidden': 'true', style: 'position:absolute;width:0;height:0;overflow:hidden' });
  const f = mk('filter', { id: 'page-glitch', x: '0', y: '0', width: '1', height: '1', 'color-interpolation-filters': 'sRGB' }, mk('defs', {}, svg));
  const turb = mk('feTurbulence', { type: 'fractalNoise', baseFrequency: '0 0.04', numOctaves: '1', seed: '1', result: 't' }, f);
  const ct = mk('feComponentTransfer', { in: 't', result: 'm' }, f);
  const fr = mk('feFuncR', { type: 'discrete', tableValues: '.5' }, ct);
  mk('feFuncG', { type: 'linear', slope: '0', intercept: '.5' }, ct);
  const disp = mk('feDisplacementMap', { in: 'SourceGraphic', in2: 'm', scale: '0', xChannelSelector: 'R', yChannelSelector: 'G', result: 'd1' }, f);
  const turb2 = mk('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.004 0.05', numOctaves: '1', seed: '3', result: 't2' }, f);
  const ct2 = mk('feComponentTransfer', { in: 't2', result: 'w' }, f);
  mk('feFuncG', { type: 'linear', slope: '0', intercept: '.5' }, ct2);
  mk('feFuncA', { type: 'linear', slope: '0', intercept: '1' }, ct2);
  const img = mk('feImage', {
    href: 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3CradialGradient id=%22g%22%3E%3Cstop offset=%220%22 stop-color=%22%23fff%22/%3E%3Cstop offset=%22.45%22 stop-color=%22%23999%22/%3E%3Cstop offset=%221%22 stop-color=%22%23000%22/%3E%3C/radialGradient%3E%3Crect width=%22100%22 height=%22100%22 fill=%22url(%23g)%22/%3E%3C/svg%3E',
    x: '-999', y: '-999', width: '420', height: '300', preserveAspectRatio: 'none', result: 'gi',
  }, f);
  mk('feFlood', { 'flood-color': '#000', result: 'blk' }, f);
  mk('feComposite', { in: 'gi', in2: 'blk', operator: 'over', result: 'mk' }, f);
  mk('feComposite', { in: 'w', in2: 'mk', operator: 'arithmetic', k1: '1', k2: '0', k3: '-.5', k4: '.5', result: 'm2' }, f);
  const disp2 = mk('feDisplacementMap', { in: 'd1', in2: 'm2', scale: '0', xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }, f);
  mk('feColorMatrix', { in: 'd', type: 'matrix', values: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0', result: 'r' }, f);
  const or = mk('feOffset', { in: 'r', dx: '0', dy: '0', result: 'ro' }, f);
  mk('feColorMatrix', { in: 'd', type: 'matrix', values: '0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0', result: 'c' }, f);
  const oc = mk('feOffset', { in: 'c', dx: '0', dy: '0', result: 'co' }, f);
  mk('feBlend', { in: 'ro', in2: 'co', mode: 'screen', result: 'b' }, f);
  const oj = mk('feOffset', { in: 'b', dx: '0', dy: '0' }, f);
  document.body.appendChild(svg);
  return { turb, fr, disp, or, oc, oj, turb2, img, disp2 };
}

function cssAnimationRunning() {
  return page.getAnimations({ subtree: true }).some((a) =>
    a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity);
}

function initGlitch() {
  const fx = createFilter();
  const R = Math.random;
  let idleT = 0;
  let burst = 0;
  let lastScroll = -Infinity;
  let pendingBurst = false;

  const frame = (now) => {
    requestAnimationFrame(frame);
    if (page.querySelector('[aria-modal="true"]:not([hidden])')) { page.style.filter = ''; return; }
    // Re-rendering the filter on every scroll frame is what made scrolling stutter.
    if (now - lastScroll < SCROLL_SETTLE_MS) { page.style.filter = ''; return; }
    if (pendingBurst) { pendingBurst = false; glitch = Math.max(glitch, 0.45 * FX.scroll); }

    const cursorOn = cursorGlitch > 0.02;
    if (cursorOn) {
      const br = page.getBoundingClientRect();
      fx.img.setAttribute('x', (px - br.left - 210).toFixed(0));
      fx.img.setAttribute('y', (py - br.top - 150).toFixed(0));
      fx.turb2.setAttribute('seed', String(1 + Math.floor(R() * 999)));
      fx.disp2.setAttribute('scale', (cursorGlitch * 9).toFixed(1));
      cursorGlitch *= 0.92;
    } else if (cursorGlitch) {
      cursorGlitch = 0;
      fx.disp2.setAttribute('scale', '0');
      fx.img.setAttribute('x', '-999');
    }

    let g = glitch;
    let tick = true;
    if (g < 0.03) {
      glitch = g = 0;
      if (now - idleT < 80) tick = false;
      else {
        idleT = now;
        if (burst > 0) { burst--; g = (0.2 + R() * 0.2) * Math.min(1, FX.idle * 2); }
        else if (R() < 0.035 * FX.idle * 2) burst = 2 + Math.floor(R() * 3);
      }
    } else glitch *= 0.86;

    const e = g;
    if (e < 0.01 && !cursorOn) { page.style.filter = ''; return; }
    // Chrome does not repaint compositor-driven CSS animations under an SVG filter,
    // so the glitch steps aside while any finite CSS animation in the page is playing.
    if (cssAnimationRunning()) { page.style.filter = ''; return; }
    page.style.filter = 'url(#page-glitch)';
    if (!tick) return;

    const n = 10 + Math.floor(R() * 14);
    const tv = [];
    for (let i = 0; i < n; i++) {
      tv.push(R() < 0.03 + e * 0.16
        ? (R() < 0.5 ? 0.5 - (0.15 + R() * 0.35) : 0.5 + 0.15 + R() * 0.35).toFixed(2)
        : '.5');
    }
    fx.fr.setAttribute('tableValues', tv.join(' '));
    fx.turb.setAttribute('seed', String(1 + Math.floor(R() * 999)));
    fx.turb.setAttribute('baseFrequency', '0 ' + (0.004 + R() * 0.014).toFixed(4));
    fx.disp.setAttribute('scale', (e * (8 + R() * 12)).toFixed(1));
    const c = (FX.idle * 1.1 + g * (1 + R() * 1.4)).toFixed(2);
    fx.or.setAttribute('dx', c);
    fx.oc.setAttribute('dx', -c);
    fx.oj.setAttribute('dx', ((R() - 0.5) * g * 2).toFixed(1));
    fx.oj.setAttribute('dy', (R() < 0.06 ? (R() - 0.5) * g * 4 : 0).toFixed(1));
  };
  requestAnimationFrame(frame);

  page.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });

  // A short glitch burst once scrolling settles after a section comes into view.
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      pendingBurst = true;
    }
  }, { root: page, rootMargin: '0px 0px -25% 0px' });
  [...page.children].slice(1).forEach((el) => io.observe(el));
}

/* ---------- Custom cursor ---------- */

function initCursor() {
  const el = document.querySelector('.page-cursor');
  document.documentElement.classList.add('has-cursor');

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const x = e.clientX;
    const y = e.clientY;
    const dx = px < 0 ? 0 : x - px;
    const dy = py < 0 ? 0 : y - py;
    const speed = Math.sqrt(dx * dx + dy * dy);
    px = x;
    py = y;
    el.style.opacity = 1;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
    const hit = e.target.closest?.('a,button,input,select,label,[role="tab"]');
    el.toggleAttribute('data-hover', !!hit);
    // Only fast flicks distort the page; ordinary pointer movement stays cheap.
    if (speed > 30) cursorGlitch = Math.max(cursorGlitch, Math.min(1, speed / 60));
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget) return;
    el.style.opacity = 0;
    px = py = -1;
  });
  document.addEventListener('pointerdown', () => el.setAttribute('data-down', ''));
  document.addEventListener('pointerup', () => el.removeAttribute('data-down'));
}
