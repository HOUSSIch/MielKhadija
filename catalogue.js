document.querySelectorAll('.catalogue-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-7px)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});

// NumÃ©ro WhatsApp officiel
document.querySelectorAll('a[href*="216298555522"]').forEach(link => {
  link.href = link.href.replace('216298555522', '21629855522');
});

const beeCursor = document.querySelector('.bee-cursor');
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.body.classList.add('bee-cursor-enabled');
  let x=-100,y=-100,tx=-100,ty=-100,last=-100;
  document.addEventListener('pointermove',e=>{tx=e.clientX+7;ty=e.clientY+7;beeCursor.style.setProperty('--bee-angle',`${tx<last?180:0}deg`);last=tx;beeCursor.classList.add('visible')});
  document.addEventListener('pointerleave',()=>beeCursor.classList.remove('visible'));
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>beeCursor.classList.add('hovering'));el.addEventListener('pointerleave',()=>beeCursor.classList.remove('hovering'))});
  (function animate(){x+=(tx-x)*.3;y+=(ty-y)*.3;beeCursor.style.transform=`translate3d(${x}px,${y}px,0) rotate(var(--bee-angle))`;requestAnimationFrame(animate)})();
}

