/**
 * SOUNDBRIDGE SPEECH & HEARING CLINIC — 3D HERO EXPERIENCE
 * Concept: SOUND → HEARING → UNDERSTANDING → CONNECTION
 * Anatomical cochlea & inner-ear sculpture, flowing acoustic particles,
 * resonant waveforms, cinematic mouse parallax, and scroll depth.
 */

(function () {
  'use strict';

  const container = document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  let scene, camera, renderer;
  let cochleaMesh, outerEarRibbons = [], waveRings = [];
  let soundWaveGroup, earMasterGroup;
  let width = container.clientWidth;
  let height = container.clientHeight;

  // Mouse & Scroll State
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollProgress = 0;
  let isVisible = true;
  let clock = new THREE.Clock();

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check WebGL support
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    container.innerHTML = '<div class="hero-webgl-fallback"></div>';
    return;
  }

  init();
  animate();

  function init() {
    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071521, 0.035);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Master Groups
    earMasterGroup = new THREE.Group();
    soundWaveGroup = new THREE.Group();
    scene.add(earMasterGroup);
    scene.add(soundWaveGroup);

    // 5. Lighting
    setupLighting();

    // 6. Build 3D Inner-Ear & Cochlea Structure
    buildCochleaStructure();

    // 7. Build Auricular Translucent Ribbons (Outer Ear Guidance)
    buildAcousticRibbons();

    // 8. Build Resonant Wave Rings
    buildWaveRings();

    // 9. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Intersection Observer to pause rendering when hero is not visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  }

  function setupLighting() {
    // Ambient soft blue fill
    const ambientLight = new THREE.AmbientLight(0x0a1d2e, 1.8);
    scene.add(ambientLight);

    // Key Light: Pure Crisp White/Cyan
    const keyLight = new THREE.DirectionalLight(0xEAF8FC, 2.4);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    // Fill Light: Soft Electric Cyan
    const fillLight = new THREE.DirectionalLight(0x7DD9EA, 3.2);
    fillLight.position.set(-10, -6, 8);
    scene.add(fillLight);

    // Rim / Backlight: Deep Sky Glow
    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.8);
    rimLight.position.set(0, -10, -8);
    scene.add(rimLight);

    // Center Point Glow
    const centerPoint = new THREE.PointLight(0x7DD9EA, 2, 12);
    centerPoint.position.set(0, 0, 2);
    earMasterGroup.add(centerPoint);
  }

  /**
   * Anatomical Cochlear Logarithmic Spiral Sculpture
   * Mathematically generates the 2.75 helical spiral of the human cochlea
   */
  function buildCochleaStructure() {
    class CochleaSpiralCurve extends THREE.Curve {
      constructor(scale = 2.4) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        // Cochlear spiral formula: logarithmic radius tapering from base to apex
        const turns = 2.75 * Math.PI * 2;
        const theta = t * turns;
        const decay = Math.exp(-0.35 * theta);
        const radius = (2.2 * decay + 0.25) * this.scale;
        const height = (1.4 * (1.0 - t) - 0.7) * this.scale;

        const x = radius * Math.cos(theta) * 0.85;
        const y = height + 0.3 * Math.sin(theta * 0.5);
        const z = radius * Math.sin(theta) * 0.85;

        return new THREE.Vector3(x, y, z);
      }
    }

    const curve = new CochleaSpiralCurve(1.6);
    // Tube geometry along cochlear curve with 120 segments and radial segments
    const tubeGeo = new THREE.TubeGeometry(curve, 140, 0.42, 28, false);

    // Custom vertex deformation for natural biological taper
    const pos = tubeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = i / pos.count;
      const taper = 1.0 - (u * 0.65);
      pos.setX(i, pos.getX(i) * taper);
      pos.setY(i, pos.getY(i) * taper);
      pos.setZ(i, pos.getZ(i) * taper);
    }
    tubeGeo.computeVertexNormals();

    // Luxury Medical-Tech Iridescent Material
    const cochleaMat = new THREE.MeshPhysicalMaterial({
      color: 0xDDF3FA,
      emissive: 0x052236,
      roughness: 0.15,
      metalness: 0.82,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.2, // Subtle glass-like subsurface depth
      transparent: true,
      opacity: 0.94
    });

    cochleaMesh = new THREE.Mesh(tubeGeo, cochleaMat);
    cochleaMesh.rotation.x = Math.PI * 0.2;
    cochleaMesh.rotation.y = -Math.PI * 0.15;
    cochleaMesh.position.set(0.6, 0.2, 0);

    earMasterGroup.add(cochleaMesh);

    // Inner Acoustic Modiolus (Central Core)
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.45, 2.2, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7DD9EA,
      emissive: 0x0C334A,
      roughness: 0.3,
      metalness: 0.7
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.rotation.x = Math.PI * 0.2;
    coreMesh.position.set(0.6, 0.2, 0);
    earMasterGroup.add(coreMesh);
  }

  /**
   * Translucent Auricular / Acoustic Ribbons
   * Simulates the elegant organic curves of the human pinna / auditory helix
   */
  function buildAcousticRibbons() {
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x7DD9EA,
      emissive: 0x071521,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    // Create 3 flowing acoustic ribbons
    for (let r = 0; r < 3; r++) {
      const points = [];
      const count = 60;
      const angleOffset = r * 0.7;
      const radiusBase = 2.6 + r * 0.5;

      for (let i = 0; i <= count; i++) {
        const p = i / count;
        const angle = p * Math.PI * 1.6 + angleOffset;
        const rad = radiusBase * (0.8 + 0.3 * Math.sin(p * Math.PI));
        const x = Math.cos(angle) * rad - 0.2;
        const y = (p - 0.5) * 4.2;
        const z = Math.sin(angle) * rad * 0.6;
        points.push(new THREE.Vector3(x, y, z));
      }

      const ribbonCurve = new THREE.CatmullRomCurve3(points);
      const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 80, 0.08 - r * 0.015, 12, false);
      const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMaterial.clone());
      ribbonMesh.material.opacity = 0.4 - r * 0.08;
      outerEarRibbons.push(ribbonMesh);
      earMasterGroup.add(ribbonMesh);
    }
  }

  /**
   * Resonant Waveform Rings (Concentric Soundwaves)
   */
  function buildWaveRings() {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7DD9EA,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    });

    for (let i = 0; i < 4; i++) {
      const radius = 3.2 + i * 1.1;
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.04, 64);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat.clone());
      ringMesh.rotation.x = Math.PI * 0.5;
      ringMesh.position.y = -0.5 + i * 0.15;
      ringMesh.userData = { initialRadius: radius, phase: i * 0.8 };
      waveRings.push(ringMesh);
      soundWaveGroup.add(ringMesh);
    }
  }

  function onMouseMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    scrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1.5);
  }

  function onWindowResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth Mouse Damping (Cinematic Easing)
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // 1. Slow, Luxurious Ear Floating & Subtle Breathing Pulse
    if (earMasterGroup) {
      // Gentle breathing pulse
      const breathe = 1.0 + Math.sin(elapsedTime * 1.2) * 0.025;
      earMasterGroup.scale.set(breathe, breathe, breathe);

      // Slow floating rotation
      if (!prefersReducedMotion) {
        earMasterGroup.rotation.y = 0.25 * Math.sin(elapsedTime * 0.3) + (mouse.x * 0.35);
        earMasterGroup.rotation.x = 0.15 * Math.cos(elapsedTime * 0.25) + (-mouse.y * 0.25);
        earMasterGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.25;
      }

      // Scroll-depth reaction: Ear moves backward into depth as user scrolls
      const scrollDepthZ = -scrollProgress * 9.0;
      const scrollYOffset = -scrollProgress * 3.5;
      earMasterGroup.position.z = scrollDepthZ;
      earMasterGroup.position.y += scrollYOffset;
      earMasterGroup.rotation.y += scrollProgress * 0.6;
    }

    // 2. Ribbons Subtle Harmonic Undulation
    outerEarRibbons.forEach((ribbon, index) => {
      if (!prefersReducedMotion) {
        ribbon.rotation.z = Math.sin(elapsedTime * 0.4 + index) * 0.05;
        ribbon.rotation.y = Math.cos(elapsedTime * 0.35 + index * 0.5) * 0.06;
      }
    });

    // 3. Resonant Wave Rings Expansion
    waveRings.forEach((ring) => {
      const u = (elapsedTime * 0.6 + ring.userData.phase) % 3.0;
      const scale = 1.0 + (u / 3.0) * 0.4;
      ring.scale.set(scale, scale, 1);
      ring.material.opacity = Math.max(0, 0.3 * (1.0 - (u / 3.0)));
    });

    // Camera travel through soundwaves during scroll
    camera.position.z = 15 - (scrollProgress * 4.0);
    camera.lookAt(0, -scrollProgress * 2.0, 0);

    renderer.render(scene, camera);
  }
})();
