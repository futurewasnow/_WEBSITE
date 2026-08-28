/**
 * YouSee360 Hero Particles
 * Uses Three.js to create a futuristic network background
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only init if we're on a page with a hero section
    const container = document.getElementById('hero-particles');
    if (!container) return;

    // Wait for Three.js to load
    const checkThree = setInterval(() => {
        if (window.THREE) {
            clearInterval(checkThree);
            initParticles(window.THREE, container);
        }
    }, 100);
});

function initParticles(THREE, container) {
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000); // Increased far plane
    camera.position.z = 1000;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100; // Optimal for performance/look

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x01e4e4); // Cyan
    const color2 = new THREE.Color(0x00ff66); // Neon Green

    for (let i = 0; i < particleCount; i++) {
        // Random positions
        const x = (Math.random() * 2000) - 1000;
        const y = (Math.random() * 2000) - 1000;
        const z = (Math.random() * 2000) - 1000;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random mix of our two brand colors
        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 6,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Create system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Interactive Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.5; // Dampening
        targetY = mouseY * 0.5;

        // Smooth rotation
        particleSystem.rotation.y += 0.002 + (targetX - particleSystem.rotation.y * 1000) * 0.00005;
        particleSystem.rotation.x += 0.002 + (targetY - particleSystem.rotation.x * 1000) * 0.00005;

        renderer.render(scene, camera);
    }

    animate();
}
