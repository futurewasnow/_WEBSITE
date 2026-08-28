/**
 * YouSee360 Contact Modal Component
 * A reusable modal contact form that opens from "Get Started" buttons
 * across service and industry pages with context-aware pre-selection
 */

(function () {
  'use strict';

  // Modal HTML template
  const modalTemplate = `
    <div class="contact-modal-overlay" id="contactModalOverlay" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle" hidden>
      <div class="contact-modal">
        <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-header">
          <h2 class="modal-title" id="contactModalTitle">Let's Create Something <span class="highlight">Amazing</span></h2>
          <p class="modal-subtitle" id="modalSubtitle">Get your custom quote in 24 hours — no commitment required.</p>
        </div>

        <!-- Trust Signal Bar -->
        <div class="modal-trust-bar">
          <div class="trust-item">
            <i class="fas fa-clock"></i>
            <span>Response within 24 hours</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-shield-alt"></i>
            <span>100% Secure</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-comments"></i>
            <span>Free Consultation</span>
          </div>
        </div>

        <form id="modalContactForm" action="https://formspree.io/f/xldjykrj" method="POST">
          <!-- Hidden fields for context -->
          <input type="hidden" name="_subject" id="modalSubject" value="New Quote Request from YouSee360 Website">
          <input type="hidden" name="_replyto" id="modalReplyTo">
          <input type="hidden" name="pageContext" id="pageContext">
          
          <!-- Services Selection -->
          <div class="modal-form-section">
            <label class="modal-section-label">
              <i class="fas fa-check-circle"></i>
              SELECT YOUR SERVICES
              <span class="label-hint">(Select all that apply)</span>
            </label>
            <div class="modal-checkbox-grid" id="modalServicesGrid">
              <label class="modal-checkbox" data-service="360-photo">
                <input type="checkbox" name="services[]" value="360 Photo">
                <span class="checkbox-label">360° Photography</span>
              </label>
              <label class="modal-checkbox" data-service="360-video">
                <input type="checkbox" name="services[]" value="360 Video">
                <span class="checkbox-label">360° Videography</span>
              </label>
              <label class="modal-checkbox" data-service="drone">
                <input type="checkbox" name="services[]" value="Drone Media">
                <span class="checkbox-label">Drone 360° Media</span>
              </label>
              <label class="modal-checkbox" data-service="branded-tour">
                <input type="checkbox" name="services[]" value="Branded Virtual Tour">
                <span class="checkbox-label">Interactive Virtual Tour</span>
              </label>
              <label class="modal-checkbox" data-service="streetview">
                <input type="checkbox" name="services[]" value="Google Streetview">
                <span class="checkbox-label">Google Street View</span>
              </label>
              <label class="modal-checkbox" data-service="ar">
                <input type="checkbox" name="services[]" value="Augmented Reality">
                <span class="checkbox-label">Augmented Reality</span>
              </label>
            </div>
          </div>

          <!-- Contact Details -->
          <div class="modal-form-section">
            <label class="modal-section-label">
              <i class="fas fa-user"></i>
              YOUR DETAILS
            </label>
            <div class="modal-form-row">
              <input type="text" name="fullName" placeholder="Full Name *" required class="modal-input">
              <input type="text" name="company" placeholder="Company / Business Name" class="modal-input">
            </div>
            <div class="modal-form-row">
              <input type="tel" name="phone" placeholder="Phone (WhatsApp preferred)" class="modal-input">
              <input type="email" name="email" placeholder="Email Address *" required class="modal-input" id="modalEmail">
            </div>
            <textarea name="message" placeholder="Tell us about your project, location, and goals..." required class="modal-textarea" id="modalMessage"></textarea>
          </div>

          <!-- Budget Selection -->
          <div class="modal-form-section">
            <label class="modal-section-label">
              <i class="fas fa-dollar-sign"></i>
              PROJECT BUDGET (USD)
              <span class="label-hint">(Helps us tailor your quote)</span>
            </label>
            <div class="modal-radio-grid">
              <label class="modal-radio">
                <input type="radio" name="budget" value="Less than $5k">
                <span class="radio-label">&lt;$5k</span>
              </label>
              <label class="modal-radio">
                <input type="radio" name="budget" value="$5-10k">
                <span class="radio-label">$5-10k</span>
              </label>
              <label class="modal-radio">
                <input type="radio" name="budget" value="$10-25k">
                <span class="radio-label">$10-25k</span>
              </label>
              <label class="modal-radio">
                <input type="radio" name="budget" value="$25-50k">
                <span class="radio-label">$25-50k</span>
              </label>
              <label class="modal-radio">
                <input type="radio" name="budget" value="$50k+">
                <span class="radio-label">$50k+</span>
              </label>
            </div>
          </div>

          <!-- Honeypot -->
          <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">

          <!-- Submit Button -->
          <div class="modal-submit-wrapper">
            <button type="submit" class="modal-submit-btn" id="modalSubmitBtn">
              <span class="btn-text">Get Your Free Quote</span>
              <span class="btn-loading" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i> Sending...
              </span>
              <i class="fas fa-arrow-right btn-arrow"></i>
            </button>
            <p class="modal-guarantee">
              <i class="fas fa-lock"></i> Your information is secure. We never share your data.
            </p>
          </div>
        </form>

        <!-- Success Message -->
        <div class="modal-success" id="modalSuccess" style="display: none;">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Thank You! 🎉</h3>
          <p>Your request has been received successfully.</p>
          <div class="success-details">
            <p><i class="fas fa-clock"></i> We'll respond within <strong>24 hours</strong></p>
            <p><i class="fas fa-envelope"></i> Check your inbox for a confirmation email</p>
          </div>
          <button class="modal-close-success" id="modalCloseSuccess">Close</button>
        </div>

        <!-- Error Message -->
        <div class="modal-error" id="modalError" style="display: none;">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p>Oops! Something went wrong.</p>
          <p class="error-help">Please try again or email us directly at <a href="mailto:info@yousee360.com">info@yousee360.com</a></p>
          <button class="modal-retry-btn" id="modalRetry">Try Again</button>
        </div>
      </div>
    </div>
  `;

  // Service to checkbox mapping
  const serviceMapping = {
    '360-photo': '360-photo',
    '360-photography': '360-photo',
    '360-video': '360-video',
    '360-videography': '360-video',
    'drone': 'drone',
    'drone-360': 'drone',
    'branded-tour': 'branded-tour',
    'virtual-tour': 'branded-tour',
    'streetview': 'streetview',
    'google-streetview': 'streetview',
    'ar': 'ar',
    'augmented-reality': 'ar'
  };

  // Industry context messages
  const industryMessages = {
    'hospitality': 'Transform your hotel or resort with immersive 360° experiences.',
    'real-estate': 'Accelerate sales with stunning virtual property tours.',
    'restaurants': 'Showcase your atmosphere and attract more diners.',
    'adventure-tours': 'Let customers experience the thrill before they book.',
    'museums': 'Preserve and share your exhibits with the world.',
    'retreat-centers': 'Create a peaceful virtual welcome for your guests.'
  };

  let modalInitialized = false;

  /**
   * Initialize the modal system
   */
  function initContactModal() {
    if (modalInitialized) return;

    // Inject modal HTML into the page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalTemplate;
    document.body.appendChild(modalContainer.firstElementChild);

    // Set up event listeners
    setupModalListeners();

    // Set up "Get Started" button triggers
    setupTriggerButtons();

    // Set up checkbox/radio visual feedback (radio-like appearance but multi-select)
    setupCheckboxVisualFeedback();

    modalInitialized = true;
  }

  /**
   * Set up checkbox visual feedback - checkboxes look like radio buttons but allow multiple selection
   */
  function setupCheckboxVisualFeedback() {
    // Service checkboxes - visual toggle on click
    document.querySelectorAll('.modal-checkbox').forEach(label => {
      label.addEventListener('click', function (e) {
        // Prevent default browser behavior to avoid race conditions/double toggles
        e.preventDefault();

        const input = this.querySelector('input[type="checkbox"]');
        if (input) {
          input.checked = !input.checked;
          this.classList.toggle('checked', input.checked);
        }
      });

      // Also handle direct input change
      const input = label.querySelector('input[type="checkbox"]');
      if (input) {
        input.addEventListener('change', function () {
          this.closest('.modal-checkbox').classList.toggle('checked', this.checked);
        });
      }
    });

    // Budget radio buttons - visual toggle (single select)
    document.querySelectorAll('.modal-radio').forEach(label => {
      label.addEventListener('click', function (e) {
        // Prevent double-firing from label click
        if (e.target.tagName === 'INPUT') return;

        const input = this.querySelector('input[type="radio"]');
        if (input) {
          // Clear all radios in the group first
          document.querySelectorAll('.modal-radio').forEach(r => r.classList.remove('checked'));
          input.checked = true;
          this.classList.add('checked');
        }
      });

      // Also handle direct input change
      const input = label.querySelector('input[type="radio"]');
      if (input) {
        input.addEventListener('change', function () {
          document.querySelectorAll('.modal-radio').forEach(r => r.classList.remove('checked'));
          this.closest('.modal-radio').classList.add('checked');
        });
      }
    });
  }

  /**
   * Set up modal event listeners
   */
  function setupModalListeners() {
    const overlay = document.getElementById('contactModalOverlay');
    const closeBtn = document.getElementById('modalCloseBtn');
    const form = document.getElementById('modalContactForm');
    const closeSuccess = document.getElementById('modalCloseSuccess');
    const retryBtn = document.getElementById('modalRetry');
    const emailInput = document.getElementById('modalEmail');
    const replyToField = document.getElementById('modalReplyTo');

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // Close button
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Sync email to reply-to field
    emailInput.addEventListener('input', function () {
      replyToField.value = this.value;
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Success close button
    closeSuccess.addEventListener('click', closeModal);

    // Retry button
    retryBtn.addEventListener('click', () => {
      document.getElementById('modalError').style.display = 'none';
      form.style.display = 'block';
    });
  }

  /**
   * Set up trigger buttons
   */
  function setupTriggerButtons() {
    // Find all buttons that should trigger the modal
    const triggerButtons = document.querySelectorAll('[data-open-contact-modal], .cta-button[id="showFormBtn"]');

    triggerButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const contextType = button.dataset.contextType || detectContextFromPage();
        const contextValue = button.dataset.contextValue || detectValueFromPage();

        openModal(contextType, contextValue);
      });
    });
  }

  /**
   * Detect context type from current page URL
   */
  function detectContextFromPage() {
    const path = window.location.pathname;
    if (path.includes('/services/')) return 'service';
    if (path.includes('/industries/')) return 'industry';
    return 'general';
  }

  /**
   * Detect context value from current page URL
   */
  function detectValueFromPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename || 'general';
  }

  /**
   * Open the modal with context
   */
  function openModal(contextType, contextValue) {
    const overlay = document.getElementById('contactModalOverlay');
    const form = document.getElementById('modalContactForm');
    const successDiv = document.getElementById('modalSuccess');
    const errorDiv = document.getElementById('modalError');
    const pageContextInput = document.getElementById('pageContext');
    const subtitleEl = document.getElementById('modalSubtitle');
    const subjectInput = document.getElementById('modalSubject');

    // Reset modal state
    form.style.display = 'block';
    form.reset();
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    // Clear all checkbox selections first
    document.querySelectorAll('#modalServicesGrid input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      cb.closest('.modal-checkbox').classList.remove('checked');
    });

    // Set context
    pageContextInput.value = `${contextType}: ${contextValue}`;

    // Pre-select service if on a service page
    if (contextType === 'service') {
      const mappedService = serviceMapping[contextValue] || contextValue;
      const checkbox = document.querySelector(`#modalServicesGrid .modal-checkbox[data-service="${mappedService}"] input`);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.closest('.modal-checkbox').classList.add('checked');
      }
      subjectInput.value = `New Quote Request - ${contextValue.replace(/-/g, ' ').toUpperCase()} Service`;
    }

    // Set industry-specific subtitle
    if (contextType === 'industry' && industryMessages[contextValue]) {
      subtitleEl.textContent = industryMessages[contextValue];
      subjectInput.value = `New Quote Request - ${contextValue.replace(/-/g, ' ').toUpperCase()} Industry`;
    } else {
      subtitleEl.textContent = 'Get your custom quote in 24 hours — no commitment required.';
    }

    // Show modal
    lastFocused = document.activeElement;
    overlay.hidden = false;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trapFocus, true);

    // Focus into the dialog once it has animated in. Prefer the first text
    // field, but fall back to the first focusable thing (and finally the
    // dialog itself) so focus never stays stranded on the page behind.
    setTimeout(() => {
      const target =
        form.querySelector('input[name="fullName"]') ||
        focusableIn(overlay)[0] ||
        overlay;
      if (target === overlay && !overlay.hasAttribute('tabindex')) {
        overlay.setAttribute('tabindex', '-1');
      }
      target.focus();
    }, 300);
  }

  /**
   * Close the modal
   */
  let lastFocused = null;

  function closeModal() {
    const overlay = document.getElementById('contactModalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus, true);

    // `hidden` keeps the dialog out of the accessibility tree and off the tab
    // order while closed; without it its 25 focusable elements stayed reachable.
    setTimeout(function () {
      if (!overlay.classList.contains('active')) overlay.hidden = true;
    }, 400);

    // Return focus to whatever opened the modal.
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  /**
   * Keep Tab inside the dialog. Without this, keyboard users tabbed straight
   * out of the open modal and into the page behind it.
   */
  function focusableIn(root) {
    return [].slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]),' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      return el.offsetParent !== null && !el.hasAttribute('hidden');
    });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const overlay = document.getElementById('contactModalOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    const items = focusableIn(overlay);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /**
   * Handle form submission
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('modalSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successDiv = document.getElementById('modalSuccess');
    const errorDiv = document.getElementById('modalError');

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success
        form.style.display = 'none';
        successDiv.style.display = 'block';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      form.style.display = 'none';
      errorDiv.style.display = 'block';
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  // Initialize contact modal on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initContactModal();
  });

  // Expose globally for manual triggering
  window.YouSee360ContactModal = {
    open: openModal,
    close: closeModal,
    init: initContactModal
  };

})();
