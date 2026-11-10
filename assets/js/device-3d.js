/**
 * SOUNDBRIDGE SPEECH & HEARING CLINIC — 3D HEARING DEVICE EXPLORER
 * Interactive 3D Receiver-In-Canal (RIC) Hearing Aid with drag-to-rotate,
 * auto-rotation, 3D hotspots projected to screen coordinates, and feature focus.
 */

(function () {
  'use strict';

  const container = document.getElementById('device-3d-viewport');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer, controls;
  let deviceGroup, hotspotObjects = [];
  let isDragging = false;
  let autoRotate = true;
  let width = container.clientWidth;
  let height = container.clientHeight;
  let isVisible = true;

  // Hotspots definition (Local 3D coordinates on the model)
  const hotspotsData = [
    {
      id: 'mic',
      pos: new THREE.Vector3(0, 1.35, 0.45),
      title: 'Dual Micro-Directional Mics',
      desc: 'Precision spatial capture focusing on human speech while reducing ambient noise.'
    },
    {
      id: 'dsp',
      pos: new THREE.Vector3(0, 0.1, 0.55),
      title: 'Advanced Digital Audio Processor',
      desc: 'High-speed signal processing with real-time acoustic classification.'
    },
    {
      id: 'dome',
      pos: new THREE.Vector3(1.8, -0.4, 0.2),
      title: 'Medical-Grade Silicone Dome',
      desc: 'Soft, breathable ergonomic fit engineered for all-day comfort.'
    },
    {
      id: 'battery',
      pos: new THREE.Vector3(0, -1.2, 0.1),
      title: 'Rechargeable Power Cell',
      desc: 'Lithium-ion fast wireless charging with 24+ hours of continuous listening.'
    },
    {
      id: 'wireless',
      pos: new THREE.Vector3(0, 0.8, -0.3),
      title: 'Direct Wireless Streaming',
      desc: 'Crystal-clear Bluetooth audio streaming from smartphones and TVs.'
    }
  ];

  init();
  animate();

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0.4, 0.05, 5.6);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0.4, 0.05, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = window.innerWidth > 768;
      controls.minDistance = 3.2;
      controls.maxDistance = 9;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.minPolarAngle = Math.PI * 0.15;

      controls.addEventListener('start', () => { isDragging = true; autoRotate = false; });
      controls.addEventListener('end', () => {
        isDragging = false;
        // Resume auto-rotation after 4 seconds of inactivity
        setTimeout(() => { if (!isDragging) autoRotate = true; }, 4000);
      });
    }

    adjustCameraForViewport();
    setupLighting();
    buildHearingDeviceModel();
    setupHotspotsHUD();

    window.addEventListener('resize', onWindowResize, false);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);
  }

  function setupLighting() {
    const ambient = new THREE.AmbientLight(0x0A1C2C, 2.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xEAF8FC, 2.8);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x7DD9EA, 3.5);
    cyanRim.position.set(-6, -4, 5);
    scene.add(cyanRim);

    const blueBack = new THREE.DirectionalLight(0x0284C7, 2.0);
    blueBack.position.set(0, -6, -5);
    scene.add(blueBack);
  }

  /**
   * Anatomical Receiver-In-Canal (RIC) Hearing Device Model
   */
  function buildHearingDeviceModel() {
    deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 1. Main Capsule (Ergonomically contoured body)
    // Create an elegant curved spline for the behind-the-ear chassis
    const bodyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0.05, 0.7, 0.25),
      new THREE.Vector3(0, -0.3, 0.35),
      new THREE.Vector3(-0.05, -1.0, 0.15),
      new THREE.Vector3(0, -1.3, -0.05)
    ]);

    const bodyGeo = new THREE.TubeGeometry(bodyCurve, 64, 0.42, 32, false);
    
    // Scale body thickness laterally for realistic ear-contour profile
    const pos = bodyGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = i / pos.count;
      // Thinner at apex, broader in mid-chassis
      const taper = 0.75 + 0.35 * Math.sin(u * Math.PI);
      pos.setX(i, pos.getX(i) * 0.75 * taper);
      pos.setZ(i, pos.getZ(i) * taper);
    }
    bodyGeo.computeVertexNormals();

    const chassisMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0E2638,
      emissive: 0x041320,
      roughness: 0.22,
      metalness: 0.85,
      clearcoat: 0.95,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMaterial);
    deviceGroup.add(bodyMesh);

    // 2. Titanium Accent Trim Spine
    const trimCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.35, 0.42),
      new THREE.Vector3(0, 0.6, 0.58),
      new THREE.Vector3(0, -0.3, 0.65),
      new THREE.Vector3(0, -1.0, 0.45)
    ]);
    const trimGeo = new THREE.TubeGeometry(trimCurve, 40, 0.05, 16, false);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x7DD9EA,
      metalness: 0.95,
      roughness: 0.2
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    deviceGroup.add(trimMesh);

    // 3. Dual Microphone Grilles
    const micGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
    const micMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9, roughness: 0.4 });
    
    const mic1 = new THREE.Mesh(micGeo, micMat);
    mic1.rotation.x = Math.PI * 0.5;
    mic1.position.set(0, 1.3, 0.4);
    deviceGroup.add(mic1);

    const mic2 = new THREE.Mesh(micGeo, micMat);
    mic2.rotation.x = Math.PI * 0.5;
    mic2.position.set(0, 0.9, 0.52);
    deviceGroup.add(mic2);

    // 4. Slender Acoustic Receiver Wire (Curves towards ear canal)
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0.5, 1.5, -0.1),
      new THREE.Vector3(1.2, 1.0, 0.1),
      new THREE.Vector3(1.6, 0.2, 0.15),
      new THREE.Vector3(1.8, -0.3, 0.2)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 50, 0.045, 16, false);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xC0D6DF,
      metalness: 0.9,
      roughness: 0.15
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    deviceGroup.add(wireMesh);

    // 5. In-Ear Receiver Speaker Unit
    const speakerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 20);
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x223240, metalness: 0.8, roughness: 0.3 });
    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.rotation.z = Math.PI * 0.4;
    speakerMesh.position.set(1.7, -0.35, 0.18);
    deviceGroup.add(speakerMesh);

    // 6. Translucent Medical-Grade Silicone Ear Dome
    const domeGeo = new THREE.SphereGeometry(0.28, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0xEAF8FC,
      roughness: 0.1,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.rotation.z = -Math.PI * 0.6;
    domeMesh.position.set(1.95, -0.45, 0.22);
    deviceGroup.add(domeMesh);

    // 7. Gold Magnetic Charging Contacts
    const contactGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.95, roughness: 0.15 });
    
    const contact1 = new THREE.Mesh(contactGeo, goldMat);
    contact1.position.set(0.1, -1.28, 0);
    deviceGroup.add(contact1);

    const contact2 = new THREE.Mesh(contactGeo, goldMat);
    contact2.position.set(-0.1, -1.28, 0);
    deviceGroup.add(contact2);

    // Center and tilt whole device for signature aesthetic presentation
    deviceGroup.rotation.y = -Math.PI * 0.25;
    deviceGroup.rotation.z = Math.PI * 0.05;
  }

  /**
   * Screen-projected Hotspot Pins HUD
   */
  function setupHotspotsHUD() {
    const hudContainer = document.getElementById('device-hotspot-hud');
    if (!hudContainer) return;

    hotspotsData.forEach((item, index) => {
      const pin = document.createElement('div');
      pin.className = 'hotspot-pin';
      pin.id = `hotspot-${item.id}`;
      pin.setAttribute('data-id', item.id);
      pin.innerHTML = `
        <div class="hotspot-dot"></div>
        <div class="hotspot-ripple"></div>
        <div class="hotspot-tooltip">
          <strong>${item.title}</strong>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        focusOnHotspot(item);
      });

      hudContainer.appendChild(pin);
      hotspotObjects.push({ element: pin, data: item });
    });

    // Also link feature list items in DOM
    const featureItems = document.querySelectorAll('.solution-feature-item');
    featureItems.forEach(card => {
      const targetId = card.getAttribute('data-target');
      card.addEventListener('click', () => {
        const targetData = hotspotsData.find(h => h.id === targetId);
        if (targetData) focusOnHotspot(targetData);
      });
    });
  }

  function focusOnHotspot(item) {
    autoRotate = false;
    // Highlight feature card
    document.querySelectorAll('.solution-feature-item').forEach(c => c.classList.remove('active-feature'));
    const matchingCard = document.querySelector(`.solution-feature-item[data-target="${item.id}"]`);
    if (matchingCard) matchingCard.classList.add('active-feature');

    // Smoothly animate device rotation to feature angle
    const targetY = -Math.atan2(item.pos.z, item.pos.x) + Math.PI * 0.5;
    deviceGroup.rotation.y = targetY;
  }

  function updateHotspotsScreenPositions() {
    if (!deviceGroup) return;

    hotspotObjects.forEach(hp => {
      // Convert local coordinate to world coordinate
      const worldPos = hp.data.pos.clone().applyMatrix4(deviceGroup.matrixWorld);

      // Project 3D vector to 2D normalized device coordinates (-1 to +1)
      const screenPos = worldPos.clone().project(camera);

      // Only display if point is in front of camera
      if (screenPos.z < 1) {
        const x = (screenPos.x * 0.5 + 0.5) * width;
        const y = (-screenPos.y * 0.5 + 0.5) * height;

        hp.element.style.left = `${x}px`;
        hp.element.style.top = `${y}px`;
        hp.element.style.display = 'block';
      } else {
        hp.element.style.display = 'none';
      }
    });
  }

  function adjustCameraForViewport() {
    const aspect = width / height;
    if (aspect < 1.05) {
      // Narrow mobile viewport: pull back so entire device is framed
      camera.position.z = 7.4;
      camera.fov = 42;
    } else if (aspect < 1.35) {
      // Tablet viewport
      camera.position.z = 6.4;
      camera.fov = 40;
    } else {
      // Desktop widescreen
      camera.position.z = 5.6;
      camera.fov = 38;
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function onWindowResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    adjustCameraForViewport();
    if (controls) controls.enableZoom = window.innerWidth > 768;
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    if (controls) controls.update();

    if (autoRotate && deviceGroup) {
      deviceGroup.rotation.y += 0.005;
      deviceGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.08;
    }

    updateHotspotsScreenPositions();

    renderer.render(scene, camera);
  }
})();
