/**
 * YouSee360 Interactive Elements JavaScript
 * Implements page transitions, 3D cards, and interactive UI components
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initPageTransitions();
  init3DCards();
  initInteractiveTimeline();
  initIndustryGrid();
  initIndustryGrid();
  // initContactFormCheckboxes() removed to avoid conflict with inline script in index.html
});

// Contact Form Checkbox functionality moved to inline script in index.html to avoid conflicts

/**
 * Page Transitions using Barba.js
 * Creates smooth transitions between pages
 */
function initPageTransitions() {
  // Check if Barba.js is loaded and wrapper element exists
  if (typeof barba !== 'undefined' && document.querySelector('[data-barba="wrapper"]')) {
    barba.init({
      transitions: [{
        name: 'opacity-transition',
        leave(data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.5
          });
        },
        enter(data) {
          return gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.5
          });
        }
      }]
    });

    // Reinitialize animations after page transition
    barba.hooks.after(() => {
      // Reinitialize all animations
      if (typeof initParallaxEffects === 'function') initParallaxEffects();
      if (typeof initScrollAnimations === 'function') initScrollAnimations();
      if (typeof initStatCounters === 'function') initStatCounters();
      if (typeof initMicroInteractions === 'function') initMicroInteractions();
      if (typeof initParticleEffects === 'function' && typeof particlesJS !== 'undefined') {
        initParticleEffects();
      }

      // Reinitialize interactive elements
      init3DCards();
      initInteractiveTimeline();
      initIndustryGrid();
    });
  }
}

/**
 * 3D Cards for Services and Industries
 * Creates interactive 3D effect on cards
 */
function init3DCards() {
  const cards = document.querySelectorAll('.service-card, .industry-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      // Apply the 3D effect
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    // Reset transform on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });
}

/**
 * Interactive Timeline for Process Sections
 */
function initInteractiveTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineItems.forEach((item, index) => {
    // Add animation delay based on index
    item.style.transitionDelay = `${index * 0.1}s`;

    // Add progress indicator animation
    const progressIndicator = item.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.style.height = '0%';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              progressIndicator.style.height = '100%';
            }, index * 300);
            observer.unobserve(item);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(item);
    }
  });
}

/**
 * Interactive Industry Grid
 * Enhances the industry application section with interactive features
 */
function initIndustryGrid() {
  const industryCards = document.querySelectorAll('.industry-card');

  industryCards.forEach(card => {
    // Add hover effect for industry cards
    card.addEventListener('mouseenter', () => {
      const overlay = card.querySelector('.industry-overlay');
      if (overlay) {
        overlay.style.transform = 'translateY(0)';
      }

      const learnMore = card.querySelector('.learn-more');
      if (learnMore) {
        learnMore.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      const overlay = card.querySelector('.industry-overlay');
      if (overlay) {
        overlay.style.transform = 'translateY(70px)';
      }

      const learnMore = card.querySelector('.learn-more');
      if (learnMore) {
        learnMore.style.opacity = '0';
      }
    });
  });
}

// NOTE: initBeforeAfterComparison and initTestimonialCarousel functions were removed
// as they were unused. If needed in the future, they can be re-implemented when
// the corresponding HTML elements (.before-after-container, .testimonial-carousel) are added.