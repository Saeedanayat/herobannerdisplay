(() => {
  const hero = document.getElementById('home');
  const slides = [...hero.querySelectorAll('.slide')];
  const tabsEl = document.getElementById('tabs');
  const countEl = document.getElementById('count');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0, boltTimer;

  // If a video file is missing or fails, remove it so the image/gradient fallback shows.
  slides.forEach(s => {
    const v = s.querySelector('video'), src = v && v.querySelector('source');
    if (!v) return;
    const kill = () => v.remove();
    v.addEventListener('error', kill);
    if (src) src.addEventListener('error', kill);
  });

  const playActive = () => slides.forEach((s, i) => {
    const v = s.querySelector('video');
    if (!v) return;
    if (i === current && !reduced) { v.preload = 'auto'; const p = v.play(); if (p) p.catch(() => {}); }
    else v.pause();
  });

  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'tab'; b.type = 'button'; b.setAttribute('role', 'tab');
    b.textContent = s.dataset.name;
    b.addEventListener('click', () => go(i));
    tabsEl.appendChild(b);
  });
  const tabs = [...tabsEl.children];

  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === current;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
    });
    tabs.forEach((t, n) => t.setAttribute('aria-selected', String(n === current)));
    countEl.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    playActive();
    scheduleBolts();
  }

  document.getElementById('prev').addEventListener('click', () => go(current - 1));
  document.getElementById('next').addEventListener('click', () => go(current + 1));
  hero.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  let x0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  // Lightning: thin jagged arcs through the title. data-lightning sets intensity (0 = off).
  function bolt(svg, big) {
    const rnd = (a, b) => a + Math.random() * (b - a);
    const arc = () => {
      let x = rnd(0, 120), y = rnd(60, 170), d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
      while (x < 1000) { x += rnd(30, 80); y = Math.max(15, Math.min(205, y + rnd(-55, 55))); d += `L${x.toFixed(0)} ${y.toFixed(0)}`; }
      return d;
    };
    svg.innerHTML = '';
    for (let i = 0; i < (big ? 2 : 1); i++) {
      const d = arc();
      ['glow', 'core'].forEach(c => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('class', c); p.setAttribute('d', d); svg.appendChild(p);
      });
    }
    svg.classList.remove('is-strike'); void svg.getBoundingClientRect(); svg.classList.add('is-strike');
  }

  function scheduleBolts() {
    clearTimeout(boltTimer);
    const s = slides[current], k = parseFloat(s.dataset.lightning || 0), svg = s.querySelector('.bolts');
    if (reduced || !k || !svg) return;
    const strong = k >= 1;
    const tick = () => {
      bolt(svg, strong);
      boltTimer = setTimeout(tick, (strong ? 1800 : 5500) + Math.random() * (strong ? 2800 : 5000));
    };
    boltTimer = setTimeout(tick, 1400);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(boltTimer); slides.forEach(s => s.querySelector('video') && s.querySelector('video').pause()); }
    else { playActive(); scheduleBolts(); }
  });

  go(0);
})();
