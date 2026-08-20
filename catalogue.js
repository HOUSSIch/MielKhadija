function bindCatalogueCards() { document.querySelectorAll('.catalogue-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-7px)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
}); }
bindCatalogueCards();
window.addEventListener('catalogue:rendered', bindCatalogueCards);

// Numéro WhatsApp officiel
document.querySelectorAll('a[href*="216298555522"]').forEach(link => {
  link.href = link.href.replace('216298555522', '21694323527');
});

const beeCursor = document.querySelector('.bee-cursor');
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.body.classList.add('bee-cursor-enabled');
  let last=-100;
  document.addEventListener('pointermove',e=>{beeCursor.style.setProperty('--bee-angle',`${e.clientX<last?180:0}deg`);last=e.clientX;beeCursor.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0) rotate(var(--bee-angle))`;beeCursor.classList.add('visible')});
  document.addEventListener('pointerleave',()=>beeCursor.classList.remove('visible'));
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>beeCursor.classList.add('hovering'));el.addEventListener('pointerleave',()=>beeCursor.classList.remove('hovering'))});
}
