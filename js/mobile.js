/* ============================================================
   YOUSEE360 — MOBILE LAYER
   Robust menu, sticky bottom bar, FAB, gyroscope 360°, haptics.
   Loads after polish.js. Idempotent boot.
   ============================================================ */
(function () {
  'use strict';

  // Always cleanup any leftover open state on a fresh load.
  document.documentElement.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';

  const phone = '+50687971281';
  const phoneHuman = '+506 8797-1281';
  const whatsapp = 'https://wa.me/50687971281';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  const supportsHaptic = () => 'vibrate' in navigator;
  const haptic = (ms = 8) => { if (supportsHaptic()) try { navigator.vibrate(ms); } catch (e) {} };

  /* =================================================================
     1. MOBILE NAV — ROBUST (rewritten)
     ================================================================= */
  function initMobileNav() {
    const nav = document.querySelector('.navigation-bar');
    const btn = document.querySelector('.hamburger-button');
    const menu = document.querySelector('.navigation-menu');
    if (!nav || !btn || !menu) return;

    // 1) Clone the hamburger button to nuke ANY pre-existing listeners
    //    (webflow.js / vanilla-main.js / theme JS may all have bound to it).
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    const closeMenu = () => {
      nav.removeAttribute('data-nav-menu-open');
      nav.classList.remove('is-menu-open');
      menu.classList.remove('w--nav-menu-open');
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.querySelectorAll('.w-dropdown.is-open, .w-dropdown.w--open')
        .forEach(d => { d.classList.remove('is-open'); d.classList.remove('w--open'); });
    };
    const openMenu = () => {
      nav.setAttribute('data-nav-menu-open', 'true');
      nav.classList.add('is-menu-open');
      menu.classList.add('w--nav-menu-open');
      menu.classList.add('is-open');
      document.body.classList.add('menu-open');
      // We don't set position:fixed on body — that locks scroll position and
      // confuses iOS. overflow:hidden + the menu being a full overlay is enough.
      document.body.style.overflow = 'hidden';
    };

    // Single bubble-phase listener — no capture, no stopImmediatePropagation
    // so OUR handler can't get killed by us.
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      haptic(10);
      const open = nav.hasAttribute('data-nav-menu-open');
      if (open) closeMenu(); else openMenu();
    });
    // Also handle touchstart so iOS responds instantly
    newBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      haptic(10);
      const open = nav.hasAttribute('data-nav-menu-open');
      if (open) closeMenu(); else openMenu();
    }, { passive: false });

    // Inject the top-of-menu CTA as a real anchor (was a pseudo before, unclickable)
    if (!menu.querySelector('.ys-mobile-top-cta')) {
      const es = location.pathname.includes('/es/');
      const cta = document.createElement('a');
      cta.className = 'ys-mobile-top-cta';
      cta.href = es ? '/es/contacto.html#cotizacion' : '/contact.html#quote';
      cta.textContent = es ? 'Cotización Gratis' : 'Get a Free Quote';
      cta.addEventListener('click', () => { haptic(10); closeMenu(); });
      menu.insertBefore(cta, menu.firstChild);
    }

    // Dropdown toggles on mobile use click, not hover
    document.querySelectorAll('.w-dropdown-toggle').forEach(t => {
      t.addEventListener('click', (e) => {
        if (!isMobile() && window.innerWidth > 980) return;
        e.preventDefault();
        e.stopPropagation();
        const dd = t.closest('.w-dropdown');
        if (!dd) return;
        const wasOpen = dd.classList.contains('is-open');
        // Close all
        document.querySelectorAll('.w-dropdown.is-open')
          .forEach(d => { d.classList.remove('is-open'); d.classList.remove('w--open'); });
        if (!wasOpen) { dd.classList.add('is-open'); dd.classList.add('w--open'); haptic(6); }
      });
    });

    // Tapping any anchor inside the menu closes it
    menu.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', () => {
        if (isMobile() || window.innerWidth <= 980) closeMenu();
      });
    });

    // Tap outside (on the nav bg) shouldn't close — but ESC + back button should
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.hasAttribute('data-nav-menu-open')) closeMenu();
    });
    window.addEventListener('pageshow', closeMenu);
    window.addEventListener('popstate', closeMenu);

    // Swipe-right from inside menu to close
    let startX = null;
    menu.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    menu.addEventListener('touchmove', (e) => {
      if (startX === null) return;
      const dx = e.touches[0].clientX - startX;
      if (dx > 90) { closeMenu(); startX = null; }
    }, { passive: true });
    menu.addEventListener('touchend', () => { startX = null; }, { passive: true });
  }

  /* =================================================================
     2. STICKY BOTTOM ACTION BAR
     ================================================================= */
  function initStickyBar() {
    if (document.querySelector('.ys-mob-bar')) return;
    const es = location.pathname.includes('/es/');
    const quoteHref = es ? '/es/contacto.html#cotizacion' : '/contact.html#quote';
    const bar = document.createElement('div');
    bar.className = 'ys-mob-bar';
    bar.setAttribute('aria-label', es ? 'Acciones rápidas' : 'Quick actions');
    bar.innerHTML = `
      <a href="tel:${phone}" class="btn-call" aria-label="${es ? 'Llamar' : 'Call'}">
        <i class="fas fa-phone" aria-hidden="true"></i><span>${es ? 'Llamar' : 'Call'}</span>
      </a>
      <a href="${whatsapp}" class="btn-wa" target="_blank" rel="noopener" aria-label="WhatsApp">
        <i class="fab fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span>
      </a>
      <a href="${quoteHref}" class="btn-quote" aria-label="${es ? 'Cotización' : 'Quote'}">
        <i class="fas fa-bolt" aria-hidden="true"></i><span>${es ? 'Cotización Gratis' : 'Get a Quote'}</span>
      </a>
    `;
    document.body.appendChild(bar);

    bar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => haptic(12));
    });

    // Hide on scroll down, show on scroll up
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) { ticking = false; return; }
      if (y > lastY && y > 200) bar.classList.add('is-hidden');
      else bar.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  /* =================================================================
     3. FLOATING CONTACT FAB
     ================================================================= */
  function initFab() {
    if (document.querySelector('.ys-fab')) return;
    const es = location.pathname.includes('/es/');
    const fab = document.createElement('div');
    fab.className = 'ys-fab';
    fab.innerHTML = `
      <div class="ys-fab-options" role="menu">
        <a href="mailto:info@yousee360.com" class="ys-fab-option" style="--i:0" role="menuitem">
          <i class="fas fa-envelope" aria-hidden="true"></i> info@yousee360.com
        </a>
        <a href="${whatsapp}" target="_blank" rel="noopener" class="ys-fab-option" style="--i:1" role="menuitem">
          <i class="fab fa-whatsapp" aria-hidden="true"></i> ${es ? 'Chatear' : 'Chat on WhatsApp'}
        </a>
        <a href="tel:${phone}" class="ys-fab-option" style="--i:2" role="menuitem">
          <i class="fas fa-phone" aria-hidden="true"></i> ${phoneHuman}
        </a>
      </div>
      <button class="ys-fab-trigger" aria-label="${es ? 'Contacto' : 'Contact options'}" aria-expanded="false">
        <i class="fas fa-plus" aria-hidden="true"></i>
      </button>
    `;
    document.body.appendChild(fab);
    const trigger = fab.querySelector('.ys-fab-trigger');
    trigger.addEventListener('click', () => {
      const open = fab.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open);
      haptic(open ? 14 : 8);
    });
    fab.querySelectorAll('.ys-fab-option').forEach(o => {
      o.addEventListener('click', () => { haptic(10); fab.classList.remove('is-open'); });
    });
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) fab.classList.remove('is-open');
    });
  }

  /* =================================================================
     4. GYROSCOPE 360° — the WOW factor
     Hooks into Pannellum viewers + adds tilt-to-look-around
     ================================================================= */
  function initGyro() {
    // Only interactive viewers, never a decorative hero backdrop. The hero
    // panorama sits behind the headline, so attaching the prompt there covered
    // the H1 with a dark blurred overlay reading "Move your phone to explore".
    const containers = [...document.querySelectorAll('.ys-360-hero, .featured-tour-container, [data-pannellum]')]
      .filter(c => !c.closest('.hero-section') && !c.classList.contains('ys-hero-360-bg'));
    if (!containers.length) return;
    // Only on touch devices that support orientation
    const hasOrient = ('DeviceOrientationEvent' in window);
    if (!hasOrient || !('ontouchstart' in window)) return;

    containers.forEach(container => {
      if (container.dataset.gyroInit === '1') return;
      container.dataset.gyroInit = '1';

      const isPannellum = container.matches('[data-pannellum]') ||
                          container.querySelector('[data-pannellum]');
      const target = container.matches('[data-pannellum]')
        ? container : container.querySelector('[data-pannellum]');
      if (!target) return;

      // Build the prompt overlay
      const prompt = document.createElement('div');
      prompt.className = 'ys-gyro-prompt';
      prompt.innerHTML = `
        <div class="ys-gyro-prompt-inner">
          <div class="ys-gyro-prompt-icon"><i class="fas fa-mobile-alt" aria-hidden="true"></i></div>
          <h4>Move your phone to explore</h4>
          <p>Tilt and pan to look around. Drag with your finger if you prefer.</p>
          <button type="button">Enable Motion</button>
        </div>
      `;
      container.style.position = container.style.position || 'relative';
      container.appendChild(prompt);

      // Active badge
      const badge = document.createElement('div');
      badge.className = 'ys-gyro-active-badge';
      badge.textContent = 'Gyro on';
      container.appendChild(badge);

      // Show prompt once viewer loads
      const showPrompt = () => {
        if (sessionStorage.getItem('ys-gyro-dismissed') === '1') return;
        prompt.classList.add('is-visible');
      };
      // Defer until viewer init
      const promptTimer = setTimeout(showPrompt, 1800);

      const enable = async () => {
        clearTimeout(promptTimer);
        prompt.classList.remove('is-visible');
        haptic(20);
        // iOS 13+ permission gate
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const res = await DeviceOrientationEvent.requestPermission();
            if (res !== 'granted') return;
          } catch (e) { return; }
        }
        // Hook into Pannellum if loaded
        const tryHook = () => {
          // Find the viewer instance — Pannellum stores it on the element via pannellum.viewer return
          const viewer = container._panViewer || target._panViewer;
          if (viewer && viewer.startOrientation) {
            try { viewer.startOrientation(); badge.classList.add('is-visible'); }
            catch (e) {}
          } else {
            setTimeout(tryHook, 400);
          }
        };
        tryHook();
        sessionStorage.setItem('ys-gyro-dismissed', '1');
      };
      prompt.querySelector('button').addEventListener('click', enable);
      prompt.addEventListener('click', (e) => {
        if (e.target === prompt) {
          prompt.classList.remove('is-visible');
          sessionStorage.setItem('ys-gyro-dismissed', '1');
        }
      });
    });

    // Intercept the Pannellum viewer creation in polish.js to expose the instance
    // We patch window.pannellum.viewer so we can stash the result on the element.
    if (window.pannellum && !window.pannellum.__ysWrapped) {
      const orig = window.pannellum.viewer;
      window.pannellum.viewer = function (el, opts) {
        const v = orig.apply(this, arguments);
        try {
          (el === 'string' ? document.getElementById(el) : el)._panViewer = v;
        } catch (e) {}
        return v;
      };
      window.pannellum.__ysWrapped = true;
    }
  }

  // Wait for pannellum to load before wrapping so polish.js's init benefits
  function waitPannellumThen(fn, tries = 0) {
    if (window.pannellum) return fn();
    if (tries > 30) return fn();
    setTimeout(() => waitPannellumThen(fn, tries + 1), 200);
  }

  /* =================================================================
     5. RIPPLES on action buttons
     ================================================================= */
  function initRipples() {
    const targets = document.querySelectorAll('.nav-cta, .ys-mob-bar a, .ds-btn-primary, .ys-fab-trigger, .pkg-btn');
    targets.forEach(el => {
      el.classList.add('ripple-able');
      el.addEventListener('pointerdown', (e) => {
        const r = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ys-ripple';
        const size = Math.max(r.width, r.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
        ripple.style.top  = (e.clientY - r.top  - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* =================================================================
     6. PASSIVE HAPTIC on all link/button taps
     ================================================================= */
  function initHapticTaps() {
    if (!supportsHaptic()) return;
    document.addEventListener('touchstart', (e) => {
      const t = e.target.closest('a, button, .ds-card, .modal-checkbox, .portfolio-filter-btn');
      if (t) haptic(4);
    }, { passive: true });
  }

  /* ------- Boot ------- */
  function boot() {
    initMobileNav();
    initStickyBar();
    initFab();
    waitPannellumThen(initGyro);
    initRipples();
    initHapticTaps();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
