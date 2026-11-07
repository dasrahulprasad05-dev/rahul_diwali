// Ultra High-Performance Fireworks Engine for Diwali Celebration
// Optimized for 60 FPS locked on Android & mobile devices

const COLORS = {
  gold: '#FFD700',
  orange: '#FFA500',
  red: '#FF4444',
  white: '#FFFFFF',
  pink: '#FF69B4',
  deepOrange: '#FF6B35',
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  amber: '#FFC107',
  lime: '#AAFF00',
  cyan: '#00FFFF',
};

const COLOR_PALETTES = [
  [COLORS.gold, COLORS.orange, COLORS.yellow, COLORS.white],
  [COLORS.red, COLORS.orange, COLORS.pink, COLORS.gold],
  [COLORS.pink, COLORS.magenta, COLORS.white, COLORS.gold],
  [COLORS.gold, COLORS.white, COLORS.amber, COLORS.yellow],
  [COLORS.red, COLORS.gold, COLORS.orange, COLORS.white],
  [COLORS.deepOrange, COLORS.gold, COLORS.red, COLORS.yellow],
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ─── Fast Explosion Particle ─────────────────────────────────
class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.alpha = options.alpha !== undefined ? options.alpha : 1;
    this.color = options.color || COLORS.gold;
    this.size = options.size || 2.5;
    this.gravity = options.gravity || 0.06;
    this.decay = options.decay || randomRange(0.012, 0.024);
    this.friction = options.friction || 0.97;
    this.type = options.type || 'explosion'; // 'rocket', 'explosion', 'sparkle', 'confetti'

    // Confetti-specific properties
    if (this.type === 'confetti') {
      this.width = options.width || 8;
      this.height = options.height || 12;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = randomRange(-0.1, 0.1);
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = randomRange(0.08, 0.16);
    }
  }

  update() {
    this.prevX = this.x;
    this.prevY = this.y;

    if (this.type === 'confetti') {
      this.wobble += this.wobbleSpeed;
      this.vx += Math.sin(this.wobble) * 0.1;
      this.vx *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
      return this.alpha > 0.02;
    }

    // Standard particle physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    this.alpha -= this.decay;
    return this.alpha > 0.02;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    if (this.type === 'confetti') {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const w = this.width * Math.abs(Math.cos(this.wobble));
      ctx.fillRect(-w * 0.5, -this.height * 0.5, Math.max(1, w), this.height);
      ctx.restore();
      return;
    }

    // High-performance line streak (motion blur)
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.max(1, this.size * this.alpha);

    ctx.beginPath();
    ctx.moveTo(this.prevX, this.prevY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // Spark head
    if (this.alpha > 0.4) {
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = this.alpha * 0.6;
      ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
    }
  }
}

// ─── Firework (Rocket + Burst) ──────────────────────────────
class Firework {
  constructor(startX, startY, targetX, targetY, isMobile = false) {
    this.particles = [];
    this.phase = 'rocket';
    this.done = false;
    this.isMobile = isMobile;

    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;

    this.palette = randomFromArray(COLOR_PALETTES);

    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = randomRange(13, 17);

    this.rocket = new Particle(startX, startY, {
      vx: Math.cos(angle) * speed * 0.25 + randomRange(-0.4, 0.4),
      vy: -speed,
      color: randomFromArray(this.palette),
      size: 3.5,
      gravity: 0.05,
      decay: 0,
      friction: 0.99,
      type: 'rocket',
    });

    this.trailTimer = 0;
    this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
  }

