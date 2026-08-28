/**
 * YouSee360 Portal Effect
 * Seamless 2D to 3D transition using Three.js and GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js and GSAP are loaded
    if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
        console.warn('Three.js or GSAP is missing. Portal effect cannot be initialized.');
        return;
    }

    // Create the Portal Container
    const portalContainer = document.createElement('div');
    portalContainer.id = 'yousee-portal-container';
    Object.assign(portalContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '9999',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        background: '#000'
    });
    document.body.appendChild(portalContainer);

    // Create a Close Button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times; Exit 360';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        background: 'rgba(1, 228, 228, 0.2)',
        border: '1px solid #01e4e4',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '30px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        opacity: '0',
        transition: 'opacity 0.5s ease',
        fontFamily: "'Outfit', sans-serif"
    });
    portalContainer.appendChild(closeBtn);

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    portalContainer.appendChild(renderer.domElement);

    // Create the Sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0 // Start invisible
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add a subtle ambient light (not strictly needed for BasicMaterial, but good for future expansions)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.set(0, 0, 0.1); // Inside the sphere

    // Variables for interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lon = 0, lat = 0;
    let portalActive = false;

    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    const loadTexture = (path) => {
        return new Promise((resolve) => {
            textureLoader.load(path, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                material.map = texture;
                material.needsUpdate = true;
                resolve();
            });
        });
    };

    // Render Loop
    const animate = () => {
        if (!portalActive) return;
        requestAnimationFrame(animate);

        // Auto-rotation if not dragging
        if (!isDragging) {
            lon -= 0.05;
        }

        lat = Math.max(-85, Math.min(85, lat));
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon);

        camera.target = new THREE.Vector3(
            500 * Math.sin(phi) * Math.cos(theta),
            500 * Math.cos(phi),
            500 * Math.sin(phi) * Math.sin(theta)
        );
        camera.lookAt(camera.target);

        renderer.render(scene, camera);
    };

    // Interaction Handlers
    const onPointerDown = (event) => {
        if (!portalActive) return;
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onPointerMove = (event) => {
        if (!portalActive || !isDragging) return;
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        lon -= deltaX * 0.1;
        lat += deltaY * 0.1;
        
        previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = () => {
        isDragging = false;
    };

    portalContainer.addEventListener('mousedown', onPointerDown);
    portalContainer.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    
    // Touch support
    portalContainer.addEventListener('touchstart', (e) => onPointerDown(e.touches[0]), { passive: false });
    portalContainer.addEventListener('touchmove', (e) => { e.preventDefault(); onPointerMove(e.touches[0]); }, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Close Portal Logic
    closeBtn.addEventListener('click', () => {
        portalActive = false;
        closeBtn.style.opacity = '0';
        
        gsap.to(material, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                portalContainer.style.opacity = '0';
                portalContainer.style.pointerEvents = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Morph camera back
        gsap.to(camera, {
            fov: 75,
            duration: 0.8,
            onUpdate: () => camera.updateProjectionMatrix()
        });
    });

    // The Magic Trigger
    // We attach a special click event to images in the portfolio
    const setupPortalTriggers = () => {
        const triggers = document.querySelectorAll('.case-study-media img');
        
        triggers.forEach((img) => {
            // Add a visual cue
            img.style.cursor = 'pointer';
            
            // Add a subtle overlay badge (optional, if they don't have play buttons)
            if(!img.parentElement.querySelector('.portal-badge')) {
               const badge = document.createElement('div');
               badge.className = 'portal-badge';
               badge.innerHTML = '<i class="fas fa-vr-cardboard"></i> Enter 360';
               Object.assign(badge.style, {
                   position: 'absolute',
                   top: '10px',
                   right: '10px',
                   background: 'rgba(0,0,0,0.6)',
                   color: '#01e4e4',
                   padding: '5px 10px',
                   borderRadius: '4px',
                   fontSize: '12px',
                   fontWeight: 'bold',
                   pointerEvents: 'none',
                   zIndex: '1',
                   backdropFilter: 'blur(4px)'
               });
               img.parentElement.style.position = 'relative';
               img.parentElement.appendChild(badge);
            }

            img.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // For demo purposes, we always load the high-res 360 image we copied.
                // In production, this would read from a data-attribute: img.dataset.panoSrc
                const panoSrc = 'images/demo-360.jpg';
                
                document.body.style.cursor = 'wait';
                
                try {
                    await loadTexture(panoSrc);
                    
                    // Start Portal Sequence
                    portalActive = true;
                    portalContainer.style.opacity = '1';
                    portalContainer.style.pointerEvents = 'auto';
                    document.body.style.overflow = 'hidden'; // Lock scrolling
                    document.body.style.cursor = 'default';
                    
                    // Reset view
                    lon = 0;
                    lat = 0;
                    camera.fov = 120; // Start wide (2D like)
                    camera.updateProjectionMatrix();
                    material.opacity = 0;
                    
                    // Start render loop
                    animate();

                    // GSAP Morph Effect
                    // Fade in the sphere
                    gsap.to(material, {
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.inOut'
                    });
                    
                    // Zoom the camera in to create the "warp" effect
                    gsap.to(camera, {
                        fov: 75,
                        duration: 1.5,
                        ease: 'power3.out',
                        onUpdate: () => camera.updateProjectionMatrix(),
                        onComplete: () => {
                            closeBtn.style.opacity = '1';
                        }
                    });

                } catch (err) {
                    console.error("Failed to load 360 panorama", err);
                    document.body.style.cursor = 'default';
                }
            });
        });
    };

    // Initialize triggers after a short delay to ensure DOM is ready
    setTimeout(setupPortalTriggers, 500);
});
