/* ============================================================
   FORM ACCESSIBILITY HELPERS
   Inline, persistent validation messages tied to their field via
   aria-describedby, focus moved to the first problem on submit, and
   focus moved to the success/error panel once a request settles.

   Forms opt in with YSForms.init(form) and gate their fetch on
   YSForms.validate(form).
   ============================================================ */
(function () {
  'use strict';

  var uid = 0;

  function labelFor(el) {
    var name = el.getAttribute('aria-label')
      || el.getAttribute('placeholder')
      || el.getAttribute('name')
      || 'this field';
    return name.replace(/\s*\*+\s*$/, '').replace(/\s*\(required\)\s*$/i, '').trim();
  }

  /* A message that names the fix, not just the problem. */
  function messageFor(el) {
    var v = el.validity;
    var what = labelFor(el);
    if (v.valueMissing) {
      if (el.type === 'checkbox' || el.type === 'radio') return 'Pick an option to continue.';
      // Some fields are labelled with a question rather than a noun; those
      // don't read as "Enter <label>".
      if (what.length > 32 || what.indexOf(',') !== -1) {
        return 'Add a short answer here so we can quote accurately.';
      }
      return 'Enter your ' + what.toLowerCase() + ' so we can reply to you.';
    }
    if (v.typeMismatch && el.type === 'email') {
      return 'Enter a complete email address, like name@example.com.';
    }
    if (v.typeMismatch && el.type === 'tel') {
      return 'Enter a reachable phone number, like +506 8888 8888.';
    }
    if (v.tooShort) {
      return 'Add a little more detail — at least ' + el.minLength + ' characters.';
    }
    if (v.patternMismatch) {
      return 'Check the format of ' + what.toLowerCase() + ' and try again.';
    }
    return el.validationMessage || 'Check this field and try again.';
  }

  function errorNode(el) {
    var id = el.dataset.ysErrorId;
    if (id) {
      var found = document.getElementById(id);
      if (found) return found;
    }
    uid += 1;
    var node = document.createElement('p');
    node.className = 'ys-field-error';
    node.id = 'ys-err-' + uid;
    el.dataset.ysErrorId = node.id;
    (el.parentNode || el).insertBefore(node, el.nextSibling);
    return node;
  }

  function showError(el, text) {
    var node = errorNode(el);
    node.textContent = text;
    node.hidden = false;
    el.setAttribute('aria-invalid', 'true');
    var described = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (described.indexOf(node.id) === -1) {
      described.push(node.id);
      el.setAttribute('aria-describedby', described.join(' '));
    }
  }

  function clearError(el) {
    var id = el.dataset.ysErrorId;
    el.removeAttribute('aria-invalid');
    if (!id) return;
    var node = document.getElementById(id);
    if (node) { node.textContent = ''; node.hidden = true; }
    var described = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/).filter(function (x) { return x && x !== id; });
    if (described.length) el.setAttribute('aria-describedby', described.join(' '));
    else el.removeAttribute('aria-describedby');
  }

  function init(form) {
    if (!form || form.dataset.ysA11y === '1') return;
    form.dataset.ysA11y = '1';
    /* Our own messages replace the browser bubble, which vanishes on the next
       keystroke and is never read back by a screen reader on demand. */
    form.setAttribute('novalidate', 'novalidate');
    form.addEventListener('input', function (e) {
      var el = e.target;
      if (!el.matches || !el.matches('input, select, textarea')) return;
      if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) clearError(el);
    }, true);
    form.addEventListener('change', function (e) {
      var el = e.target;
      if (!el.matches || !el.matches('input, select, textarea')) return;
      if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) clearError(el);
    }, true);
  }

  function validate(form) {
    if (!form) return true;
    var fields = form.querySelectorAll('input, select, textarea');
    var first = null;
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (el.type === 'hidden' || el.disabled || el.name === '_gotcha') continue;
      if (el.checkValidity()) { clearError(el); continue; }
      showError(el, messageFor(el));
      if (!first) first = el;
    }
    if (first) {
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return false;
    }
    return true;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Move focus into a result panel so the outcome is announced and the next
     Tab starts from the message rather than the top of the page. */
  function focusPanel(panel) {
    if (!panel) return;
    if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
    window.requestAnimationFrame(function () {
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* "Try Again" on a failed submit: restore the form and put the caret back
     where the person left off, instead of an inline onclick that only flips
     two display properties. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-retry-form]') : null;
    if (!btn) return;
    e.preventDefault();
    var panel = document.getElementById(btn.getAttribute('data-retry-panel'));
    var form = document.getElementById(btn.getAttribute('data-retry-form'));
    if (panel) panel.style.display = 'none';
    if (!form) return;
    form.style.display = 'block';
    var firstField = form.querySelector('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select');
    if (firstField) firstField.focus();
  });

  window.YSForms = {
    init: init,
    validate: validate,
    focusPanel: focusPanel,
    clearError: clearError
  };
})();
