import React, { useRef, useEffect, useState, useCallback } from 'react';
import FireworksEngine from '../animations/fireworks';
import './Fireworks.css';

function Fireworks({ onNext }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const maxClicks = 5;

  // Initialize fireworks engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new FireworksEngine(canvas);
    engineRef.current = engine;

    const resize = () => {
      engine.resize(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    engine.start();

    return () => {
      engine.destroy();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleCelebrate = useCallback(() => {
    if (clickCount >= maxClicks) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Trigger flash
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);

    // Shake button
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);

    if (newCount >= maxClicks) {
      // Grand finale!
      if (engineRef.current) {
        engineRef.current.addGrandFinale();
      }
      setTimeout(() => {
        setShowFinale(true);
      }, 2000);
    } else {
      // Regular firework
      if (engineRef.current) {
        engineRef.current.addFirework();
        engineRef.current.addConfetti(30);
      }
    }
  }, [clickCount]);

  return (
    <div className="fireworks-section">
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {showFlash && <div className="screen-flash" />}

      {/* Floating sparkle decorations */}
      <div className="sparkle-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="floating-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {!showFinale ? (
        <div className="fireworks-ui">
          <h2 className="fireworks-title">Light Up The Sky</h2>

          <div className="click-counter">
            {Array.from({ length: maxClicks }).map((_, i) => (
              <span key={i} className={`dot ${i < clickCount ? 'filled' : ''}`} />
            ))}
          </div>

          <button
            className={`celebrate-btn ${isShaking ? 'shake' : ''}`}
            onClick={handleCelebrate}
            disabled={clickCount >= maxClicks}
          >
            🎆 Celebrate Diwali
          </button>

          <div className="fireworks-instruction">
            Tap to launch fireworks • {clickCount} / {maxClicks}
          </div>
        </div>
      ) : (
        <div className="finale-overlay">
          <h2 className="finale-text">What a Celebration! 🎉</h2>
          <p className="finale-subtitle">
            The skies are lit with the spirit of Diwali
          </p>
          <button className="continue-btn" onClick={onNext}>
            Continue → ✨
          </button>
        </div>
      )}
    </div>
  );
}

export default Fireworks;

