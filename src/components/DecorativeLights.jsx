import React from 'react';
import './DecorativeLights.css';

// Colors for festive Indian home decor & Christmas style fairy lights
const BULB_COLORS = [
  { name: 'gold', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.85)' },
  { name: 'ruby', color: '#FF2E63', glow: 'rgba(255, 46, 99, 0.85)' },
  { name: 'emerald', color: '#00F5D4', glow: 'rgba(0, 245, 212, 0.85)' },
  { name: 'amber', color: '#FF9F1C', glow: 'rgba(255, 159, 28, 0.85)' },
  { name: 'cyan', color: '#00BBF9', glow: 'rgba(0, 187, 249, 0.85)' },
  { name: 'magenta', color: '#F72585', glow: 'rgba(247, 37, 133, 0.85)' },
  { name: 'lime', color: '#70E000', glow: 'rgba(112, 224, 0, 0.85)' },
];

function DecorativeLights() {
  // Generate 24 bulbs across the top swags
  const topBulbs = Array.from({ length: 26 }).map((_, i) => {
    const colorObj = BULB_COLORS[i % BULB_COLORS.length];
    // Create catenary swag curve y-offsets: 3 swags across the width
    const swagIndex = i % 9;
    const drop = Math.sin((swagIndex / 8) * Math.PI) * 22 + (i % 2 === 0 ? 6 : 0);
    const delay = ((i * 0.23) % 2.5).toFixed(2);
    const duration = (1.4 + (i % 3) * 0.4).toFixed(2);
    return { id: i, ...colorObj, drop, delay, duration };
  });

  // Hanging vertical drops on the left and right borders (like curtain fairy lights)
  const leftDrops = [
    { height: 160, color: BULB_COLORS[0], delay: '0.2s' },
    { height: 120, color: BULB_COLORS[1], delay: '0.8s' },
    { height: 80, color: BULB_COLORS[2], delay: '1.4s' },
  ];

  const rightDrops = [
    { height: 80, color: BULB_COLORS[3], delay: '1.2s' },
    { height: 120, color: BULB_COLORS[4], delay: '0.6s' },
    { height: 160, color: BULB_COLORS[0], delay: '0.1s' },
  ];

  return (
    <div className="decorative-lights-wrapper" aria-hidden="true">
      {/* Main wire strand across top */}
      <svg className="lights-wire-svg" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path
          d="M0,8 Q200,38 400,10 Q600,40 800,10 Q1000,38 1200,8"
          fill="none"
          stroke="rgba(255, 215, 0, 0.35)"
          strokeWidth="1.5"
        />
        <path
          d="M0,12 Q200,42 400,14 Q600,44 800,14 Q1000,42 1200,12"
          fill="none"
          stroke="rgba(80, 50, 10, 0.5)"
          strokeWidth="1"
        />
      </svg>

      {/* Marigold Toran / Garland Beads along the wire */}
      <div className="toran-garland">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`marigold-flower ${i % 2 === 0 ? 'orange' : 'yellow'}`}
            style={{ left: `${(i / 29) * 100}%` }}
          />
        ))}
      </div>

      {/* Glowing Fairy Light Bulbs */}
      <div className="bulbs-container">
        {topBulbs.map((b) => (
          <div
            key={b.id}
            className="fairy-bulb-unit"
            style={{
              left: `${(b.id / (topBulbs.length - 1)) * 96 + 2}%`,
              top: `${b.drop}px`,
            }}
          >
            <div className="bulb-socket"></div>
            <div
              className={`bulb-glass glow-${b.name}`}
              style={{
                backgroundColor: b.color,
                boxShadow: `0 0 10px ${b.color}, 0 0 20px ${b.glow}, 0 0 35px ${b.glow}`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            >
              <div className="bulb-filament"></div>
            </div>
            {/* Soft light aura cone */}
            <div
              className="bulb-light-cone"
              style={{
                background: `radial-gradient(ellipse at top, ${b.glow} 0%, transparent 70%)`,
                animationDelay: `${b.delay}s`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Left Hanging Fairy Drops */}
      <div className="corner-drops left-drops">
        {leftDrops.map((drop, idx) => (
          <div key={idx} className="hanging-drop-line" style={{ height: `${drop.height}px` }}>
            <div className="drop-wire"></div>
            <div
              className="drop-bulb"
              style={{
                backgroundColor: drop.color.color,
                boxShadow: `0 0 12px ${drop.color.color}, 0 0 25px ${drop.color.glow}`,
                animationDelay: drop.delay,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Right Hanging Fairy Drops */}
      <div className="corner-drops right-drops">
        {rightDrops.map((drop, idx) => (
          <div key={idx} className="hanging-drop-line" style={{ height: `${drop.height}px` }}>
            <div className="drop-wire"></div>
            <div
              className="drop-bulb"
              style={{
                backgroundColor: drop.color.color,
                boxShadow: `0 0 12px ${drop.color.color}, 0 0 25px ${drop.color.glow}`,
                animationDelay: drop.delay,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DecorativeLights;

