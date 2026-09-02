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

    /* ---- URL <-> state -------------------------------------------------
       The estimator is stateful UI, so the step and the answers belong in
       the query string: Back returns to the previous question instead of
       leaving the page, and a link carries the estimate with it. */
    const PARAMS = ['est-step', 'est-type', 'est-size', 'est-addons'];

    function readUrl() {
      const q = new URLSearchParams(window.location.search);
      if (!PARAMS.some(k => q.has(k))) return false;
      const step = parseInt(q.get('est-step'), 10);
      state.step = isNaN(step) ? 0 : Math.max(0, Math.min(3, step));
      state.type = TYPE[q.get('est-type')] ? q.get('est-type') : null;
      state.size = SIZE[q.get('est-size')] ? q.get('est-size') : null;
      state.addons = (q.get('est-addons') || '').split(',').filter(a => ADDON[a]);
      if (!state.type) state.step = 0;
      else if (!state.size && state.step > 1) state.step = 1;
      return true;
    }

    function paintSelections() {
      root.querySelectorAll('.ys-estimator-option').forEach(o => {
        const val = o.dataset.value;
        const chosen = val === state.type || val === state.size ||
                       state.addons.indexOf(val) !== -1;
        o.classList.toggle('is-selected', chosen);
        o.setAttribute('aria-pressed', String(chosen));
      });
    }

    function writeUrl(push) {
      const url = new URL(window.location.href);
      const q = url.searchParams;
      if (!state.type && !state.size && !state.addons.length && state.step === 0) {
        PARAMS.forEach(k => q.delete(k));
      } else {
        q.set('est-step', String(state.step));
        if (state.type) q.set('est-type', state.type); else q.delete('est-type');
        if (state.size) q.set('est-size', state.size); else q.delete('est-size');
        if (state.addons.length) q.set('est-addons', state.addons.join(','));
        else q.delete('est-addons');
      }
      history[push ? 'pushState' : 'replaceState']({ estimator: true }, '', url);
    }
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
        paintSelections();
        render();
        writeUrl(true);
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
          const on = opt.classList.toggle('is-selected');
          opt.setAttribute('aria-pressed', String(on));
          state.addons = [...panel.querySelectorAll('.is-selected')].map(o => o.dataset.value);
        } else {
          // Single select
          panel.querySelectorAll('.ys-estimator-option').forEach(o => {
            o.classList.remove('is-selected');
            o.setAttribute('aria-pressed', 'false');
          });
          opt.classList.add('is-selected');
          opt.setAttribute('aria-pressed', 'true');
          if (key === 'type') state.type = val;
          if (key === 'size') state.size = val;
        }
        render();
        writeUrl(false);
      });
    });

    next.addEventListener('click', () => {
      if (state.step < 3) { state.step++; render(); writeUrl(true); haptic(10); }
    });
    back.addEventListener('click', () => {
      if (state.step > 0) { state.step--; render(); writeUrl(true); haptic(6); }
    });

    window.addEventListener('popstate', () => {
      state.step = 0; state.type = null; state.size = null; state.addons = [];
      readUrl();
      paintSelections();
      render();
    });

    if (readUrl()) paintSelections();
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
        if (root) {
          root.querySelectorAll('.ys-faq-item.is-open').forEach(i => {
            i.classList.remove('is-open');
            const btn = i.querySelector('.ys-faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
        }
        if (!wasOpen) item.classList.add('is-open');
        q.setAttribute('aria-expanded', String(!wasOpen));
      });
    });
  }

  function boot() { initEstimator(); initFaq(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
