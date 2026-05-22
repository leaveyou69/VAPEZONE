<script>
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── DATA ─────────────────────────────────────────── */
const PRODUCTS = [
  {
    id:            'wb',
    name:          'Watermelon Berries',
    img:           'poze%20produse%20finale/watermelon%20berries.png',
    price:         69,
    promoPrice:    60,
    promoOldPrice: 70,
    color:         '#C41E2A',
  },
  {
    id:            'br',
    name:          'Blueberry Raspberry',
    img:           'poze%20produse%20finale/blueberry%20raspberry.png',
    price:         69,
    promoPrice:    60,
    promoOldPrice: 70,
    color:         '#1E4FBF',
  },
  {
    id:            'gbg',
    name:          'Grape Bubble Gum',
    img:           'poze%20produse%20finale/grape%20bubble%20gum.png',
    price:         69,
    promoPrice:    60,
    promoOldPrice: 70,
    color:         '#7B1EC4',
  },
  {
    id:            'gl',
    name:          'Guava Lime',
    img:           'poze%20produse%20finale/guava%20lime.png',
    price:         69,
    promoPrice:    60,
    promoOldPrice: 70,
    color:         '#1EC43A',
  },
  {
    id:            'mp',
    name:          'Mango Peach',
    img:           'poze%20produse%20finale/mango%20peach.png',
    price:         69,
    promoPrice:    60,
    promoOldPrice: 70,
    color:         '#C4871E',
  },
  {
    id:            'mb',
    name:          'Mystery Box',
    img:           'poze%20produse%20finale/mysterybox%20landscape.webp',
    price:         169,
    promoPrice:    149,
    promoOldPrice: 170,
    oldPrice:      250,
    color:         '#5B21B6',
    brand:         'Mystery Box',
    tag:           'Mystery Box · 3 Produse Random',
    chips:         ['3 Produse', 'Flavors Random', 'Economisești 81 LEI'],
    fill:          true,
  },
];

/* ── CART STATE ────────────────────────────────────── */
const cart = {};

/* ── GRAIN GENERATOR ──────────────────────────────── */
(function generateGrain() {
  const c = document.createElement('canvas');
  c.width = 180; c.height = 180;
  const ctx = c.getContext('2d');
  const id = ctx.createImageData(180, 180);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  document.getElementById('grain').style.backgroundImage = `url(${c.toDataURL()})`;
})();

