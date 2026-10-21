// DEAD SIGNAL · The Game section (raid phases + progression badges)

export const PHASES = [
  { num: '01', name: 'BREACH', sub: 'DEPLOY / BUNKER EXIT', title: 'DEPLOY WITH WHAT YOU CAN CARRY', body: 'Leave the bunker with your gear, your rig and nothing to spare. Every room in the zone is a fight: the infected, rival crews and KAZI patrols guarding the trial wards.', image: 'assets/2f9ea34f805d750b68576115ff35149d.jpg', alt: 'A squad breaching a lab door', position: '62% 50%',
    stats: [{ value: '05', label: 'INFECTED TYPES' }, { value: '03', label: 'RIVAL CREWS' }],
    items: [['WALKER', 'INFECTED'], ['RUNNER', 'INFECTED'], ['BRUTE', 'INFECTED'], ['BLOATER', 'INFECTED'], ['SCREAMER', 'INFECTED'], ['THE CLEANERS', 'CREW'], ['CAIRN PMC', 'CREW'], ['SCAVENGERS', 'CREW'], ['KAZI PATROLS', 'PATROL']] },
  { num: '02', name: 'LOOT', sub: 'SEARCH / INVENTORY', title: 'SEARCH EVERYTHING. CARRY WHAT FITS.', body: 'Bodies, crates and lockers all hold something. Every item takes grid space and weight, and every gun you bring home can be stripped and rebuilt on the bench.', image: 'assets/08440bdf718e925081aff7be6fce3f44.jpg', alt: 'A loot table with rifles, cash and supplies', position: '55% 50%',
    stats: [{ value: '09', label: 'BADGE RANKS' }, { value: '03', label: 'ITEM CONDITIONS' }],
    items: [['RIFLES', 'WEAPON'], ['AMMO', 'WEAPON'], ['WEAPON PARTS', 'WEAPON'], ['MEDS', 'GEAR'], ['FOOD', 'GEAR'], ['ARMOUR', 'GEAR'], ['CASH', 'VALUE'], ['INTEL NOTES', 'INTEL'], ['KAZI BADGES', 'VALUE']] },
  { num: '03', name: 'EXTRACT', sub: 'EXIT / BEFORE THE SIGNAL DROPS', title: 'GET OUT, OR LOSE IT ALL', body: 'Reach an exit before the signal drops. Make it out and everything you carried is yours. Go down, and it stays where you fell.', image: 'assets/3ddec52c860b172d69222a7fc4ce5766.jpg', alt: 'A squad running to an extraction helicopter', position: '35% 50%',
    warn: true, stats: [{ value: '05', label: 'TRADERS' }, { value: '12', label: 'BUNKER ROOMS' }],
    items: [['HELIPAD', 'EXIT'], ['BUNKER', 'BASE'], ['STORAGE', 'BASE'], ['IRON ANGEL', 'TRADER'], ['DR. KESTREL', 'TRADER'], ['MOTHER RUST', 'TRADER'], ['THE DEACON', 'TRADER'], ['MAJOR VOSS', 'TRADER'], ['CONTRACTS', 'BASE']] }
];

export const BADGES = [
  { name: 'KAZI PATCH', image: 'assets/0715e11e97bf00b15f0b96f42f316775.webp' },
  { name: 'RECRUIT', image: 'assets/064095d40c9a2cd12e03d0bf586f5634.webp' },
  { name: 'OPERATOR', image: 'assets/54265f44bd716e5f119178983e1b6cbd.webp' },
  { name: 'SPECIALIST', image: 'assets/b0d4607480959dfe698518abecf4dc05.webp' },
  { name: 'VETERAN', image: 'assets/7d7875c0d3df38d58ac7781ee2ed4ee4.webp' },
  { name: 'ELITE', image: 'assets/ca54e4003cebd5e4777356739ced3759.webp' },
  { name: 'GHOST', image: 'assets/c0b6f5cdebddc35ff93a531bc3b2f22e.webp' },
  { name: 'PRAETORIAN', image: 'assets/a2f0c15755f2c88f96674c6132c7ee9b.webp' },
  { name: 'FOUNDER', image: 'assets/f1a2c7147384078fd4bbb2f7967bc3e2.webp' }
];

