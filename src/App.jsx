import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DiwaliCard from './components/DiwaliCard';
import Fireworks from './components/Fireworks';
import NameReveal from './components/NameReveal';
import ShareCard from './components/ShareCard';

const SECTIONS = ['welcome', 'card', 'fireworks', 'nameReveal', 'share'];

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect touch device + check URL params
  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(touchDevice);

    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name');
    if (urlName) {
      setUserName(decodeURIComponent(urlName));
    }

    // Fix mobile viewport height (address bar issue)
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  const goToNext = useCallback((name) => {
    if (transitioning) return;
    if (name && typeof name === 'string') {
      setUserName(name);
    }
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSection((prev) => Math.min(prev + 1, SECTIONS.length - 1));
      setTransitioning(false);
      // Scroll to top on section change (mobile)
      window.scrollTo(0, 0);
    }, 400);
  }, [transitioning]);

  const goToStart = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSection(0);
      setUserName('');
      setTransitioning(false);
      window.scrollTo(0, 0);
      window.history.replaceState({}, '', window.location.pathname);
    }, 400);
  }, []);

  // Cursor particle effect (desktop only)
  useEffect(() => {
    if (isMobile) return; // Skip on touch devices

    let particles = [];
    const maxParticles = 20;
    let lastTime = 0;
    const throttleMs = 50;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      const dx = (Math.random() - 0.5) * 30;
      const dy = -(Math.random() * 25 + 10);
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;

      const size = Math.random() * 4 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      document.body.appendChild(particle);
      particles.push(particle);

      if (particles.length > maxParticles) {
        const old = particles.shift();
        if (old.parentNode) old.parentNode.removeChild(old);
      }

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
        particles = particles.filter((p) => p !== particle);
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      particles.forEach((p) => {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    };
  }, [isMobile]);

  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  const renderSection = () => {
    switch (SECTIONS[currentSection]) {
      case 'welcome':
        return <WelcomeScreen onNext={goToNext} />;
      case 'card':
        return <DiwaliCard onNext={goToNext} />;
      case 'fireworks':
        return <Fireworks onNext={goToNext} />;
      case 'nameReveal':
        return <NameReveal onNext={goToNext} />;
      case 'share':
        return <ShareCard userName={userName} onRestart={goToStart} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0a1a' }}>
      <div
        className="section-wrapper"
        key={currentSection}
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {renderSection()}
      </div>

      {/* Developer Credit */}
      <a
        href="https://rahul-protfolio-orcin.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="developer-credit"
      >
        <span className="dev-diya">🪔</span>
        <span className="dev-text">Crafted with ❤️ by <strong>Rahul</strong></span>
      </a>

      {/* Music Toggle Button */}
      <button
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <div className="bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </button>
    </div>
  );
}

export default App;
