import React, { useEffect, useRef, useState } from 'react';
import './WelcomeScreen.css';

const TITLE_TEXT = 'The Festival of Lights';

function WelcomeScreen({ onNext }) {
  const canvasRef = useRef(null);
  const [lettersVisible, setLettersVisible] = useState([]);
  const [showButton, setShowButton] = useState(false);

  // Letter-by-letter animation
  useEffect(() => {
    const letters = TITLE_TEXT.split('');
    letters.forEach((_, i) => {
      setTimeout(() => {
        setLettersVisible((prev) => [...prev, i]);
      }, 200 + i * 80);
    });

    setTimeout(() => {
      setShowButton(true);
    }, 200 + letters.length * 80 + 400);
  }, []);

  // Floating particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.6 + 0.3;
        this.fadeIn = true;
        this.fadeSpeed = Math.random() * 0.008 + 0.004;
        this.hue = Math.random() > 0.5 ? 43 : 36; // gold or amber
        this.lightness = 50 + Math.random() * 20;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.fadeIn) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= this.maxOpacity) {
            this.fadeIn = false;
          }
        } else {
          this.opacity -= this.fadeSpeed * 0.6;
        }

        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.opacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.opacity * 0.15})`;
        ctx.fill();
      }
    }

    const isMobile = window.innerWidth < 768;
    for (let i = 0; i < (isMobile ? 30 : 60); i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="welcome-screen">
      {/* Background stars */}
      <div className="stars-container">
        {Array.from({ length: typeof window !== 'undefined' && window.innerWidth < 768 ? 25 : 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
      </div>

      {/* Mandala background pattern */}
      <div className="mandala-pattern"></div>
      <div className="mandala-pattern mandala-2"></div>

      {/* Floating particles canvas */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Diya Left Side */}
      <div className="diya-group diya-group-left">
        <div className="diya">
          <div className="diya-flame-wrapper">
            <div className="diya-flame">
              <div className="flame-inner"></div>
            </div>
            <div className="diya-glow"></div>
          </div>
          <div className="diya-base">
            <div className="diya-bowl"></div>
            <div className="diya-foot"></div>
          </div>
        </div>
        <div className="diya diya-small">
          <div className="diya-flame-wrapper">
            <div className="diya-flame">
              <div className="flame-inner"></div>
            </div>
            <div className="diya-glow"></div>
          </div>
          <div className="diya-base">
            <div className="diya-bowl"></div>
            <div className="diya-foot"></div>
          </div>
        </div>
      </div>

      {/* Diya Right Side */}
      <div className="diya-group diya-group-right">
        <div className="diya">
          <div className="diya-flame-wrapper">
            <div className="diya-flame">
              <div className="flame-inner"></div>
            </div>
            <div className="diya-glow"></div>
          </div>
          <div className="diya-base">
            <div className="diya-bowl"></div>
            <div className="diya-foot"></div>
          </div>
        </div>
        <div className="diya diya-small">
          <div className="diya-flame-wrapper">
            <div className="diya-flame">
              <div className="flame-inner"></div>
            </div>
            <div className="diya-glow"></div>
          </div>
          <div className="diya-base">
            <div className="diya-bowl"></div>
            <div className="diya-foot"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="welcome-content">
        <div className="welcome-subtitle">🪔 Welcome to 🪔</div>
        <h1 className="welcome-title">
          {TITLE_TEXT.split('').map((letter, i) => (
            <span
              key={i}
              className={`title-letter ${lettersVisible.includes(i) ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        <div className={`welcome-divider ${showButton ? 'visible' : ''}`}>
          <span className="divider-ornament">✦</span>
          <div className="divider-line"></div>
          <span className="divider-ornament">✦</span>
        </div>

        <button
          className={`cta-button ${showButton ? 'visible' : ''}`}
          onClick={onNext}
        >
          <span className="cta-sparkle left">✨</span>
          <span className="cta-text">Experience Diwali</span>
          <span className="cta-sparkle right">✨</span>
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
