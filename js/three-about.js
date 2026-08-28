/**
 * YouSee360 3D About Page Engine
 * Powers the interactive background for the About Us page
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeAbout();
});

function initThreeAbout() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Objects
    // Main Sphere (Glass-like)
    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x01e4e4,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.2,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner Core
    const coreGeom = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x00ff66,
        emissive: 0x00ff66,
        emissiveIntensity: 0.5,
        wireframe: false,
        transparent: true,
        opacity: 0.6
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    scene.add(core);

    // Particles
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particlesMesh);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x01e4e4, 2);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    camera.position.z = 5;

    // Interaction handling
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero title & subtitle reveal
    gsap.from('[data-gsap="hero-title"]', {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: "expo.out"
    });

    gsap.from('[data-gsap="hero-subtitle"]', {
        y: 40,
        opacity: 0,
        duration: 2,
        delay: 0.3,
        ease: "expo.out"
    });

    // Camera movement on scroll
    gsap.to(camera.position, {
        z: 2,
        y: 2,
        scrollTrigger: {
            trigger: ".parallax-text-section",
            start: "top bottom",
            end: "top top",
            scrub: 1
        }
    });

    gsap.to(sphere.rotation, {
        y: Math.PI * 2,
        scrollTrigger: {
            trigger: ".parallax-text-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Object rotations
        sphere.rotation.y = elapsedTime * 0.1;
        core.rotation.x = -elapsedTime * 0.2;

        // Mouse follow effect
        sphere.rotation.y += mouseX * 0.5;
        sphere.rotation.x += -mouseY * 0.5;

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.position.x = mouseX * 0.5;
        particlesMesh.position.y = -mouseY * 0.5;

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
