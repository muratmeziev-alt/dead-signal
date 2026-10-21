// WORLD section: factions / traders database with dossier panel,
// tear/static image transition and character-scramble text reveal.

const HERO = 'assets/f32fe80f2095e937a1308f3901b796c6.jpg';

const FAC = [
  { name: 'KAZI', tag: 'HOSTILE', img: 'assets/b8fad39ccde2bba1e703bf60831b005f.jpg', pos: '50% 22%', sig: 9, text: 'Ran the trials in Ward B, then sealed the zone with its own people inside. Under Tan, it runs the zone as if nothing went wrong.', stats: [['TYPE', 'THE COMPANY', 'LEADER', 'TAN'], ['TERRITORY', 'WARD B', 'STANCE', 'HOSTILE'], ['SEEN', 'EVERY RAID', 'BADGES', 'YES']] },
  { name: 'HOLLOW CHOIR', tag: 'HOSTILE', img: 'assets/01929d7d6c470a755771ac8eb880a42e.jpg', pos: '50% 40%', sig: 6, text: 'They hold the hospital chapel. They call the outbreak a cleansing and the bitten chosen.', stats: [['TYPE', 'CULT', 'LEADER', 'UNKNOWN'], ['TERRITORY', 'CHAPEL', 'STANCE', 'HOSTILE'], ['SEEN', 'AT NIGHT', 'BADGES', 'NO']] },
  { name: 'THE CLEANERS', tag: 'HOSTILE', img: 'assets/01e8f82193572386cd5b4ba97138ed94.jpg', pos: '50% 50%', sig: 5, text: 'Ex-civilians in work clothes and salvaged kit. They strip bodies, burn nests and remove witnesses.', stats: [['TYPE', 'REBEL CREW', 'LEADER', 'UNKNOWN'], ['TERRITORY', 'FURNACE', 'STANCE', 'HOSTILE'], ['SEEN', 'AFTER FIGHTS', 'BADGES', 'TAKEN']] },
  { name: 'CAIRN PMC', tag: 'NEUTRAL', sig: 7, text: 'Hired guns working the zone for whoever pays. They sell armour and they sell what they overhear.', stats: [['TYPE', 'CONTRACTORS', 'LEADER', 'UNKNOWN'], ['TERRITORY', 'EAST GATE', 'STANCE', 'FOR HIRE'], ['SEEN', 'AT THE GATE', 'BADGES', 'BOUGHT']] },
  { name: 'SCAVENGERS', tag: 'NEUTRAL', sig: 4, text: 'Every scav crew in the zone drinks at the Rust Bar and sells through Mother Rust’s counter.', stats: [['TYPE', 'NO FLAG', 'LEADER', 'NONE'], ['TERRITORY', 'RUST BAR', 'STANCE', 'NEUTRAL'], ['SEEN', 'EVERYWHERE', 'BADGES', 'SOLD']] },
  { name: 'THE GHOST', tag: '???', sig: 0, ghost: true, text: 'Officially, KAZI’s founder is dead. Some patrols report hunters in Praetorian badges.', stats: [['TYPE', 'UNCONFIRMED', 'LEADER', '██████'], ['TERRITORY', 'UNKNOWN', 'STANCE', 'UNKNOWN'], ['SEEN', 'UNCONFIRMED', 'SIGNAL', 'LOST']] }
];

