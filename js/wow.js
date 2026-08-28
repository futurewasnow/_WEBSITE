/* ============================================================
   YOUSEE360 — WOW LAYER
   Magnetic CTAs, 3D card tilt, hero text reveal, counters,
   spotlight cursor, cinematic page transitions, scroll stagger.
   Desktop-focused. Gracefully no-ops on touch / reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isWide       = () => window.innerWidth > 980;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* =================================================================
     1. HERO TEXT REVEAL — wraps every word in a mask
     ================================================================= */
  function initHeroReveal() {
    if (reducedMotion) return;
    const selectors = [
      '.hero-section h1', '.hero-section .apple-heading',
      '.about-hero h1', '.portfolio-hero h1',
      '#Hero h1', '.hero-heading'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      if (el.dataset.ysRevealed === '1') return;
      el.dataset.ysRevealed = '1';

      // Walk text nodes only — preserve span structure (e.g. .highlight)
      const wrapNode = (node) => {
        const text = node.nodeValue;
        if (!text || !text.trim()) return;
        const frag = document.createDocumentFragment();
        const words = text.split(/(\s+)/);
        let idx = 0;
        words.forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          const span = document.createElement('span');
          span.className = 'ys-word';
          span.style.setProperty('--i', idx);
          span.textContent = w;
          const wrap = document.createElement('span');
          wrap.className = 'ys-reveal-text';
          wrap.appendChild(span);
          frag.appendChild(wrap);
          idx++;
        });
        node.parentNode.replaceChild(frag, node);
      };

      const walk = (parent) => {
        const kids = [...parent.childNodes];
        kids.forEach(k => {
          if (k.nodeType === 3) wrapNode(k);
          else if (k.nodeType === 1 && !k.classList.contains('ys-reveal-text')) walk(k);
        });
      };
      walk(el);
    });
  }

  /* =================================================================
     2. MAGNETIC CTAs — desktop only
     ================================================================= */
  function initMagnetic() {
    if (!finePointer || reducedMotion) return;
    const targets = document.querySelectorAll('.ds-btn-primary, .nav-cta, .pkg-btn, .ds-btn-arrow, .ys-fab-trigger, button.ys-form-submit');
    targets.forEach(el => {
      el.classList.add('ys-magnetic');
      let raf = null;
      const r = () => el.getBoundingClientRect();
      const move = (e) => {
        const rect = r();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const radius = 90;
        if (dist > radius) { reset(); return; }
        const force = (1 - dist / radius) * 16;
        const tx = (dx / radius) * force;
        const ty = (dy / radius) * force;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--mag-x', tx + 'px');
          el.style.setProperty('--mag-y', ty + 'px');
          el.classList.add('is-near');
        });
      };
      const reset = () => {
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
        el.classList.remove('is-near');
      };
      window.addEventListener('mousemove', move, { passive: true });
      el.addEventListener('mouseleave', reset);
    });
  }

  /* =================================================================
     3. 3D CARD TILT — desktop only
     ================================================================= */
  function initCardTilt() {
    if (!finePointer || reducedMotion || !isWide()) return;
    const targets = document.querySelectorAll('.ds-card, .bento-card, .value-card, .ys-package, .ys-testimonial, .modern-service-card, .ys-portfolio-tile');
    targets.forEach(card => {
      card.classList.add('ys-tilt');
      let raf = null;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const ry = (x - 0.5) * 10;   // up to 10° y
        const rx = (0.5 - y) * 8;    // up to 8° x
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };
      const reset = () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', reset);
    });
  }

  /* =================================================================
     4. ANIMATED COUNTERS — count up when scrolled into view
     ================================================================= */
  function initCounters() {
    // Find numbers like "100+", "500+", "35%", "48h", "1,490", "$650"
    const candidates = document.querySelectorAll('.proof-number, .ds-stat-num, .stat-num, .bento-stat, [data-count]');
    if (!candidates.length) return;

    const animate = (el, targetText) => {
      // Parse number out of the text
      const m = targetText.match(/-?\d[\d,]*\.?\d*/);
      if (!m) return;
      const target = parseFloat(m[0].replace(/,/g, ''));
      if (isNaN(target)) return;
      const prefix = targetText.slice(0, m.index);
      const suffix = targetText.slice(m.index + m[0].length);
      const dur = 1400;
      const start = performance.now();
      el.dataset.target = target;
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        // ease out cubic
        const e = 1 - Math.pow(1 - t, 3);
        const v = Math.round(target * e);
        const formatted = v.toLocaleString('en-US');
        el.textContent = prefix + formatted + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = targetText;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          if (el.dataset.counted === '1') return;
          el.dataset.counted = '1';
          const original = el.dataset.originalText || el.textContent.trim();
          el.dataset.originalText = original;
          animate(el, original);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    candidates.forEach(c => {
      c.dataset.originalText = c.textContent.trim();
      io.observe(c);
    });
  }

  /* =================================================================
     5. SPOTLIGHT CURSOR — desktop only
     ================================================================= */
  function initSpotlight() {
    if (!finePointer || reducedMotion || !isWide()) return;
    const spot = document.createElement('div');
    spot.className = 'ys-spotlight';
    document.body.appendChild(spot);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let visible = false;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { spot.classList.add('is-visible'); visible = true; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { spot.classList.remove('is-visible'); visible = false; });
    const loop = () => {
      cx = lerp(cx, mx, 0.12);
      cy = lerp(cy, my, 0.12);
      spot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* =================================================================
     6. CINEMATIC PAGE TRANSITIONS — intercept same-origin links
     ================================================================= */
  function initPageTransitions() {
    if (reducedMotion) return;
    if (window.__ysPageTransInit) return;
    window.__ysPageTransInit = true;

    // Slide-in overlay on enter (page load)
    const enter = document.createElement('div');
    enter.className = 'ys-page-transition';
    enter.innerHTML = '<div class="ys-loader-mark">360</div>';
    document.body.appendChild(enter);
    // Reveal then dismiss
    requestAnimationFrame(() => {
      enter.classList.add('is-entering');
      setTimeout(() => {
        enter.classList.remove('is-entering');
        enter.classList.add('is-leaving');
        setTimeout(() => enter.remove(), 700);
      }, 250);
    });

    // Outgoing transition on navigation
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('javascript:')) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      // External link?
      try {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return;
      } catch (err) { return; }
      // Only animate if it's actually a different page
      try {
        const u = new URL(href, location.href);
        if (u.pathname === location.pathname && u.search === location.search) return;
      } catch (err) {}
      e.preventDefault();
      const overlay = document.createElement('div');
      overlay.className = 'ys-page-transition';
      overlay.innerHTML = '<div class="ys-loader-mark">360</div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.classList.add('is-entering');
      });
      setTimeout(() => { location.href = href; }, 480);
    });

    // If user navigates back/forward, reset
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        document.querySelectorAll('.ys-page-transition').forEach(n => n.remove());
      }
    });
  }

  /* =================================================================
     7. SECTION STAGGER — auto-apply to grid containers
     ================================================================= */
  function initStagger() {
    if (reducedMotion) return;
    const candidates = document.querySelectorAll(
      '.ds-grid-3, .ds-grid-4, .modern-services-slider, ' +
      '.bento-grid, .values-grid, .ys-testimonials-grid, ' +
      '.ys-pricing-grid, .ys-portfolio-grid'
    );
    candidates.forEach(grid => {
      if (grid.dataset.staggerInit === '1') return;
      grid.dataset.staggerInit = '1';
      grid.setAttribute('data-stagger', '');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-stagger]').forEach(g => io.observe(g));
  }

  /* =================================================================
     8. SIDE RAIL — green line on the left (desktop)
     ================================================================= */
  function initSideRail() {
    if (!isWide() || reducedMotion) return;
    if (document.querySelector('.ys-side-rail')) return;
    const r = document.createElement('div');
    r.className = 'ys-side-rail';
    document.body.appendChild(r);
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 200 && y !== last) r.classList.add('is-visible');
      else if (y < 100) r.classList.remove('is-visible');
      last = y;
    }, { passive: true });
  }

  /* ------- Boot ------- */
  function boot() {
    initPageTransitions();
    initHeroReveal();
    initMagnetic();
    initCardTilt();
    initCounters();
    initSpotlight();
    initStagger();
    initSideRail();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