  update() {
    if (this.phase === 'rocket') {
      this.rocket.update();

      // Emit rocket trail sparks efficiently
      this.trailTimer++;
      const sparkFreq = this.isMobile ? 4 : 2;
      if (this.trailTimer % sparkFreq === 0) {
        this.particles.push(
          new Particle(this.rocket.x, this.rocket.y, {
            vx: randomRange(-0.8, 0.8),
            vy: randomRange(0.5, 2.5),
            color: '#FFD700',
            size: randomRange(1, 2.5),
            gravity: 0.04,
            decay: randomRange(0.04, 0.08),
            friction: 0.94,
            type: 'sparkle',
          })
        );
      }

      const distMoved = Math.hypot(this.rocket.x - this.startX, this.rocket.y - this.startY);
      if (
        this.rocket.vy >= -2 ||
        distMoved >= this.distanceToTarget * 0.88 ||
        this.rocket.y <= this.targetY
      ) {
        this.explode();
      }
    }

    // Fast particle update
    let active = 0;
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].update()) {
        this.particles[active++] = this.particles[i];
      }
    }
    this.particles.length = active;

    if (this.phase === 'explosion' && this.particles.length === 0) {
      this.done = true;
    }
  }

  explode() {
    this.phase = 'explosion';
    const x = this.rocket.x;
    const y = this.rocket.y;

    // Mobile-optimized particle count
    const baseCount = this.isMobile ? randomRange(35, 45) : randomRange(55, 75);
    const numParticles = Math.floor(baseCount);
    const pattern = Math.floor(Math.random() * 3);

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 * i) / numParticles + randomRange(-0.08, 0.08);
      let speed;

      switch (pattern) {
        case 0: // Sphere burst
          speed = randomRange(2.5, 7.5);
          break;
        case 1: // Ring burst
          speed = randomRange(4.5, 6.5);
          break;
        case 2: // Dual-velocity burst
          speed = i % 2 === 0 ? randomRange(2.5, 4.5) : randomRange(5.5, 8);
          break;
        default:
          speed = randomRange(2.5, 7.5);
      }

      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: randomFromArray(this.palette),
          size: randomRange(2, 4),
          gravity: randomRange(0.04, 0.07),
          decay: randomRange(0.012, 0.022),
          friction: 0.975,
          type: 'explosion',
        })
      );
    }

    // White core sparks (creates brilliant center flash)
    const flashCount = this.isMobile ? 6 : 10;
    for (let i = 0; i < flashCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(0.5, 2.5);
      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#FFFFFF',
          size: randomRange(2.5, 5),
          gravity: 0.02,
          decay: randomRange(0.03, 0.06),
          friction: 0.96,
          type: 'explosion',
        })
      );
    }
  }

  draw(ctx) {
    if (this.phase === 'rocket') {
      this.rocket.draw(ctx);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }
  }
}

