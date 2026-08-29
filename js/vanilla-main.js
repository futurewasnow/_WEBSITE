/**
 * vanilla-main.js
 * YouSee360 - Navigation & Interactive Elements
 * Complete rewrite for reliable cross-device functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProcessTabs();
    initModernSlider();
    initScrollAnimations();
    initVirtualTourFacade();
});

/* ============================================================
   NAVIGATION SYSTEM
   ============================================================ */
function initNavigation() {
    const navbar = document.querySelector('.navigation-bar');
    const hamburger = document.querySelector('.hamburger-button') || document.querySelector('.w-nav-button');
    const desktopDropdowns = document.querySelectorAll('.w-dropdown');

    if (!navbar) return;

    // --- 1. Scroll Effect ---
    initScrollEffect(navbar);

    // --- 2. Desktop Dropdowns (Hover) ---
    if (window.innerWidth >= 992) {
        initDesktopDropdowns(desktopDropdowns);
    }

    // --- 3. Mobile Menu ---
    if (hamburger) {
        initMobileMenu(hamburger);
    }

    // --- 4. Resize Handler ---
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    }, 150));
}

/* ============================================================
   SCROLL EFFECT
   ============================================================ */
function initScrollEffect(navbar) {
    let lastScroll = 0;

    const updateNavbar = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // Initial check
}

/* ============================================================
   DESKTOP DROPDOWNS
   ============================================================ */
function initDesktopDropdowns(dropdowns) {
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.w-dropdown-toggle');
        const list = dropdown.querySelector('.w-dropdown-list');
        let hoverTimeout;

        if (!toggle || !list) return;

        // Hover enter
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            dropdown.classList.add('open');
            list.classList.add('w--open');
        });

        // Hover leave (with delay)
        dropdown.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                dropdown.classList.remove('open');
                list.classList.remove('w--open');
            }, 150);
        });

        // Click toggle for touch-enabled desktops
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth >= 992) {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = dropdown.classList.contains('open');

                // Close all other dropdowns
                dropdowns.forEach(d => {
                    d.classList.remove('open');
                    d.querySelector('.w-dropdown-list')?.classList.remove('w--open');
                });

                if (!isOpen) {
                    dropdown.classList.add('open');
                    list.classList.add('w--open');
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.w-dropdown')) {
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('.w-dropdown-list')?.classList.remove('w--open');
            });
        }
    });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
let mobileOverlay = null;

function initMobileMenu(hamburger) {
    // Disabled — mobile.js handles the mobile menu now (the new glass-blur overlay
    // with mega-menu accordions + top CTA). This legacy version created a competing
    // #mobile-nav-overlay that fought with the new system.
    return;
}

function createMobileOverlay() {
    const nav = document.querySelector('.navigation-menu') || document.querySelector('.w-nav-menu');
    if (!nav) return;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'mobile-nav-overlay';

    // Create inner container
    const inner = document.createElement('div');
    inner.className = 'mobile-nav-inner';

    // Detect language from page
    const isSpanish = document.documentElement.lang === 'es' || window.location.pathname.includes('/es/');

    // Get navigation items
    const navItems = nav.querySelectorAll(':scope > .w-nav-link, :scope > .w-dropdown');

    navItems.forEach((item, index) => {
        if (item.classList.contains('w-dropdown')) {
            // It's a dropdown - create accordion
            const accordion = createMobileAccordion(item, index);
            inner.appendChild(accordion);
        } else if (item.classList.contains('w-nav-link')) {
            // It's a regular link
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'mobile-nav-link';
            link.textContent = item.textContent.trim();
            link.addEventListener('click', () => closeMobileMenu());
            inner.appendChild(link);
        }
    });

    // Add CTA button
    const cta = document.createElement('a');
    cta.href = isSpanish ? '#Contacto' : '#Contact';
    cta.className = 'mobile-nav-cta';
    cta.textContent = isSpanish ? 'Solicitar Cotización' : 'Get a Quote';
    cta.addEventListener('click', () => closeMobileMenu());
    inner.appendChild(cta);

    overlay.appendChild(inner);
    document.body.appendChild(overlay);
}

function createMobileAccordion(dropdown, index) {
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list = dropdown.querySelector('.w-dropdown-list');
    const toggleText = toggle?.textContent.trim().replace(/\s+/g, ' ') || 'Menu';

    const accordion = document.createElement('div');
    accordion.className = 'mobile-nav-accordion';
    accordion.style.transitionDelay = `${index * 0.05}s`;

    // Header
    const header = document.createElement('div');
    header.className = 'mobile-nav-accordion-header';
    header.innerHTML = `<span>${toggleText}</span><i class="fas fa-chevron-down" aria-hidden="true"></i>`;

    // Content
    const content = document.createElement('div');
    content.className = 'mobile-nav-accordion-content';

    // Get links from dropdown
    if (list) {
        const links = list.querySelectorAll('.w-dropdown-link');
        links.forEach(link => {
            const sublink = document.createElement('a');
            sublink.href = link.href;
            sublink.className = 'mobile-nav-sublink';
            sublink.textContent = link.textContent.trim();
            sublink.addEventListener('click', () => closeMobileMenu());
            content.appendChild(sublink);
        });
    }

    // Toggle accordion
    header.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('open');

        // Close other accordions
        document.querySelectorAll('.mobile-nav-accordion.open').forEach(acc => {
            if (acc !== accordion) {
                acc.classList.remove('open');
                acc.querySelector('.mobile-nav-accordion-header')?.classList.remove('active');
            }
        });

        accordion.classList.toggle('open', !isOpen);
        header.classList.toggle('active', !isOpen);
    });

    accordion.appendChild(header);
    accordion.appendChild(content);

    return accordion;
}

