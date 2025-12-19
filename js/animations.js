/**
 * YouSee360 Advanced Animations JavaScript
 * Implements parallax effects, 3D elements, micro-interactions, and scroll animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animation components
  initParallaxEffects();
  initScrollAnimations();
  initStatCounters();
  initMicroInteractions();
  initMicroInteractions();
  setupFormAnimations();
  initTypingEffect();
  initTiltEffect();

  // Initialize particles if the library is loaded
  if (typeof particlesJS !== 'undefined') {
    initParticleEffects();
  }
});

/**
 * Parallax Scrolling Effects
 * Uses Intersection Observer API to create smooth parallax effects
 */
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax-container');

  if (parallaxElements.length === 0) return;

  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add scroll event listener when element is in view
        window.addEventListener('scroll', () => applyParallaxEffect(entry.target));
      } else {
        // Remove scroll event listener when element is out of view
        window.removeEventListener('scroll', () => applyParallaxEffect(entry.target));
      }
    });
  }, { threshold: 0.1 });

  parallaxElements.forEach(element => {
    parallaxObserver.observe(element);
  });
}

/**
 * Apply parallax effect to a specific element
 */
function applyParallaxEffect(element) {
  const parallaxBg = element.querySelector('.parallax-bg');
  if (!parallaxBg) return;

  const scrollPosition = window.pageYOffset;
  const elementTop = element.getBoundingClientRect().top + scrollPosition;
  const elementHeight = element.offsetHeight;
  const viewportHeight = window.innerHeight;

  // Only apply effect when element is in viewport
  if (scrollPosition + viewportHeight > elementTop && scrollPosition < elementTop + elementHeight) {
    const distance = scrollPosition - elementTop;
    const speed = parseFloat(element.dataset.parallaxSpeed || 0.5);
    const yPos = distance * speed;

    parallaxBg.style.transform = `translateY(${yPos}px)`;
  }
}

/**
 * Scroll Animations
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-scroll-animation]');

  if (animatedElements.length === 0) return;

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add visible class with delay based on index for staggered effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);

        // Stop observing after animation is applied
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(element => {
    scrollObserver.observe(element);
  });

  // Also animate headings and subheadings
  const headings = document.querySelectorAll('.animated-heading, .animated-subheading');
  headings.forEach(heading => {
    scrollObserver.observe(heading);
  });
}

/**
 * Animated Statistics Counters
 */
function initStatCounters() {
  const statItems = document.querySelectorAll('.stat-item');

  if (statItems.length === 0) return;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const counter = entry.target.querySelector('.counter');
        if (counter) {
          const targetValue = parseInt(entry.target.dataset.statValue || 0);
          animateCounter(counter, targetValue);
        }

        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });

  statItems.forEach(item => {
    statObserver.observe(item);
  });
}

/**
 * Animate a counter from 0 to target value
 */
function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current;
  }, 30);
}

/**
 * Initialize Particle Effects
 * Uses particles.js library for background particle effects
 */
function initParticleEffects() {
  // Hero particles
  const heroParticles = document.getElementById('hero-particles');
  if (heroParticles) {
    particlesJS('hero-particles', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#66cc79' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2, direction: 'none', random: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' } }
      }
    });
  }

  // Industry-specific particles
  const industrySection = document.querySelector('.industry-hero');
  if (industrySection) {
    const industryType = industrySection.dataset.industry;
    const particlesConfig = getIndustryParticleConfig(industryType);

    particlesJS('industryParticles', particlesConfig);
  }
}

/**
 * Get particle configuration based on industry type
 */
function getIndustryParticleConfig(industryType) {
  const configs = {
    hospitality: {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#66cc79' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2, direction: 'none', random: true }
      }
    },
    realEstate: {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: '#50a7c2' },
        shape: { type: 'triangle' },
        opacity: { value: 0.6, random: true },
        size: { value: 4, random: true },
        move: { enable: true, speed: 3, direction: 'top', random: true }
      }
    },
    restaurants: {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 2, random: true },
        move: { enable: true, speed: 1.5, direction: 'none', random: true }
      }
    }
    // Additional industry configurations can be added here
  };

  // Return the specific config or a default one
  return configs[industryType] || configs.hospitality;
}

/**
 * Micro-interactions for buttons and interactive elements
 */
function initMicroInteractions() {
  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.btn-primary');
  buttons.forEach(button => {
    if (!button.querySelector('.btn-glow')) {
      const glow = document.createElement('div');
      glow.className = 'btn-glow';
      button.appendChild(glow);
    }
  });
}

/**
 * Form animations for CTA sections
 */
function setupFormAnimations() {
  const showFormBtn = document.getElementById('showFormBtn');
  const contactForm = document.getElementById('contactForm');

  if (showFormBtn && contactForm) {
    showFormBtn.addEventListener('click', () => {
      const formContainer = document.getElementById('ctaForm');

      if (formContainer) {
        // Animate button out
        showFormBtn.style.opacity = '0';
        showFormBtn.style.transform = 'translateY(-20px)';

        setTimeout(() => {
          showFormBtn.style.display = 'none';
          formContainer.style.display = 'block';

          // Animate form in
          setTimeout(() => {
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateY(0)';
          }, 50);
        }, 300);
      }
    });

    // Form submission animation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMessage = document.getElementById('successMessage');

      if (successMessage) {
        // Animate form out
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(-20px)';

        setTimeout(() => {
          contactForm.parentElement.style.display = 'none';
          successMessage.style.display = 'block';

          // Initialize celebration particles if available
          if (typeof particlesJS !== 'undefined') {
            particlesJS('celebration-particles', {
              particles: {
                number: { value: 100 },
                color: { value: ['#66cc79', '#ffffff', '#50a7c2'] },
                shape: { type: 'circle' },
                opacity: { value: 0.8, random: true },
                size: { value: 5, random: true },
                move: {
                  enable: true,
                  speed: 6,
                  direction: 'top',
                  random: true,
                  straight: false,
                  out_mode: 'out'
                }
              }
            });
          }

          // Animate success message in
          setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'scale(1)';
          }, 50);
        }, 300);
      }
    });
  }
}

/**
 * Typing Text Effect for Hero Section
 */
function initTypingEffect() {
  const textElement = document.getElementById('typing-text');
  if (!textElement || textElement.textContent.trim() === '') return;

  const words = ['be seen', 'be found', 'grow', 'stand out', 'transform'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  // Start the typing loop
  textElement.textContent = '';
  type();
}

/**
 * 3D Tilt Effect for Service Cards
 */
function initTiltEffect() {
  const cards = document.querySelectorAll('.modern-service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      // Calculate rotation based on cursor position
      const rotateX = ((y - midY) / midY) * -10; // Max rotation 10deg
      const rotateY = ((x - midX) / midX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}