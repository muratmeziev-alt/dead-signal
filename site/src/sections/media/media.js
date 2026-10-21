const SHOTS = [
  { title: 'EXTRACTION AT THE HELIPAD', place: 'HELIPAD · EXIT', img: 'assets/3ddec52c860b172d69222a7fc4ce5766.jpg', pos: '35% 50%' },
  { title: 'THE SPECIMEN TANK', place: 'WARD B · CONTAINMENT', img: 'assets/46a9c08fe3ba5bc3adab7a72d510fb67.jpg', pos: '62% 42%' },
  { title: 'THE HOLLOW CHOIR', place: 'HOSPITAL CHAPEL', img: 'assets/01929d7d6c470a755771ac8eb880a42e.jpg', pos: '50% 40%' },
  { title: 'KAZI NIGHT PATROL', place: 'WARD B · PERIMETER', img: 'assets/b8fad39ccde2bba1e703bf60831b005f.jpg', pos: '50% 22%' },
  { title: 'BREACHING LAB B-1', place: 'WARD B · LAB B-1', img: 'assets/2f9ea34f805d750b68576115ff35149d.jpg', pos: '62% 50%' },
  { title: 'THE BUNKER', place: 'DEPLOY ROOM', img: 'assets/c6d05b18844288fc19e65301f3b92556.jpg', pos: '62% 50%' },
  { title: 'IRON ANGEL’S COUNTER', place: 'THE BUNKER', img: 'assets/6cc3babce74769a487e63b555ec34faf.jpg', pos: '50% 30%' },
  { title: 'FIRST PLAYTEST', place: 'BUILD 0.3', img: 'assets/ba6646f6b94c35414270d0c492495635.jpg', pos: '50% 65%' }
];

const pad = (n) => String(n).padStart(2, '0');

export function init(root) {
  if (!root) return;
  const lb = root.querySelector('.media-lb');
  const thumbs = Array.from(root.querySelectorAll('.media-thumb'));
  if (!lb || !thumbs.length) return;

  const img = lb.querySelector('.media-lb-img');
  const counter = lb.querySelector('.media-lb-counter');
  const title = lb.querySelector('.media-lb-title');
  const place = lb.querySelector('.media-lb-place');
  const closeBtn = lb.querySelector('[data-action="close"]');
  const n = SHOTS.length;
  const count = pad(n);

  let open = -1;
  let opener = null;

  function render() {
    const c = SHOTS[open] || SHOTS[0];
    img.src = c.img;
    img.alt = c.title;
    img.style.objectPosition = c.pos;
    counter.textContent = `REC · IMG ${pad(open + 1)} / ${count}`;
    title.textContent = c.title;
    place.textContent = c.place;
    lb.setAttribute('aria-label', c.title);
  }

  function go(i) {
    const wasOpen = open >= 0;
    open = (i + n) % n;
    render();
    if (!wasOpen) {
      lb.hidden = false;
      document.addEventListener('keydown', onKey);
      closeBtn.focus({ preventScroll: true });
    }
  }

  function close() {
    if (open < 0) return;
    open = -1;
    lb.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (opener) opener.focus({ preventScroll: true });
    opener = null;
  }

  function onKey(e) {
    if (open < 0) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(open - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(open + 1); }
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      const f = Array.from(lb.querySelectorAll('button'));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => {
      opener = t;
      go(Number(t.dataset.index ?? i));
    });
  });

  lb.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const a = btn.dataset.action;
    if (a === 'prev') go(open - 1);
    else if (a === 'next') go(open + 1);
    else if (a === 'close') close();
  });
}
