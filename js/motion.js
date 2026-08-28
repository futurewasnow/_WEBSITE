/* ============================================================
   YOUSEE360 — MOTION LAYER
   Patterns inspired by Awwwards / motionsites.ai showcases:
   - Split-text reveal (word + char)
   - Scroll-velocity skew (subtle, awwwards-style)
   - Magnetic CTAs (mouse-pull within radius)
   - Image hover internal pan via mouse position
   - Cursor halo on dark sections
   - Marquee direction-reversal on scroll-up
   - Count-up numbers on intersect
   - Mask-clip reveal
   Auto-detects elements; no markup changes required.
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* =================================================================
     1. HEADING REVEAL — simple element-level fade-up
     (Word-by-word splitting was breaking nested .highlight spans on
     mobile due to content-visibility + nested transform clipping —
     non-highlighted words rendered invisible. Reverted to safer
     whole-element reveal that animates the entire heading as one.)
     ================================================================= */
  function splitText() {
    const targets = document.querySelectorAll(
      '.hero-heading, .apple-heading, .sexy-heading, [data-split], .ys-section-header h2, .ys-includes h2, .ys-faq h2, .ys-related h2, .ys-pricing .header h2, .ys-testimonials .header h2, .ys-estimator-header h2, .ys-footer-cta h2'
    );
    targets.forEach(el => {
      if (el.dataset.headingReveal === '1') return;
      el.dataset.headingReveal = '1';
      el.classList.add('ys-heading-reveal');
    });
    if (reduced) {
      document.querySelectorAll('.ys-heading-reveal').forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.ys-heading-reveal').forEach(el => io.observe(el));

    // Safety net: anything still hidden after 1.5s gets revealed
    setTimeout(() => {
      document.querySelectorAll('.ys-heading-reveal:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
    }, 1500);
  }

  /* =================================================================
     2. SCROLL-VELOCITY SKEW
     Body-level subtle skew of large sections during fast scroll.
     ================================================================= */
  function scrollVelocitySkew() {
    if (reduced) return;
    const hosts = document.querySelectorAll('.ys-skew-host');
    if (!hosts.length) return;
    let lastY = window.scrollY, lastT = performance.now();
    let v = 0, ticking = false;
    const update = () => {
      const t = performance.now();
      const dy = window.scrollY - lastY;
      const dt = t - lastT || 16;
      const rawV = dy / dt; // px per ms
      v = v * 0.75 + rawV * 0.25;
      // clamp skew to a tiny range
      const skew = Math.max(-2, Math.min(2, v * 1.4));
      hosts.forEach(h => h.style.setProperty('--ys-skew', skew.toFixed(2) + 'deg'));
      lastY = window.scrollY;
      lastT = t;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    // Settle to 0 when scroll stops
    let settleTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        hosts.forEach(h => h.style.setProperty('--ys-skew', '0deg'));
      }, 140);
    }, { passive: true });
  }

  /* =================================================================
     3. MAGNETIC CTAs
     Mouse within radius pulls the button toward cursor.
     ================================================================= */
  function magneticCTAs() {
    if (!fine || reduced) return;
    const targets = document.querySelectorAll(
      '.nav-cta, .ds-btn-primary, .pkg-btn, .ys-fab-trigger, .ys-form-submit, .ys-estimator-next, .ys-mob-bar a.btn-quote'
    );
    targets.forEach(el => {
      el.classList.add('ys-magnetic');
      const radius = 90;
      const strength = 0.32;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius * 2) return;
        const pull = Math.max(0, 1 - dist / (radius * 2));
        el.style.transform = `translate(${dx * pull * strength}px, ${dy * pull * strength}px)`;
      };
      const onLeave = () => { el.style.transform = ''; };
      // Track mousemove globally but cheaply via the element's own enter+local-mousemove
      el.addEventListener('mouseenter', () => window.addEventListener('mousemove', onMove));
      el.addEventListener('mouseleave', () => {
        window.removeEventListener('mousemove', onMove);
        onLeave();
      });
    });
  }

  /* =================================================================
     4. IMAGE HOVER INTERNAL PAN
     Portfolio tiles get parallax-pan based on cursor position.
     ================================================================= */
  function imagePan() {
    if (!fine || reduced) return;
    document.querySelectorAll('.ys-portfolio-tile').forEach(tile => {
      tile.addEventListener('mousemove', (e) => {
        const r = tile.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
        const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        tile.classList.add('has-pan');
        tile.style.setProperty('--px', (px * 2).toFixed(2));
        tile.style.setProperty('--py', (py * 2).toFixed(2));
      });
      tile.addEventListener('mouseleave', () => {
        tile.classList.remove('has-pan');
        tile.style.setProperty('--px', '0');
        tile.style.setProperty('--py', '0');
      });
    });
  }

  /* =================================================================
     5. CURSOR HALO on dark sections (auto-apply to sections)
     ================================================================= */
  function cursorHalo() {
    if (!fine || reduced) return;
    // Apply to all .section / .ys-section / hero / footer
    document.querySelectorAll(
      '.section, .ys-section, section:not(.ys-mob-bar), .footer, .ys-includes, .ys-faq, .ys-pricing, .ys-testimonials, .ys-related, .ys-portfolio-teaser, .ys-trusted, .ys-estimator'
    ).forEach(s => s.classList.add('ys-halo'));

    let raf = 0;
    let mx = -9999, my = -9999;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });
    const loop = () => {
      // Only update the hovered halo (one) — find the topmost
      const el = document.elementFromPoint(mx, my);
      const host = el && el.closest('.ys-halo');
      document.querySelectorAll('.ys-halo.is-active').forEach(h => {
        if (h !== host) h.classList.remove('is-active');
      });
      if (host) {
        const r = host.getBoundingClientRect();
        host.style.setProperty('--mx', `${mx - r.left}px`);
        host.style.setProperty('--my', `${my - r.top}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* =================================================================
     6. MARQUEE DIRECTION REVERSAL ON SCROLL
     ================================================================= */
  function marqueeScrollLink() {
    const marquees = document.querySelectorAll('.ys-marquee, .ys-trusted');
    if (!marquees.length || reduced) return;
    let lastY = window.scrollY;
    let fastTimer = null;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const up = y < lastY;
      marquees.forEach(m => m.classList.toggle('is-reversed', up));
      // Speed boost during fast scroll
      marquees.forEach(m => m.classList.add('is-fast'));
      clearTimeout(fastTimer);
      fastTimer = setTimeout(() => {
        marquees.forEach(m => m.classList.remove('is-fast'));
      }, 300);
      lastY = y;
    }, { passive: true });
  }

  /* =================================================================
     7. COUNT-UP NUMBERS on intersect
     Any [data-count] element animates from 0 to the integer in dataset
     ================================================================= */
  function countUp() {
    const items = document.querySelectorAll('[data-count]');
    if (!items.length) return;
    if (reduced) {
      items.forEach(el => { el.textContent = (el.dataset.count || '') + (el.dataset.suffix || ''); });
      return;
    }
    const animate = (el) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      const dur = parseInt(el.dataset.dur || '1400', 10);
      const start = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        const v = Math.round(target * eased * 100) / 100;
        const shown = (target % 1 === 0) ? Math.round(v) : v.toFixed(1);
        el.textContent = shown + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    items.forEach(el => io.observe(el));
  }

  /* =================================================================
     8. MASK-CLIP REVEAL on [data-mask-reveal]
     ================================================================= */
  function maskReveal() {
    const els = document.querySelectorAll('[data-mask-reveal]');
    if (!els.length || reduced) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* =================================================================
     9. SMOOTH-FOCUS scroll-to-anchor with offset (account for fixed nav)
     ================================================================= */
  function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const navH = document.querySelector('.navigation-bar')?.getBoundingClientRect().height || 64;
        const y = target.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* =================================================================
     10. STAGGER REVEAL on service slide stack (mobile immersive cards)
     ================================================================= */
  function staggerReveal() {
    const items = document.querySelectorAll('.modern-slide');
    if (!items.length) return;
    if (reduced) { items.forEach(i => i.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(i => io.observe(i));
    // Safety net
    setTimeout(() => items.forEach(i => i.classList.add('is-visible')), 2000);
  }

  /* ------- Boot ------- */
  function boot() {
    splitText();
    scrollVelocitySkew();
    magneticCTAs();
    imagePan();
    cursorHalo();
    marqueeScrollLink();
    countUp();
    maskReveal();
    smoothAnchors();
    staggerReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
