/* ============================================================
   YOUSEE360 — POLISH LAYER
   Custom cursor + scroll reveals + scroll-aware nav + card tilt
   Loaded last, defers to DOMContentLoaded
   ============================================================ */
(function () {
  'use strict';

  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------- 1. Scroll-aware sticky nav — minimal layout thrash ------- */
  function initStickyNav() {
    const nav = document.querySelector('.navigation-bar');
    if (!nav) return;
    let ticking = false;
    let isScrolled = false; // cached state — skip redundant classList writes
    const update = () => {
      const should = window.scrollY > 24;
      if (should !== isScrolled) {
        isScrolled = should;
        nav.classList.toggle('scrolled', should);
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------- 2. Mobile hamburger toggle ------- */
  function initHamburger() {
    const nav = document.querySelector('.navigation-bar');
    const btn = document.querySelector('.hamburger-button');
    const menu = document.querySelector('.navigation-menu');
    if (!btn || !menu || !nav) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = nav.hasAttribute('data-nav-menu-open');
      if (open) {
        nav.removeAttribute('data-nav-menu-open');
        menu.classList.remove('w--nav-menu-open');
        document.body.style.overflow = '';
      } else {
        nav.setAttribute('data-nav-menu-open', 'true');
        menu.classList.add('w--nav-menu-open');
        document.body.style.overflow = 'hidden';
      }
    });
    // Mobile dropdown toggle on click
    document.querySelectorAll('.w-dropdown-toggle').forEach(t => {
      t.addEventListener('click', (e) => {
        if (window.innerWidth > 980) return;
        e.preventDefault();
        const dd = t.closest('.w-dropdown');
        if (dd) dd.classList.toggle('w--open');
      });
    });
    // Close on link click (mobile)
    document.querySelectorAll('.navigation-menu a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 980) {
          nav.removeAttribute('data-nav-menu-open');
          menu.classList.remove('w--nav-menu-open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ------- 3. Scroll reveals via IntersectionObserver ------- */
  function initReveals() {
    if (reducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    // Legacy [data-scroll-animation] hooks — also reveal these
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-scroll-animation]').forEach(el => io2.observe(el));

    // Final safety net — anything still hidden after 2s shows up
    setTimeout(() => {
      document.querySelectorAll('[data-scroll-animation]:not(.visible), [data-reveal]:not(.is-visible)').forEach(el => {
        el.classList.add('visible'); el.classList.add('is-visible');
      });
    }, 2200);
  }

  /* ------- 4. Card cursor-tracking glow ------- */
  function initCardGlow() {
    if (!supportsFinePointer) return;
    document.querySelectorAll('.ds-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ------- 5. Custom cursor (lerped ring + dot) ------- */
  function initCursor() {
    // Disabled by default — mix-blend-mode + mousemove repaints can feel heavy.
    // Opt-in via <html data-ys-cursor="1"> or ?cursor=1.
    const optIn = document.documentElement.dataset.ysCursor === '1' ||
                  /\bcursor=1\b/.test(location.search);
    if (!optIn) return;
    if (!supportsFinePointer || reducedMotion) return;
    if (document.querySelector('.ys-cursor-dot')) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'ys-cursor-dot';
    ring.className = 'ys-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('ys-cursor-active');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hoverTargets = 'a, button, .ds-card, .w-dropdown-toggle, [role="button"], input, textarea, select';
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) document.body.classList.add('ys-cursor-hover');
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) document.body.classList.remove('ys-cursor-hover');
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ------- 6a. Scroll progress bar ------- */
  function initScrollProgress() {
    if (document.querySelector('.ys-scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'ys-scroll-progress';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ------- 6b. Pannellum 360 heroes (lazy load, auto-advancing playlist) -------
     The hero used to hold a single panorama on every service and industry page.
     It now runs as a Pannellum multi-scene tour so visitors see several real
     client locations, cross-fading every few seconds, while keeping the drag
     interaction that makes the hero worth having.

     A page can override the reel with data-panorama-set='[{"src":"...","label":"..."}]'.
     Otherwise the page's own data-panorama opens the reel and HERO_REEL follows. */
  const HERO_REEL = [
    { src: 'images/hero-360-arenal-4k.jpg',   label: 'Arenal Volcano · La Fortuna' },
    { src: 'images/tours/casadelrio_360.jpg', label: 'Casa del Rio · La Fortuna' },
    { src: 'images/tours/junglo_360.jpg',     label: 'Junglo Resort & Spa · La Fortuna' },
    { src: 'images/tours/elgenio_360.jpg',    label: 'El Genio · Costa Rica' },
    { src: 'images/tours/arboeden_360.jpg',   label: 'Arboeden Eco Retreat · Costa Rica' }
  ];
  const HERO_SCENE_MS = 7000;     // dwell time per panorama
  const HERO_FADE_MS = 1200;      // cross-fade between panoramas
  const HERO_RESUME_MS = 14000;   // idle time before auto-advance resumes

  function heroReelFor(el) {
    const own = el.dataset.panorama || '';
    // Pages sit at different depths ("images/..." vs "../images/...").
    // Reuse the prefix the page already wrote rather than guessing.
    const base = own.indexOf('images/') > -1 ? own.slice(0, own.indexOf('images/')) : '';

    let reel;
    try {
      reel = el.dataset.panoramaSet ? JSON.parse(el.dataset.panoramaSet) : null;
    } catch (e) {
      console.warn('Invalid data-panorama-set; using the default reel.', e);
      reel = null;
    }
    if (!reel || !reel.length) {
      reel = HERO_REEL.map(s => ({ src: base + s.src, label: s.label }));
      // Open on whatever the page already chose, without showing it twice.
      if (own) {
        const dupe = reel.findIndex(s => s.src === own);
        const label = dupe > -1 ? reel[dupe].label : (el.dataset.panoramaLabel || '');
        if (dupe > -1) reel.splice(dupe, 1);
        reel.unshift({ src: own, label: label });
      }
    }
    return reel;
  }

  function mountHeroCaption(el, text) {
    const host = el.parentElement || el;
    let cap = host.querySelector('.ys-hero-360-caption');
    if (!cap) {
      cap = document.createElement('span');
      cap.className = 'ys-hero-360-caption';
      cap.setAttribute('aria-live', 'off');
      host.appendChild(cap);
    }
    if (cap.textContent !== text) {
      cap.classList.remove('is-in');
      // let the fade-out land before swapping the words
      setTimeout(() => { cap.textContent = text; cap.classList.add('is-in'); }, 220);
    }
    return cap;
  }

  function initPannellum() {
    const targets = document.querySelectorAll('[data-pannellum]');
    if (!targets.length) return;

    const start = (el, tries) => {
      tries = tries || 0;
      if (el.dataset.loaded === '1') return;
      if (!window.pannellum) {
        // Pannellum (deferred) not ready yet — retry, but cap at ~12s so we
        // never leave a runaway timer if the library fails to load.
        if (tries > 30) return;
        return setTimeout(() => start(el, tries + 1), 400);
      }
      el.dataset.loaded = '1';   // only mark loaded once we actually init

      const reel = heroReelFor(el);
      const autoRotate = parseFloat(el.dataset.autorotate || '-2');
      const haov = parseFloat(el.dataset.haov || '360');
      const vaov = parseFloat(el.dataset.vaov || '180');

      const scenes = {};
      reel.forEach((shot, n) => {
        scenes['ys' + n] = {
          type: 'equirectangular',
          panorama: shot.src,
          haov: haov,
          vaov: vaov,
          pitch: 0,
          hfov: 100
        };
      });

      let viewer;
      try {
        viewer = window.pannellum.viewer(el, {
          default: {
            firstScene: 'ys0',
            autoLoad: true,
            sceneFadeDuration: HERO_FADE_MS,
            autoRotate: autoRotate,
            showControls: false,
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            compass: false,
            hfov: 100,
            pitch: 0,
            mouseZoom: true,
            friction: 0.18
          },
          scenes: scenes
        });
      } catch (e) {
        console.warn('Pannellum init failed', e);
        return;
      }

      if (reel.length < 2) {
        if (reel[0] && reel[0].label) mountHeroCaption(el, reel[0].label);
        return;
      }

      let index = 0;
      let timer = null;
      let idle = null;
      if (reel[0].label) mountHeroCaption(el, reel[0].label);

      const advance = () => {
        index = (index + 1) % reel.length;
        try {
          viewer.loadScene('ys' + index);
          if (reel[index].label) mountHeroCaption(el, reel[index].label);
        } catch (e) { /* viewer torn down */ }
      };
      const play = () => {
        if (timer || reducedMotion) return;
        timer = setInterval(advance, HERO_SCENE_MS);
      };
      const pause = () => {
        if (timer) { clearInterval(timer); timer = null; }
      };
      // Someone dragging the panorama is the one person who does not want it
      // swapped out from under them. Hold, then resume once they stop.
      const hold = () => {
        pause();
        clearTimeout(idle);
        idle = setTimeout(play, HERO_RESUME_MS);
      };

      // Exposed so the reel can be inspected and stepped from the console.
      el._ysHeroReel = {
        viewer: viewer,
        reel: reel,
        next: advance,
        isPlaying: () => !!timer,
        play: play,
        pause: pause
      };

      el.addEventListener('pointerdown', hold);
      el.addEventListener('wheel', hold, { passive: true });
      el.addEventListener('touchstart', hold, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) pause(); else play();
      });
      play();
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { start(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    targets.forEach(t => io.observe(t));
  }

  /* ------- 7. Lenis smooth scroll — OFF by default (feels heavier than native) ------- */
  function initLenis() {
    const optIn = document.documentElement.dataset.ysLenis === '1' ||
                  /\blenis=1\b/.test(location.search);
    if (!optIn) return;
    if (reducedMotion || !window.Lenis) return;
    try {
      const lenis = new window.Lenis({
        duration: 0.6,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      window.__lenis = lenis;
    } catch (err) { /* silent */ }
  }

  /* ------- Boot ------- */
  function boot() {
    initStickyNav();
    initHamburger();
    initReveals();
    initCardGlow();
    initCursor();
    initScrollProgress();
    initPannellum();
    initLenis();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
