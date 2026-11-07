// Spectacular Fireworks Engine for Diwali celebration

const COLORS = {
  gold: '#FFD700',
  orange: '#FFA500',
  red: '#FF4444',
  white: '#FFFFFF',
  pink: '#FF69B4',
  deepOrange: '#FF6B35',
  magenta: '#FF00FF',
  cyan: '#00FFFF',
  yellow: '#FFFF00',
  lime: '#AAFF00',
};

const COLOR_PALETTES = [
  [COLORS.gold, COLORS.orange, COLORS.yellow, COLORS.white],
  [COLORS.red, COLORS.orange, COLORS.pink, COLORS.gold],
  [COLORS.pink, COLORS.magenta, COLORS.white, COLORS.gold],
  [COLORS.gold, COLORS.white, COLORS.cyan, COLORS.yellow],
  [COLORS.red, COLORS.gold, COLORS.orange, COLORS.white],
  [COLORS.deepOrange, COLORS.gold, COLORS.red, COLORS.yellow],
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ─── Trail Particle ──────────────────────────────────────────
class TrailPoint {
  constructor(x, y, alpha, size, color) {
    this.x = x;
    this.y = y;
    this.alpha = alpha;
    this.size = size;
    this.color = color;
  }
}

// ─── Firework Particle ──────────────────────────────────────
class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.alpha = options.alpha || 1;
    this.color = options.color || COLORS.gold;
    this.size = options.size || 3;
    this.originalSize = this.size;
    this.gravity = options.gravity || 0.06;
    this.decay = options.decay || randomRange(0.01, 0.025);
    this.friction = options.friction || 0.98;
    this.trail = [];
    this.trailLength = options.trailLength || 8;
    this.sparkleTimer = 0;
    this.sparkleInterval = Math.floor(randomRange(3, 8));
    this.isSparkling = false;
    this.type = options.type || 'explosion'; // 'rocket', 'explosion', 'sparkle', 'confetti'
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.width = options.width || this.size;
    this.height = options.height || this.size;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = options.wobbleSpeed || 0;
    this.twinkle = options.twinkle || false;
    this.twinkleSpeed = randomRange(0.1, 0.3);
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update() {
    // Store trail
    if (this.trail.length >= this.trailLength) {
      this.trail.shift();
    }
    this.trail.push(new TrailPoint(this.x, this.y, this.alpha, this.size, this.color));

    this.prevX = this.x;
    this.prevY = this.y;

    // Apply physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    // Decay
    this.alpha -= this.decay;
    this.size = this.originalSize * Math.max(0, this.alpha);

    // Sparkle
    this.sparkleTimer++;
    if (this.sparkleTimer >= this.sparkleInterval) {
      this.sparkleTimer = 0;
      this.isSparkling = true;
    } else {
      this.isSparkling = false;
    }

    // Wobble (for confetti)
    if (this.wobbleSpeed) {
      this.wobble += this.wobbleSpeed;
      this.vx += Math.sin(this.wobble) * 0.1;
    }

    // Rotation (for confetti)
    this.rotation += this.rotationSpeed;

    // Twinkle
    if (this.twinkle) {
      this.twinklePhase += this.twinkleSpeed;
    }

    return this.alpha > 0.01;
  }

  draw(ctx) {
    if (this.type === 'confetti') {
      this.drawConfetti(ctx);
      return;
    }

    // Draw trail
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const trailAlpha = (i / this.trail.length) * this.alpha * 0.5;
        const trailSize = (i / this.trail.length) * this.size * 0.6;

        if (trailAlpha < 0.01) continue;

        ctx.save();
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = trailSize * 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, Math.max(0.5, trailSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw main particle
    ctx.save();

    let currentAlpha = this.alpha;
    if (this.twinkle) {
      currentAlpha *= 0.5 + 0.5 * Math.sin(this.twinklePhase);
    }

    ctx.globalAlpha = Math.max(0, currentAlpha);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.size * 4;

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
    ctx.fill();

    // Sparkle flash
    if (this.isSparkling && this.alpha > 0.3) {
      ctx.globalAlpha = Math.min(1, this.alpha * 1.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = this.size * 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw cross sparkle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 15;
      const sparkSize = this.size * 3;
      ctx.beginPath();
      ctx.moveTo(this.x - sparkSize, this.y);
      ctx.lineTo(this.x + sparkSize, this.y);
      ctx.moveTo(this.x, this.y - sparkSize);
      ctx.lineTo(this.x, this.y + sparkSize);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawConfetti(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Paper-like rectangle
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 3;

    const w = this.width * Math.abs(Math.cos(this.wobble));
    const h = this.height;

    ctx.fillRect(-w / 2, -h / 2, Math.max(1, w), h);

    // Lighter face
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-w / 2, -h / 2, Math.max(1, w) / 2, h);

    ctx.restore();
  }
}

// ─── Firework (Rocket + Explosion) ──────────────────────────
class Firework {
  constructor(startX, startY, targetX, targetY) {
    this.particles = [];
    this.phase = 'rocket'; // 'rocket' or 'explosion'
    this.done = false;

    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;

    this.palette = randomFromArray(COLOR_PALETTES);

    // Create the rocket particle
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = randomRange(12, 18);

    this.rocket = new Particle(startX, startY, {
      vx: Math.cos(angle) * speed * 0.3 + randomRange(-0.5, 0.5),
      vy: -speed,
      color: randomFromArray(this.palette),
      size: 4,
      gravity: 0.05,
      decay: 0,
      friction: 0.99,
      trailLength: 15,
      type: 'rocket',
    });

    this.rocketTrailTimer = 0;
    this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
  }

  update() {
    if (this.phase === 'rocket') {
      this.rocket.update();

      // Emit trailing sparks from rocket
      this.rocketTrailTimer++;
      if (this.rocketTrailTimer % 2 === 0) {
        for (let i = 0; i < 3; i++) {
          this.particles.push(
            new Particle(
              this.rocket.x + randomRange(-2, 2),
              this.rocket.y + randomRange(-2, 2),
              {
                vx: randomRange(-1, 1),
                vy: randomRange(0, 2),
                color: randomFromArray(['#FFD700', '#FFA500', '#FF8C00', '#FFFFFF']),
                size: randomRange(1, 3),
                gravity: 0.03,
                decay: randomRange(0.03, 0.06),
                friction: 0.95,
                trailLength: 4,
                type: 'sparkle',
              }
            )
          );
        }
      }

      // Check if rocket reached target area
      const distFromStart = Math.hypot(
        this.rocket.x - this.startX,
        this.rocket.y - this.startY
      );
      if (
        this.rocket.vy >= -2 ||
        distFromStart >= this.distanceToTarget * 0.85 ||
        this.rocket.y <= this.targetY
      ) {
        this.explode();
      }
    }

    // Update all particles
    this.particles = this.particles.filter((p) => p.update());

    // Done when explosion phase and no particles left
    if (this.phase === 'explosion' && this.particles.length === 0) {
      this.done = true;
    }
  }

  explode() {
    this.phase = 'explosion';
    const x = this.rocket.x;
    const y = this.rocket.y;

    const numParticles = Math.floor(randomRange(55, 80));
    const explosionType = Math.floor(Math.random() * 4);

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 * i) / numParticles + randomRange(-0.1, 0.1);
      let speed;

      switch (explosionType) {
        case 0: // Sphere
          speed = randomRange(2, 8);
          break;
        case 1: // Ring
          speed = randomRange(5, 7);
          break;
        case 2: // Double burst
          speed = i % 2 === 0 ? randomRange(3, 5) : randomRange(6, 9);
          break;
        case 3: // Star pattern
          speed = i % 5 === 0 ? randomRange(6, 10) : randomRange(2, 5);
          break;
        default:
          speed = randomRange(2, 8);
      }

      const color = randomFromArray(this.palette);

      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          size: randomRange(2, 5),
          gravity: randomRange(0.04, 0.08),
          decay: randomRange(0.008, 0.02),
          friction: 0.97,
          trailLength: randomRange(5, 12),
          type: 'explosion',
          twinkle: Math.random() > 0.6,
        })
      );
    }

    // Add central flash particles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(0.5, 3);
      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#FFFFFF',
          size: randomRange(3, 7),
          gravity: 0.02,
          decay: randomRange(0.03, 0.06),
          friction: 0.96,
          trailLength: 3,
          type: 'explosion',
        })
      );
    }

    // Add tiny secondary sparkle particles
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(1, 10);
      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: randomFromArray(this.palette),
          size: randomRange(1, 2),
          gravity: randomRange(0.03, 0.07),
          decay: randomRange(0.005, 0.015),
          friction: 0.98,
          trailLength: 6,
          type: 'sparkle',
          twinkle: true,
        })
      );
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Draw rocket if in rocket phase
    if (this.phase === 'rocket') {
      this.rocket.draw(ctx);
    }

    // Draw all particles
    for (const particle of this.particles) {
      particle.draw(ctx);
    }

    ctx.restore();
  }
}

