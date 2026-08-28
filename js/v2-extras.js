/* ============================================================
   YOUSEE360 — V2 EXTRAS
   Quote estimator state machine + FAQ accordion.
   ============================================================ */
(function () {
  'use strict';
  const haptic = (ms = 8) => { if ('vibrate' in navigator) try { navigator.vibrate(ms); } catch(e){} };

  /* =================================================================
     QUOTE ESTIMATOR
     ================================================================= */
  function initEstimator() {
    const root = document.querySelector('.ys-estimator');
    if (!root) return;

    const state = { step: 0, type: null, size: null, addons: [] };
    const panels = root.querySelectorAll('.ys-estimator-panel');
    const steps = root.querySelectorAll('.ys-estimator-step');
    const back = root.querySelector('.ys-estimator-back');
    const next = root.querySelector('.ys-estimator-next');
    const navEl = root.querySelector('.ys-estimator-nav');

    // ---- pricing model (realistic Costa Rica premium rates) ----
    const TYPE = {
      'hotel':       { base: 1800, label: 'Hotel / Resort' },
      'real-estate': { base: 1250, label: 'Real Estate' },
      'restaurant':  { base: 950,  label: 'Restaurant' },
      'adventure':   { base: 2200, label: 'Adventure / Tour Operator' },
      'wellness':    { base: 1500, label: 'Retreat / Wellness' },
      'other':       { base: 1300, label: 'Other / Custom' }
    };
    const SIZE = {
      'small':  { mult: 1.0,  label: 'Small (up to 5 scenes)' },
      'medium': { mult: 1.7,  label: 'Medium (6–12 scenes)' },
      'large':  { mult: 2.6,  label: 'Large (13+ scenes)' }
    };
    const ADDON = {
      'drone':      { add: 650,  label: '🛸 Drone Aerial 360°' },
      'streetview': { add: 400,  label: '🗺️ Google Street View Publish' },
      'video':      { add: 1100, label: '🎥 360° Video' },
      'ar':         { add: 900,  label: '✨ Augmented Reality' },
      'hotspots':   { add: 350,  label: '🔄 Custom Hotspots' }
    };

    function render() {
      panels.forEach((p, i) => p.classList.toggle('is-active', i === state.step));
      steps.forEach((s, i) => s.classList.toggle('is-active', i <= state.step));
      back.disabled = state.step === 0;

      // Last step (result) — hide nav
      if (state.step === 3) {
        navEl.style.display = 'none';
        renderResult();
      } else {
        navEl.style.display = '';
        // Next button label
        next.textContent = state.step === 2 ? 'See estimate →' : 'Next →';
        // Disable next until current step has selection
        const canProceed =
          (state.step === 0 && state.type) ||
          (state.step === 1 && state.size) ||
          (state.step === 2); // addons optional
        next.disabled = !canProceed;
        next.style.opacity = canProceed ? '1' : '0.45';
        next.style.pointerEvents = canProceed ? '' : 'none';
      }
    }

    function renderResult() {
      if (!state.type || !state.size) return;
      const base = TYPE[state.type].base;
      const mult = SIZE[state.size].mult;
      const addonsTotal = state.addons.reduce((s, a) => s + ADDON[a].add, 0);
      const est = Math.round((base * mult + addonsTotal) / 50) * 50; // round to $50
      const low = Math.round(est * 0.9 / 50) * 50;
      const high = Math.round(est * 1.15 / 50) * 50;

      const wrap = root.querySelector('.ys-estimator-result');
      const breakdown = [TYPE[state.type].label, SIZE[state.size].label]
        .concat(state.addons.map(a => ADDON[a].label));

      const quoteUrl = `/contact.html?type=${state.type}&size=${state.size}&addons=${state.addons.join(',')}&est=${est}#quote`;
      wrap.innerHTML = `
        <span class="price-label">Starting at</span>
        <div class="price">$${est.toLocaleString()}</div>
        <div class="price-range">Typical range: $${low.toLocaleString()} – $${high.toLocaleString()}</div>
        <div class="breakdown">
          <ul>${breakdown.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="actions">
          <a href="${quoteUrl}" class="primary">Get exact quote →</a>
          <button type="button" class="ghost" data-estimator-restart>Start over</button>
        </div>
      `;
      wrap.querySelector('[data-estimator-restart]').addEventListener('click', () => {
        state.step = 0; state.type = null; state.size = null; state.addons = [];
        root.querySelectorAll('.ys-estimator-option').forEach(o => o.classList.remove('is-selected'));
        render();
        haptic(8);
      });
    }

    // ---- option click handlers ----
    root.querySelectorAll('.ys-estimator-option').forEach(opt => {
      opt.addEventListener('click', () => {
        haptic(6);
        const panel = opt.closest('.ys-estimator-panel');
        const key = panel.dataset.step;
        const val = opt.dataset.value;
        const multi = opt.dataset.multi === '1';

        if (multi) {
          // Toggle addon
          opt.classList.toggle('is-selected');
          state.addons = [...panel.querySelectorAll('.is-selected')].map(o => o.dataset.value);
        } else {
          // Single select
          panel.querySelectorAll('.ys-estimator-option').forEach(o => o.classList.remove('is-selected'));
          opt.classList.add('is-selected');
          if (key === 'type') state.type = val;
          if (key === 'size') state.size = val;
        }
        render();
      });
    });

    next.addEventListener('click', () => {
      if (state.step < 3) { state.step++; render(); haptic(10); }
    });
    back.addEventListener('click', () => {
      if (state.step > 0) { state.step--; render(); haptic(6); }
    });

    render();
  }

  /* =================================================================
     FAQ ACCORDION
     ================================================================= */
  function initFaq() {
    document.querySelectorAll('.ys-faq-item').forEach(item => {
      const q = item.querySelector('.ys-faq-question');
      if (!q) return;
      q.addEventListener('click', () => {
        haptic(6);
        const wasOpen = item.classList.contains('is-open');
        // close siblings within the same .ys-faq
        const root = item.closest('.ys-faq');
        if (root) root.querySelectorAll('.ys-faq-item.is-open').forEach(i => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
      });
    });
  }

  function boot() { initEstimator(); initFaq(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
