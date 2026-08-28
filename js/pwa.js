/* PWA register — silent install, runs after idle */
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
  const reg = () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  };
  if ('requestIdleCallback' in window) requestIdleCallback(reg, { timeout: 3000 });
  else setTimeout(reg, 1500);

  // Install-prompt button hook (optional CTA later)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.body.dataset.canInstall = '1';
  });
  window.addEventListener('appinstalled', () => {
    document.body.dataset.canInstall = '';
  });
  // Public helper if you ever want to wire an "Install App" button
  window.ysPromptInstall = () => {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
  };
})();