// ─── Fireworks Engine ────────────────────────────────────────
class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fireworks = [];
    this.ambientParticles = [];
    this.confettiParticles = [];
    this.shakeAmount = 0;
    this.shakeDecay = 0.9;
    this.flashAlpha = 0;
    this.flashDecay = 0.92;
    this.isRunning = false;
    this.animFrameId = null;

    // Stars background
    this.stars = [];
    this.initStars();
  }

  initStars() {
    this.stars = [];
    const numStars = 120;
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.7,
        size: randomRange(0.5, 2),
        twinkleSpeed: randomRange(0.01, 0.04),
        twinklePhase: Math.random() * Math.PI * 2,
        brightness: randomRange(0.3, 1),
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
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
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addFirework(x, y) {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // Random target in upper portion of screen
    const targetX = x !== undefined ? x : randomRange(canvasW * 0.15, canvasW * 0.85);
    const targetY = y !== undefined ? y : randomRange(canvasH * 0.1, canvasH * 0.4);

    // Launch from bottom
    const startX = targetX + randomRange(-100, 100);
    const startY = canvasH + 10;

    this.fireworks.push(new Firework(startX, startY, targetX, targetY));

    // Screen flash
    this.flashAlpha = 0.15;

    // Camera shake
    this.shakeAmount = 5;
  }

  addGrandFinale() {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // Launch 5 fireworks in sequence spread across the screen
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = canvasW * (0.15 + (i / 4) * 0.7) + randomRange(-30, 30);
        const y = randomRange(canvasH * 0.08, canvasH * 0.35);
        this.addFirework(x, y);
      }, i * 200);
    }

    // Add extra fireworks after a short delay
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        this.addFirework();
      }
    }, 1200);

    // Massive confetti
    this.addConfetti(200);

    // Big flash
    this.flashAlpha = 0.3;
    this.shakeAmount = 10;
  }

  addConfetti(count = 80) {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    const confettiColors = [
      '#FFD700', '#FFA500', '#FF4444', '#FF69B4',
      '#FF6B35', '#FFE082', '#FF1744', '#F50057',
      '#FFAB00', '#FF9100', '#FF3D00', '#D500F9',
      '#00E5FF', '#76FF03', '#FFEA00',
    ];

    for (let i = 0; i < count; i++) {
      const startX = randomRange(0, canvasW);
      const startY = randomRange(-canvasH * 0.3, canvasH * 0.2);

      this.confettiParticles.push(
        new Particle(startX, startY, {
          vx: randomRange(-3, 3),
          vy: randomRange(1, 5),
          color: randomFromArray(confettiColors),
          size: randomRange(4, 8),
          gravity: randomRange(0.02, 0.05),
          decay: randomRange(0.003, 0.008),
          friction: 0.99,
          trailLength: 0,
          type: 'confetti',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: randomRange(-0.15, 0.15),
          wobbleSpeed: randomRange(0.05, 0.15),
          width: randomRange(6, 12),
          height: randomRange(8, 16),
        })
      );
    }
  }

  update() {
    // Update fireworks
    this.fireworks = this.fireworks.filter((fw) => {
      fw.update();
      return !fw.done;
    });

    // Update confetti
    this.confettiParticles = this.confettiParticles.filter((p) => p.update());

    // Update ambient particles
    this.ambientParticles = this.ambientParticles.filter((p) => p.update());

    // Decay screen shake
    this.shakeAmount *= this.shakeDecay;
    if (this.shakeAmount < 0.1) this.shakeAmount = 0;

    // Decay flash
    this.flashAlpha *= this.flashDecay;
    if (this.flashAlpha < 0.005) this.flashAlpha = 0;

    // Twinkle stars
    for (const star of this.stars) {
      star.twinklePhase += star.twinkleSpeed;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();

    // Apply camera shake
    if (this.shakeAmount > 0) {
      const sx = (Math.random() - 0.5) * this.shakeAmount * 2;
      const sy = (Math.random() - 0.5) * this.shakeAmount * 2;
      ctx.translate(sx, sy);
    }

    // Clear with dark sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
    skyGradient.addColorStop(0, '#0a0015');
    skyGradient.addColorStop(0.4, '#0d0025');
    skyGradient.addColorStop(0.7, '#15002a');
    skyGradient.addColorStop(1, '#1a0033');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(-10, -10, w + 20, h + 20);

    // Draw subtle ground glow
    const groundGlow = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, w * 0.6);
    groundGlow.addColorStop(0, 'rgba(255, 150, 50, 0.08)');
    groundGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = groundGlow;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Draw stars
    for (const star of this.stars) {
      const brightness = star.brightness * (0.5 + 0.5 * Math.sin(star.twinklePhase));
      ctx.save();
      ctx.globalAlpha = brightness;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = star.size * 3;
      ctx.beginPath();
      ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw fireworks
    for (const fw of this.fireworks) {
      fw.draw(ctx);
    }

    // Draw confetti (not with 'lighter' blend mode)
    for (const confetti of this.confettiParticles) {
      confetti.draw(ctx);
    }

    // Draw ambient particles
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.ambientParticles) {
      p.draw(ctx);
    }
    ctx.restore();

    // Draw flash overlay
    if (this.flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-10, -10, w + 20, h + 20);
      ctx.restore();
    }

    ctx.restore();
  }

  clear() {
    this.fireworks = [];
    this.confettiParticles = [];
    this.ambientParticles = [];
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
