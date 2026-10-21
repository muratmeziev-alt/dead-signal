// Hero: CRT intro runs via CSS on load. JS only drives the full-screen menu dialog
// (source state: { menu: false }, openMenu / closeMenu).
export function init(root) {
  if (!root) return;
  const menu = root.querySelector('.hero-menu');
  const openBtn = root.querySelector('[data-hero-open]');
  if (!menu || !openBtn) return;

  let open = false;
  let returnFocus = null;

  function setOpen(next, { restoreFocus = true } = {}) {
    if (next === open) return;
    open = next;
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openBtn;
      menu.hidden = false;
      const closeBtn = menu.querySelector('.hero-menu-close');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
      document.addEventListener('keydown', onKey);
    } else {
      menu.hidden = true;
      document.removeEventListener('keydown', onKey);
      if (restoreFocus) (returnFocus || openBtn).focus({ preventScroll: true });
      returnFocus = null;
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'Tab') {
      // keep focus inside the modal dialog
      const items = [...menu.querySelectorAll('a[href], button:not([disabled])')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  openBtn.addEventListener('click', () => setOpen(true));

  menu.querySelectorAll('[data-hero-close]').forEach((el) => {
    // links: let the shell's anchor handler scroll; don't yank focus/scroll back to the burger
    const isLink = el.tagName === 'A';
    el.addEventListener('click', () => setOpen(false, { restoreFocus: !isLink }));
  });
}