/* ── CUSTOM CURSOR ──────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mousedown', () => { dot.style.transform = 'translate(-50%,-50%) scale(0.65)'; });
  document.addEventListener('mouseup',   () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
})();

/* ── LOADER ─────────────────────────────────────────── */
function startLoader() {
  vidA.currentTime = 0;
  vidA.play().catch(() => {});
  prewarm(vidB);
  armLoop(vidA, vidB);
  const tl = gsap.timeline({
    onComplete() {
      document.getElementById('loader').style.display = 'none';
      revealHero();
    }
  });
  tl.to('#loader-logo', { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' })
    .to('#loader-fill',  { width: '100%', duration: 1.1, ease: 'power2.inOut' }, '-=0.2')
    .to('#loader-label', { opacity: 1, duration: 0.4 }, '-=0.7')
    .to('#loader',       { opacity: 0, duration: 0.55, delay: 0.15 });
}

/* ── HERO REVEAL ─────────────────────────────────────── */
gsap.set(['.hero-logo-img', '.hero-heading', '.hero-sub', '.hero-ctas'], {
  opacity: 0, y: 28
});

function revealHero() {
  const tl = gsap.timeline();
  tl.to('.hero-logo-img', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
    .to('.hero-heading',  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4')
    .to('.hero-ctas',     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
    ;
}

/* ── SMOOTH SCROLL CTA ──────────────────────────────── */
document.querySelector('a[href="#products"]').addEventListener('click', e => {
  e.preventDefault();
  const target = document.getElementById('slider-wrap');
  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: target, offsetY: 68 },
    ease: 'power3.inOut',
  });
});

/* ── NAVBAR SOLID ON SCROLL ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('solid', window.scrollY > 40);
}, { passive: true });

/* ── PRODUCTS SLIDER ─────────────────────────────────── */
let sliderIdx = 0;

function renderProducts() {
  const track = document.getElementById('slider-track');
  const dotsEl = document.getElementById('slider-dots');

  const dotsHTML = PRODUCTS.map((_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
  ).join('');

  track.innerHTML = PRODUCTS.map((p, i) => `
    <div class="slide${i === 0 ? ' active' : ''}" style="--sc:${p.color}" data-pid="${p.id}">
      <div class="slide-bg"></div>
      <div class="slide-img-wrap">${p.img ? `<img class="slide-img${p.fill ? ' slide-img-fill' : ''}" src="${p.img}" alt="${p.name}"${i > 0 ? ' loading="lazy"' : ''} onerror="this.style.display='none'">` : ''}</div>
      <div class="slide-info">
        <div class="slide-meta">
          <span class="slide-brand-tag">${p.tag || 'Bang Legend · 150,000 Puffs'}</span>
          <div class="slide-name">${p.name}</div>
          <div class="slide-chips">
            ${(p.chips || ['150K Puffs', 'Premium', 'Nicotine']).map(c => `<span class="slide-chip">${c}</span>`).join('')}
          </div>
        </div>
        <div class="slide-right">
          <div class="slide-price-wrap">
             <div class="slide-price-old">${promoActive() && p.promoPrice ? (p.promoOldPrice || p.price) : (p.oldPrice || 100)} LEI</div>
             <div class="slide-price">${promoActive() && p.promoPrice ? p.promoPrice : p.price} <sub>LEI</sub></div>
          </div>
          <button class="slide-add" data-pid="${p.id}">+ ADAUGĂ ÎN COȘ</button>
        </div>
      </div>
    </div>
  `).join('');

  // Inițializare opacitate — doar primul slide vizibil
  track.querySelectorAll('.slide').forEach((s, i) => {
    if (i !== 0) gsap.set(s, { opacity: 0 });
  });

  track.querySelectorAll('.slide-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      cartAdd(btn.dataset.pid);
      btn.classList.add('popped');
      setTimeout(() => btn.classList.remove('popped'), 500);
    });
  });

  dotsEl.innerHTML = dotsHTML;
  dotsEl.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => goSlide(+dot.dataset.i));
  });

  document.getElementById('sliderPrev').addEventListener('click', () => goSlide(sliderIdx - 1));
  document.getElementById('sliderNext').addEventListener('click', () => goSlide(sliderIdx + 1));

  // swipe
  let tx = 0;
  const wrap = document.getElementById('slider-wrap');
  wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (diff > 45) goSlide(sliderIdx + 1);
    else if (diff < -45) goSlide(sliderIdx - 1);
  }, { passive: true });

  // keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goSlide(sliderIdx + 1);
    if (e.key === 'ArrowLeft')  goSlide(sliderIdx - 1);
  });

  gsap.from('#slider-wrap', {
    scrollTrigger: { trigger: '#products', start: 'top 80%' },
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
  });
}

function goSlide(idx) {
  const n      = PRODUCTS.length;
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  const prevIdx = sliderIdx;
  sliderIdx = (idx + n) % n;
  if (sliderIdx === prevIdx) return;

  const dir      = sliderIdx > prevIdx ? 1 : -1;
  const outSlide = slides[prevIdx];
  const inSlide  = slides[sliderIdx];

  dots.forEach((d, i) => d.classList.toggle('active', i === sliderIdx));
  slides.forEach((s, i) => s.classList.toggle('active', i === sliderIdx));

  gsap.killTweensOf([outSlide, inSlide,
    outSlide.querySelector('.slide-img-wrap'), outSlide.querySelector('.slide-bg'),
    inSlide.querySelector('.slide-img-wrap'),  inSlide.querySelector('.slide-bg')]);

  // Ieșire: vape pleacă rapid, lumina rămâne în urmă (mai grea, mai departe)
  gsap.to(outSlide, { opacity: 0, duration: 0.35, ease: 'power1.in' });
  gsap.fromTo(outSlide.querySelector('.slide-img-wrap'),
    { x: 0 }, { x: -dir * 140, duration: 0.4, ease: 'power2.in' });
  gsap.fromTo(outSlide.querySelector('.slide-bg'),
    { x: 0 }, { x: dir * 35, duration: 0.5, ease: 'power1.in', delay: 0.07 });

  // Intrare: vape vine primul, lumina îl urmează cu întârziere
  gsap.set(inSlide, { opacity: 0 });
  gsap.to(inSlide, { opacity: 1, duration: 0.4, ease: 'power1.out', delay: 0.08 });
  gsap.fromTo(inSlide.querySelector('.slide-img-wrap'),
    { x: dir * 140 }, { x: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 });
  gsap.fromTo(inSlide.querySelector('.slide-bg'),
    { x: -dir * 35 }, { x: 0, duration: 0.6, ease: 'power1.out', delay: 0.15 });
}

