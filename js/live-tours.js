/* ============================================================
   YOUSEE360 — PORTFOLIO TOUR CARDS
   Each card shows the REAL first scene of its tour (poster pulled
   from the tour's own socialThumbnail), with a Felix & Paul-style
   gyro/cursor 3D tilt. The live 360° tour loads ON TAP in the
   lightbox — one at a time — so we never spin up multiple heavy
   3DVista WebGL tours at once (which froze low-end devices).
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openTour(card) {
    const preview = card.querySelector('.portfolio-card-tour-preview');
    const tourId = preview && preview.dataset.tourId;
    if (tourId && window.__ysOpenTour) {
      window.__ysOpenTour(tourId);
    } else if (card.dataset.tourUrl) {
      window.open(card.dataset.tourUrl, '_blank', 'noopener');
    }
  }

  function enhanceCard(card) {
    const media = card.querySelector('.portfolio-card-media');
    if (!media || media.dataset.enhanced === '1') return;
    media.dataset.enhanced = '1';

    const title = (card.querySelector('.portfolio-card-title') || {}).textContent || 'Virtual tour';
    const preview = card.querySelector('.portfolio-card-tour-preview');

    // Real first-scene poster
    if (preview && !preview.querySelector('.portfolio-card-poster')) {
      const tourId = preview.dataset.tourId;
      const poster = document.createElement('img');
      poster.className = 'portfolio-card-poster';
      poster.src = card.dataset.poster || (tourId ? 'images/tours/' + tourId + '.jpg' : 'images/tour-poster.jpg');
      poster.alt = title + ' — real 360 tour preview';
      poster.loading = 'lazy';
      poster.decoding = 'async';
      poster.addEventListener('error', function () {
        if (poster.src.indexOf('tour-poster.jpg') === -1) poster.src = 'images/tour-poster.jpg';
      });
      preview.insertBefore(poster, preview.firstChild);
    }

    // Badge
    const badge = document.createElement('span');
    badge.className = 'ys-tour-badge';
    badge.innerHTML = '360&deg; Tour';
    media.appendChild(badge);

    // Tap hint
    const hint = document.createElement('span');
    hint.className = 'ys-tour-drag-hint';
    hint.innerHTML = '<i class="fas fa-vr-cardboard"></i> Tap to explore';
    media.appendChild(hint);

    // A play affordance so it's obviously interactive
    const play = document.createElement('span');
    play.className = 'ys-tour-playbtn';
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<i class="fas fa-play"></i>';
    media.appendChild(play);

    // Whole media area opens the live tour
    media.style.cursor = 'pointer';
    media.addEventListener('click', function (e) {
      e.preventDefault();
      openTour(card);
    });
  }

  /* ---- Felix & Paul-style reactive tilt on the poster ---- */
  function setTilt(media, rx, ry) {
    rx = Math.max(-1, Math.min(1, rx));
    ry = Math.max(-1, Math.min(1, ry));
    media.style.setProperty('--tilt-x', (rx * 7).toFixed(2) + 'deg');
    media.style.setProperty('--tilt-y', (ry * 9).toFixed(2) + 'deg');
    media.style.setProperty('--par-x', (ry * -6).toFixed(2) + 'px');
    media.style.setProperty('--par-y', (rx * 6).toFixed(2) + 'px');
  }
  function resetTilt(media) {
    media.style.setProperty('--tilt-x', '0deg');
    media.style.setProperty('--tilt-y', '0deg');
    media.style.setProperty('--par-x', '0px');
    media.style.setProperty('--par-y', '0px');
  }
  function initCursorTilt(cards) {
    cards.forEach(function (card) {
      const media = card.querySelector('.portfolio-card-media');
      if (!media) return;
      media.classList.add('ys-tilt');
      card.addEventListener('mousemove', function (e) {
        const r = media.getBoundingClientRect();
        const ry = (e.clientX - r.left) / r.width - 0.5;
        const rx = -((e.clientY - r.top) / r.height - 0.5);
        setTilt(media, rx * 2, ry * 2);
      });
      card.addEventListener('mouseleave', function () { resetTilt(media); });
    });
  }
  function initGyroTilt(cards) {
    const medias = [];
    cards.forEach(function (card) {
      const m = card.querySelector('.portfolio-card-media');
      if (m) { m.classList.add('ys-tilt'); medias.push(m); }
    });
    if (!medias.length) return;
    let base = null, ticking = false;
    function onOrient(e) {
      if (e.beta == null || e.gamma == null) return;
      if (base === null) base = { beta: e.beta, gamma: e.gamma };
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const ry = Math.max(-1, Math.min(1, (e.gamma - base.gamma) / 28));
        const rx = Math.max(-1, Math.min(1, (e.beta - base.beta) / 28));
        medias.forEach(function (m) { setTilt(m, rx, ry); });
        ticking = false;
      });
    }
    function start() { window.addEventListener('deviceorientation', onOrient, true); }
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      window.addEventListener('touchend', function ask() {
        DeviceOrientationEvent.requestPermission().then(function (s) {
          if (s === 'granted') start();
        }).catch(function () {});
        window.removeEventListener('touchend', ask);
      }, { once: true });
    } else {
      start();
    }
  }

  /* ---- Featured tour: tap-to-load (no heavy auto-mount) ---- */
  function initFeatured() {
    const facade = document.getElementById('featuredTourFacade');
    if (!facade) return;
    facade.style.cursor = 'pointer';
    facade.addEventListener('click', function () {
      if (window.__ysOpenTour) window.__ysOpenTour('casadelrio');
      else window.open('https://tours.yousee360.com/casadelrio', '_blank', 'noopener');
    });
  }

  function boot() {
    const cards = document.querySelectorAll('.portfolio-card[data-tour-url]');
    cards.forEach(enhanceCard);
    initFeatured();

    if (!reduced && cards.length) {
      if (window.matchMedia('(pointer: coarse)').matches) initGyroTilt(cards);
      else initCursorTilt(cards);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
