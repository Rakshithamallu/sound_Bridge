/**
 * SOUNDBRIDGE SPEECH & HEARING CLINIC — CUSTOM CURSOR
 * Minimalist luxury cursor with micro-interactions and sound wave mode.
 */

(function () {
  'use strict';

  // Disable on mobile or touch devices
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) {
    return;
  }

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth lagging ring loop
  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(loop);
  }
  loop();

  // Micro-interaction hover states
  const interactives = 'a, button, input, select, textarea, .service-panel, .gallery-item, .journey-node-item, .hotspot-pin';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.add('hovering');
    }
    if (e.target.closest('#hero-3d-canvas-container')) {
      ring.classList.add('sound-mode');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.remove('hovering');
    }
    if (e.target.closest('#hero-3d-canvas-container')) {
      ring.classList.remove('sound-mode');
    }
  });
})();