/* ── WHATSAPP SMART LINK ─────────────────────────────── */
function buildWaMsg() {
  const entries = Object.entries(cart);
  let text;
  if (entries.length === 0) {
    text = 'Bună ziua! Sunt interesat de produsele VapeZone 🔥 Îmi puteți da mai multe detalii despre disponibilitate și ridicare?';
  } else {
    const pData   = promoGet();
    const sum     = entries.reduce((s, [pid, q]) => s + (PRODUCTS.find(p => p.id === pid)?.price ?? 0) * q, 0);
    const discSum = pData
      ? entries.reduce((s, [pid, q]) => { const p = PRODUCTS.find(x => x.id === pid); return s + (p ? priceFor(p) : 0) * q; }, 0)
      : sum;
    const lines   = entries.map(([pid, qty]) => {
      const p = PRODUCTS.find(x => x.id === pid);
      return `• ${p.name} x${qty} = ${priceFor(p) * qty} lei`;
    }).join('\n');
    const promoLine = pData ? `\n\n🎁 PROMO QR · COD: ${pData.code}` : '';
    text = `Bună ziua! Vreau să comand de la VapeZone:\n\n${lines}${promoLine}\n\nTOTAL: ${discSum} lei\n\nCând putem stabili ridicarea?`;
  }
  return 'https://wa.me/40743391581?text=' + encodeURIComponent(text);
}

/* ── CART LOGIC ─────────────────────────────────────── */
function cartAdd(pid) {
  cart[pid] = (cart[pid] || 0) + 1;
  cartRender();
}

function cartRemove(pid) {
  delete cart[pid];
  cartRender();
}

function cartQty(pid, delta) {
  cart[pid] = (cart[pid] || 0) + delta;
  if (cart[pid] <= 0) delete cart[pid];
  cartRender();
}

window.cartRemove = cartRemove;
window.cartQty    = cartQty;

function cartRender() {
  const entries = Object.entries(cart);
  const total   = entries.reduce((s, [, q]) => s + q, 0);
  const sum     = entries.reduce((s, [pid, q]) => {
    return s + (PRODUCTS.find(p => p.id === pid)?.price ?? 0) * q;
  }, 0);

  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.classList.toggle('show', total > 0);

  const body  = document.getElementById('cartBody');
  const foot  = document.getElementById('cartFoot');
  const empty = document.getElementById('cartEmptyMsg');

  body.querySelectorAll('.cart-line').forEach(el => el.remove());

  if (entries.length === 0) {
    empty.style.display = 'block';
    foot.style.display  = 'none';
    return;
  }

  empty.style.display = 'none';
  foot.style.display  = 'flex';

  const itemsHTML = entries.map(([pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) return '';
    return `
      <div class="cart-line">
        <img class="cart-line-img" src="${p.img}" alt="${p.name}">
        <div class="cart-line-meta">
          <div class="cart-line-brand">Bang Legend</div>
          <div class="cart-line-name">${p.name}</div>
          <div class="cart-line-qty">
            <button class="qty-btn" onclick="cartQty('${pid}', -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="cartQty('${pid}',  1)">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="cart-line-price">${promoActive() && p.promoPrice ? `<small style="display:block;text-decoration:line-through;opacity:0.32;font-size:0.72em">${p.price * qty} LEI</small>${p.promoPrice * qty}` : p.price * qty} LEI</div>
          <button class="cart-line-del" onclick="cartRemove('${pid}')" aria-label="Elimină">✕</button>
        </div>
      </div>`;
  }).join('');

  body.insertAdjacentHTML('afterbegin', itemsHTML);

  const pData   = promoGet();
  const discSum = pData
    ? entries.reduce((s, [pid, q]) => { const p = PRODUCTS.find(x => x.id === pid); return s + (p ? priceFor(p) : 0) * q; }, 0)
    : sum;
  document.getElementById('cartTotal').textContent = discSum + ' LEI';
  const origEl  = document.getElementById('cartOrigSum');
  const promoEl = document.getElementById('cartPromoRow');
  const saveEl  = document.getElementById('cartPromoSave');
  if (origEl)  { origEl.textContent  = sum + ' LEI'; origEl.style.display  = pData ? 'block' : 'none'; }
  if (promoEl) { promoEl.style.display = pData ? 'flex' : 'none'; }
  if (saveEl && pData)  saveEl.textContent = `−${sum - discSum} LEI`;

  const waLines = entries.map(([pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    return `%E2%80%A2%20${encodeURIComponent(p.name)}%20x${qty}%20%3D%20${priceFor(p) * qty}%20lei`;
  }).join('%0A');
  const waPromo = pData ? `%0A%0A%F0%9F%8E%81%20PROMO%20QR%20%C2%B7%20COD%3A%20${pData.code}` : '';
  const msg = `Bun%C4%83%20ziua!%20Vreau%20s%C4%83%20comand%3A%0A${waLines}${waPromo}%0A%0ATOTAL%3A%20${discSum}%20lei`;
  document.getElementById('cartWaLink').href = `https://wa.me/40743391581?text=${msg}`;
}

/* ── CART OPEN / CLOSE ──────────────────────────────── */
function cartOpen() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function cartClose() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-panel').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartToggle').addEventListener('click', cartOpen);
document.getElementById('cartClose').addEventListener('click', cartClose);
document.getElementById('cart-overlay').addEventListener('click', cartClose);

