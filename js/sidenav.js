/* ============================================================
   YOUSEE360 — Section side rail
   Desktop-only right-edge nav with section dots + tooltip labels.
   Auto-discovers any <section id="..."> with an h2 inside.
   Highlights as user scrolls; tap to smooth-scroll there.
   ============================================================ */
(function () {
  'use strict';
  if (window.matchMedia('(max-width: 1024px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function boot() {
    // Collect candidate sections — must have an id and an h2
    const all = [...document.querySelectorAll('section[id], main[id]')];
    const sections = all.filter(s => {
      const h2 = s.querySelector('h2');
      if (!h2) return false;
      if (s.id === 'Hero') return false; // skip hero
      if (s.offsetHeight < 240) return false; // skip tiny sections
      return true;
    });
    if (sections.length < 3) return;

    // Build rail
    const rail = document.createElement('nav');
    rail.className = 'ys-sidenav';
    rail.setAttribute('aria-label', 'Section navigation');
    rail.innerHTML = sections.map((s, i) => {
      const h2 = s.querySelector('h2');
      // Strip <span> wrapper text
      const label = (h2.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 32);
      return `<a class="ys-sidenav-dot" href="#${s.id}" data-index="${i}" data-label="${label}" aria-label="${label}"><span class="ys-sidenav-dot-inner"></span><span class="ys-sidenav-tip">${label}</span></a>`;
    }).join('');
    document.body.appendChild(rail);

    const dots = rail.querySelectorAll('.ys-sidenav-dot');

    // Smooth scroll on click (account for fixed nav)
    dots.forEach((d, i) => {
      d.addEventListener('click', (e) => {
        e.preventDefault();
        const navH = document.querySelector('.navigation-bar')?.getBoundingClientRect().height || 64;
        const y = sections[i].getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    // IntersectionObserver to highlight active dot
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = sections.indexOf(e.target);
        if (idx < 0) return;
        dots.forEach(d => d.classList.remove('is-active'));
        dots[idx].classList.add('is-active');
      });
    }, { threshold: [0.45], rootMargin: '-15% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
