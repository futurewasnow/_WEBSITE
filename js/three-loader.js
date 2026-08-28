/* ============================================================
   YOUSEE360 — LAZY THREE.JS LOADER
   three.min.js is ~590KB: the single heaviest asset on the site, and it is
   only ever used for decorative WebGL backgrounds (aurora.js, hero-particles).
   Loading it up front meant every page paid that cost before the hero could
   settle, on every connection.

   This loader fetches it only when it will actually be used, and only once the
   page is idle. Consumers wait on the `three:ready` / `three:skipped` events.

   Skipped when:
     - the visitor prefers reduced motion (aurora bails in that case anyway)
     - the viewport is phone-sized (effect is barely visible, cost is highest)
     - the browser reports a data-saver preference or a slow connection
     - the device reports very limited memory / cores
   In every skip case the CSS gradient fallback is what renders, which is the
   already-designed no-WebGL path.
   ============================================================ */
(function () {
  'use strict';

  var SRC = (document.currentScript && document.currentScript.getAttribute('data-three-src')) ||
            'js/three.min.js';

  function announce(name) {
    try { window.dispatchEvent(new Event(name)); }
    catch (e) {
      var ev = document.createEvent('Event');
      ev.initEvent(name, false, false);
      window.dispatchEvent(ev);
    }
  }

  function skip() {
    window.__threeSkipped = true;
    announce('three:skipped');
  }

  function shouldSkip() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      if (window.matchMedia('(max-width: 768px)').matches) return true;
      var c = navigator.connection;
      if (c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType || ''))) return true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    } catch (e) { /* if any probe is unavailable, err on the side of loading */ }
    return false;
  }

  function load() {
    if (window.THREE) { announce('three:ready'); return; }
    var s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onload = function () { announce('three:ready'); };
    s.onerror = skip;
    document.head.appendChild(s);
  }

  function start() {
    if (shouldSkip()) { skip(); return; }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(load, { timeout: 2500 });
    } else {
      setTimeout(load, 1200);
    }
  }

  // Wait for first paint to be well clear before spending bandwidth on decor.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
