import React, { useState, useRef, useEffect, useCallback } from 'react';
import './DiwaliCard.css';

function DiwaliCard({ onNext }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);

  // Detect touch device
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 12;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-section">
      {/* Background */}
      <div className="card-bg-glow"></div>

      {/* Floating sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="card-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="card-instruction">
        {isFlipped ? '✨ Tap card to close ✨' : '✨ Tap the card to open ✨'}
      </div>

      <div
        className="card-scene"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className={`card-3d ${isFlipped ? 'flipped' : ''}`}
          onClick={handleClick}
          style={{
            transform: isFlipped
              ? 'rotateY(180deg)'
              : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Front Face */}
          <div className="card-face card-front">
            <div className="card-corner top-left"></div>
            <div className="card-corner top-right"></div>
            <div className="card-corner bottom-left"></div>
            <div className="card-corner bottom-right"></div>

            <div className="card-front-content">
              <div className="card-ornament-top">✦ ✦ ✦</div>
              <div className="card-diya-icon">🪔</div>
              <h2 className="card-title">Happy Diwali</h2>
              <div className="card-subtitle">Festival of Lights</div>
              <div className="card-ornament-bottom">✦ ✦ ✦</div>
            </div>

            <div className="card-shine"></div>
          </div>

          {/* Back Face */}
          <div className="card-face card-back">
            <div className="card-corner top-left"></div>
            <div className="card-corner top-right"></div>
            <div className="card-corner bottom-left"></div>
            <div className="card-corner bottom-right"></div>

            <div className="card-back-content">
              <div className="card-back-diya">🪔</div>
              <p className="card-message">
                May the light of Diwali illuminate your life with
                <span className="highlight"> joy</span>,
                <span className="highlight"> prosperity</span> and
                <span className="highlight"> happiness</span>.
              </p>
              <p className="card-message-sub">
                Wishing you and your family a blessed and beautiful Diwali!
              </p>
              <div className="card-signature">✨ 🪔 ✨</div>
            </div>
          </div>
        </div>
      </div>

      <button className="card-continue-btn" onClick={onNext}>
        Continue to Celebrations →
      </button>
    </div>
  );
}

export default DiwaliCard;