// ─── Fireworks Engine ────────────────────────────────────────
class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }); // alpha: false speeds up canvas clear!
    this.fireworks = [];
    this.confettiParticles = [];
    this.shakeAmount = 0;
    this.flashAlpha = 0;
    this.isRunning = false;
    this.animFrameId = null;

    this.isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Static stars batch
    this.stars = [];
    this.initStars();
  }

  initStars() {
    this.stars = [];
    const count = this.isMobile ? 40 : 80;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.65,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: randomRange(0.25, 0.8),
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  resize(width, height) {
    // Clamp DPR to max 1.5 to keep GPU fillrate at 60 FPS on high-res mobile
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.dpr = dpr;
    this.cssWidth = width;
    this.cssHeight = height;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.isMobile = width < 768;
    this.initStars();
  }

  addFirework(x, y) {
    const w = this.cssWidth || window.innerWidth;
    const h = this.cssHeight || window.innerHeight;

    const targetX = x !== undefined ? x : randomRange(w * 0.15, w * 0.85);
    const targetY = y !== undefined ? y : randomRange(h * 0.12, h * 0.42);

    const startX = targetX + randomRange(-60, 60);
    const startY = h + 10;

    this.fireworks.push(new Firework(startX, startY, targetX, targetY, this.isMobile));
    this.flashAlpha = 0.12;
    this.shakeAmount = this.isMobile ? 2.5 : 4;
  }

  addGrandFinale() {
    const w = this.cssWidth || window.innerWidth;
    const h = this.cssHeight || window.innerHeight;

    // Smoothly choreographed finale launches (staggered to maintain 60 FPS)
    const count = this.isMobile ? 4 : 5;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.isRunning) return;
        const x = w * (0.15 + (i / (count - 1)) * 0.7) + randomRange(-25, 25);
        const y = randomRange(h * 0.1, h * 0.35);
        this.addFirework(x, y);
      }, i * 260);
    }

    // Second wave
    setTimeout(() => {
      if (!this.isRunning) return;
      this.addFirework(w * 0.3, h * 0.2);
      this.addFirework(w * 0.7, h * 0.22);
    }, 1200);

    this.addConfetti(this.isMobile ? 35 : 60);
    this.flashAlpha = 0.25;
    this.shakeAmount = 6;
  }

  addConfetti(count = 20) {
    const w = this.cssWidth || window.innerWidth;
    const h = this.cssHeight || window.innerHeight;

    const confettiColors = [
      '#FFD700', '#FFA500', '#FF4444', '#FF69B4',
      '#FF6B35', '#FFE082', '#00E5FF', '#76FF03',
    ];

    const actualCount = this.isMobile ? Math.min(count, 25) : count;

    for (let i = 0; i < actualCount; i++) {
      this.confettiParticles.push(
        new Particle(randomRange(0, w), randomRange(-h * 0.2, 0), {
          vx: randomRange(-2.5, 2.5),
          vy: randomRange(1.5, 4),
          color: randomFromArray(confettiColors),
          gravity: randomRange(0.02, 0.04),
          decay: randomRange(0.004, 0.009),
          friction: 0.99,
          type: 'confetti',
          width: randomRange(6, 10),
          height: randomRange(8, 14),
        })
      );
    }
  }

  update() {
    // Fast in-place filtering for fireworks
    let activeFw = 0;
    for (let i = 0; i < this.fireworks.length; i++) {
      this.fireworks[i].update();
      if (!this.fireworks[i].done) {
        this.fireworks[activeFw++] = this.fireworks[i];
      }
    }
    this.fireworks.length = activeFw;

    // Fast in-place filtering for confetti
    let activeConfetti = 0;
    for (let i = 0; i < this.confettiParticles.length; i++) {
      if (this.confettiParticles[i].update()) {
        this.confettiParticles[activeConfetti++] = this.confettiParticles[i];
      }
    }
    this.confettiParticles.length = activeConfetti;

    // Decay shake and flash
    this.shakeAmount *= 0.88;
    if (this.shakeAmount < 0.1) this.shakeAmount = 0;

    this.flashAlpha *= 0.9;
    if (this.flashAlpha < 0.005) this.flashAlpha = 0;
  }

  draw() {
    const ctx = this.ctx;
    const w = this.cssWidth || window.innerWidth;
    const h = this.cssHeight || window.innerHeight;

    // Apply camera shake if any
    if (this.shakeAmount > 0) {
      const sx = (Math.random() - 0.5) * this.shakeAmount * 1.5;
      const sy = (Math.random() - 0.5) * this.shakeAmount * 1.5;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, sx * this.dpr, sy * this.dpr);
    } else {
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    // 1. Draw solid dark night sky
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, w, h);

    // 2. Subtle warm ground glow (single radial gradient)
    const groundGlow = ctx.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, w * 0.5);
    groundGlow.addColorStop(0, 'rgba(255, 120, 30, 0.08)');
    groundGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = groundGlow;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // 3. Batched star drawing (single path = ultra fast)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      ctx.rect(s.x * w, s.y * h, s.size, s.size);
    }
    ctx.globalAlpha = 0.5;
    ctx.fill();

    // 4. Draw fireworks with hardware additive blending ('lighter')
    // This gives intense, radiant, glowing explosions with ZERO shadowBlur penalty!
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.fireworks.length; i++) {
      this.fireworks[i].draw(ctx);
    }

    // 5. Draw confetti with normal blend mode
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < this.confettiParticles.length; i++) {
      this.confettiParticles[i].draw(ctx);
    }

    // 6. Draw flash overlay directly in canvas (no DOM reflows)
    if (this.flashAlpha > 0) {
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, w, h);
    }

    // Reset alpha
    ctx.globalAlpha = 1;
  }

  clear() {
    this.fireworks = [];
    this.confettiParticles = [];
    this.shakeAmount = 0;
    this.flashAlpha = 0;
  }

  destroy() {
    this.stop();
    this.clear();
  }
}

export { Particle, Firework, FireworksEngine, COLORS, COLOR_PALETTES };
export default FireworksEngine;
