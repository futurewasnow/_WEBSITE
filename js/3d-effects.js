/**
 * YouSee360 High-End 3D Effects
 * Inspired by Marcelo Design X / Apple / Modern WebGL trends
 * Customized for performance and visual fidelity.
 */

(function () {
    'use strict';

    class VanillaTilt {
        constructor(element, settings = {}) {
            if (!(element instanceof Node)) {
                throw "Can't initialize VanillaTilt because " + element + " is not a Node.";
            }

            this.width = null;
            this.height = null;
            this.clientWidth = null;
            this.clientHeight = null;
            this.left = null;
            this.top = null;

            // DOM elements & events
            this.element = element;
            this.settings = this.extendSettings(settings);
            this.reverse = this.settings.reverse ? -1 : 1;

            // Glare
            this.glare = this.isSettingTrue(this.settings.glare);
            this.glarePrerender = this.isSettingTrue(this.settings["glare-prerender"]);

            if (this.glare) {
                this.prepareGlare();
            }

            this.addEventListeners();
        }

        isSettingTrue(setting) {
            return setting === "" || setting === true || setting === 1;
        }

        getElementListener(element, listener) {
            if (typeof listener === "string") {
                const res = element.querySelector(listener);
                return res;
            }
            return listener;
        }

        addEventListeners() {
            this.onMouseEnterBind = this.onMouseEnter.bind(this);
            this.onMouseMoveBind = this.onMouseMove.bind(this);
            this.onMouseLeaveBind = this.onMouseLeave.bind(this);
            this.onWindowResizeBind = this.reset.bind(this);
            this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

            this.element.addEventListener("mouseenter", this.onMouseEnterBind);
            this.element.addEventListener("mouseleave", this.onMouseLeaveBind);
            this.element.addEventListener("mousemove", this.onMouseMoveBind);

            if (this.glare || this.fullPageListening) {
                window.addEventListener("resize", this.onWindowResizeBind);
            }

            if (this.settings.gyroscope) {
                window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
            }
        }

        removeEventListeners() {
            this.element.removeEventListener("mouseenter", this.onMouseEnterBind);
            this.element.removeEventListener("mouseleave", this.onMouseLeaveBind);
            this.element.removeEventListener("mousemove", this.onMouseMoveBind);

            if (this.glare || this.fullPageListening) {
                window.removeEventListener("resize", this.onWindowResizeBind);
            }

            if (this.settings.gyroscope) {
                window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
            }
        }

        destroy() {
            clearTimeout(this.transitionTimeout);
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.reset();
            this.removeEventListeners();
            this.element.vanillaTilt = null;
            delete this.element.vanillaTilt;

            this.element.style = null;
        }

        onDeviceOrientation(event) {
            if (event.gamma === null || event.beta === null) {
                return;
            }

            this.updateElementPosition();

            if (this.gyroscopeSamples > 0) {
                this.lastGamma = this.lastGamma + (event.gamma - this.lastGamma) / this.gyroscopeSamples;
                this.lastBeta = this.lastBeta + (event.beta - this.lastBeta) / this.gyroscopeSamples;
            } else {
                this.lastGamma = event.gamma;
                this.lastBeta = event.beta;
            }

            const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
            const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;

            const degreesPerPixelX = totalAngleX / this.width;
            const degreesPerPixelY = totalAngleY / this.height;

            const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.settings.gyroscopeMaxAngleX) / 2;
            const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.settings.gyroscopeMaxAngleY) / 2;

            const posX = angleX / degreesPerPixelX * -1 + this.width / 2;
            const posY = angleY / degreesPerPixelY * -1 + this.height / 2;

            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.event = {
                clientX: posX + this.left,
                clientY: posY + this.top,
            };

            this.updateCall = requestAnimationFrame(this.updateBind);
        }

        onMouseEnter() {
            this.updateElementPosition();
            this.element.style.willChange = "transform";
            this.setTransition();
        }

        onMouseMove(event) {
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.event = event;
            this.updateCall = requestAnimationFrame(this.update.bind(this));
        }

        onMouseLeave() {
            this.setTransition();

            if (this.settings.reset) {
                requestAnimationFrame(this.reset.bind(this));
            }
        }

        reset() {
            this.event = {
                clientX: this.left + this.width / 2,
                clientY: this.top + this.height / 2
            };

            if (this.element && this.element.style) {
                this.element.style.transform = `perspective(${this.settings.perspective}px) ` +
                    `rotateX(0deg) ` +
                    `rotateY(0deg) ` +
                    `scale3d(1, 1, 1)`;
            }

            this.resetGlare();
        }

        resetGlare() {
            if (this.glare) {
                this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
                this.glareElement.style.opacity = "0";
            }
        }

        updateElementPosition() {
            const rect = this.element.getBoundingClientRect();
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
            this.left = rect.left;
            this.top = rect.top;
        }

        update() {
            const values = this.getValues();

            this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
                "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
                "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
                "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";

            if (this.glare) {
                this.transformGlare(values.percentageX, values.percentageY);
            }

            this.element.dispatchEvent(new CustomEvent("tiltChange", {
                "detail": values
            }));

            this.updateCall = null;
        }

        /**
         * Calculate tilt values based on mouse position
         */
        getValues() {
            let x, y;

            if (this.fullPageListening) {
                x = this.event.clientX;
                y = this.event.clientY;
            } else {
                x = (this.event.clientX - this.left) / this.width;
                y = (this.event.clientY - this.top) / this.height;
            }

            x = Math.min(Math.max(x, 0), 1);
            y = Math.min(Math.max(y, 0), 1);

            const tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2);
            const tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2);
            const angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);

            return {
                tiltX: tiltX,
                tiltY: tiltY,
                percentageX: x * 100,
                percentageY: y * 100,
                angle: angle
            };
        }

        updateGlareSize() {
            if (this.glare) {
                const glareSize = (this.width > this.height ? this.width : this.height) * 2;

                Object.assign(this.glareElement.style, {
                    width: `${glareSize}px`,
                    height: `${glareSize}px`,
                });
            }
        }

        transformGlare(percentageX, percentageY) {
            const angle = this.getValues().angle;
            this.glareElement.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
            this.glareElement.style.opacity = `${percentageY * this.settings["max-glare"] / 100}`;
        }

        prepareGlare() {
            // If glare element doesn't exist, create it
            if (!this.glareElement) {
                this.glareWraper = document.createElement("div");
                this.glareWraper.classList.add("js-tilt-glare");
                this.glareElement = document.createElement("div");
                this.glareElement.classList.add("js-tilt-glare-inner");

                this.glareWraper.appendChild(this.glareElement);
                this.element.appendChild(this.glareWraper);
            }

            const stretch = "100%";
            const settings = {
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "overflow": "hidden",
                "pointer-events": "none",
                "border-radius": "inherit" // Important for rounded cards
            };

            Object.assign(this.glareWraper.style, settings);

            Object.assign(this.glareElement.style, {
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "pointer-events": "none",
                "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
                "transform": "rotate(180deg) translate(-50%, -50%)",
                "transform-origin": "0% 0%",
                "opacity": "0",
            });

            this.updateGlareSize();
        }

        setTransition() {
            clearTimeout(this.transitionTimeout);
            this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;

            if (this.glare) {
                this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
            }

            this.transitionTimeout = setTimeout(() => {
                this.element.style.transition = "";

                if (this.glare) {
                    this.glareElement.style.transition = "";
                }
            }, this.settings.speed);
        }

        extendSettings(settings) {
            const defaultSettings = {
                reverse: false,
                max: 15, // stronger tilt
                startX: 0,
                startY: 0,
                perspective: 1000,
                easing: "cubic-bezier(.03,.98,.52,.99)",
                scale: 1.05,
                speed: 300,
                transition: true,
                axis: null,
                glare: true,
                "max-glare": 0.5,
                "glare-prerender": false,
                "full-page-listening": false,
                "mouse-event-element": null,
                reset: true,
                gyroscope: true,
                gyroscopeMinAngleX: -45,
                gyroscopeMaxAngleX: 45,
                gyroscopeMinAngleY: -45,
                gyroscopeMaxAngleY: 45,
                gyroscopeSamples: 10
            };

            const newSettings = {};
            for (let property in defaultSettings) {
                if (property in settings) {
                    newSettings[property] = settings[property];
                } else if (this.element.hasAttribute("data-tilt-" + property)) {
                    let attribute = this.element.getAttribute("data-tilt-" + property);
                    try {
                        newSettings[property] = JSON.parse(attribute);
                    } catch (e) {
                        newSettings[property] = attribute;
                    }
                } else {
                    newSettings[property] = defaultSettings[property];
                }
            }

            return newSettings;
        }

        static init(elements, settings) {
            if (elements instanceof Node) {
                elements = [elements];
            }

            if (elements instanceof NodeList) {
                elements = [].slice.call(elements);
            }

            if (!(elements instanceof Array)) {
                return;
            }

            elements.forEach((element) => {
                if (!("vanillaTilt" in element)) {
                    element.vanillaTilt = new VanillaTilt(element, settings);
                }
            });
        }
    }

    if (typeof document !== "undefined") {
        /* expose the class to window */
        window.VanillaTilt = VanillaTilt;

        /**
         * Auto init
         */
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }

    // === Custom High-End Effects Integration ===

    // Initialize 3D effects
    function init3DEffects() {
        console.log("Initializing High-End 3D Effects...");

        // 1. Apply to Service Cards
        const serviceCards = document.querySelectorAll('.modern-service-card');
        VanillaTilt.init(serviceCards, {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.08, // subtle pop
        });

        // 2. Apply to Bento Cards
        const bentoCards = document.querySelectorAll('.bento-card');
        VanillaTilt.init(bentoCards, {
            max: 5, // less tilt for larger cards
            speed: 500,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });

        // 3. Hero Text Parallax (Mouse Move)
        const heroSection = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content');

        if (heroSection && heroContent) {
            heroSection.addEventListener('mousemove', (e) => {
                // Determine mouse position relative to center
                const x = (window.innerWidth / 2 - e.clientX) / 50;
                const y = (window.innerHeight / 2 - e.clientY) / 50;

                // Move content slightly
                heroContent.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
            });

            heroSection.addEventListener('mouseleave', () => {
                heroContent.style.transform = `rotateY(0deg) rotateX(0deg)`;
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init3DEffects);
    } else {
        init3DEffects();
    }

})();
