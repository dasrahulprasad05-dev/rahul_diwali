// Golden cursor particle system for magical trailing effect

class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || (Math.random() - 0.5) * 2;
    this.vy = options.vy || -(Math.random() * 2 + 1);
    this.size = options.size || Math.random() * 4 + 2;
    this.alpha = options.alpha || 1;
    this.decay = options.decay || Math.random() * 0.015 + 0.01;
    this.color = options.color || this.getGoldenColor();
    this.life = options.life || 60;
    this.maxLife = this.life;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.gravity = options.gravity || -0.02;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.1 + 0.03;
    this.wobbleAmplitude = Math.random() * 0.5 + 0.2;
  }

  getGoldenColor() {
    const goldenColors = [
      '#FFD700',
      '#FFC107',
      '#FFB300',
      '#FF8F00',
      '#FFCA28',
      '#FFE082',
      '#FFF8E1',
      '#FFD54F',
    ];
    return goldenColors[Math.floor(Math.random() * goldenColors.length)];
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.vx += Math.sin(this.wobble) * this.wobbleAmplitude * 0.1;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    this.rotation += this.rotationSpeed;
    this.life--;
    this.alpha = Math.max(0, this.life / this.maxLife);
    this.size *= 0.98;

    return this.life > 0 && this.alpha > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.size * 3;

    // Draw the particle as a soft glowing circle
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.4, this.color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = this.alpha * 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.spawnRate = 3;
    this.isActive = true;
  }

  spawn(x, y, count = null) {
    const numParticles = count || this.spawnRate;
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(
        new Particle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10)
      );
    }
  }

  spawnBurst(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 1;
      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 3,
          life: 40,
          gravity: 0.02,
        })
      );
    }
  }

  update() {
    this.particles = this.particles.filter((p) => p.update());
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
  }

  get count() {
    return this.particles.length;
  }
}

export { Particle, ParticleSystem };
export default ParticleSystem;