const TR = [
  { name: 'IRON ANGEL', tag: 'ONLINE', img: 'assets/6cc3babce74769a487e63b555ec34faf.jpg', pos: '50% 30%', sig: 9, text: '“Cash first. Then we talk about what you want to shoot.” The beta opens with her counter.', stats: [['SELLS', 'WEAPONS', 'ALSO', 'AMMO'], ['STATUS', 'ONLINE', 'SINCE', 'BETA'], ['LOYALTY', 'LL1', 'PAYS', 'CASH ONLY']] },
  { name: 'DR. KESTREL', tag: 'AFTER BETA', sig: 2, text: 'Medicine and surgery. Comes online after the beta.', stats: [['SELLS', 'MEDS', 'ALSO', 'SURGERY'], ['STATUS', 'OFFLINE', 'SINCE', 'AFTER BETA'], ['LOYALTY', 'LOCKED', 'PAYS', '—']] },
  { name: 'MOTHER RUST', tag: 'AFTER BETA', sig: 2, text: 'Food and barter at the Rust Bar counter. Comes online after the beta.', stats: [['SELLS', 'FOOD', 'ALSO', 'BARTER'], ['STATUS', 'OFFLINE', 'SINCE', 'AFTER BETA'], ['LOYALTY', 'LOCKED', 'PAYS', '—']] },
  { name: 'THE DEACON', tag: 'AFTER BETA', sig: 2, text: 'Melee weapons and rites. Comes online after the beta.', stats: [['SELLS', 'MELEE', 'ALSO', 'RITES'], ['STATUS', 'OFFLINE', 'SINCE', 'AFTER BETA'], ['LOYALTY', 'LOCKED', 'PAYS', '—']] },
  { name: 'MAJOR VOSS', tag: 'AFTER BETA', sig: 2, text: 'Armour and intel. Comes online after the beta.', stats: [['SELLS', 'ARMOUR', 'ALSO', 'INTEL'], ['STATUS', 'OFFLINE', 'SINCE', 'AFTER BETA'], ['LOYALTY', 'LOCKED', 'PAYS', '—']] },
  { name: 'UNKNOWN', tag: 'NO SIGNAL', sig: 0, ghost: true, text: 'A sixth frequency keeps showing up on the bunker radio. Nobody has answered it yet.', stats: [['SELLS', 'UNKNOWN', 'ALSO', 'UNKNOWN'], ['STATUS', 'NO SIGNAL', 'SINCE', '—'], ['LOYALTY', '—', 'SIGNAL', 'LOST']] }
];

const CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#/%';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad2 = (n) => String(n).padStart(2, '0');

