import React, { useState, useEffect, useCallback } from 'react';
import sound from '../utils/audio';
import './NameReveal.css';

function NameReveal({ onNext, initialName = '' }) {
  const [name, setName] = useState(initialName || '');
  const [isRevealed, setIsRevealed] = useState(false);
  const [lettersVisible, setLettersVisible] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showRangoli, setShowRangoli] = useState(false);

  const triggerReveal = useCallback((targetName) => {
    const raw = (targetName && typeof targetName === 'string') ? targetName.trim() : '';
    const finalName = raw || 'Friend';
    setName(finalName);
    setIsRevealed(true);
    setLettersVisible([]);

    // Play auspicious bell/sparkle sound
    sound.playBell(587); // D5 temple chime

    const letters = finalName.split('');

    // Letter-by-letter reveal
    letters.forEach((_, i) => {
      setTimeout(() => {
        setLettersVisible((prev) => [...prev, i]);
      }, 150 + i * 80);
    });

    // Safeguard: Ensure ALL letters are revealed
    setTimeout(() => {
      setLettersVisible(letters.map((_, i) => i));
      setShowMessage(true);
      sound.playSparkle();
    }, 150 + letters.length * 80 + 250);

    // Show rangoli pattern
    setTimeout(() => {
      setShowRangoli(true);
    }, 150 + letters.length * 80 + 750);
  }, []);

  // Check URL params or initialName for pre-filled name on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name') || initialName;
    if (urlName && urlName.trim()) {
      const clean = decodeURIComponent(urlName).trim();
      setName(clean);
      triggerReveal(clean);
    }
  }, [initialName, triggerReveal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    triggerReveal(clean);
  };

  const handleEditName = () => {
    setIsRevealed(false);
    setShowMessage(false);
    setShowRangoli(false);
    setLettersVisible([]);
  };

  const handleContinue = () => {
    const clean = name.trim() || 'Friend';
    onNext(clean);
  };

  const displayName = name.trim() || 'Friend';

  return (
    <div className="name-section">
      {/* Background decorations */}
      <div className="name-bg-glow"></div>

      {/* Floating diyas around the edges */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="floating-diya-mini"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: i < 4 ? '8%' : '85%',
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <div className="mini-flame"></div>
          <div className="mini-base"></div>
        </div>
      ))}

      {!isRevealed ? (
        /* ─── Input Form ─────────────────────────────── */
        <form className="name-form" onSubmit={handleSubmit}>
          <div className="form-diya">🪔</div>
          <h2 className="form-title">Personalize Your Greeting</h2>
          <div className="form-subtitle">Enter your name to create a unique Diwali wish</div>

          <div className="input-wrapper">
            <input
              type="text"
              className="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              autoFocus
            />
            <div className="input-line"></div>
          </div>

          <button type="submit" className="create-btn" disabled={!name.trim()}>
            <span>✨</span>
            <span>Create My Wish</span>
            <span>✨</span>
          </button>
        </form>
      ) : (
        /* ─── Name Reveal ────────────────────────────── */
        <div className="reveal-container">
          {/* Illuminating diyas around name */}
          <div className="diya-circle">
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const radius = 180;
              return (
                <div
                  key={i}
                  className="reveal-diya"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <div className="reveal-diya-flame"></div>
                  <div className="reveal-diya-glow"></div>
                </div>
              );
            })}
          </div>

          {/* Sparkles around name */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="name-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 30}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Name Display */}
          <div className="name-display">
            <div className="name-label">Dear</div>
            <h1 className="revealed-name">
              {displayName.split('').map((letter, i) => (
                <span
                  key={i}
                  className={`name-letter ${lettersVisible.includes(i) ? 'visible' : ''}`}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <button className="edit-name-btn" onClick={handleEditName}>
              ✏️ Change Name
            </button>
          </div>

          {/* Personalized message */}
          <div className={`personal-message ${showMessage ? 'visible' : ''}`}>
            <p className="message-text">
              May this Diwali bring you endless <span className="gold">joy</span>,{' '}
              <span className="gold">prosperity</span>, and the warmth of loved ones.
              May every diya light up your path to{' '}
              <span className="gold">success</span> and{' '}
              <span className="gold">happiness</span>! 🪔✨
            </p>
          </div>

          {/* Rangoli */}
          <div className={`rangoli ${showRangoli ? 'visible' : ''}`}>
            <div className="rangoli-ring ring-1"></div>
            <div className="rangoli-ring ring-2"></div>
            <div className="rangoli-ring ring-3"></div>
            <div className="rangoli-center"></div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rangoli-petal"
                style={{ transform: `rotate(${i * 45}deg)` }}
              >
                <div className="petal-shape"></div>
              </div>
            ))}
          </div>

          {/* Continue button */}
          <button
            className={`share-next-btn ${showRangoli ? 'visible' : ''}`}
            onClick={handleContinue}
          >
            Share Your Greeting →
          </button>
        </div>
      )}
    </div>
  );
}

export default NameReveal;
