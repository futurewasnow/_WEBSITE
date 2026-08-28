/* ============================================================
   YOUSEE360 — AURORA DREAM NEON
   Global Three.js immersive layer.
   - Nebula particle field with neon hues
   - Wireframe icosahedron at center (the "360 sphere")
   - Soft volumetric glow shells
   - Desktop: click + drag to rotate scene (+ subtle mouse parallax)
   - Mobile: scroll position drives scene rotation + color shift
   - Auto-pauses when tab hidden / canvas off-screen
   - Gracefully falls back to CSS gradient if WebGL/Three.js unavailable
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  function boot() {
    document.body.classList.add('aurora-on');

    // CSS fallback always present in DOM as a base; canvas layers on top.
    if (!document.querySelector('.ys-aurora-fallback')) {
      const fb = document.createElement('div');
      fb.className = 'ys-aurora-fallback';
      document.body.insertBefore(fb, document.body.firstChild);
    }

    if (reduced) return;

    // Three.js is now fetched lazily by js/three-loader.js so its ~590KB never
    // competes with the hero paint (and is skipped entirely on phones and
    // data-saver). Wait for it rather than falling back on the first tick.
    whenThreeReady(function (ok) {
      if (!ok) { document.body.classList.add('aurora-no-webgl'); return; }
      bootWebGL();
    });
  }

  function whenThreeReady(cb) {
    if (window.THREE) { cb(true); return; }
    if (window.__threeSkipped) { cb(false); return; }
    let settled = false;
    const done = function (ok) { if (settled) return; settled = true; cb(ok); };
    window.addEventListener('three:ready', function () { done(!!window.THREE); }, { once: true });
    window.addEventListener('three:skipped', function () { done(false); }, { once: true });
    // Backstop in case the loader never runs (e.g. it failed to fetch).
    setTimeout(function () { done(!!window.THREE); }, 8000);
  }

  function bootWebGL() {
    // WebGL feature test
    try {
      const test = document.createElement('canvas').getContext('webgl') ||
                   document.createElement('canvas').getContext('experimental-webgl');
      if (!test) throw new Error('no webgl');
    } catch (e) {
      document.body.classList.add('aurora-no-webgl');
      return;
    }

    // Create canvas
    let canvas = document.querySelector('canvas.ys-aurora');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'ys-aurora';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    initScene(canvas);
  }

  function initScene(canvas) {
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    /* ---------- Nebula particle field — green + cyan only ---------- */
    const PARTICLE_COUNT = isMobile ? 1800 : 4200;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);

    // Brand palette: green + cyan + teal mixes only
    const palette = [
      [0.00, 1.00, 0.53],  // brand green   #00ff88
      [0.13, 0.83, 0.93],  // cyan          #22d3ee
      [0.18, 0.83, 0.75],  // teal          #2dd4bf
      [0.55, 1.00, 0.78],  // mint
      [0.40, 0.95, 0.85],  // aqua
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

    /* ---------- Distant slow stars for depth ---------- */
    const FAR_COUNT = isMobile ? 600 : 1200;
    const farPos = new Float32Array(FAR_COUNT * 3);
    for (let i = 0; i < FAR_COUNT; i++) {
      farPos[i * 3]     = (Math.random() - 0.5) * 120;
      farPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      farPos[i * 3 + 2] = -40 - Math.random() * 80;
    }
    const farGeom = new THREE.BufferGeometry();
    farGeom.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00ff88,                 // brand green
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const farStars = new THREE.Points(farGeom, farMat);
    scene.add(farStars);

    /* Sphere removed — the user didn't like the central wireframe.
       Particle field carries the visual on its own. */

    /* ---------- Interaction state ---------- */
    const state = {
      // Pointer parallax (subtle on desktop)
      mx: 0, my: 0,
      // Camera target rotation (drag-driven on desktop)
      rotX: 0, rotY: 0,
      // Smoothed values
      smX: 0, smY: 0,
      smParX: 0, smParY: 0,
      // Drag state
      dragging: false, lastX: 0, lastY: 0,
      // Scroll-driven (mobile)
      scrollY: 0,
      // Idle auto-rotation
      idle: 0,
    };

    /* Desktop: drag */
    if (!isCoarse) {
      document.body.classList.add('ys-aurora-interactive');
      canvas.addEventListener('pointerdown', (e) => {
        state.dragging = true;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        document.body.classList.add('ys-aurora-dragging');
        canvas.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener('pointermove', (e) => {
        if (state.dragging) {
          const dx = e.clientX - state.lastX;
          const dy = e.clientY - state.lastY;
          state.rotY += dx * 0.005;
          state.rotX += dy * 0.005;
          state.lastX = e.clientX;
          state.lastY = e.clientY;
          document.body.classList.add('ys-aurora-hint-dismissed');
        }
      });
      const endDrag = (e) => {
        state.dragging = false;
        document.body.classList.remove('ys-aurora-dragging');
        if (e && e.pointerId !== undefined) {
          try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      };
      canvas.addEventListener('pointerup', endDrag);
      canvas.addEventListener('pointerleave', endDrag);
      canvas.addEventListener('pointercancel', endDrag);

      // Subtle parallax on mouse-move anywhere
      window.addEventListener('mousemove', (e) => {
        state.mx = (e.clientX / window.innerWidth) * 2 - 1;
        state.my = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });

      // Mount a hint
      if (!document.querySelector('.ys-aurora-hint')) {
        const hint = document.createElement('div');
        hint.className = 'ys-aurora-hint';
        hint.textContent = 'Drag to explore';
        document.body.appendChild(hint);
        setTimeout(() => {
          document.body.classList.add('ys-aurora-hint-dismissed');
        }, 5500);
      }
    } else {
      /* Mobile: scroll drives rotation + color shift */
      let lastSY = window.scrollY;
      const onScroll = () => {
        const sy = window.scrollY;
        const dy = sy - lastSY;
        state.rotY += dy * 0.0018;
        state.rotX += dy * 0.0008;
        state.scrollY = sy;
        lastSY = sy;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Resize ---------- */
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    };
    window.addEventListener('resize', resize, { passive: true });

    /* ---------- Visibility / off-screen / power gating ---------- */
    let tabVisible = !document.hidden;
    let canvasVisible = true;
    let lowPower = false;
    // Detect probable low-power devices and back off
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) lowPower = true;
    if ((navigator.deviceMemory || 8) < 3) lowPower = true;
    if (lowPower) {
      // Reduce work significantly
      renderer.setPixelRatio(1);
      particles.geometry.setDrawRange(0, Math.floor(PARTICLE_COUNT * 0.55));
      farStars.geometry.setDrawRange(0, Math.floor(FAR_COUNT * 0.5));
    }

    document.addEventListener('visibilitychange', () => {
      tabVisible = !document.hidden;
    });
    // IntersectionObserver — pause render when canvas is off-screen (long pages)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        canvasVisible = entries.some(e => e.isIntersecting);
      }, { threshold: 0 });
      io.observe(canvas);
    }
    const shouldRender = () => tabVisible && canvasVisible;

    /* ---------- Animate ---------- */
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!shouldRender()) return;
      const t = clock.getElapsedTime();

      // Smooth user input
      state.smX += (state.rotX - state.smX) * 0.08;
      state.smY += (state.rotY - state.smY) * 0.08;
      state.smParX += (state.mx - state.smParX) * 0.04;
      state.smParY += (state.my - state.smParY) * 0.04;

      // Idle drift
      state.idle += 0.0008;

      // Apply rotation to scene group via individual objects
      const baseY = state.idle + state.smY + state.smParX * 0.15;
      const baseX = state.smX + state.smParY * 0.1;

      particles.rotation.y = baseY * 0.45;
      particles.rotation.x = baseX * 0.45;
      farStars.rotation.y = baseY * 0.18;
      farStars.rotation.x = baseX * 0.18;

      // Subtle particle breathing — gentle scale pulse
      const pulse = 1 + Math.sin(t * 0.6) * 0.02;
      particles.scale.set(pulse, pulse, pulse);

      // Camera dolly with mouse for depth
      camera.position.x = state.smParX * 0.4;
      camera.position.y = state.smParY * 0.3;
      camera.lookAt(0, 0, 0);

      // Mobile: shift particle hue slightly along the green→teal arc with scroll
      if (isCoarse) {
        const h = 0.36 + Math.sin(state.scrollY * 0.0008) * 0.08; // 0.28..0.44 = green/teal
        farMat.color.setHSL(h, 0.85, 0.55);
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  /* Live tour hint dismiss + Pannellum lazy init helper */
  function hookLiveTour() {
    const live = document.querySelector('.ys-live-tour');
    if (!live) return;
    const markInteracted = () => live.classList.add('has-interacted');
    live.addEventListener('pointerdown', markInteracted, { once: true, passive: true });
    live.addEventListener('touchstart',  markInteracted, { once: true, passive: true });
    live.addEventListener('wheel',       markInteracted, { once: true, passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { boot(); hookLiveTour(); });
  } else {
    boot();
    hookLiveTour();
  }
})();