export function init(root) {
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const bgImg = $('.world-bg');
  const statusEl = $('[data-world-status]');
  const tabBtns = Array.from(root.querySelectorAll('[data-world-tab]'));
  const listEl = $('[data-world-list]');
  const imgBox = $('[data-world-img]');
  const kindEl = $('[data-world-kind]');
  const nameEl = $('[data-world-name]');
  const textEl = $('[data-world-text]');
  const statsEl = $('[data-world-stats]');

  // Mirrors the component state.
  const st = { tab: 'factions', f: 0, t: 0, flip: false, dp: 1, ch: false, out: false, pend: null };
  let dl = 0; // out-phase timeout
  let dr = 0; // scramble rAF

  const isF = () => st.tab === 'factions';
  const curList = () => (isF() ? FAC : TR);
  const curIdx = () => (isF() ? st.f : st.t);
  const cur = () => curList()[curIdx()];

  const scr = (s, d) => {
    s = String(s);
    const dp = st.dp == null ? 1 : st.dp;
    if (dp >= 1) return s;
    const n = s.length;
    let out = '';
    for (let q = 0; q < n; q++) {
      const c = s.charAt(q);
      if (c === ' ' || c === '·' || c === '.') { out += c; continue; }
      out += (q / n) < dp * 1.25 - (d || 0) ? c : CH.charAt(Math.floor(Math.random() * CH.length));
    }
    return out;
  };

  // Selected entry index as rendered (pending entry pick highlights immediately).
  const selIdx = () => {
    const pk = isF() ? 'f' : 't';
    return st.pend && st.pend.tab == null && st.pend[pk] != null ? st.pend[pk] : curIdx();
  };

  // ---- renderers ----
  const renderTabs = () => {
    const active = (st.pend && st.pend.tab) || st.tab;
    tabBtns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.worldTab === active)));
  };

  const renderList = () => {
    const sel = selIdx();
    listEl.innerHTML = curList().map((e, i) =>
      `<button type="button" role="tab" class="world-row" aria-selected="${i === sel}" data-world-entry="${i}">` +
      `<span class="world-row-name"><span aria-hidden="true" class="world-row-mark"></span>${esc(e.name)}</span>` +
      `<span class="world-row-meta">${pad2(i + 1)} · ${esc(e.tag)}</span></button>`
    ).join('');
  };

  const renderSelection = () => {
    const sel = selIdx();
    listEl.querySelectorAll('[data-world-entry]').forEach((b) => {
      b.setAttribute('aria-selected', String(Number(b.dataset.worldEntry) === sel));
    });
  };

  const renderChCls = () => {
    imgBox.classList.remove('world-out', 'world-cha', 'world-chb');
    const cls = st.out ? 'world-out' : !st.ch ? '' : st.flip ? 'world-cha' : 'world-chb';
    if (cls) imgBox.classList.add(cls);
  };

  const renderDossier = () => {
    const c = cur();
    const list = curList();
    bgImg.src = c.img || HERO;
    bgImg.style.objectPosition = c.pos || '70% 40%';
    statusEl.textContent = (isF() ? 'FACTIONS' : 'TRADERS') + ' · ' + pad2(curIdx() + 1) + ' / ' + pad2(list.length);
    kindEl.textContent = isF() ? 'FACTION PROFILE:' : 'TRADER PROFILE:';
    textEl.textContent = c.text;

    // image or placeholder (first child of the image box)
    const first = imgBox.firstElementChild;
    let media;
    if (c.img) {
      media = document.createElement('img');
      media.className = 'world-photo';
      media.alt = '';
      media.src = c.img;
      media.style.objectPosition = c.pos || '50% 50%';
    } else {
      media = document.createElement('span');
      media.className = 'world-noimg';
      const label = document.createElement('span');
      if (c.ghost) label.className = 'world-blink';
      label.textContent = c.ghost ? 'SIGNAL LOST' : 'NO VISUAL ON FILE';
      media.appendChild(label);
    }
    if (first && (first.classList.contains('world-photo') || first.classList.contains('world-noimg'))) {
      first.replaceWith(media);
    } else {
      imgBox.insertBefore(media, first);
    }

    statsEl.innerHTML = c.stats.map((s) => {
      const cls = c.ghost && s[3] === 'LOST' ? ' class="world-blink"' : '';
      return `<span><span class="world-dim">${esc(s[0])}:</span> <span data-world-v></span><br>` +
        `<span class="world-dim">${esc(s[2])}:</span> <span data-world-v2${cls}></span></span>`;
    }).join('');
    renderScramble();
  };

  const renderScramble = () => {
    const c = cur();
    nameEl.textContent = scr(c.name);
    const vs = statsEl.querySelectorAll('[data-world-v]');
    const v2s = statsEl.querySelectorAll('[data-world-v2]');
    c.stats.forEach((s, i) => {
      if (vs[i]) vs[i].textContent = scr(s[1], 0.15);
      if (v2s[i]) v2s[i].textContent = scr(s[3], 0.25);
    });
  };

  // ---- flow ----
  const commit = (o) => {
    const tabChanged = o.tab != null && o.tab !== st.tab;
    Object.assign(st, o);
    st.flip = !st.flip; st.ch = true; st.dp = 0; st.out = false; st.pend = null;

    renderTabs();
    if (tabChanged) renderList(); else renderSelection();
    renderChCls();
    renderDossier();

    if (dr) cancelAnimationFrame(dr);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 650);
      st.dp = p;
      renderScramble();
      dr = p < 1 ? requestAnimationFrame(step) : 0;
    };
    dr = requestAnimationFrame(step);
  };

  const go = (o) => {
    clearTimeout(dl);
    st.pend = o; st.out = true;
    renderTabs();
    renderSelection();
    renderChCls();
    dl = setTimeout(() => commit(o), 320);
  };

  // ---- events ----
  tabBtns.forEach((b) => {
    b.addEventListener('click', () => {
      const t = b.dataset.worldTab;
      if (st.tab !== t) go({ tab: t });
    });
  });

  listEl.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-world-entry]');
    if (!b || !listEl.contains(b)) return;
    const i = Number(b.dataset.worldEntry);
    if (i === selIdx()) return;
    go(isF() ? { f: i } : { t: i });
  });

  // Initial render matches the static markup; sync anyway in case of drift.
  renderTabs();
  renderSelection();
}
