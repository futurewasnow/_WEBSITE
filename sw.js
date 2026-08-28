/* ============================================================
   YouSee360 — Service Worker
   Offline support + smart caching for repeat visits.
   Cache strategy: stale-while-revalidate for HTML, cache-first for assets.
   ============================================================ */
const CACHE_VERSION = 'ys360-v2026-05-14';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Critical assets to precache on install
const PRECACHE = [
  '/',
  '/index.html',
  '/css/normalize.css',
  '/css/design-system.css',
  '/css/page-modules.css',
  '/css/nav-v2.css',
  '/css/perf-fixes.css',
  '/css/mobile.css',
  '/css/wow.css',
  '/js/polish.js',
  '/js/mobile.js',
  '/js/wow.js',
  '/images/350-x-375-You-see-360-logo-white-for-black-bg-1.png',
  '/images/webclip.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k)))
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Skip cross-origin (Pannellum, GA, etc.) — let browser handle directly
  if (url.origin !== location.origin) return;

  // Strategy A: HTML — network-first (always show fresh content), fall back to cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(DYNAMIC_CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }

  // Strategy B: Same-origin static assets — cache-first
  if (/\.(css|js|woff2?|ttf|jpg|jpeg|png|webp|svg|ico|mp4|webm)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          // Refresh in background
          fetch(req).then(res => {
            caches.open(DYNAMIC_CACHE).then(c => c.put(req, res.clone())).catch(() => {});
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then(res => {
          const copy = res.clone();
          caches.open(DYNAMIC_CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        });
      })
    );
    return;
  }
});
