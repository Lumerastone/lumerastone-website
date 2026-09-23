const messages = JSON.parse(document.querySelector('#locale-messages').textContent);
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', messages.menuOpen); }
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? messages.menuClose : messages.menuOpen);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('.product').forEach(product => {
  product.addEventListener('click', () => {
    document.querySelector('#color').value = product.dataset.color;
    document.querySelector('#contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector('input[name="name"]').focus({ preventScroll: true });
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#inquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  for (const input of form.querySelectorAll('input[required]')) {
    input.setCustomValidity(input.value.trim() ? '' : messages.required);
    if (!input.reportValidity()) return;
  }
  const data = new FormData(form);
  const shade = form.querySelector('#color').selectedOptions[0].textContent;
  const content = `LUMERASTONE — ${messages.fileTitle}\n\n${messages.fileName}: ${data.get('name').trim()}\n${messages.fileContact}: ${data.get('contact').trim()}\n${messages.fileColor}: ${shade}\n${messages.fileIdea}: ${data.get('message').trim() || messages.fallbackIdea}\n\nLUMERASTONE: +48 662 522 396\n`;
  const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lumerastone-${document.documentElement.lang}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = messages.success;
});
document.querySelectorAll('input[required]').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
