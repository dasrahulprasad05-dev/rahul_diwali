import React, { useRef, useEffect, useState, useCallback } from 'react';
import FireworksEngine from '../animations/fireworks';
import './Fireworks.css';

function Fireworks({ onNext }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const buttonRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
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
    window.addEventListener('resize', resize, { passive: true });

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

    // Button animation via DOM class (no React re-render overhead)
    if (buttonRef.current) {
      buttonRef.current.classList.remove('bounce');
      // trigger reflow
      void buttonRef.current.offsetWidth;
      buttonRef.current.classList.add('bounce');
    }

    if (newCount >= maxClicks) {
      if (engineRef.current) {
        engineRef.current.addGrandFinale();
      }
      setTimeout(() => {
        setShowFinale(true);
      }, 2200);
    } else {
      if (engineRef.current) {
        engineRef.current.addFirework();
        engineRef.current.addConfetti(18);
      }
    }
  }, [clickCount]);

  return (
    <div className="fireworks-section">
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {!showFinale ? (
        <div className="fireworks-ui">
          <h2 className="fireworks-title">Light Up The Sky</h2>

          <div className="click-counter">
            {Array.from({ length: maxClicks }).map((_, i) => (
              <span key={i} className={`dot ${i < clickCount ? 'filled' : ''}`} />
            ))}
          </div>

          <button
            ref={buttonRef}
            className="celebrate-btn"
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
