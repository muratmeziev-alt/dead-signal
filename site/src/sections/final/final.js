export function init(root) {
  if (!root) return;

  // FAQ accordion: one item open at a time (initially index 0), click toggles.
  const buttons = Array.from(root.querySelectorAll('.final-q'));
  let open = 0;

  const render = () => {
    buttons.forEach((btn, i) => {
      const isOpen = i === open;
      btn.setAttribute('aria-expanded', String(isOpen));
      const icon = btn.querySelector('.final-icon');
      if (icon) icon.classList.toggle('is-open', isOpen);
      const answer = root.querySelector('#' + btn.getAttribute('aria-controls'));
      if (answer) answer.hidden = !isOpen;
    });
  };

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      open = open === i ? -1 : i;
      render();
    });
  });
  render();

  // Email signup: no backend yet.
  const form = root.querySelector('.final-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: hook up email signup
    });
  }
}