/* ── SCROLL ANIMATIONS ──────────────────────────────── */
gsap.from('#about .about-body', {
  scrollTrigger: { trigger: '#about', start: 'top 76%' },
  opacity: 0, x: -38, duration: 0.8, ease: 'power2.out',
});
gsap.from('#about .features-col', {
  scrollTrigger: { trigger: '#about', start: 'top 76%' },
  opacity: 0, x: 38, duration: 0.8, ease: 'power2.out', delay: 0.12,
});
gsap.from('.feature-card', {
  scrollTrigger: { trigger: '.features-col', start: 'top 82%' },
  opacity: 0, y: 22, stagger: 0.1, duration: 0.5, ease: 'power2.out',
});
gsap.from('.stat-box', {
  scrollTrigger: { trigger: '.stats-row', start: 'top 85%' },
  opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: 'power2.out',
});
gsap.from('.contact-left', {
  scrollTrigger: { trigger: '#contact', start: 'top 78%' },
  opacity: 0, x: -36, duration: 0.8, ease: 'power2.out',
});
gsap.from('.wa-block', {
  scrollTrigger: { trigger: '#contact', start: 'top 78%' },
  opacity: 0, x: 36, duration: 0.8, ease: 'power2.out', delay: 0.14,
});

/* ── AGE GATE ───────────────────────────────────────── */
(function initAgeGate() {
  const gate     = document.getElementById('age-gate');
  const check    = document.getElementById('age-check');
  const enterBtn = document.getElementById('age-enter');

  document.body.style.overflow = 'hidden';

  check.addEventListener('change', () => {
    enterBtn.disabled = !check.checked;
  });

  document.getElementById('terms-link').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('terms-modal').classList.add('open');
  });
  document.getElementById('terms-close').addEventListener('click', () => {
    document.getElementById('terms-modal').classList.remove('open');
  });
  document.getElementById('terms-accept').addEventListener('click', () => {
    document.getElementById('terms-modal').classList.remove('open');
    check.checked = true;
    enterBtn.disabled = false;
  });

  enterBtn.addEventListener('click', () => {
    if (!check.checked) return;
    gate.classList.add('hidden');
    setTimeout(() => {
      gate.style.display = 'none';
      document.body.style.overflow = '';
      startLoader();
    }, 500);
  });
})();

/* ── DUAL-VIDEO SEAMLESS LOOP ────────────────────────── */
const vidA = document.getElementById('hero-vid-a');
const vidB = document.getElementById('hero-vid-b');

function prewarm(vid) {
  vid.currentTime = 0;
  vid.play().then(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      vid.pause();
      vid.currentTime = 0;
    }));
  }).catch(() => {});
}

function armLoop(playing, waiting) {
  let done = false;

  function swap() {
    if (done) return;
    done = true;
    playing.removeEventListener('timeupdate', onTick);
    playing.removeEventListener('ended', onEnded);
    waiting.currentTime = 0;

    function onReady() {
      waiting.removeEventListener('playing', onReady);
      waiting.style.opacity = '1';
      playing.style.opacity = '0';
      setTimeout(() => {
        playing.pause();
        playing.currentTime = 0;
        prewarm(playing);
      }, 400);
      armLoop(waiting, playing);
    }

    waiting.addEventListener('playing', onReady);
    waiting.play().catch(() => waiting.removeEventListener('playing', onReady));
  }

  function onTick() {
    if (playing.duration && playing.currentTime >= playing.duration - 0.3) swap();
  }
  function onEnded() { swap(); }

  playing.addEventListener('timeupdate', onTick);
  playing.addEventListener('ended', onEnded);
}

