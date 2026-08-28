/**
 * YouSee360 Future UI Upgrade
 * Contains: Glitch Text, Custom Cursor, Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // initElegantReveal(); // Disabled - was causing hero to be invisible
    initCustomCursor(); // Re-enabled per user request
    // initSmoothScroll(); // Disabled per user request (too heavy)
});

// === 1. Lenis Smooth Scroll (Disabled) ===
/*
function initSmoothScroll() {
    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') return;

    window.lenis = new Lenis({
        duration: 0.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.5,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    console.log('🚀 Lenis Smooth Scroll Initialized');
}
*/

// === 2. Elegant Text Reveal (Blur-in) ===
function initElegantReveal() {
    const targets = document.querySelectorAll('.hero-heading, .section-heading, h1, h2, .sexy-heading');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Clear inline styles and use CSS class for reveal
                entry.target.style.opacity = '';
                entry.target.style.filter = '';
                entry.target.style.transform = '';
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Add the CSS for initial and revealed states
    const style = document.createElement('style');
    style.innerHTML = `
        .hero-heading, .section-heading, h1, h2, .sexy-heading {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(20px);
            transition: opacity 0.8s ease, filter 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .revealed {
            opacity: 1 !important;
            filter: blur(0) !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    targets.forEach(target => {
        observer.observe(target);
    });
}

// === 3. Advanced Custom Cursor ===
function initCustomCursor() {
    // Only for desktop
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'future-cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.id = 'future-follower';
    document.body.appendChild(follower);

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    let isVisible = true;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate movement for dot (offset by half the cursor size to center it)
        cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

        // Ensure visible
        if (!isVisible) {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
            isVisible = true;
        }
    });

    // Smooth movement for follower
    function animateFollower() {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        follower.style.transform = `translate3d(${posX - 15}px, ${posY - 15}px, 0)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, .w-button, input, textarea, .cf-checkbox-field, .bento-card, .service-item, .modern-service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('active');
            cursor.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
            cursor.classList.remove('active');
        });
    });

    // Hide cursor ONLY when leaving the document window entirely
    document.documentElement.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
        isVisible = false;
    });

    // Show cursor when re-entering
    document.documentElement.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
        isVisible = true;
    });
}