function openMobileMenu() {
    const hamburger = document.querySelector('.hamburger-button') || document.querySelector('.w-nav-button');

    if (mobileOverlay) {
        mobileOverlay.classList.add('active');
        document.body.classList.add('nav-open');

        if (hamburger) {
            hamburger.classList.add('is-open');
            hamburger.classList.add('w--open');
        }
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger-button') || document.querySelector('.w-nav-button');

    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');

        if (hamburger) {
            hamburger.classList.remove('is-open');
            hamburger.classList.remove('w--open');
        }

        // Reset accordions after animation
        setTimeout(() => {
            document.querySelectorAll('.mobile-nav-accordion').forEach(acc => {
                acc.classList.remove('open');
                acc.querySelector('.mobile-nav-accordion-header')?.classList.remove('active');
            });
        }, 400);
    }
}

/* ============================================================
   PROCESS TABS (How We Work)
   ============================================================ */
function initProcessTabs() {
    const tabButtons = document.querySelectorAll('.process-tab-btn');
    const tabPanels = document.querySelectorAll('.process-tab-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-tab');

            // Deactivate all
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => p.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/* ============================================================
   MODERN SERVICES SLIDER
   ============================================================ */
function initModernSlider() {
    const modernSlider = document.querySelector('.modern-services-slider');
    const slides = document.querySelectorAll('.modern-slide');
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    const paginationDotsContainer = document.querySelector('.slider-pagination');

    if (!modernSlider || !slides.length) return;

    let currentIndex = 0;
    let slidesToShow = 3;
    let startX, endX;
    let isDragging = false;
    let startTranslateX = 0;

    // Helper Functions
    function getCurrentTranslateX() {
        const style = window.getComputedStyle(modernSlider);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    function updateSlidesToShow() {
        if (window.innerWidth <= 767) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 991) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
        updateSlider();
    }

    function updateSlider() {
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const slideWidth = slides[0].offsetWidth + 20; // width + gap
        const translateValue = -currentIndex * slideWidth;
        modernSlider.style.transform = `translateX(${translateValue}px)`;

        // Update Dots
        const paginationDots = document.querySelectorAll('.pagination-dot');
        paginationDots.forEach((dot, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + slidesToShow;
            dot.classList.toggle('active', isVisible);
        });

        // Update Buttons
        if (prevButton) prevButton.disabled = currentIndex <= 0;
        if (nextButton) nextButton.disabled = currentIndex >= maxIndex;
    }

    // Init Pagination
    if (paginationDotsContainer) {
        paginationDotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
            dot.addEventListener('click', () => {
                currentIndex = Math.max(0, Math.min(i, slides.length - slidesToShow));
                updateSlider();
            });
            paginationDotsContainer.appendChild(dot);
        }
    }

    // Event Listeners
    if (prevButton) prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    if (nextButton) nextButton.addEventListener('click', () => {
        const maxIndex = slides.length - slidesToShow;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    window.addEventListener('resize', debounce(updateSlidesToShow, 100));

    // Touch Support
    modernSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startTranslateX = getCurrentTranslateX();
        isDragging = true;
    }, { passive: true });

    modernSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
        const diffX = endX - startX;
        modernSlider.style.transform = `translateX(${startTranslateX + diffX}px)`;
    }, { passive: true });

    modernSlider.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        handleSwipeEnd(endX - startX);
    });

    // Mouse Support
    modernSlider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startTranslateX = getCurrentTranslateX();
        isDragging = true;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
        const diffX = endX - startX;
        modernSlider.style.transform = `translateX(${startTranslateX + diffX}px)`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        handleSwipeEnd(endX - startX);
    });

    function handleSwipeEnd(diffX) {
        const slideWidth = slides[0].offsetWidth + 20;
        if (Math.abs(diffX) > slideWidth * 0.3) {
            const maxIndex = slides.length - slidesToShow;
            if (diffX > 0 && currentIndex > 0) currentIndex--;
            else if (diffX < 0 && currentIndex < maxIndex) currentIndex++;
        }
        updateSlider();
    }

    // Run Once
    updateSlidesToShow();
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll-animation]');

    if (!scrollElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => observer.observe(el));
}

/* ============================================================
   VIRTUAL TOUR FACADE (Lazy Load)
   ============================================================ */
function initVirtualTourFacade() {
    const facade = document.getElementById('tourFacade');
    const frameContainer = document.getElementById('tourFrame');

    if (!facade || !frameContainer) return;

    facade.addEventListener('click', () => {
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://elsalto.yousee360.com';
        iframe.title = 'YouSee360 Virtual Tour - El Salto Costa Rica';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        // Replace facade with iframe
        facade.style.display = 'none';
        frameContainer.appendChild(iframe);
        frameContainer.style.display = 'block';
    });
}

/* ============================================================
   UTILITIES
   ============================================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
