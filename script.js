const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

// Numéro WhatsApp officiel
document.querySelectorAll('a[href*="216298555522"]').forEach(link => {
  link.href = link.href.replace('216298555522', '21694323527');
});
const displayedWhatsappNumber = document.querySelector('.contact-button strong');
if (displayedWhatsappNumber) displayedWhatsappNumber.textContent = '+216 94 323 527';

// Carrousel horizontal en profondeur
let productCards = [...document.querySelectorAll('.product-card')];
let activeProduct = 0;
let dragStart = 0;
let dragDelta = 0;

function renderProducts() {
  const total = productCards.length;
  productCards.forEach((card, index) => {
    const relative = (index - activeProduct + total) % total;
    card.classList.remove('is-active', 'is-left', 'is-right', 'is-hidden');
    if (relative === 0) {
      card.classList.add('is-active');
      card.style.transform = 'translate3d(0, 0, 120px) rotateY(0deg)';
    } else if (relative === 1) {
      card.classList.add('is-right');
      card.style.transform = 'translate3d(30vw, 32px, -180px) rotateY(-38deg)';
    } else if (relative === total - 1) {
      card.classList.add('is-left');
      card.style.transform = 'translate3d(-30vw, 32px, -180px) rotateY(38deg)';
    } else {
      card.classList.add('is-hidden');
    }
  });
}

function rotateProducts(direction) {
  if (!productCards.length) return;
  activeProduct = (activeProduct + direction + productCards.length) % productCards.length;
  renderProducts();
}

document.querySelector('.carousel-next').addEventListener('click', () => rotateProducts(1));
document.querySelector('.carousel-prev').addEventListener('click', () => rotateProducts(-1));
const productShell = document.querySelector('.products-shell');
productShell.addEventListener('pointerdown', event => { dragStart = event.clientX; dragDelta = 0; productShell.setPointerCapture(event.pointerId); });
productShell.addEventListener('pointermove', event => { if (dragStart) dragDelta = event.clientX - dragStart; });
productShell.addEventListener('pointerup', () => {
  if (Math.abs(dragDelta) > 45) rotateProducts(dragDelta < 0 ? 1 : -1);
  dragStart = 0;
});
renderProducts();
window.addEventListener('home-products:rendered', () => {
  productCards = [...document.querySelectorAll('.product-card')];
  activeProduct = 0;
  renderProducts();
});

let carouselTimer;
function startCarousel() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  carouselTimer = window.setInterval(() => rotateProducts(1), 5200);
}
productShell.addEventListener('pointerenter', () => clearInterval(carouselTimer));
productShell.addEventListener('pointerleave', () => { clearInterval(carouselTimer); startCarousel(); });
startCarousel();

// Profondeur légère au pointeur sur les autres éléments
document.querySelectorAll('.stats, .steps, .contact-button').forEach(element => {
  element.classList.add('depth-card');
  element.addEventListener('pointermove', event => {
    const rect = element.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - .5) * -5;
    const ry = ((event.clientX - rect.left) / rect.width - .5) * 7;
    element.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

// Parallaxe des gouttes de miel
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', event => {
    const nx = event.clientX / innerWidth - .5;
    const ny = event.clientY / innerHeight - .5;
    document.querySelectorAll('[data-depth]').forEach(orb => {
      const depth = Number(orb.dataset.depth);
      orb.style.setProperty('--move-x', `${nx * 180 * depth}px`);
      orb.style.setProperty('--move-y', `${ny * 140 * depth}px`);
      orb.style.setProperty('--spin', `${nx * 16}deg`);
    });
  });
}

// Inclinaison 3D des bouteilles suivant la souris
document.querySelectorAll('.honey-bottle').forEach(bottle => {
  bottle.addEventListener('pointermove', event => {
    const rect = bottle.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    bottle.style.setProperty('--tilt-x', `${-y * 22}deg`);
    bottle.style.setProperty('--tilt-y', `${x * 28}deg`);
  });
  bottle.addEventListener('pointerleave', () => {
    bottle.style.setProperty('--tilt-x', '0deg');
    bottle.style.setProperty('--tilt-y', '0deg');
  });
});

// Curseur abeille animé pour les appareils avec souris
const beeCursor = document.querySelector('.bee-cursor');
const supportsBeeCursor = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (supportsBeeCursor) {
  document.body.classList.add('bee-cursor-enabled');
  let beeX = -100, beeY = -100, targetBeeX = -100, targetBeeY = -100, lastBeeX = -100;
  document.addEventListener('pointermove', event => {
    targetBeeX = event.clientX + 7;
    targetBeeY = event.clientY + 7;
    const direction = targetBeeX < lastBeeX ? 180 : 0;
    beeCursor.style.setProperty('--bee-angle', `${direction}deg`);
    lastBeeX = targetBeeX;
    beeCursor.classList.add('visible');
  });
  document.addEventListener('pointerleave', () => beeCursor.classList.remove('visible'));
  document.addEventListener('pointerdown', () => beeCursor.classList.add('clicking'));
  document.addEventListener('pointerup', () => beeCursor.classList.remove('clicking'));
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('pointerenter', () => beeCursor.classList.add('hovering'));
    element.addEventListener('pointerleave', () => beeCursor.classList.remove('hovering'));
  });
  function animateBeeCursor() {
    beeX += (targetBeeX - beeX) * .3;
    beeY += (targetBeeY - beeY) * .3;
    beeCursor.style.transform = `translate3d(${beeX}px,${beeY}px,0) rotate(var(--bee-angle))`;
    requestAnimationFrame(animateBeeCursor);
  }
  animateBeeCursor();
}
