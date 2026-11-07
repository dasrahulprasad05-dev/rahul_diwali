import React from 'react';
import './BananaTree.css';

function BananaTree({ side = 'left' }) {
  const isRight = side === 'right';

  return (
    <div className={`banana-tree-container side-${side}`} aria-hidden="true">
      {/* Base Diya Lighting the Tree */}
      <div className="tree-base-diya">
        <div className="diya-flame-tree">
          <div className="diya-flame-core"></div>
        </div>
        <div className="diya-glow-tree"></div>
        <div className="diya-terracotta-bowl"></div>
      </div>

      {/* SVG Banana Tree */}
      <svg
        className="banana-tree-svg"
        viewBox="0 0 240 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isRight ? 'scaleX(-1)' : 'none' }}
      >
        <defs>
          {/* Gradients for Leaves */}
          <linearGradient id={`leafGrad1-${side}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#74c69d" />
            <stop offset="45%" stopColor="#2d6a4f" />
            <stop offset="100%" stopColor="#1b4332" />
          </linearGradient>

          <linearGradient id={`leafGrad2-${side}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#52b788" />
            <stop offset="55%" stopColor="#40916c" />
            <stop offset="100%" stopColor="#081c15" />
          </linearGradient>

          <linearGradient id={`leafGradLight-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b7efc5" />
            <stop offset="50%" stopColor="#74c69d" />
            <stop offset="100%" stopColor="#2d6a4f" />
          </linearGradient>

          {/* Gradients for Trunk */}
          <linearGradient id={`trunkGrad-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1b4332" />
            <stop offset="25%" stopColor="#52b788" />
            <stop offset="65%" stopColor="#40916c" />
            <stop offset="100%" stopColor="#1b4332" />
          </linearGradient>

          {/* Banana Flower Gradient */}
          <linearGradient id={`flowerGrad-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7209b7" />
            <stop offset="60%" stopColor="#b5179e" />
            <stop offset="100%" stopColor="#480ca8" />
          </linearGradient>
        </defs>

        {/* ─── Ground Soil Mound ─── */}
        <ellipse cx="120" cy="485" rx="50" ry="14" fill="#2b1810" opacity="0.8" />
        <ellipse cx="120" cy="483" rx="35" ry="9" fill="#4a2810" opacity="0.6" />

        {/* ─── Banana Trunk (Pseudostem) ─── */}
        <path
          d="M104,485 Q112,320 114,190 L126,190 Q128,320 136,485 Z"
          fill={`url(#trunkGrad-${side})`}
        />

        {/* Trunk Sheath Rings / Segments */}
        <path d="M106,450 Q120,456 134,450" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M108,410 Q120,416 132,410" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M110,370 Q120,375 130,370" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M111,330 Q120,335 129,330" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M112,290 Q120,295 128,290" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M113,250 Q120,254 127,250" stroke="#1b4332" strokeWidth="2.5" fill="none" opacity="0.6" />

        {/* Sacred Marigold Garland Wrapped Around Trunk */}
        <path
          d="M107,460 Q120,470 133,440 M109,420 Q120,430 131,400 M111,380 Q120,390 129,360 M112,340 Q120,350 128,320"
          stroke="#FF9F1C"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="4 6"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M107,460 Q120,470 133,440 M109,420 Q120,430 131,400 M111,380 Q120,390 129,360 M112,340 Q120,350 128,320"
          stroke="#FFD700"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 8"
          fill="none"
        />

        {/* ─── Back Banana Leaves (Darker / Depth) ─── */}
        {/* Leaf 1: Far Left Arching Down */}
        <path
          d="M118,200 C80,180 20,210 5,290 C25,270 70,265 118,205 Z"
          fill={`url(#leafGrad2-${side})`}
          opacity="0.85"
        />
        {/* Leaf 1 Rib */}
        <path d="M118,200 Q50,210 5,290" stroke="#95d5b2" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Leaf 2: Far Right Arching High */}
        <path
          d="M122,195 C160,160 215,170 235,245 C205,230 160,230 122,202 Z"
          fill={`url(#leafGrad2-${side})`}
          opacity="0.85"
        />
        <path d="M122,195 Q190,175 235,245" stroke="#95d5b2" strokeWidth="2" fill="none" opacity="0.7" />

        {/* ─── Hanging Banana Blossom (Kele ka Phool) ─── */}
        <g className="banana-flower-group">
          {/* Stem */}
          <path d="M124,195 Q135,230 130,265" stroke="#2d6a4f" strokeWidth="3" fill="none" />
          {/* Small baby bananas */}
          <ellipse cx="127" cy="235" rx="4" ry="7" fill="#95d5b2" transform="rotate(-20 127 235)" />
          <ellipse cx="132" cy="237" rx="4" ry="7" fill="#74c69d" transform="rotate(15 132 237)" />
          <ellipse cx="128" cy="245" rx="3.5" ry="6.5" fill="#95d5b2" transform="rotate(-15 128 245)" />
          <ellipse cx="133" cy="247" rx="3.5" ry="6.5" fill="#74c69d" transform="rotate(20 133 247)" />
          {/* Purple Blossom Bulb */}
          <path
            d="M130,255 C122,265 120,285 130,305 C140,285 138,265 130,255 Z"
            fill={`url(#flowerGrad-${side})`}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
          />
        </g>

        {/* ─── Front Prominent Banana Leaves (Lush, Wide, Graceful) ─── */}
        {/* Leaf 3: Wide Top-Left Arching Gracefully */}
        <path
          d="M117,192 C60,120 10,135 0,210 C30,185 85,185 117,196 Z"
          fill={`url(#leafGrad1-${side})`}
        />
        <path d="M117,192 Q50,135 0,210" stroke="#b7efc5" strokeWidth="2.5" fill="none" />
        {/* Leaf splits / cuts */}
        <path d="M45,155 L35,170 M75,150 L68,168" stroke="#081c15" strokeWidth="1.2" opacity="0.4" />

        {/* Leaf 4: Tall Arching Center-Left Leaf */}
        <path
          d="M118,190 C85,90 80,30 105,5 C125,50 125,120 119,190 Z"
          fill={`url(#leafGradLight-${side})`}
        />
        <path d="M118,190 Q95,70 105,5" stroke="#d8f3dc" strokeWidth="2.5" fill="none" />

        {/* Leaf 5: Young Emerging Center Shoot (Bright Lime Green) */}
        <path
          d="M120,188 C120,110 125,50 130,20 C134,60 130,120 121,188 Z"
          fill="#95d5b2"
          opacity="0.95"
        />
        <path d="M120,188 Q125,80 130,20" stroke="#d8f3dc" strokeWidth="2" fill="none" />

        {/* Leaf 6: Graceful Right-Drooping Canopy Leaf */}
        <path
          d="M122,190 C165,110 210,120 238,185 C205,170 160,175 122,194 Z"
          fill={`url(#leafGrad1-${side})`}
        />
        <path d="M122,190 Q180,125 238,185" stroke="#b7efc5" strokeWidth="2.5" fill="none" />
        <path d="M175,142 L185,158 M195,150 L203,165" stroke="#081c15" strokeWidth="1.2" opacity="0.4" />

        {/* Leaf 7: Mid-Right Arching Downward Leaf */}
        <path
          d="M123,195 C175,200 220,240 230,315 C205,280 165,260 123,200 Z"
          fill={`url(#leafGrad2-${side})`}
        />
        <path d="M123,195 Q195,225 230,315" stroke="#74c69d" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}

export default BananaTree;

