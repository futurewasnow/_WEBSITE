/**
 * Tap-to-load live tour embeds.
 *
 * The client tours are heavy WebGL iframes, so a page ships a poster facade and
 * the real tour is mounted on first intent. The homepage carries its own inline
 * copy of this wired to fixed element ids; this version drives every
 * .ys-live-tour on a page from data attributes, so a case study can drop the
 * markup in without also pasting a script.
 */
(function () {
  'use strict';

  function mount(host) {
    if (host.dataset.ysTourBound === '1') return;
    host.dataset.ysTourBound = '1';

    var facade = host.querySelector('.ys-live-tour-facade');
    var frame = host.querySelector('.ys-live-tour-frame');
    var url = host.dataset.tourUrl;
    if (!facade || !frame || !url) return;

    var loaded = false;

    function loadTour() {
      if (loaded) return;
      loaded = true;
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = host.dataset.tourTitle || 'Virtual tour';
      iframe.allow = 'accelerometer; gyroscope; xr-spatial-tracking; fullscreen';
      iframe.setAttribute('allowfullscreen', '');
      iframe.loading = 'eager';
      frame.appendChild(iframe);
      host.classList.add('is-loaded');
      if (window.gtag) {
        window.gtag('event', 'tour_open', {
          tour: host.dataset.tourId || 'unknown',
          location: host.dataset.tourContext || 'case_study'
        });
      }
    }

    facade.addEventListener('click', loadTour);

    // Warm the connection as soon as the visitor shows intent, so the tour is
    // already on its way by the time the tap lands.
    facade.addEventListener('pointerenter', function () {
      if (loaded || host.dataset.ysTourPrefetched === '1') return;
      host.dataset.ysTourPrefetched = '1';
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }, { once: true });
  }

  function boot() {
    document.querySelectorAll('.ys-live-tour[data-tour-url]').forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
