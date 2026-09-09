/**
 * YouSee360 Universal WebAR 3D Portal Engine
 * Universal Mobile Compatibility for iOS Safari & Android Chrome
 * Instantly launches AR camera for any selected tour with 3D portal auto-placed in front of user
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

  // The 8th Wall engine binary is free and keyless since the platform went open
  // source, and it is the only way an iPhone gets real world tracking, because
  // Safari has no WebXR. It loads async from a script tag in index.html.
  const EIGHTH_WALL_START_TIMEOUT_MS = 9000;
  const EIGHTH_WALL_LOAD_TIMEOUT_MS = 7000;

  // window.XR8 appears before the SLAM chunk finishes downloading. Calling
  // XR8.run() in that window is what threw "No valid session manager to handle
  // this session" -- there is no session manager registered yet. The engine
  // fires xrloaded when it is genuinely ready.
  function whenEighthWallReady(timeoutMs) {
    return new Promise(resolve => {
      if (window.XR8 && window.XR8.XrConfig) return resolve(window.XR8);
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        window.removeEventListener('xrloaded', onLoaded);
        resolve(value);
      };
      const onLoaded = () => finish(window.XR8 && window.XR8.XrConfig ? window.XR8 : null);
      const timer = setTimeout(() => {
        console.warn('8th Wall engine did not load within %dms.', timeoutMs);
        finish(null);
      }, timeoutMs);
      window.addEventListener('xrloaded', onLoaded);
    });
  }

  let activeTourKey = 'junglo';
  let activeSceneIndex = 0;

  let scene, camera, renderer;
  let skyboxMesh, reticleMesh;
  let placedPortals = [];
  let activePortalObj = null;

  let textureLoader;
  let loadedTextures = {};

  // Touch & Device Motion State
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };
  let isInsidePortal = false;
  let isCameraARActive = false;

  // Raycasting
  let raycaster, mouseVector;
  let arVideoStream = null;
  let nativeARSession = null;
  let nativeARReferenceSpace = null;
  let nativeARHitTestSource = null;
  let isNativeARActive = false;
  let isEighthWallActive = false;
  let eighthWallHasRun = false;
  let portalMomentTimer = null;

  // The doorway was modelled at roughly 2.0m wide by 2.8m tall. That reads fine
  // in the desktop simulator, where the camera sits about 6m back, but anchored
  // 1.5m away on a phone it swallows the whole viewport. 0.72 brings it to a
  // walkable 1.44m x 2.02m. Everything in the portal is one group, so a single
  // group scale keeps every proportion intact.
  const PORTAL_SCALE = 0.72;
  // Never anchor the portal on top of the visitor.
  const PORTAL_MIN_DISTANCE = 1.6;

  // Draw order for the stencil portal. The mask has to write the stencil buffer
  // before the skybox tests it; with no explicit order three.js sorts opaque
  // objects by depth, which put the skybox first once the camera came close and
  // left the doorway showing nothing at all.
  const ORDER_MASK = 0;
  const ORDER_SKY = 1;
  const ORDER_PROPS = 2;

  // Set false when the GL context has no stencil bits, so we degrade to simply
  // showing the scene once you are inside rather than rendering nothing.
  let portalMaskingSupported = true;

  // DOM Elements
  let canvasContainer, arCanvas;
  let activeTourTitleEl, activeTourCategoryEl, activeTourDescEl;

  document.addEventListener('DOMContentLoaded', () => {
    initDOMReferences();
    initThreeScene();
    setupTourSwitchers();
    setupModals();
    setupWebARMode();
    setupViewInYourRoom();
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

    // 3. WebGL Renderer with sRGB Color Space & Alpha Support
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

    // 6. Build 360 Environment Sphere Chamber
    const skyGeo = new THREE.SphereGeometry(15, 64, 64);
    skyGeo.scale(-1, 1, 1);

    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.EqualStencilFunc
    });
    skyMat.depthWrite = false;      // never occlude the arch drawn after it
    skyboxMesh = new THREE.Mesh(skyGeo, skyMat);
    skyboxMesh.position.set(0, 1.4, -0.5);
    skyboxMesh.renderOrder = ORDER_SKY;
    scene.add(skyboxMesh);

    buildFloorReticle();

    // Spawn Initial Portals Side-by-Side on Floor
    spawnFloorPortal('junglo', new THREE.Vector3(-1.8, 0, -2));
    spawnFloorPortal('arenal', new THREE.Vector3(0, 0, -2.4));
    spawnFloorPortal('casadelrio', new THREE.Vector3(1.8, 0, -2));

    if (placedPortals.length > 1) {
      activePortalObj = placedPortals[1];
    }

    loadTourSceneData(activeTourKey, activeSceneIndex);
    setupCanvasControls();
    setupDeviceGyroscope();

    window.addEventListener('resize', onWindowResize);
    animate();
  }

  // Spawn a 3D Glowing Portal Doorway on Floor
  function spawnFloorPortal(tourKey, position) {
    const data = TOUR_DATA[tourKey];
    if (!data) return;

    const portalGroup = new THREE.Group();
    portalGroup.position.copy(position);
    portalGroup.scale.setScalar(PORTAL_SCALE);

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
    stencilMaskMesh.renderOrder = ORDER_MASK;
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
    holePath.lineTo(1.1, 0);
    holePath.lineTo(-1.0, 0);
    outerShape.holes.push(holePath);

    const archGeo = new THREE.ExtrudeGeometry(outerShape, archExtrudeSettings);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8
    });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.z = -0.06;
    portalGroup.add(archMesh);

    // A lightweight constellation makes the doorway feel alive without adding a
    // heavy model or texture download to the mobile AR launch.
    const auraPositions = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const radius = 1.05 + Math.random() * 0.18;
      auraPositions.push(Math.cos(angle) * radius, 1.75 + Math.sin(angle) * radius, (Math.random() - 0.5) * 0.18);
    }
    const auraGeo = new THREE.BufferGeometry();
    auraGeo.setAttribute('position', new THREE.Float32BufferAttribute(auraPositions, 3));
    const aura = new THREE.Points(auraGeo, new THREE.PointsMaterial({
      color: 0x7df9ff, size: 0.045, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    aura.userData.baseY = 1.75;
    portalGroup.add(aura);

    const portalLight = new THREE.PointLight(0x00f2fe, 2.2, 5, 2);
    portalLight.position.set(0, 1.7, 0.45);
    portalGroup.add(portalLight);

    // 3. Floor Pin Base Ring & Title Badge
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

    // Title Badge
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

    // Hotspots Group
    const hotspotGroup = new THREE.Group();
    portalGroup.add(hotspotGroup);

    const portalObj = {
      id: 'portal_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      tourKey: tourKey,
      sceneIndex: 0,
      group: portalGroup,
      hotspotGroup: hotspotGroup,
      archMesh: archMesh,
      aura: aura,
      portalLight: portalLight,
      position: position.clone()
    };

    portalGroup.userData = portalObj;
    // The mask writes the stencil, the skybox fills the doorway, then the
    // frame and its furniture sit on top of both.
    portalGroup.traverse(obj => {
      if (obj.isMesh || obj.isPoints || obj.isSprite) {
        if (obj.renderOrder === ORDER_MASK) return;
        obj.renderOrder = ORDER_PROPS;
      }
    });

    scene.add(portalGroup);
    placedPortals.push(portalObj);

    return portalObj;
  }

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

    if (activePortalObj && activePortalObj.hotspotGroup) {
      buildInteractive3DHotspots(activePortalObj.hotspotGroup, sceneData.hotspots);
      positionSkyboxForActivePortal();
    }

    updateScenePillsUI(tour, sceneIdx);

    if (activeTourTitleEl) activeTourTitleEl.textContent = `${tour.name} — ${sceneData.title}`;
    if (activeTourCategoryEl) activeTourCategoryEl.textContent = tour.category;
    if (activeTourDescEl) activeTourDescEl.textContent = tour.desc;
    const momentTitle = document.getElementById('arPortalMomentTitle');
    if (isInsidePortal && momentTitle) momentTitle.textContent = `${tour.name} — ${sceneData.title}`;
  }

  // The panorama belongs to the selected doorway, rather than the simulator origin.
  function positionSkyboxForActivePortal() {
    if (!skyboxMesh || !activePortalObj) return;
    skyboxMesh.position.copy(activePortalObj.group.position);
    skyboxMesh.position.y += 1.4;
    skyboxMesh.position.z -= 0.35;
  }

  function movePortal(portal, position, quaternion) {
    if (!portal) return;
    portal.position.copy(position);
    portal.group.position.copy(position);
    if (quaternion) portal.group.quaternion.copy(quaternion);
    positionSkyboxForActivePortal();
  }

  function updateScenePillsUI(tour, currentIdx) {
    const containers = [
      document.getElementById('scenePillsContainer'),
      document.getElementById('arScenePillsContainer')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = '';
      tour.scenes.forEach((sc, idx) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `tour-pill ${idx === currentIdx ? 'active' : ''}`;
        pill.setAttribute('aria-pressed', idx === currentIdx ? 'true' : 'false');
        pill.innerHTML = `<i class="fas fa-eye" aria-hidden="true"></i> ${sc.title}`;
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          loadTourSceneData(tour.id, idx);
          // Choosing a scene from the sheet is a completed decision.
          if (container.id === 'arScenePillsContainer') {
            haptic(10);
            closeSheet('arSceneSheet');
          }
        });
        container.appendChild(pill);
      });
    });
  }

  function buildInteractive3DHotspots(hotspotGroupObj, hotspotsList) {
    while (hotspotGroupObj.children.length > 0) {
      const obj = hotspotGroupObj.children[0];
      hotspotGroupObj.remove(obj);
    }

    if (!hotspotsList) return;

    hotspotsList.forEach((spot) => {
      const group = new THREE.Group();
      group.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);

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
      sprite.renderOrder = ORDER_PROPS;
      sprite.position.y = 0.5;
      sprite.scale.set(1.6, 0.4, 1);
      group.add(sprite);

      group.userData = spot;
      hotspotGroupObj.add(group);
    });
  }

  // Device Gyroscope Orientation for iPhone & Mobile Phones
  function setupDeviceGyroscope() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (!isDragging && (e.beta || e.gamma)) {
          // Map phone tilt to rotation
          targetRotation.y = (e.gamma / 45) * (Math.PI / 4);
          targetRotation.x = ((e.beta - 45) / 45) * (Math.PI / 4);
        }
      }, true);
    }
  }

  // Touch & Mouse Drag Controls
  function setupCanvasControls() {
    arCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    arCanvas.addEventListener('click', handleScreenTap);

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

    // Touch Event Listeners for iPhone / Mobile
    arCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    arCanvas.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.006;
      targetRotation.x += deltaY * 0.006;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    arCanvas.addEventListener('touchend', (e) => {
      isDragging = false;
      if (e.changedTouches && e.changedTouches.length === 1) {
        handleScreenTap(e.changedTouches[0]);
      }
    });
  }

  // Handle Screen Tap & WebAR Camera Placement
  function handleScreenTap(e) {
    const rect = arCanvas.getBoundingClientRect();
    const clientX = e.clientX || (e.pageX - rect.left);
    const clientY = e.clientY || (e.pageY - rect.top);

    mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

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

        const targetPos = activePortalObj.position.clone();
        targetPos.y = 1.2;
        targetPos.z += 1.5;
        GSAPOrTweenCamera(camera.position, targetPos, 800);
        return;
      }
    }

    // 3. Tap to Place New Portal in WebAR Camera View
    if (isCameraARActive) {
      const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const floorPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(planeY, floorPoint);

      if (floorPoint) {
        if (floorPoint.length() > 8) floorPoint.normalize().multiplyScalar(4);
        
        const newPortal = spawnFloorPortal(activeTourKey, floorPoint);
        activePortalObj = newPortal;
        positionSkyboxForActivePortal();
        
        const navPill = document.querySelector('.webar-hud-bottom .canvas-instruction');
        if (navPill) {
          navPill.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> <span>Portal Placed! Walk into archway to step inside</span>`;
        }
      }
    }
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
    const width = isCameraARActive ? window.innerWidth : canvasContainer.clientWidth;
    const height = isCameraARActive ? window.innerHeight : canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

    if (activePortalObj) {
      const portalDistance = camera.position.distanceTo(activePortalObj.group.position);
      if (portalDistance <= 0.85 && !isInsidePortal) {
        setPortalInsideState(true);
      } else if (portalDistance > 1.2 && isInsidePortal) {
        setPortalInsideState(false);
      }
    }

    if (!isInsidePortal) {
      if (!isCameraARActive) placedPortals.forEach(p => {
        p.group.rotation.y = currentRotation.y * 0.3;
      });
      if (!isDragging) {
        targetRotation.y += 0.0015;
      }
    } else {
      camera.rotation.y = currentRotation.y;
      camera.rotation.x = currentRotation.x;
    }

    if (reticleMesh) {
      reticleMesh.rotation.z += 0.01;
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      reticleMesh.scale.set(scale, scale, 1);
    }

    animatePortalEffects();

    // An immersive WebXR session owns the render loop and camera pose.
    if (!isNativeARActive && !isEighthWallActive) renderer.render(scene, camera);
  }

  function animatePortalEffects() {
    const time = Date.now() * 0.001;
    placedPortals.forEach(portal => {
      if (portal.aura) {
        portal.aura.rotation.z = time * 0.35;
        portal.aura.position.y = Math.sin(time * 1.8) * 0.05;
      }
      if (portal.portalLight) portal.portalLight.intensity = 1.9 + Math.sin(time * 2.4) * 0.5;
    });
  }

  // 8th Wall supplies its own WebGLRenderer, and we cannot assume it asked for
  // stencil bits. Without them every stencilFunc silently passes or fails and
  // the doorway shows nothing, so check once and fall back to a plain reveal.
  function refreshPortalMaskingSupport() {
    portalMaskingSupported = true;
    try {
      const gl = renderer && renderer.getContext && renderer.getContext();
      const attrs = gl && gl.getContextAttributes && gl.getContextAttributes();
      if (attrs && attrs.stencil === false) portalMaskingSupported = false;
      if (gl && gl.getParameter && gl.getParameter(gl.STENCIL_BITS) === 0) {
        portalMaskingSupported = false;
      }
    } catch (e) { /* keep the optimistic default */ }
    if (!portalMaskingSupported) {
      console.warn('No stencil buffer available; showing the scene on entry ' +
                   'instead of masking it to the doorway.');
    }
    setPortalInsideState(isInsidePortal);
  }

  function setPortalInsideState(inside) {
    isInsidePortal = inside;
    const btn = document.getElementById('btnStepInside');
    const arBtn = document.getElementById('btnARStepInside');
    const moment = document.getElementById('arPortalMoment');
    const momentTitle = document.getElementById('arPortalMomentTitle');

    if (skyboxMesh) {
      if (portalMaskingSupported) {
        skyboxMesh.visible = true;
        skyboxMesh.material.stencilWrite = true;
        skyboxMesh.material.stencilFunc = inside ? THREE.AlwaysStencilFunc : THREE.EqualStencilFunc;
      } else {
        // No stencil: the doorway cannot be a window, so it becomes a threshold.
        skyboxMesh.material.stencilWrite = false;
        skyboxMesh.visible = inside;
      }
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
    // Swap only the label, not the button's markup -- the icon and the
    // element the state machine writes into both have to survive.
    const arBtnLabel = arBtn && arBtn.querySelector('[data-ar-enter-label]');
    if (arBtnLabel) arBtnLabel.textContent = inside ? 'Step back out' : 'Step inside';

    if (moment) {
      const show = inside && isCameraARActive;
      moment.classList.toggle('active', show);
      if (show && momentTitle && TOUR_DATA[activeTourKey]) {
        momentTitle.textContent = TOUR_DATA[activeTourKey].name;
      }
      // It is a moment, not a label. Let the scene have the screen back.
      clearTimeout(portalMomentTimer);
      if (show) {
        portalMomentTimer = setTimeout(() => moment.classList.remove('active'), 2600);
      }
    }
  }

  /* ============================================================
     AR EXPERIENCE STATE
     One source of truth for what the overlay is doing. The CSS reads
     data-ar-state and decides what belongs on screen, so no handler
     ever has to remember to hide four other things.
     ============================================================ */
  const AR_COPY = {
    priming:  { phase: '',                    guide: '' },
    starting: { phase: 'Starting camera',     guide: 'One moment…' },
    scanning: { phase: 'Finding your floor',  guide: 'Move your phone slowly across the floor in front of you.' },
    ready:    { phase: 'Floor found',         guide: 'Aim at the spot you want, then place the portal.' },
    placed:   { phase: 'Portal anchored',     guide: 'Walk up to the doorway, or step through from here.' },
    inside:   { phase: 'Inside the portal',   guide: '' },
    blocked:  { phase: '',                    guide: 'AR needs camera access to find your floor.' }
  };

  let arState = 'priming';

  function overlayEl() { return document.getElementById('webarOverlay'); }

  // Short, distinct taps. Android honours these; iOS Safari ignores the
  // Vibration API entirely, which is a no-op rather than an error.
  function haptic(pattern) {
    if (!navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) { /* blocked by the UA */ }
  }

  function setARState(next, message) {
    const overlay = overlayEl();
    if (!overlay) return;
    arState = next;
    overlay.dataset.arState = next;

    const copy = AR_COPY[next] || { phase: '', guide: '' };
    updateARPhase(copy.phase);
    updateARHUD(message || copy.guide);

    // The enter/exit affordance is the same button wearing two labels.
    const enterLabel = document.querySelector('[data-ar-enter-label]');
    if (enterLabel) {
      enterLabel.textContent = isInsidePortal ? 'Step back out' : 'Step inside';
    }
  }

  function openSheet(id) {
    const sheet = document.getElementById(id);
    if (sheet) sheet.classList.add('is-open');
  }

  function closeSheet(id) {
    const sheet = document.getElementById(id);
    if (sheet) sheet.classList.remove('is-open');
  }

  // A tracked surface should move the experience forward on its own rather
  // than waiting for the visitor to notice the reticle has appeared.
  function notifySurfaceFound() {
    if (arState !== 'scanning' && arState !== 'starting') return;
    haptic(12);
    setARState('ready');
  }

  /* ============================================================
     VIEW IN YOUR ROOM
     Hands the portal to the AR viewer the device already ships with:
     AR Quick Look on iOS, Scene Viewer on Android. Both are activated by a
     plain anchor, which is the whole point -- awaiting a library first would
     spend the user gesture that iOS requires, exactly as it does for
     getUserMedia. So the hrefs are resolved once at load and the tap is
     nothing but a link click.
     ============================================================ */
  function detectNativeAR() {
    const ua = navigator.userAgent || '';
    // iPadOS 13+ reports itself as a Mac, so touch points are the giveaway.
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);

    // Every iOS device since iOS 12 has AR Quick Look, and Chrome and Firefox
    // on iOS are WebKit underneath, so they get it too. Gating on
    // relList.supports('ar') would hide the button on any engine that reports
    // the capability badly -- and it is not needed: if rel="ar" is ignored the
    // anchor simply navigates to the .usdz, which iOS still opens in Quick Look
    // as long as the server sends model/vnd.usdz+zip. Either path works.
    if (isIOS) return 'quicklook';
    if (isAndroid) return 'sceneviewer';
    return null;
  }

  function sceneViewerHref(glbUrl, title) {
    // mode=ar_preferred still gives a 3D fallback if ARCore is unavailable.
    return 'intent://arvr.google.com/scene-viewer/1.0' +
      '?file=' + encodeURIComponent(glbUrl) +
      '&mode=ar_preferred' +
      '&title=' + encodeURIComponent(title) +
      '#Intent;scheme=https;package=com.google.ar.core;' +
      'action=android.intent.action.VIEW;' +
      'S.browser_fallback_url=' + encodeURIComponent(window.location.href) + ';end;';
  }

  function setupViewInYourRoom() {
    const links = document.querySelectorAll('.btn-view-room[data-tour-key]');
    if (!links.length) return;

    const mode = detectNativeAR();
    if (!mode) {
      // Desktop has nothing to hand off to. Leave the buttons hidden rather
      // than offering something that cannot work, and point at the QR instead.
      const hint = document.getElementById('viewRoomHint');
      if (hint) hint.hidden = false;
      return;
    }

    links.forEach(link => {
      const key = link.getAttribute('data-tour-key');
      const title = (TOUR_DATA[key] && TOUR_DATA[key].name) || 'YouSee360 portal';

      if (mode === 'quicklook') {
        link.setAttribute('rel', 'ar');
        link.href = 'models/' + key + '-portal.usdz';
        // Quick Look needs a child image; without one Safari treats the anchor
        // as an ordinary link and navigates to the file instead of opening AR.
        if (!link.querySelector('img')) {
          const img = document.createElement('img');
          img.src = '../images/tours/' + key + '.jpg';
          img.alt = '';
          img.width = 1;
          img.height = 1;
          img.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none';
          link.appendChild(img);
        }
      } else {
        const glb = new URL('models/' + key + '-portal.glb', window.location.href).href;
        link.href = sceneViewerHref(glb, title);
      }

      link.hidden = false;
      link.addEventListener('click', () => {
        haptic(10);
        if (window.gtag) {
          window.gtag('event', 'ar_view_in_room', {tour: key, viewer: mode});
        }
      });
    });
  }

  // Launch Universal AR Camera for Any Selected Tour
  function launchARCameraForTour(tourKey) {
    if (tourKey && TOUR_DATA[tourKey]) {
      activeTourKey = tourKey;
    }

    const arOverlay = document.getElementById('webarOverlay');
    const arVideo = document.getElementById('webarVideo');

    // Do not leave the launch button looking unresponsive while a camera or AR
    // engine starts. The overlay immediately communicates that work is underway.
    if (arOverlay) arOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ask before the browser does. A cold permission prompt with no stated
    // reason is the single biggest drop-off in a WebAR funnel, and the sheet
    // button doubles as the user gesture iOS requires for getUserMedia.
    setARState('priming');
    updateARHUD('');
    const title = document.getElementById('arHudTourTitle');
    if (title && TOUR_DATA[activeTourKey]) title.textContent = TOUR_DATA[activeTourKey].name;
    openSheet('arPrimeSheet');
  }

  // Runs from the priming sheet's button, so we are still inside the tap.
  function beginARSession() {
    closeSheet('arPrimeSheet');
    setARState('starting');
    haptic(8);

    const canTryWebXR = !!(window.isSecureContext && navigator.xr && renderer);
    // 8th Wall handles its own camera permission flow, including the gesture
    // rules on iOS, so it is safe to await the engine before starting it.
    const canTryEighthWall = !!(window.isSecureContext && window.THREE && arCanvas);

    if (!canTryWebXR && !canTryEighthWall) {
      // Nothing tracked is possible, so reach getUserMedia inside this same
      // task -- Safari refuses it once the gesture has been awaited away.
      startCameraPreview();
      return;
    }

    runTrackedARCascade(canTryWebXR, canTryEighthWall);
  }

  // Try the best-tracked mode this device can actually deliver, and fall through
  // the moment one genuinely fails rather than assuming it started.
  async function runTrackedARCascade(canTryWebXR, canTryEighthWall) {
    if (canTryWebXR && await startNativeARSession()) return;
    if (canTryEighthWall && await startEighthWallARSession()) return;
    await startCameraPreview();
  }

  async function startCameraPreview() {
    const arOverlay = document.getElementById('webarOverlay');
    const arVideo = document.getElementById('webarVideo');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        arVideoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (arVideo) {
          arVideo.srcObject = arVideoStream;
          await arVideo.play();
        }

        if (arOverlay && arCanvas) {
          arOverlay.appendChild(arCanvas);
          arCanvas.classList.add('ar-camera-mode');
          isCameraARActive = true;

          if (renderer) {
            renderer.setClearColor(0x000000, 0); // Transparent for camera stream
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
          if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.position.set(0, 1.2, 0.5);
            camera.updateProjectionMatrix();
          }

          // Auto-spawn active tour portal right in front of user in AR space
          loadTourSceneData(activeTourKey, 0);
          
          let existing = placedPortals.find(p => p.tourKey === activeTourKey);
          if (!existing) {
            existing = spawnFloorPortal(activeTourKey, new THREE.Vector3(0, 0, -2.0));
          } else {
            movePortal(existing, new THREE.Vector3(0, 0, -2.0));
          }
          activePortalObj = existing;
          positionSkyboxForActivePortal();

          arOverlay.classList.add('active');
          haptic(14);
          // The video-only path has no SLAM, so the portal is already standing
          // in front of the viewer -- there is no floor to hunt for.
          setARState('placed');
        }
      } else {
        showARCameraRecovery('This browser cannot open a camera. Try Safari on iPhone or Chrome on Android, over HTTPS.');
      }
    } catch (err) {
      console.warn('Camera permission denied or HTTP connection:', err);
      showARCameraRecovery('Camera access was blocked. Allow it for this site in your browser settings, then try again.');
    }
  }

  function showARCameraRecovery(message) {
    const overlay = document.getElementById('webarOverlay');
    const startButton = document.getElementById('btnARStartCamera');
    if (overlay) overlay.classList.add('active');
    if (startButton) startButton.hidden = false;
    closeSheet('arPrimeSheet');
    haptic([10, 60, 10]);
    setARState('blocked', message ||
      'AR needs camera access to find your floor. Allow it for this site, then try again.');
  }

  async function startEighthWallARSession() {
    if (!window.THREE || !arCanvas) return false;

    // Wait for the engine to actually finish loading rather than trusting the
    // presence of window.XR8, which appears before the SLAM chunk lands.
    const XR8 = await whenEighthWallReady(EIGHTH_WALL_LOAD_TIMEOUT_MS);
    if (!XR8) return false;

    const overlay = document.getElementById('webarOverlay');
    try {
      if (eighthWallHasRun) {
        if (overlay) overlay.classList.add('active');
        isCameraARActive = true;
        isEighthWallActive = true;
        window.XR8.resume();
        setARState('scanning');
        return true;
      }

      // XR8 reports failure through its own error channel rather than by
      // throwing, so resolve only once onStart actually fires. Anything else --
      // an exception, a bad app key, or silence -- has to fall through to the
      // next tier instead of leaving the launch button looking dead.
      const started = await new Promise(resolve => {
        let settled = false;
        const finish = (ok) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(ok);
        };
        const timer = setTimeout(() => {
          console.warn('8th Wall did not start within %dms; falling back.',
                       EIGHTH_WALL_START_TIMEOUT_MS);
          finish(false);
        }, EIGHTH_WALL_START_TIMEOUT_MS);

        window.XR8.addCameraPipelineModules([
          window.XR8.GlTextureRenderer.pipelineModule(),
          window.XR8.Threejs.pipelineModule(),
          window.XR8.XrController.pipelineModule(),
          {
            name: 'yousee360-portal-scene',
            onStart: () => {
              const xrScene = window.XR8.Threejs.xrScene();
              const oldScene = scene;
              scene = xrScene.scene;
              camera = xrScene.camera;
              renderer = xrScene.renderer;
              oldScene.children.slice().forEach(child => scene.add(child));
              isEighthWallActive = true;
              isCameraARActive = true;
              refreshPortalMaskingSupport();
              if (reticleMesh) reticleMesh.visible = true;

              const existing = placedPortals.find(p => p.tourKey === activeTourKey) ||
                spawnFloorPortal(activeTourKey, new THREE.Vector3(0, 0, -2));
              activePortalObj = existing;
              loadTourSceneData(activeTourKey, 0);
              positionSkyboxForActivePortal();
              setARState('scanning');
              finish(true);
            },
            onUpdate: () => updateEighthWallReticle(),
            onException: (error) => {
              console.warn('8th Wall AR could not start.', error);
              finish(false);
            },
            onCameraStatusChange: ({status}) => {
              if (status === 'failed') finish(false);
            },
          },
        ]);

        // The engine reports fatal problems on its own channel, not by throwing.
        if (window.XR8.addCameraPipelineModule) {
          window.XR8.addCameraPipelineModule({
            name: 'yousee360-error-watch',
            onException: (error) => {
              console.warn('8th Wall engine error.', error);
              finish(false);
            }
          });
        }

        if (overlay) {
          overlay.appendChild(arCanvas);
          overlay.classList.add('active');
        }
        arCanvas.classList.add('ar-camera-mode');
        try {
          // Without allowedDevices the engine accepts phones only and rejects
          // everything else, which surfaces as "No valid session manager".
          window.XR8.XrController.configure({disableWorldTracking: false});
          window.XR8.run({
            canvas: arCanvas,
            allowedDevices: window.XR8.XrConfig.device().ANY
          });
          eighthWallHasRun = true;
        } catch (error) {
          console.warn('8th Wall AR could not start.', error);
          finish(false);
        }
      });

      if (!started) releaseEighthWallCanvas();
      return started;
    } catch (error) {
      console.warn('8th Wall AR could not start.', error);
      releaseEighthWallCanvas();
      return false;
    }
  }

  // Hand the canvas back so a fallback tier can reuse it after 8th Wall bows out.
  function releaseEighthWallCanvas() {
    isEighthWallActive = false;
    if (window.XR8 && eighthWallHasRun) {
      try { window.XR8.pause(); } catch (error) { /* engine never started */ }
    }
    if (arCanvas) arCanvas.classList.remove('ar-camera-mode');
    if (canvasContainer && arCanvas) canvasContainer.appendChild(arCanvas);
  }

  // 8th Wall supplies a SLAM-tracked camera. Its world origin is the floor at
  // session start, so this projects the centre reticle onto that tracked floor.
  function updateEighthWallReticle() {
    if (!isEighthWallActive || !camera || !reticleMesh) return;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const origin = camera.position;
    const distance = direction.y < -0.08 ? Math.max(0.6, Math.min(5, -origin.y / direction.y)) : 2;
    reticleMesh.position.copy(origin).addScaledVector(direction, distance);
    reticleMesh.position.y = 0.01;
    reticleMesh.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    reticleMesh.visible = true;
    notifySurfaceFound();
  }

  // Use the browser's real world-tracking API when it is available (Android Chrome
  // and other WebXR-capable browsers). The video-only path below remains a manual
  // placement fallback for browsers that do not expose WebXR, such as many iPhones.
  async function startNativeARSession() {
    if (!window.isSecureContext || !navigator.xr || !renderer) return false;

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) return false;

      const overlay = document.getElementById('webarOverlay');
      nativeARSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: overlay ? { root: overlay } : undefined
      });

      renderer.xr.enabled = true;
      await renderer.xr.setSession(nativeARSession);
      nativeARReferenceSpace = await nativeARSession.requestReferenceSpace('local-floor');
      const viewerSpace = await nativeARSession.requestReferenceSpace('viewer');
      nativeARHitTestSource = await nativeARSession.requestHitTestSource({ space: viewerSpace });
      isNativeARActive = true;
      isCameraARActive = true;
      refreshPortalMaskingSupport();

      if (overlay && arCanvas) {
        overlay.appendChild(arCanvas);
        arCanvas.classList.add('ar-camera-mode');
        overlay.classList.add('active');
      }
      if (reticleMesh) reticleMesh.visible = false;

      const existing = placedPortals.find(p => p.tourKey === activeTourKey) ||
        spawnFloorPortal(activeTourKey, new THREE.Vector3(0, 0, -2));
      activePortalObj = existing;
      loadTourSceneData(activeTourKey, 0);
      setARState('scanning');
      renderer.setAnimationLoop(renderNativeARFrame);

      nativeARSession.addEventListener('end', stopNativeARSession);
      return true;
    } catch (error) {
      console.warn('Native WebXR AR could not start; using manual camera placement.', error);
      stopNativeARSession();
      return false;
    }
  }

  function renderNativeARFrame(_time, frame) {
    if (nativeARHitTestSource && nativeARReferenceSpace) {
      const hit = frame.getHitTestResults(nativeARHitTestSource)[0];
      if (hit) {
        const pose = hit.getPose(nativeARReferenceSpace);
        if (pose && reticleMesh) {
          reticleMesh.visible = true;
          reticleMesh.matrix.fromArray(pose.transform.matrix);
          reticleMesh.matrix.decompose(reticleMesh.position, reticleMesh.quaternion, reticleMesh.scale);
          notifySurfaceFound();
        }
      }
    }
    renderer.render(scene, camera);
  }

  // A doorway anchored a metre away fills the whole viewport and there is
  // nowhere to stand back to. Push any closer hit out along the same bearing.
  function standoffFromCamera(point) {
    if (!camera) return point;
    const eye = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
    const flatEye = new THREE.Vector3(eye.x, point.y, eye.z);
    const away = new THREE.Vector3().subVectors(point, flatEye);
    const dist = away.length();
    if (dist >= PORTAL_MIN_DISTANCE) return point;
    if (dist < 1e-3) {
      // Aimed straight down: put it in front of wherever the camera looks.
      const fwd = new THREE.Vector3();
      camera.getWorldDirection(fwd);
      fwd.y = 0;
      if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
      fwd.normalize();
      return flatEye.clone().addScaledVector(fwd, PORTAL_MIN_DISTANCE);
    }
    return flatEye.clone().addScaledVector(away.normalize(), PORTAL_MIN_DISTANCE);
  }

  function placePortalAtReticle() {
    if (!activePortalObj) activePortalObj = spawnFloorPortal(activeTourKey, new THREE.Vector3(0, 0, -2));
    if ((isNativeARActive || isEighthWallActive) && reticleMesh && reticleMesh.visible) {
      movePortal(activePortalObj, standoffFromCamera(reticleMesh.position.clone()),
                 reticleMesh.quaternion);
      haptic(18);
      setARState('placed');
      return;
    }
    movePortal(activePortalObj, new THREE.Vector3(0, 0, -2));
    haptic(18);
    setARState('placed');
  }

  function updateARHUD(message) {
    const instruction = document.getElementById('arInstruction');
    const title = document.getElementById('arHudTourTitle');
    if (instruction) {
      instruction.textContent = message || '';
      instruction.hidden = !message;
    }
    if (title && TOUR_DATA[activeTourKey]) title.textContent = TOUR_DATA[activeTourKey].name;
  }

  function updateARPhase(phase) {
    const phaseEl = document.getElementById('arExperiencePhase');
    if (!phaseEl) return;
    phaseEl.textContent = phase || '';
    phaseEl.hidden = !phase;
  }

  function stopNativeARSession() {
    if (renderer) renderer.setAnimationLoop(null);
    nativeARHitTestSource = null;
    nativeARReferenceSpace = null;
    nativeARSession = null;
    isNativeARActive = false;
    if (reticleMesh) reticleMesh.visible = true;
  }

  function setupTourSwitchers() {
    const pills = document.querySelectorAll('.tour-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const key = pill.getAttribute('data-tour');
        if (key && TOUR_DATA[key]) {
          activeTourKey = key;
          loadTourSceneData(key, 0);
          let existing = placedPortals.find(p => p.tourKey === key);
          if (!existing) {
            existing = spawnFloorPortal(key, new THREE.Vector3(0, 0, -2.0));
          }
          activePortalObj = existing;

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

  // WebAR Camera Mode Setup & Portfolio Card Launchers
  function setupWebARMode() {
    const arOverlay = document.getElementById('webarOverlay');
    const btnCloseAR = document.getElementById('btnCloseAR');

    document.querySelectorAll('.btn-launch-ar').forEach(btn => {
      btn.addEventListener('click', () => {
        launchARCameraForTour(activeTourKey);
      });
    });

    const btnPlacePortal = document.getElementById('btnARPlacePortal');
    if (btnPlacePortal) btnPlacePortal.addEventListener('click', (event) => {
      event.stopPropagation();
      placePortalAtReticle();
    });

    const btnARStepInside = document.getElementById('btnARStepInside');
    if (btnARStepInside) btnARStepInside.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!activePortalObj) placePortalAtReticle();
      setPortalInsideState(!isInsidePortal);
      haptic(isInsidePortal ? [12, 40, 20] : 12);
      setARState(isInsidePortal ? 'inside' : 'placed');
    });

    const btnARReposition = document.getElementById('btnARReposition');
    if (btnARReposition) btnARReposition.addEventListener('click', (event) => {
      event.stopPropagation();
      setPortalInsideState(false);
      haptic(8);
      setARState('scanning', 'Aim at a clear patch of floor, then place it again.');
    });

    const btnARStartCamera = document.getElementById('btnARStartCamera');
    if (btnARStartCamera) btnARStartCamera.addEventListener('click', (event) => {
      event.stopPropagation();
      btnARStartCamera.hidden = true;
      setARState('starting');
      startCameraPreview();
    });

    // Permission priming sheet
    const btnPrimeStart = document.getElementById('btnARPrimeStart');
    if (btnPrimeStart) btnPrimeStart.addEventListener('click', (event) => {
      event.stopPropagation();
      beginARSession();
    });
    const btnPrimeCancel = document.getElementById('btnARPrimeCancel');
    if (btnPrimeCancel) btnPrimeCancel.addEventListener('click', (event) => {
      event.stopPropagation();
      closeSheet('arPrimeSheet');
      closeARExperience();
    });

    // Scene sheet — deliberately opened rather than a permanent strip of pills
    const btnScenes = document.getElementById('btnARScenes');
    if (btnScenes) btnScenes.addEventListener('click', (event) => {
      event.stopPropagation();
      openSheet('arSceneSheet');
    });
    const btnSceneClose = document.getElementById('btnARSceneClose');
    if (btnSceneClose) btnSceneClose.addEventListener('click', (event) => {
      event.stopPropagation();
      closeSheet('arSceneSheet');
    });
    // Tapping the dimmed backdrop closes either sheet.
    ['arSceneSheet', 'arPrimeSheet'].forEach(id => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.addEventListener('click', (event) => {
        if (event.target !== sheet) return;
        if (id === 'arPrimeSheet') { closeSheet(id); closeARExperience(); }
        else closeSheet(id);
      });
    });

    // Attach to all portfolio card "Launch AR Portal" buttons
    document.querySelectorAll('.btn-launch-ar-tour').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-tour-key');
        if (key) launchARCameraForTour(key);
      });
    });

    if (btnCloseAR) btnCloseAR.addEventListener('click', closeARExperience);

    // Escape is the expected way out of a fullscreen layer on any device
    // that has a keyboard attached.
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const overlay = document.getElementById('webarOverlay');
      if (!overlay || !overlay.classList.contains('active')) return;
      const scenes = document.getElementById('arSceneSheet');
      if (scenes && scenes.classList.contains('is-open')) closeSheet('arSceneSheet');
      else closeARExperience();
    });
  }

  // Tear the session down and hand the canvas back to the on-page simulator.
  function closeARExperience() {
    const arOverlay = document.getElementById('webarOverlay');

    if (isEighthWallActive && window.XR8) {
      try { window.XR8.pause(); } catch (e) { /* never started */ }
      isEighthWallActive = false;
    }
    if (nativeARSession) {
      try { nativeARSession.end(); } catch (e) { /* already ended */ }
    }
    if (arVideoStream) {
      arVideoStream.getTracks().forEach(track => track.stop());
      arVideoStream = null;
    }
    const arVideo = document.getElementById('webarVideo');
    if (arVideo) arVideo.srcObject = null;

    if (canvasContainer && arCanvas) {
      canvasContainer.appendChild(arCanvas);
      arCanvas.classList.remove('ar-camera-mode');
      isCameraARActive = false;
      isInsidePortal = false;

      if (renderer) {
        renderer.xr.enabled = false;
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
      }
      if (camera) {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
      }
    }

    closeSheet('arSceneSheet');
    closeSheet('arPrimeSheet');
    const startButton = document.getElementById('btnARStartCamera');
    if (startButton) startButton.hidden = true;
    if (arOverlay) arOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setARState('priming');
  }

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

    // QR Code Modal
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
