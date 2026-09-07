/**
 * YouSee360 WebAR Multi-Portal Engine (Three.js + WebXR / Gyro)
 * Supports placing MULTIPLE 3D portals on floor pins simultaneously,
 * multi-scene 360 panorama switching inside portals, and 3D navigation.
 */

(function() {
  'use strict';

  // Multi-Scene 360 Tour Presets
  const TOUR_DATA = {
    junglo: {
      id: 'junglo',
      name: 'Junglo Resort & Spa',
      category: 'Luxury Hospitality & Spa',
      location: 'La Fortuna, Costa Rica',
      url: 'https://tours.yousee360.com/Junglo',
      desc: 'Step into luxury in the Costa Rican rainforest with pristine spa facilities and thermal pools.',
      scenes: [
        {
          id: 'spa',
          title: 'Rainforest Spa Deck',
          image: '../images/tours/junglo_360.jpg',
          hotspots: [
            { pos: [-3, 1.2, -5], label: '💆 Spa Villa', type: 'info', desc: 'Holistic wellness treatments surrounded by rainforest canopy.' },
            { pos: [3.5, 1.5, -4], label: '🏊 Move to Pool Deck', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'pool',
          title: 'Thermal Infinity Pool',
          image: '../images/hero-360-arenal-4k.jpg',
          hotspots: [
            { pos: [-3.5, 1.5, -4], label: '♨️ Thermal Springs', type: 'info', desc: 'Natural volcano-heated spring pools.' },
            { pos: [3, 1.2, -4], label: '🌴 Move to Canopy View', type: 'next_scene', targetScene: 2 }
          ]
        },
        {
          id: 'canopy',
          title: 'Jungle Canopy Vista',
          image: '../images/demo-360.jpg',
          hotspots: [
            { pos: [0, 1.5, -5], label: '🌋 Arenal Volcano View', type: 'info', desc: 'Unobstructed panorama of Arenal volcano peak.' },
            { pos: [-3, 1.2, -4], label: '💆 Return to Spa Deck', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    arenal: {
      id: 'arenal',
      name: 'Arenal Oasis Butterfly Dome',
      category: 'Wildlife Sanctuary',
      location: 'Arenal, Costa Rica',
      url: 'https://arenaloasis.yousee360.com/',
      desc: 'Immerse yourself inside Costa Rica premier tropical butterfly sanctuary and lush dome architecture.',
      scenes: [
        {
          id: 'dome',
          title: 'Butterfly Habitat Dome',
          image: '../images/tours/arenal_360.jpg',
          hotspots: [
            { pos: [-3.5, 2, -4], label: '🦋 Morpho Sanctuary', type: 'info', desc: 'Home to over 30 native species of tropical butterflies.' },
            { pos: [3, 1.2, -5], label: '🌺 Move to Botanical Trail', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'garden',
          title: 'Botanical Garden Trail',
          image: '../images/tours/dragonfly_360.jpg',
          hotspots: [
            { pos: [-3, 1.5, -4], label: '🌸 Rare Orchids', type: 'info', desc: 'Exotic native Costa Rican orchid collection.' },
            { pos: [3, 1, -4], label: '☕ Move to Eco Cafe', type: 'next_scene', targetScene: 2 }
          ]
        },
        {
          id: 'cafe',
          title: 'Jungle Eco Cafe',
          image: '../images/tours/kenko_360.jpg',
          hotspots: [
            { pos: [0, 1.2, -5], label: '☕ Organic Coffee Bar', type: 'info', desc: 'Fresh local coffee harvested in Arenal foothills.' },
            { pos: [-3, 1.2, -4], label: '🦋 Return to Main Dome', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    casadelrio: {
      id: 'casadelrio',
      name: 'Casa del Rio Boutique Hotel',
      category: 'Boutique Resort',
      location: 'Guanacaste, Costa Rica',
      url: 'https://tours.yousee360.com/casadelrio',
      desc: 'Discover serene riverside boutique accommodations rendered in full 12K HDR panoramic detail.',
      scenes: [
        {
          id: 'terrace',
          title: 'Riverfront Terrace',
          image: '../images/tours/casadelrio_360.jpg',
          hotspots: [
            { pos: [-3, 1.2, -5], label: '🌊 River Overlook', type: 'info', desc: 'Private balconies directly facing the river.' },
            { pos: [4, 1.8, -3], label: '🛏️ Move to Master Suite', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'suite',
          title: 'Master Luxury Suite',
          image: '../images/tours/arboeden_360.jpg',
          hotspots: [
            { pos: [-3, 1.5, -4], label: '🛋️ Teak Living Space', type: 'info', desc: 'Custom handcrafted furniture and panoramic windows.' },
            { pos: [3, 1.2, -4], label: '🌊 Return to Terrace', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    dragonfly: {
      id: 'dragonfly',
      name: 'Dragonfly Awakening',
      category: 'Wellness & Retreat Center',
      location: 'Costa Rica',
      url: 'https://tours.yousee360.com/dragonfly',
      desc: 'Explore peaceful sanctuary grounds designed for mindfulness, wellness retreats, and eco-living.',
      scenes: [
        {
          id: 'shala',
          title: 'Yoga Shala Deck',
          image: '../images/tours/dragonfly_360.jpg',
          hotspots: [
            { pos: [-4, 1.5, -4], label: '🧘 Open Air Shala', type: 'info', desc: '360-degree open air deck for group yoga & sound baths.' },
            { pos: [3, 2, -4], label: '⛰️ Move to Mountain Vista', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'vista',
          title: 'Mountain Sunset Overlook',
          image: '../images/hero-360-arenal-4k.jpg',
          hotspots: [
            { pos: [0, 1.5, -5], label: '🌅 Sunset Overlook', type: 'info', desc: 'Panoramic mountain sunsets across Central Valley.' },
            { pos: [-3, 1.2, -4], label: '🧘 Return to Shala', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    arboeden: {
      id: 'arboeden',
      name: 'Arboeden Eco Retreat',
      category: 'Eco Lodge',
      location: 'Costa Rica',
      url: 'https://tours.yousee360.com/arboreden',
      desc: 'Experience sustainable rainforest architecture floating in Costa Rica jungle canopy.',
      scenes: [
        {
          id: 'treehouse',
          title: 'Treehouse Suite',
          image: '../images/tours/arboeden_360.jpg',
          hotspots: [
            { pos: [-3, 2.5, -4], label: '🏡 Canopy Living', type: 'info', desc: 'Elevated eco-lodges integrated into living trees.' },
            { pos: [4, 1, -4], label: '🦜 Move to Canopy Trail', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'trail',
          title: 'Suspended Canopy Trail',
          image: '../images/tours/junglo_360.jpg',
          hotspots: [
            { pos: [0, 1.5, -5], label: '🦜 Wildlife Spotting', type: 'info', desc: 'Toucans, sloths, and monkeys spotted daily.' },
            { pos: [-3, 1.2, -4], label: '🏡 Return to Treehouse', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    elgenio: {
      id: 'elgenio',
      name: 'El Genio Property Showcase',
      category: 'Luxury Real Estate',
      location: 'Costa Rica',
      url: 'https://tours.yousee360.com/Elgenio',
      desc: 'Walk through premium estate grounds with complete spatial clarity and interactive navigation.',
      scenes: [
        {
          id: 'estate',
          title: 'Main Estate Residence',
          image: '../images/tours/elgenio_360.jpg',
          hotspots: [
            { pos: [-4, 1.5, -4], label: '🏡 Grand Living Room', type: 'info', desc: 'Architectural estate with custom high ceilings.' },
            { pos: [4, 2, -3], label: '🏊 Move to Pool Deck', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'pool',
          title: 'Heated Infinity Pool Deck',
          image: '../images/demo-360.jpg',
          hotspots: [
            { pos: [0, 1.5, -5], label: '🏊 Pool Bar', type: 'info', desc: 'Custom outdoor entertaining & lounge area.' },
            { pos: [-3, 1.2, -4], label: '🏡 Return to Residence', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    },
    kenko: {
      id: 'kenko',
      name: 'Kenko Restaurant',
      category: 'Dining & Street View',
      location: 'La Fortuna, Costa Rica',
      url: 'https://yousee360.com/Kenko/Tour/index.htm',
      desc: 'Step into La Fortuna finest restaurant dining room — featured live on Google Maps Street View.',
      scenes: [
        {
          id: 'sushi',
          title: 'Chef Sushi Bar & Dining',
          image: '../images/tours/kenko_360.jpg',
          hotspots: [
            { pos: [-3, 1, -5], label: '🍣 Sushi Counter', type: 'info', desc: 'Interactive dining experience and fresh Asian fusion.' },
            { pos: [4, 1.5, -4], label: '🍸 Move to Bar Lounge', type: 'next_scene', targetScene: 1 }
          ]
        },
        {
          id: 'bar',
          title: 'Tropical Bar Lounge',
          image: '../images/tours/kenko-streetview.jpg',
          hotspots: [
            { pos: [0, 1.2, -5], label: '🍸 Craft Cocktail Bar', type: 'info', desc: 'Signature Costa Rican rum & fruit infusions.' },
            { pos: [-3, 1.2, -4], label: '🍣 Return to Dining Room', type: 'next_scene', targetScene: 0 }
          ]
        }
      ]
    }
  };

  let activeTourKey = 'junglo';
  let activeSceneIndex = 0;

  let scene, camera, renderer;
  let skyboxMesh, particlesMesh, reticleMesh;
  let placedPortals = []; // Array of multiple 3D portals on the floor!
  let activePortalObj = null;

  let textureLoader;
  let loadedTextures = {};

  // Interactive controls state
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };
  let isInsidePortal = false;

  // Raycaster for 3D Hotspots & Portal selection
  let raycaster, mouseVector;

  // WebAR camera stream state
  let arVideoStream = null;

  // DOM Elements
  let canvasContainer, arCanvas;
  let activeTourTitleEl, activeTourCategoryEl, activeTourDescEl;

  document.addEventListener('DOMContentLoaded', () => {
    initDOMReferences();
    initThreeScene();
    setupTourSwitchers();
    setupModals();
    setupWebARMode();
  });

  function initDOMReferences() {
    canvasContainer = document.getElementById('canvasCard');
    arCanvas = document.getElementById('arCanvas');
    activeTourTitleEl = document.getElementById('activeTourTitle');
    activeTourCategoryEl = document.getElementById('activeTourCategory');
    activeTourDescEl = document.getElementById('activeTourDesc');
  }

  function initThreeScene() {
    if (!arCanvas || !window.THREE) return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    // 1. Scene setup
    scene = new THREE.Scene();

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);

    // 3. WebGL Renderer with sRGB Color Space & Stencil Buffer Enabled
    renderer = new THREE.WebGLRenderer({
      canvas: arCanvas,
      antialias: true,
      alpha: true,
      stencil: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f2fe, 2.5, 15);
    cyanPointLight.position.set(0, 2, 1);
    scene.add(cyanPointLight);

    const tealDirectionalLight = new THREE.DirectionalLight(0x4facfe, 1.2);
    tealDirectionalLight.position.set(5, 10, 7);
    scene.add(tealDirectionalLight);

    // Raycasting setup
    raycaster = new THREE.Raycaster();
    mouseVector = new THREE.Vector2();

    // 5. Texture Loader
    textureLoader = new THREE.TextureLoader();

    // 6. Build 360 Environment Sphere Chamber (Shared room viewer)
    const skyGeo = new THREE.SphereGeometry(15, 64, 64);
    skyGeo.scale(-1, 1, 1);

    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.EqualStencilFunc
    });
    skyboxMesh = new THREE.Mesh(skyGeo, skyMat);
    skyboxMesh.position.set(0, 1.4, -0.5);
    scene.add(skyboxMesh);

    buildFloorReticle();

    // Spawn Initial Portals Side-by-Side on the Floor!
    spawnFloorPortal('junglo', new THREE.Vector3(-1.8, 0, -2));
    spawnFloorPortal('arenal', new THREE.Vector3(0, 0, -2.5));
    spawnFloorPortal('casadelrio', new THREE.Vector3(1.8, 0, -2));

    // Select middle portal as active
    if (placedPortals.length > 1) {
      activePortalObj = placedPortals[1];
    }

    // Load initial tour data
    loadTourSceneData(activeTourKey, activeSceneIndex);

    // Event listeners for dragging & touch
    setupCanvasControls();

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    animate();
  }

  // Spawn a 3D Glowing Portal Doorway on the Floor with Pin Badge
  function spawnFloorPortal(tourKey, position) {
    const data = TOUR_DATA[tourKey];
    if (!data) return;

    const portalGroup = new THREE.Group();
    portalGroup.position.copy(position);

    // 1. Stencil Doorway Aperture Mask
    const doorShape = new THREE.Shape();
    doorShape.moveTo(-1.0, 0);
    doorShape.lineTo(-1.0, 1.8);
    doorShape.absarc(0, 1.8, 1.0, Math.PI, 0, true);
    doorShape.lineTo(1.0, 0);
    doorShape.lineTo(-1.0, 0);

    const maskGeo = new THREE.ShapeGeometry(doorShape);
    const maskMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      colorWrite: false,
      depthWrite: false,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilZPass: THREE.ReplaceStencilOp
    });
    const stencilMaskMesh = new THREE.Mesh(maskGeo, maskMat);
    portalGroup.add(stencilMaskMesh);

    // 2. Outer 3D Glowing Archway Frame
    const archExtrudeSettings = {
      steps: 2,
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4
    };

    const outerShape = new THREE.Shape();
    outerShape.moveTo(-1.12, 0);
    outerShape.lineTo(-1.12, 1.9);
    outerShape.absarc(0, 1.9, 1.12, Math.PI, 0, true);
    outerShape.lineTo(1.12, 0);
    outerShape.lineTo(-1.12, 0);

    const holePath = new THREE.Path();
    holePath.moveTo(-1.0, 0);
    holePath.lineTo(-1.0, 1.8);
    holePath.absarc(0, 1.8, 1.0, Math.PI, 0, true);
    holePath.lineTo(1.0, 0);
    holePath.lineTo(-1.0, 0);
    outerShape.holes.push(holePath);

    const archGeo = new THREE.ExtrudeGeometry(outerShape, archExtrudeSettings);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.z = -0.06;
    portalGroup.add(archMesh);

    // 3. Floor Pin Base Ring & Glowing Badge
    const pinRingGeo = new THREE.RingGeometry(0.9, 1.1, 32);
    const pinRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const pinRingMesh = new THREE.Mesh(pinRingGeo, pinRingMat);
    pinRingMesh.rotation.x = Math.PI / 2;
    pinRingMesh.position.y = 0.01;
    portalGroup.add(pinRingMesh);

    // 2D Canvas Title Badge floating above Portal Arch
    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(6, 7, 10, 0.9)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    ctx.roundRect(10, 10, 320, 60, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📍 ' + data.name, 170, 40);

    const badgeTexture = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding) badgeTexture.encoding = THREE.sRGBEncoding;

    const spriteMat = new THREE.SpriteMaterial({ map: badgeTexture, transparent: true });
    const badgeSprite = new THREE.Sprite(spriteMat);
    badgeSprite.position.y = 3.1;
    badgeSprite.scale.set(1.8, 0.45, 1);
    portalGroup.add(badgeSprite);

    // 4. Hotspots Group for inside room
    const hotspotGroup = new THREE.Group();
    portalGroup.add(hotspotGroup);

    const portalObj = {
      id: 'portal_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      tourKey: tourKey,
      sceneIndex: 0,
      group: portalGroup,
      hotspotGroup: hotspotGroup,
      archMesh: archMesh,
      position: position.clone()
    };

    portalGroup.userData = portalObj;
    scene.add(portalGroup);
    placedPortals.push(portalObj);

    return portalObj;
  }

  // Floor Reticle Target Indicator
  function buildFloorReticle() {
    const ringGeo = new THREE.RingGeometry(1.0, 1.25, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    reticleMesh = new THREE.Mesh(ringGeo, ringMat);
    reticleMesh.rotation.x = Math.PI / 2;
    reticleMesh.position.y = 0.01;
    scene.add(reticleMesh);
  }

  function configureTextureHighQuality(texture) {
    if (THREE.sRGBEncoding) {
      texture.encoding = THREE.sRGBEncoding;
    }
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    if (renderer && renderer.capabilities) {
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      if (maxAnisotropy) texture.anisotropy = maxAnisotropy;
    }
  }

  // Load Scene Panorama Texture & 3D Interactive Hotspots
  function loadTourSceneData(tourKey, sceneIdx) {
    const tour = TOUR_DATA[tourKey];
    if (!tour || !tour.scenes[sceneIdx]) return;

    activeTourKey = tourKey;
    activeSceneIndex = sceneIdx;
    const sceneData = tour.scenes[sceneIdx];

    if (loadedTextures[sceneData.image]) {
      configureTextureHighQuality(loadedTextures[sceneData.image]);
      skyboxMesh.material.map = loadedTextures[sceneData.image];
      skyboxMesh.material.needsUpdate = true;
    } else {
      textureLoader.load(sceneData.image, (texture) => {
        configureTextureHighQuality(texture);
        loadedTextures[sceneData.image] = texture;
        skyboxMesh.material.map = texture;
        skyboxMesh.material.needsUpdate = true;
      });
    }

    // Update active portal hotspots
    if (activePortalObj && activePortalObj.hotspotGroup) {
      buildInteractive3DHotspots(activePortalObj.hotspotGroup, sceneData.hotspots);
    }

    // Update In-Portal Scene UI Pills
    updateScenePillsUI(tour, sceneIdx);

    // Update Info DOM text
    if (activeTourTitleEl) activeTourTitleEl.textContent = `${tour.name} — ${sceneData.title}`;
    if (activeTourCategoryEl) activeTourCategoryEl.textContent = tour.category;
    if (activeTourDescEl) activeTourDescEl.textContent = tour.desc;
  }

  // Update Mini Scene Pills UI in DOM
  function updateScenePillsUI(tour, currentIdx) {
    let container = document.getElementById('scenePillsContainer');
    if (!container) return;

    container.innerHTML = '';
    tour.scenes.forEach((sc, idx) => {
      const pill = document.createElement('button');
      pill.className = `tour-pill ${idx === currentIdx ? 'active' : ''}`;
      pill.style.padding = '6px 14px';
      pill.style.fontSize = '0.8rem';
      pill.innerHTML = `<i class="fas fa-eye"></i> ${sc.title}`;
      pill.addEventListener('click', () => {
        loadTourSceneData(tour.id, idx);
      });
      container.appendChild(pill);
    });
  }

  // Build Floating 3D Glowing Hotspots inside Active Portal
  function buildInteractive3DHotspots(hotspotGroupObj, hotspotsList) {
    while (hotspotGroupObj.children.length > 0) {
      const obj = hotspotGroupObj.children[0];
      hotspotGroupObj.remove(obj);
    }

    if (!hotspotsList) return;

    hotspotsList.forEach((spot) => {
      const group = new THREE.Group();
      group.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);

      // Glowing Sphere Core
      const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: spot.type === 'next_scene' ? 0x00f5a0 : 0x00f2fe,
        emissive: spot.type === 'next_scene' ? 0x00f5a0 : 0x00f2fe,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.9,
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: isInsidePortal ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);

      // Outer Glowing Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.25, 0.35, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: isInsidePortal ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      group.add(ringMesh);

      // 2D Text Badge Sprite Overlay
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(6, 7, 10, 0.88)';
      ctx.strokeStyle = spot.type === 'next_scene' ? '#00f5a0' : '#00f2fe';
      ctx.lineWidth = 4;
      ctx.roundRect(10, 10, 300, 60, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spot.label, 160, 40);

      const texture = new THREE.CanvasTexture(canvas);
      if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: isInsidePortal ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.y = 0.5;
      sprite.scale.set(1.6, 0.4, 1);
      group.add(sprite);

      group.userData = spot;
      hotspotGroupObj.add(group);
    });
  }

  // Canvas Mouse & Touch Drag Controls with Raycasting
  function setupCanvasControls() {
    arCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    arCanvas.addEventListener('click', (e) => {
      const rect = arCanvas.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      // 1. Raycast Hotspots in Active Portal
      if (activePortalObj && activePortalObj.hotspotGroup) {
        const hotspotIntersects = raycaster.intersectObjects(activePortalObj.hotspotGroup.children, true);
        if (hotspotIntersects.length > 0) {
          let hitObj = hotspotIntersects[0].object;
          while (hitObj.parent && !hitObj.userData.label) hitObj = hitObj.parent;
          if (hitObj.userData && hitObj.userData.label) {
            triggerHotspotAction(hitObj.userData);
            return;
          }
        }
      }

      // 2. Raycast Placed Portals on Floor
      const portalGroups = placedPortals.map(p => p.group);
      const portalIntersects = raycaster.intersectObjects(portalGroups, true);
      if (portalIntersects.length > 0) {
        let hitGroup = portalIntersects[0].object;
        while (hitGroup.parent && !hitGroup.userData.tourKey) hitGroup = hitGroup.parent;

        if (hitGroup.userData && hitGroup.userData.tourKey) {
          activePortalObj = hitGroup.userData;
          activeTourKey = activePortalObj.tourKey;
          loadTourSceneData(activeTourKey, 0);

          // Animate camera toward clicked portal
          const targetPos = activePortalObj.position.clone();
          targetPos.y = 1.2;
          targetPos.z += 1.5;
          GSAPOrTweenCamera(camera.position, targetPos, 800);
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.005;
      targetRotation.x += deltaY * 0.005;
      targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events for mobile phone
    arCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.006;
      targetRotation.x += deltaY * 0.006;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  function triggerHotspotAction(spotData) {
    if (spotData.type === 'next_scene') {
      loadTourSceneData(activeTourKey, spotData.targetScene);
    } else if (spotData.type === 'tour') {
      const tourModal = document.getElementById('tourModal');
      const tourIframe = document.getElementById('tourIframe');
      const tourModalTitle = document.getElementById('tourModalTitle');
      const data = TOUR_DATA[activeTourKey];

      if (tourModal && tourIframe && data) {
        if (tourModalTitle) tourModalTitle.textContent = `${data.name} — ${spotData.label}`;
        tourIframe.src = data.url;
        tourModal.classList.add('active');
      }
    } else {
      alert(`✨ ${spotData.label}\n\n${spotData.desc}`);
    }
  }

  function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Main Render Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation dampening
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

    // Check distance to active portal doorway
    if (activePortalObj) {
      const portalZ = activePortalObj.position.z;
      const distZ = camera.position.z - portalZ;
      if (distZ <= 0.2 && !isInsidePortal) {
        setPortalInsideState(true);
      } else if (distZ > 0.6 && isInsidePortal) {
        setPortalInsideState(false);
      }
    }

    if (!isInsidePortal) {
      placedPortals.forEach(p => {
        p.group.rotation.y = currentRotation.y * 0.3;
      });
      if (!isDragging) {
        targetRotation.y += 0.0015;
      }
    } else {
      camera.rotation.y = currentRotation.y;
      camera.rotation.x = currentRotation.x;
    }

    // Animate particles & floor reticle
    if (particlesMesh) particlesMesh.rotation.y += 0.003;

    if (reticleMesh) {
      reticleMesh.rotation.z += 0.01;
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      reticleMesh.scale.set(scale, scale, 1);
    }

    renderer.render(scene, camera);
  }

  function setPortalInsideState(inside) {
    isInsidePortal = inside;
    const btn = document.getElementById('btnStepInside');

    if (skyboxMesh) {
      skyboxMesh.material.stencilFunc = inside ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc;
      skyboxMesh.material.needsUpdate = true;
    }

    if (activePortalObj && activePortalObj.hotspotGroup) {
      activePortalObj.hotspotGroup.children.forEach(group => {
        group.children.forEach(mesh => {
          if (mesh.material) {
            mesh.material.stencilFunc = inside ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc;
            mesh.material.needsUpdate = true;
          }
        });
      });
    }

    if (btn) {
      btn.innerHTML = inside
        ? '<i class="fas fa-arrow-left"></i> Step Outside Portal'
        : '<i class="fas fa-walking"></i> Walk Into Portal';
    }
  }

  // Tour Switcher & Multi-Portal Placement Buttons
  function setupTourSwitchers() {
    const pills = document.querySelectorAll('.tour-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const key = pill.getAttribute('data-tour');
        if (key && TOUR_DATA[key]) {
          activeTourKey = key;
          // Spawn or activate portal for this tour
          let existing = placedPortals.find(p => p.tourKey === key);
          if (!existing) {
            const newX = (placedPortals.length % 2 === 0 ? 1 : -1) * (1.5 + Math.random() * 0.8);
            existing = spawnFloorPortal(key, new THREE.Vector3(newX, 0, -2.2));
          }
          activePortalObj = existing;
          loadTourSceneData(key, 0);

          // Move camera towards active portal
          const targetPos = activePortalObj.position.clone();
          targetPos.y = 1.2;
          targetPos.z += 1.6;
          GSAPOrTweenCamera(camera.position, targetPos, 800);
        }
      });
    });

    const btnStepInside = document.getElementById('btnStepInside');
    if (btnStepInside) {
      btnStepInside.addEventListener('click', toggleStepInside);
    }
  }

  function toggleStepInside() {
    if (!activePortalObj) return;

    if (isInsidePortal) {
      const exitPos = activePortalObj.position.clone();
      exitPos.y = 1.2;
      exitPos.z += 1.8;
      GSAPOrTweenCamera(camera.position, exitPos, 1000, () => {
        setPortalInsideState(false);
      });
    } else {
      const enterPos = activePortalObj.position.clone();
      enterPos.y = 1.4;
      enterPos.z += 0.05;
      GSAPOrTweenCamera(camera.position, enterPos, 1000, () => {
        setPortalInsideState(true);
      });
    }
  }

  function GSAPOrTweenCamera(targetPos, destPos, duration, onComplete) {
    const startX = targetPos.x, startY = targetPos.y, startZ = targetPos.z;
    const startTime = Date.now();

    function step() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      targetPos.x = startX + (destPos.x - startX) * ease;
      targetPos.y = startY + (destPos.y - startY) * ease;
      targetPos.z = startZ + (destPos.z - startZ) * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (onComplete) {
        onComplete();
      }
    }
    step();
  }

  // WebAR Camera Mode
  function setupWebARMode() {
    const btnLaunchAR = document.getElementById('btnLaunchAR');
    const arOverlay = document.getElementById('webarOverlay');
    const btnCloseAR = document.getElementById('btnCloseAR');
    const arVideo = document.getElementById('webarVideo');

    if (btnLaunchAR) {
      btnLaunchAR.addEventListener('click', async () => {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            arVideoStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'environment' },
              audio: false
            });
            if (arVideo) {
              arVideo.srcObject = arVideoStream;
              await arVideo.play();
            }
            if (arOverlay) arOverlay.classList.add('active');
          } else {
            alert('WebAR camera access is not supported on this browser device. Switching to 3D Simulator Mode!');
          }
        } catch (err) {
          console.warn('Camera permission denied or unavailable:', err);
          alert('Camera permission denied or unavailable. You can explore the 3D Portal interactive simulator right on screen!');
        }
      });
    }

    if (btnCloseAR) {
      btnCloseAR.addEventListener('click', () => {
        if (arVideoStream) {
          arVideoStream.getTracks().forEach(track => track.stop());
          arVideoStream = null;
        }
        if (arOverlay) arOverlay.classList.remove('active');
      });
    }
  }

  // Modals: Fullscreen Tour Embed & QR Code Handoff
  function setupModals() {
    const tourModal = document.getElementById('tourModal');
    const tourIframe = document.getElementById('tourIframe');
    const tourModalTitle = document.getElementById('tourModalTitle');
    const btnCloseTourModal = document.getElementById('btnCloseTourModal');
    const btnOpenFullTour = document.getElementById('btnOpenFullTour');

    if (btnOpenFullTour) {
      btnOpenFullTour.addEventListener('click', () => {
        openTourModal(activeTourKey);
      });
    }

    document.querySelectorAll('.btn-launch-tour').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-tour-key');
        if (key) openTourModal(key);
      });
    });

    function openTourModal(key) {
      const data = TOUR_DATA[key];
      if (!data || !tourModal || !tourIframe) return;

      if (tourModalTitle) tourModalTitle.textContent = data.name;
      tourIframe.src = data.url;
      tourModal.classList.add('active');
    }

    if (btnCloseTourModal) {
      btnCloseTourModal.addEventListener('click', () => {
        if (tourModal) tourModal.classList.remove('active');
        if (tourIframe) tourIframe.src = 'about:blank';
      });
    }

    // QR Code Handoff Modal
    const qrModal = document.getElementById('qrModal');
    const btnShowQR = document.getElementById('btnShowQR');
    const btnCloseQR = document.getElementById('btnCloseQR');
    const qrContainer = document.getElementById('qrContainer');
    let qrGenerated = false;

    if (btnShowQR) {
      btnShowQR.addEventListener('click', () => {
        if (qrModal) qrModal.classList.add('active');
        if (!qrGenerated && window.QRCode && qrContainer) {
          let targetUrl = 'https://yousee360.com/AR%20Version/';
          if (window.location.protocol.startsWith('http')) {
            targetUrl = window.location.href;
          }
          new window.QRCode(qrContainer, {
            text: targetUrl,
            width: 200,
            height: 200
          });
          qrGenerated = true;
        }
      });
    }

    if (btnCloseQR) {
      btnCloseQR.addEventListener('click', () => {
        if (qrModal) qrModal.classList.remove('active');
      });
    }
  }

})();
