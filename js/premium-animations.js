/**
 * YouSee360 Premium Animations
 * Apple-inspired scroll reveals and interactions
 */

(function () {
    'use strict';

    // === Scroll Reveal Observer ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after reveal for performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements with data-reveal attribute
    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // Observe stagger containers
    document.querySelectorAll('[data-stagger]').forEach(el => {
        revealObserver.observe(el);
    });

    // === Auto-apply reveal to sections and cards ===
    function autoApplyReveal() {
        // Apply to sections
        document.querySelectorAll('.section, section').forEach((section, index) => {
            if (!section.hasAttribute('data-reveal')) {
                section.setAttribute('data-reveal', 'fade-up');
                section.style.transitionDelay = `${index * 0.1}s`;
                revealObserver.observe(section);
            }
        });

        // Apply to cards
        document.querySelectorAll('.bento-card, .glass-panel, .industry-card, .service-item').forEach((card, index) => {
            if (!card.hasAttribute('data-reveal')) {
                card.setAttribute('data-reveal', 'fade-up');
                card.style.transitionDelay = `${(index % 6) * 0.1}s`;
                revealObserver.observe(card);
            }
        });
    }

    // === Scroll Progress Indicator ===
    function createScrollProgress() {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        document.body.appendChild(progress);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progress.style.width = `${scrollPercent}%`;
        }, { passive: true });
    }

    // === Magnetic Button Effect ===
    function initMagneticButtons() {
        document.querySelectorAll('[data-magnetic], .btn-primary, .btn-hollow').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // === Parallax Effect ===
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    // === Custom Cursor (optional - high-end effect) ===
    function initCustomCursor() {
        // Only on desktop
        if (window.matchMedia('(pointer: fine)').matches) {
            const cursor = document.createElement('div');
            cursor.className = 'cursor-glow';
            document.body.appendChild(cursor);

            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });

            // Grow on interactive elements
            document.querySelectorAll('a, button, .btn-primary, .btn-hollow, [role="button"]').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('active'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
            });
        }
    }

    // === Smooth Scroll for Anchor Links ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // === Number Counter Animation ===
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const end = parseInt(target.dataset.counter) || 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 4); // ease-out-quart
                        const current = Math.floor(easeProgress * end);
                        target.textContent = current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.textContent = end.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // === Tilt Card Effect ===
    function initTiltCards() {
        document.querySelectorAll('[data-tilt], .bento-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // === Initialize All Effects ===
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        autoApplyReveal();
        createScrollProgress();
        initSmoothScroll();
        initCounters();

        // Optional high-end effects (can be disabled for performance)
        initMagneticButtons();
        initParallax();
        initProcessTabs(); // New Tab Logic
        initTourFacade();  // New Tour Loader
        // initTiltCards(); // Replaced by advanced 3d-effects.js
        initCustomCursor(); // Uncomment for custom cursor effect

        console.log('✨ YouSee360 Premium Animations Initialized');
    }

    // === Process Section Tabs ===
    function initProcessTabs() {
        const tabButtons = document.querySelectorAll('.process-tab-btn');
        const tabPanels = document.querySelectorAll('.process-tab-panel');

        if (!tabButtons.length) return;

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate all
                tabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.ariaSelected = "false";
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                // Activate clicked
                btn.classList.add('active');
                btn.ariaSelected = "true";

                const targetId = btn.dataset.tab;
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');

                    // Re-trigger animations in the new panel
                    const visuals = targetPanel.querySelectorAll('.process-tab-visual, .process-tab-text');
                    visuals.forEach(el => {
                        el.style.animation = 'none';
                        el.offsetHeight; /* trigger reflow */
                        el.style.animation = '';
                    });
                }
            });
        });
    }

    // === Virtual Tour Facade Loader ===
    function initTourFacade() {
        const facade = document.getElementById('tourFacade');
        const tourFrame = document.getElementById('tourFrame');
        if (!facade || !tourFrame) return;

        const playBtn = facade.querySelector('.tour-play-btn');
        const tourUrl = "https://elsalto.yousee360.com"; // Configuration

        function loadTour() {
            // Add loading state
            facade.classList.add('loading');
            playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = tourUrl;
            iframe.title = "Sample Virtual Tour - El Salto Costa Rica";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";

            iframe.onload = () => {
                // Hide facade, show frame
                facade.style.opacity = '0';
                setTimeout(() => {
                    facade.style.display = 'none';
                    tourFrame.classList.add('active');
                }, 500);
            };

            tourFrame.appendChild(iframe);
        }

        playBtn.addEventListener('click', loadTour);
        facade.addEventListener('click', loadTour); // Click anywhere on image works too
    }

    init();
})();