export const CONDITIONS = [
  { label: 'PRISTINE', filter: 'none' },
  { label: 'SCRATCHED', filter: 'grayscale(.35) contrast(1.25) brightness(.82)' },
  { label: 'BLOODIED', filter: 'sepia(.6) saturate(2.4) hue-rotate(-35deg) brightness(.62) contrast(1.2)' }
];

const W = 1328;
export const RAIL_ITEMS = [];
PHASES.forEach((P) => P.items.forEach((it) => RAIL_ITEMS.push(it)));

// Everything derived from the continuous phase value f (0..2)
export function railVals(f) {
  const center = 4 + 9 * f;
  const sx = (213 + 451 * f).toFixed(1);
  return RAIL_ITEMS.map((it, j) => {
    const u = (j - center) / 4, au = Math.abs(u);
    const x = 664 + 554 * u, y = 62 + 44 * (1 - u * u);
    const w = Math.max(0, 1 - 2 * Math.abs(Math.floor(j / 9) - f));
    const o = (au <= 1 ? 1 - 0.55 * au : Math.max(0, (1.35 - au) / 0.35 * 0.45)) * w;
    return {
      d: 'M' + sx + ' 0 C ' + sx + ' ' + (y * 0.6).toFixed(1) + ', ' + x.toFixed(1) + ' ' + (y * 0.3).toFixed(1) + ', ' + x.toFixed(1) + ' ' + y.toFixed(1),
      left: (x / W * 100).toFixed(2) + '%',
      top: y.toFixed(1) + 'px',
      o: o.toFixed(3),
      vis: o > 0 ? 'visible' : 'hidden'
    };
  });
}

export function cardVals(f) {
  const cur = Math.round(f);
  return PHASES.map((P, pi) => {
    const dlt = pi - f, th = dlt * 10 * Math.PI / 180, R = 6000;
    const op = Math.max(0, 1 - Math.abs(dlt) * 1.25);
    return {
      op: op.toFixed(3),
      vis: op > 0 ? 'visible' : 'hidden',
      tx: 'translate(' + (Math.sin(th) * R).toFixed(1) + 'px, ' + (-(1 - Math.cos(th)) * R).toFixed(1) + 'px) rotate(' + (dlt * -10).toFixed(2) + 'deg)',
      hidden: pi !== cur,
      pe: pi === cur ? 'auto' : 'none'
    };
  });
}

export function progPct(f) { return ((f + 1) / 3 * 100).toFixed(1) + '%'; }

export function badgeVals(sel, cond) {
  return BADGES.map((b, i) => {
    const on = i === sel, o = i - sel, ab = Math.abs(o), sg = o < 0 ? -1 : 1;
    const k = ab === 0 ? 0 : sg * (1.08 + (ab - 1) * 0.9);
    return {
      selected: on,
      past: i < sel,
      tx: 'translateX(calc(var(--s) * ' + k.toFixed(2) + ')) rotateY(' + (ab ? -sg * 24 : 0) + 'deg) scale(' + (ab ? 0.84 : 1) + ')',
      op: String(ab === 0 ? 1 : ab === 1 ? 0.8 : ab === 2 ? 0.45 : ab === 3 ? 0.18 : 0),
      vis: ab > 3 ? 'hidden' : 'visible',
      z: String(10 - ab),
      filter: on ? CONDITIONS[cond].filter : 'grayscale(.6) brightness(.55)'
    };
  });
}

