/**
 * SOUNDBRIDGE SPEECH & HEARING CLINIC — AUDIO VISUALIZER & WEB AUDIO ENGINE
 * Multi-canvas acoustic resonance visualizers, soundbridge wave track,
 * service panel waveforms, and optional therapeutic Web Audio API engine.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let analyser = null;
  let isSoundPlaying = false;
  let osc1 = null, osc2 = null, osc3 = null;

  // Visualizer Canvases
  const editorialCanvas = document.getElementById('editorial-canvas');
  const soundbridgeCanvas = document.getElementById('soundbridge-canvas');
  const techCanvas = document.getElementById('tech-freq-canvas');
  const serviceCanvases = document.querySelectorAll('.service-waveform-canvas');

  // Animation Timers
  let time = 0;

  // Initialize Audio Visualizers
  initVisualizers();
  setupAudioToggle();

  function initVisualizers() {
    renderEditorialVisualizer();
    renderSoundbridgeCanvas();
    renderServicePanelWaveforms();
    animateLoop();
  }

  /**
   * 1. Editorial Introduction Frequency Analyzer Canvas
   */
  function renderEditorialVisualizer() {
    if (!editorialCanvas) return;
    const ctx = editorialCanvas.getContext('2d');
    const width = (editorialCanvas.width = editorialCanvas.clientWidth * 2);
    const height = (editorialCanvas.height = editorialCanvas.clientHeight * 2);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(125, 217, 234, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Frequency Bars or Waveform
      const bars = 48;
      const barWidth = (width / bars) * 0.7;
      const gap = (width / bars) * 0.3;

      for (let i = 0; i < bars; i++) {
        const u = i / bars;
        // Speech resonance curve: peaks around 1kHz - 3kHz (human speech band)
        const speechEnvelope = Math.sin(u * Math.PI) * (1.0 + 0.4 * Math.sin(u * Math.PI * 4));
        const dynamicNoise = Math.sin(time * 3 + i * 0.4) * 0.3 + Math.cos(time * 2 + i * 0.6) * 0.2;
        const barHeight = Math.max(8, (speechEnvelope + dynamicNoise) * (height * 0.42));

        const x = i * (barWidth + gap);
        const y = height * 0.5 - barHeight * 0.5;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#7DD9EA');
        grad.addColorStop(0.5, '#38BDF8');
        grad.addColorStop(1, '#0284C7');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Center Overlay Speech Formant Wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      for (let x = 0; x < width; x += 4) {
        const normX = x / width;
        const wave = Math.sin(normX * 18 + time * 4) * Math.cos(normX * 8 - time * 2) * (height * 0.18);
        const y = height * 0.5 + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    draw();
    editorialCanvas.drawFrame = draw;
  }

  /**
   * 2. The SoundBridge Acoustic Bridge Canvas
   * A thin wave on the left develops into a continuous luminous bridge across
   */
  function renderSoundbridgeCanvas() {
    if (!soundbridgeCanvas) return;
    const ctx = soundbridgeCanvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = soundbridgeCanvas.getBoundingClientRect();
      const cssW = rect.width || soundbridgeCanvas.clientWidth || 800;
      const cssH = rect.height || soundbridgeCanvas.clientHeight || 130;
      width = soundbridgeCanvas.width = Math.round(cssW * dpr);
      height = soundbridgeCanvas.height = Math.round(cssH * dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (width === 0 || height === 0) resize();
      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const midY = height * 0.52;

      // Font size responsive to canvas resolution
      const fontSize = width > 1600 ? 24 : (width > 900 ? 21 : 17);
      ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

      // Measure exact pixel width of 'CONNECTION'
      const connMetrics = ctx.measureText('CONNECTION');
      const connHalfW = connMetrics.width / 2;

      // Safe horizontal padding ensuring 'CONNECTION' is never clipped at canvas right edge
      const padX = Math.max(Math.ceil(connHalfW + 30 * dpr), Math.round(75 * dpr));
      const startX = padX;
      const endX = width - padX;
      const span = endX - startX;

      // Base Guide Line spanning exactly from SOUND to CONNECTION
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(125, 217, 234, 0.16)';
      ctx.lineWidth = Math.max(1, Math.round(1 * dpr));
      ctx.moveTo(startX, midY);
      ctx.lineTo(endX, midY);
      ctx.stroke();

      // SoundBridge Transition Waves (Left: scattered waves -> Right: smooth harmonic bridge)
      for (let waveIdx = 0; waveIdx < 3; waveIdx++) {
        ctx.beginPath();
        const alpha = 0.85 - waveIdx * 0.25;
        ctx.strokeStyle = `rgba(125, 217, 234, ${alpha})`;
        ctx.lineWidth = (2.4 - waveIdx * 0.5) * (dpr * 0.8);

        const step = Math.max(2, Math.round(3 * dpr * 0.5));
        for (let x = startX; x <= endX; x += step) {
          const progress = (x - startX) / span; // 0 to 1
          
          // Modulation: high jitter and variance at start, smoothly harmonizing in middle, steady bridge at end
          const harmonic = Math.sin(progress * 14 + time * 3 + waveIdx) * (1 - progress * 0.85);
          const arch = -Math.sin(progress * Math.PI) * (height * 0.32);
          const y = midY + arch + harmonic * (20 * (dpr * 0.65));

          if (x === startX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Bridge Anchor Nodes (Technology Node & Connection Node)
      const apexY = midY - (height * 0.32);
      drawNode(ctx, startX, midY, 'SOUND', fontSize, dpr);
      drawNode(ctx, width * 0.5, apexY, 'SOUNDBRIDGE', fontSize, dpr, true);
      drawNode(ctx, endX, midY, 'CONNECTION', fontSize, dpr);
    }

    function drawNode(ctx, x, y, label, fontSize, dpr, isApex = false) {
      const radius = 5.5 * dpr;

      // Subtle breathing pulse ring
      ctx.beginPath();
      const ringPulse = radius + (3 + Math.sin(time * 3) * 1.5) * dpr;
      ctx.arc(x, y, ringPulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(125, 217, 234, 0.3)';
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // Core luminous dot
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#7DD9EA';
      ctx.shadowColor = '#7DD9EA';
      ctx.shadowBlur = 12 * dpr;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label typography with guaranteed bounds
      ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#EAF8FC';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const textY = y + radius + (8 * dpr);
      ctx.fillText(label, x, textY);
    }

    draw();
    soundbridgeCanvas.drawFrame = draw;
  }

  /**
   * 3. Service Panel Individual Micro-Waveforms
   */
  function renderServicePanelWaveforms() {
    serviceCanvases.forEach((canvas, idx) => {
      const ctx = canvas.getContext('2d');
      const w = (canvas.width = canvas.clientWidth * 2 || 200);
      const h = (canvas.height = canvas.clientHeight * 2 || 60);

      canvas.drawFrame = function () {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.strokeStyle = '#7DD9EA';
        ctx.lineWidth = 2;

        const freq = 6 + idx * 2;
        const phase = time * 3 + idx;

        for (let x = 0; x < w; x += 3) {
          const u = x / w;
          const envelope = Math.sin(u * Math.PI); // tapered at ends
          const y = (h * 0.5) + Math.sin(u * freq + phase) * (h * 0.35 * envelope);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
    });
  }

  /**
   * Continuous Animation Loop for Canvases
   */
  function animateLoop() {
    time += 0.02;

    if (editorialCanvas && editorialCanvas.drawFrame) editorialCanvas.drawFrame();
    if (soundbridgeCanvas && soundbridgeCanvas.drawFrame) soundbridgeCanvas.drawFrame();
    serviceCanvases.forEach(canvas => {
      if (canvas.drawFrame) canvas.drawFrame();
    });

    requestAnimationFrame(animateLoop);
  }

  /**
   * 4. Optional Therapeutic Sound Experience (Web Audio API)
   * Plays a calm, binaural 432 Hz healing harmonic sound chord with pure sines
   */
  function setupAudioToggle() {
    const toggleBtns = document.querySelectorAll('.audio-toggle-btn');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isSoundPlaying) {
          startSound();
          toggleBtns.forEach(b => {
            b.classList.add('active');
            b.classList.remove('audio-highlight');
          });
        } else {
          stopSound();
          toggleBtns.forEach(b => b.classList.remove('active'));
        }
      });
    });
  }

  function startSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.2);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);

      masterGain.connect(filter);
      filter.connect(audioCtx.destination);

      // 432 Hz Root (Crystalline Therapeutic Tone)
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, audioCtx.currentTime);
      osc1.connect(masterGain);
      osc1.start();

      // 528 Hz Harmonic (Solfeggio Resonance)
      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(528, audioCtx.currentTime);
      const gain2 = audioCtx.createGain();
      gain2.gain.value = 0.4;
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();

      // 216 Hz Warm Sub-harmonic
      osc3 = audioCtx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(216, audioCtx.currentTime);
      const gain3 = audioCtx.createGain();
      gain3.gain.value = 0.3;
      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start();

      isSoundPlaying = true;
    } catch (e) {
      console.warn('Web Audio not allowed or supported', e);
    }
  }

  function stopSound() {
    if (audioCtx && masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      setTimeout(() => {
        if (osc1) { osc1.stop(); osc1.disconnect(); }
        if (osc2) { osc2.stop(); osc2.disconnect(); }
        if (osc3) { osc3.stop(); osc3.disconnect(); }
        isSoundPlaying = false;
      }, 600);
    }
  }
})();
