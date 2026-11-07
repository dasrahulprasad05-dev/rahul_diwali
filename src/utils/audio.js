// Web Audio API Sound Generator for Diwali Experience
// Zero external files, zero latency, works on mobile & desktop

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.ambientOscillators = [];
    this.melodyTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ─── Temple Bell / Magic Chime ─────────────────────────────
  playBell(freq = 660) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Harmonic frequencies for rich temple bell sound
    const harmonics = [1, 2.05, 3.02, 4.2];
    const gains = [0.25, 0.12, 0.08, 0.04];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  // ─── Rocket Whoosh Sound ───────────────────────────────────
  playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.55;

    // Filtered noise for rocket whoosh
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.8);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // ─── Firework / Cracker Explosion ──────────────────────────
  playCracker() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Sub-bass boom
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(130, now);
    boomOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    boomGain.gain.setValueAtTime(0.35, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 0.35);

    // 2. Crisp burst noise
    const duration = 0.45;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // 3. Crackle sparks
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      for (let s = 0; s < 3; s++) {
        setTimeout(() => {
          if (this.isMuted || !this.ctx) return;
          this.playMiniPop();
        }, s * 70 + Math.random() * 40);
      }
    }, 120);
  }

  playMiniPop() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // ─── Sparkle Sound ─────────────────────────────────────────
  playSparkle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [784, 880, 1046, 1175, 1318]; // G5, A5, C6, D6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }, idx * 45);
    });
  }

  // ─── Ambient Festive Drone / Music ─────────────────────────
  startAmbientMusic() {
    this.isMuted = false;
    this.init();
    if (!this.ctx) return;

    this.stopAmbientMusic();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master ambient gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.12, now + 1.5);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    // Indian Tanpura / Sitar Drone chord (Sa, Pa, Sa' - C, G, C)
    const droneFreqs = [130.81, 196.0, 261.63, 392.0]; // C3, G3, C4, G4

    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Low pass to keep it warm and meditative
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + i * 50, now);

      // Gentle pulsating volume
      gain.gain.setValueAtTime(0.04 / (i + 1), now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      this.ambientOscillators.push(osc);
    });

    // Auspicious Raag Bhupali melody notes (Sa, Re, Ga, Pa, Dha)
    // C, D, E, G, A pentatonic
    const ragaNotes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    let noteIdx = 0;

    const playNextNote = () => {
      if (this.isMuted || !this.ctx) return;
      const noteNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteNow);

      gain.gain.setValueAtTime(0.001, noteNow);
      gain.gain.linearRampToValueAtTime(0.04, noteNow + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteNow + 2.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteNow);
      osc.stop(noteNow + 2.3);

      this.melodyTimer = setTimeout(playNextNote, 1600 + Math.random() * 1200);
    };

    this.melodyTimer = setTimeout(playNextNote, 1000);
  }

  stopAmbientMusic() {
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }

    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        this.ambientOscillators = [];
      }, 550);
    } else {
      this.ambientOscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
      });
      this.ambientOscillators = [];
    }
  }

  toggleMusic() {
    if (this.isMuted) {
      this.startAmbientMusic();
      return true;
    } else {
      this.isMuted = true;
      this.stopAmbientMusic();
      return false;
    }
  }
}

const sound = new SoundManager();
export default sound;
