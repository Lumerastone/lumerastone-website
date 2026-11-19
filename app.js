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

// Hero gallery: only the renamed ok (1).png–ok (9).png files are used.
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
    gallery.innerHTML = `<button class="hero-gallery-arrow hero-gallery-prev" type="button" data-step="-1" aria-label="${labels.previous}"><span aria-hidden="true">←</span></button><div class="hero-gallery-thumbs" role="group" aria-label="${labels.gallery}"></div><button class="hero-gallery-arrow hero-gallery-next" type="button" data-step="1" aria-label="${labels.next}"><span aria-hidden="true">→</span></button>`;
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
      heroImage.style.objectFit = 'contain';
      heroImage.style.objectPosition = 'center';
      heroImage.style.background = '#24251f';
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
      .hero-gallery{position:absolute;z-index:4;left:18px;right:18px;bottom:18px;display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid rgba(239,238,231,.18);border-radius:999px;background:rgba(20,21,18,.68);box-shadow:0 10px 30px rgba(0,0,0,.22);backdrop-filter:blur(14px)}
      .hero-gallery-thumbs{display:flex;flex:1;min-width:0;gap:7px;overflow-x:auto;padding:2px;scrollbar-width:none}
      .hero-gallery-thumbs::-webkit-scrollbar{display:none}
      .hero-gallery-thumb{flex:0 0 auto;width:54px;height:42px;padding:0;overflow:hidden;border:1px solid rgba(239,238,231,.38);border-radius:4px;background:#191b18;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s,transform .2s}
      .hero-gallery-thumb:hover,.hero-gallery-thumb[aria-pressed="true"]{opacity:1;border-color:#edb579;transform:translateY(-2px)}
      .hero-gallery-thumb img{display:block;width:100%;height:100%;object-fit:contain;background:#24251f}
      .hero-gallery-arrow{flex:0 0 auto;width:38px;height:38px;display:grid;place-items:center;padding:0;border:1px solid rgba(239,238,231,.42);border-radius:50%;background:rgba(25,27,24,.92);color:#efeee7;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;transition:transform .18s,background .18s,border-color .18s,color .18s}
      .hero-gallery-arrow span{display:block;font-family:Arial,sans-serif;font-size:19px;line-height:1;transform:translateY(-1px)}
      .hero-gallery-arrow:hover{transform:scale(1.06);color:#edb579;border-color:#edb579;background:#24251f}
      .hero-gallery button:focus-visible{outline:2px solid #edb579;outline-offset:3px}
      .image-caption[hidden],.vertical-caption[hidden]{display:none}
      @media(max-width:760px){.hero-gallery{left:10px;right:10px;bottom:10px;gap:6px;padding:6px 7px}.hero-gallery-thumb{width:42px;height:36px}.hero-gallery-thumbs{gap:5px}.hero-gallery-arrow{width:32px;height:32px}.hero-gallery-arrow span{font-size:16px}}
      @media(prefers-reduced-motion:reduce){.hero-gallery-thumb,.hero-gallery-arrow{transition:none}}
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
