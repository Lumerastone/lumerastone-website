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

// Hero gallery: only the newly renamed ok (1).png–ok (9).png files are used.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  const heroImage = heroVisual.querySelector(':scope > img');
  const topCounter = heroVisual.querySelector('.image-top span:last-child');
  if (heroImage) {
    const labels = {
      pl: { gallery: 'Galeria zdjęć', previous: 'Poprzednie zdjęcie', next: 'Następne zdjęcie', photo: 'Zdjęcie' },
      ru: { gallery: 'Фотогалерея', previous: 'Предыдущее фото', next: 'Следующее фото', photo: 'Фото' },
      uk: { gallery: 'Фотогалерея', previous: 'Попереднє фото', next: 'Наступне фото', photo: 'Фото' },
      en: { gallery: 'Photo gallery', previous: 'Previous photo', next: 'Next photo', photo: 'Photo' }
    }[document.documentElement.lang] || { gallery: 'Photo gallery', previous: 'Previous photo', next: 'Next photo', photo: 'Photo' };
    const photos = Array.from({ length: 9 }, (_, index) => `/gallery/ok%20(${index + 1}).png`);
    let activeIndex = -1;
    const gallery = document.createElement('div');
    gallery.className = 'hero-gallery';
    gallery.setAttribute('role', 'group');
    gallery.setAttribute('aria-label', labels.gallery);
    gallery.innerHTML = `<button class="hero-gallery-arrow" type="button" data-step="-1" aria-label="${labels.previous}">‹</button><div class="hero-gallery-thumbs" role="group" aria-label="${labels.gallery}"></div><button class="hero-gallery-arrow" type="button" data-step="1" aria-label="${labels.next}">›</button>`;
    const thumbs = gallery.querySelector('.hero-gallery-thumbs');
    const caption = heroVisual.querySelector('.image-caption');
    const verticalCaption = heroVisual.querySelector('.vertical-caption');
    const buttons = photos.map((src, index) => {
      const button = document.createElement('button');
      button.className = 'hero-gallery-thumb';
      button.type = 'button';
      button.setAttribute('aria-label', `${labels.photo} ${index + 1} / ${photos.length}`);
      button.setAttribute('aria-pressed', 'false');
      const image = document.createElement('img');
      image.src = src;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      button.append(image);
      button.addEventListener('click', () => showPhoto(index));
      thumbs.append(button);
      return button;
    });
    function showPhoto(index) {
      activeIndex = (index + photos.length) % photos.length;
      heroImage.src = photos[activeIndex];
      heroImage.alt = `${labels.photo} ${activeIndex + 1} / ${photos.length}`;
      heroImage.removeAttribute('fetchpriority');
      if (caption) caption.hidden = true;
      if (verticalCaption) verticalCaption.hidden = true;
      if (topCounter) topCounter.textContent = `${String(activeIndex + 1).padStart(2, '0')} — ${String(photos.length).padStart(2, '0')}`;
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === activeIndex;
        button.setAttribute('aria-pressed', String(selected));
        if (selected) button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      });
    }
    gallery.querySelectorAll('.hero-gallery-arrow').forEach(button => button.addEventListener('click', () => showPhoto(activeIndex + Number(button.dataset.step || 1))));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
        buttons[activeIndex].focus();
      }
    });
    heroVisual.append(gallery);
    const galleryStyles = document.createElement('style');
    galleryStyles.textContent = `
      .hero-visual{position:relative}
      .hero-gallery{position:absolute;z-index:3;left:18px;right:18px;bottom:76px;display:flex;align-items:center;gap:8px;padding:8px;border:1px solid rgba(239,238,231,.2);border-radius:4px;background:rgba(20,21,18,.78);backdrop-filter:blur(12px)}
      .hero-gallery-thumbs{display:flex;flex:1;min-width:0;gap:7px;overflow-x:auto;scrollbar-width:thin;scrollbar-color:#edb579 transparent}
      .hero-gallery-thumb,.hero-gallery-arrow{flex:0 0 auto;padding:0;border:1px solid rgba(239,238,231,.35);background:#191b18;cursor:pointer}
      .hero-gallery-thumb{width:54px;height:42px;overflow:hidden;opacity:.72;transition:opacity .2s,border-color .2s,transform .2s}
      .hero-gallery-thumb:hover,.hero-gallery-thumb[aria-pressed="true"]{opacity:1;border-color:#edb579;transform:translateY(-2px)}
      .hero-gallery-thumb img{display:block;width:100%;height:100%;object-fit:cover}
      .hero-gallery-arrow{width:34px;height:34px;border-radius:50%;color:#efeee7;font-size:25px;line-height:1}
      .hero-gallery-arrow:hover{color:#edb579;border-color:#edb579}
      .hero-gallery button:focus-visible{outline:2px solid #edb579;outline-offset:3px}
      .image-caption[hidden],.vertical-caption[hidden]{display:none}
      @media(max-width:760px){.hero-gallery{left:10px;right:10px;bottom:70px;gap:5px;padding:6px}.hero-gallery-thumb{width:42px;height:36px}.hero-gallery-thumbs{gap:5px}.hero-gallery-arrow{width:30px;height:30px}}
      @media(prefers-reduced-motion:reduce){.hero-gallery-thumb{transition:none}}
    `;
    document.head.append(galleryStyles);
  }
}

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