export function init(root) {
  if (!root) return;
  const pin = root.querySelector('[data-ds-pin]');
  const sc = root.closest('[data-ds-page]') || document.getElementById('page');

  const progBar = root.querySelector('.game-prog-bar');
  const tabs = Array.from(root.querySelectorAll('.game-ph'));
  const paths = Array.from(root.querySelectorAll('.game-fan-svg path'));
  const labels = Array.from(root.querySelectorAll('.game-rl'));
  const cards = Array.from(root.querySelectorAll('.game-card'));

  const state = { f: 0, selected: 4, condition: 0, paged: false };
  let phase = 0, raf = 0, lastCur = -1;

  function renderF() {
    const f = state.f;
    const cur = Math.round(f);
    if (progBar) progBar.style.width = progPct(f);
    const rv = railVals(f);
    rv.forEach((l, j) => {
      const a = paths[j * 2], b = paths[j * 2 + 1];
      if (a) { a.setAttribute('d', l.d); a.setAttribute('opacity', l.o); }
      if (b) { b.setAttribute('d', l.d); b.setAttribute('opacity', l.o); }
      const el = labels[j];
      if (el) {
        el.style.left = l.left;
        el.style.top = l.top;
        el.style.opacity = l.o;
        el.style.visibility = l.vis;
      }
    });
    cardVals(f).forEach((c, i) => {
      const el = cards[i];
      if (!el) return;
      el.style.opacity = c.op;
      el.style.visibility = c.vis;
      el.style.transform = c.tx;
      el.style.pointerEvents = c.pe;
      el.setAttribute('aria-hidden', String(c.hidden));
    });
    if (cur !== lastCur) {
      lastCur = cur;
      tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === cur)));
    }
  }

  function tweenTo(target) {
    target = Math.max(0, Math.min(2, target));
    phase = target;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    const from = state.f;
    if (Math.abs(target - from) < 0.001) return;
    const t0 = performance.now(), dur = 700;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const ez = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      state.f = from + (target - from) * ez;
      renderF();
      raf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  }

  function geo() {
    const r = pin.getBoundingClientRect(), s = sc.getBoundingClientRect(), vh = sc.clientHeight;
    const h = Math.min(vh, 900), top = (vh - h) / 2;
    return { off: r.top - s.top - top, run: r.height - h };
  }

  function onPageScroll() {
    if (!pin || !sc) return;
    const g = geo();
    if (g.run <= 0) return;
    const p = -g.off / g.run;
    const ph = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    if (ph !== phase) tweenTo(ph);
  }

  function goPhase(i) {
    if (!pin || !sc || !state.paged) { tweenTo(i); return; }
    const g = geo();
    const y = sc.scrollTop + g.off + g.run * (i + 0.5) / 3;
    if (typeof window.dsScrollTo === 'function') window.dsScrollTo(y);
    else sc.scrollTo({ top: y, behavior: 'smooth' });
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => goPhase(i)));

  // Bind the pin to the page scroller ("paged" state)
  if (pin && sc) {
    state.paged = true;
    pin.classList.add('game-pin--paged');
    sc.addEventListener('scroll', onPageScroll, { passive: true });
    requestAnimationFrame(onPageScroll);
  }

  // ---- Badges / insignia viewer ----
  const badgeBtns = Array.from(root.querySelectorAll('.game-badge'));
  const badgeImgs = badgeBtns.map((b) => b.querySelector('.game-badge-img'));
  const dotBtns = Array.from(root.querySelectorAll('.game-dot'));
  const condBtns = Array.from(root.querySelectorAll('.game-chip'));
  const idxEl = root.querySelector('[data-game-badge-index]');
  const nameEl = root.querySelector('[data-game-badge-name]');

  function renderBadges() {
    const sel = state.selected, cond = state.condition;
    if (idxEl) idxEl.textContent = String(sel + 1).padStart(2, '0');
    if (nameEl) nameEl.textContent = BADGES[sel].name;
    badgeVals(sel, cond).forEach((b, i) => {
      const el = badgeBtns[i];
      if (el) {
        el.setAttribute('aria-pressed', String(b.selected));
        el.style.transform = b.tx;
        el.style.opacity = b.op;
        el.style.visibility = b.vis;
        el.style.zIndex = b.z;
      }
      if (badgeImgs[i]) badgeImgs[i].style.filter = b.filter;
      const d = dotBtns[i];
      if (d) {
        d.setAttribute('aria-pressed', String(b.selected));
        d.classList.toggle('game-dot--past', b.past);
      }
    });
    condBtns.forEach((c, i) => c.setAttribute('aria-pressed', String(i === cond)));
  }

  const pick = (i) => { state.selected = i; renderBadges(); };
  badgeBtns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  dotBtns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  const prev = root.querySelector('[data-game-prev]');
  const next = root.querySelector('[data-game-next]');
  if (prev) prev.addEventListener('click', () => pick((state.selected + BADGES.length - 1) % BADGES.length));
  if (next) next.addEventListener('click', () => pick((state.selected + 1) % BADGES.length));
  condBtns.forEach((c, i) => c.addEventListener('click', () => { state.condition = i; renderBadges(); }));

  renderF();
  renderBadges();
}