vidA.load();
vidB.load();

/* ── PROMO PRICE HELPERS ─────────────────────────────── */
function priceFor(p) { return promoActive() && p.promoPrice ? p.promoPrice : p.price; }

function updateProductPrices() {
  PRODUCTS.forEach(p => {
    const slide = document.querySelector(`.slide[data-pid="${p.id}"]`);
    if (!slide) return;
    const promo  = promoActive() && p.promoPrice;
    slide.querySelector('.slide-price-old').textContent = (promo ? (p.promoOldPrice || p.price) : (p.oldPrice || 100)) + ' LEI';
    slide.querySelector('.slide-price').innerHTML       = (promo ? p.promoPrice : p.price) + ' <sub>LEI</sub>';
  });
}

/* ── PROMO QR SYSTEM ─────────────────────────────────── */
const PROMO_KEY  = 'vz_promo_v1';
const PROMO_MS   = 86400000;
const PROMO_CIRC = 326.73; // 2π × 52

function promoGet() {
  try {
    const d = JSON.parse(localStorage.getItem(PROMO_KEY) || 'null');
    if (!d || Date.now() - d.ts > PROMO_MS) { localStorage.removeItem(PROMO_KEY); return null; }
    return d;
  } catch { return null; }
}
function promoActive()   { return promoGet() !== null; }
function promoActivate() {
  let d = promoGet();
  if (!d) {
    d = { ts: Date.now(), code: Math.random().toString(36).toUpperCase().slice(2, 8) };
    localStorage.setItem(PROMO_KEY, JSON.stringify(d));
  }
  return d;
}

let _promoIv = null;
function promoTick(data, withDial) {
  const left  = PROMO_MS - (Date.now() - data.ts);
  if (left <= 0) {
    clearInterval(_promoIv);
    localStorage.removeItem(PROMO_KEY);
    document.getElementById('promo-reveal').classList.remove('show');
    document.getElementById('promo-bar').classList.remove('show');
    document.body.classList.remove('promo-on');
    cartRender();
    return;
  }
  const h     = String(Math.floor(left / 3600000)).padStart(2, '0');
  const m     = String(Math.floor((left % 3600000) / 60000)).padStart(2, '0');
  const s     = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
  const t     = `${h}:${m}:${s}`;
  const frac  = left / PROMO_MS;
  const color = frac > 0.5 ? '#22c55e' : frac > 0.2 ? '#f59e0b' : '#ef4444';

  if (withDial) {
    const arc = document.getElementById('promoArc');
    if (arc) { arc.style.strokeDashoffset = PROMO_CIRC * (1 - frac); arc.style.stroke = color; }
    const rc = document.getElementById('promoRevealClock');
    if (rc) rc.textContent = t;
  }
  const bc = document.getElementById('promoBarClock');
  if (bc) { bc.textContent = t; bc.style.color = color; }
  const bp = document.getElementById('promoBarProg');
  if (bp) bp.style.width = (frac * 100) + '%';
}

function promoShowBar(data) {
  document.getElementById('promoCodeBar').textContent = data.code;
  document.getElementById('promo-bar').classList.add('show');
  document.body.classList.add('promo-on');
}

function initPromo() {
  const params = new URLSearchParams(window.location.search);
  const isQR   = params.get('promo') === 'QR10';
  if (isQR) history.replaceState({}, '', window.location.pathname);

  const data = isQR ? promoActivate() : promoGet();
  if (!data) return;

  promoShowBar(data);
  promoTick(data, isQR);
  _promoIv = setInterval(() => promoTick(data, isQR && document.getElementById('promo-reveal').classList.contains('show')), 1000);

  if (isQR) {
    const reveal = document.getElementById('promo-reveal');
    document.getElementById('promoCodeReveal').textContent = data.code;
    reveal.classList.add('show');
    document.getElementById('promoEnterBtn').addEventListener('click', () => {
      reveal.classList.remove('show');
      updateProductPrices();
      cartRender();
    });
  } else {
    updateProductPrices();
    cartRender();
  }
}

/* ── INIT ───────────────────────────────────────────── */
renderProducts();
cartRender();