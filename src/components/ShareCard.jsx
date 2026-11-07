import React, { useState, useCallback } from 'react';
import './ShareCard.css';

function ShareCard({ userName, onRestart }) {
  const [copied, setCopied] = useState(false);
  const displayName = userName || 'Friend';

  const getShareUrl = useCallback(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?name=${encodeURIComponent(displayName)}`;
  }, [displayName]);

  const handleWhatsAppShare = () => {
    const message = `🪔 Happy Diwali, ${displayName}! 🪔\n\nMay this festival of lights bring you joy, prosperity, and happiness.\n\n✨ Check out your personalized Diwali greeting: ${getShareUrl()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Dark background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, '#050510');
    bgGrad.addColorStop(0.5, '#0a0a1a');
    bgGrad.addColorStop(1, '#0d1137');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Stars
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 800, Math.random() * 500, Math.random() * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      ctx.fill();
    }

    // Golden border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 740, 940);

    // Inner border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, 710, 910);

    // Corner ornaments
    const corners = [[50, 50], [750, 50], [50, 950], [750, 950]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
    });

    // Diya emoji area - golden glow
    const glowGrad = ctx.createRadialGradient(400, 200, 0, 400, 200, 150);
    glowGrad.addColorStop(0, 'rgba(255, 165, 0, 0.15)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(250, 50, 300, 300);

    // "Happy Diwali" text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 64px serif';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText('Happy Diwali', 400, 280);
    ctx.shadowBlur = 0;

    // Diya symbol
    ctx.font = '80px serif';
    ctx.fillText('🪔', 400, 180);

    // Ornament line
    const lineGrad = ctx.createLinearGradient(150, 0, 650, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, '#FFD700');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 320);
    ctx.lineTo(650, 320);
    ctx.stroke();

    // Ornament dots
    ctx.fillStyle = '#FFD700';
    [300, 400, 500].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 320, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // "Dear [Name]"
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.font = '24px sans-serif';
    ctx.fillText('Dear', 400, 390);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px serif';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    ctx.shadowBlur = 15;
    ctx.fillText(displayName, 400, 450);
    ctx.shadowBlur = 0;

    // Message text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '20px serif';
    const lines = [
      'May this Diwali bring you endless',
      'joy, prosperity, and the warmth',
      'of loved ones.',
      '',
      'May every diya light up your path',
      'to success and happiness!',
    ];
    lines.forEach((line, i) => {
      ctx.fillText(line, 400, 530 + i * 35);
    });

    // Bottom decorations
    ctx.font = '40px serif';
    ctx.fillText('✨ 🪔 ✨', 400, 800);

    // Bottom text
    ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.font = '16px sans-serif';
    ctx.fillText('Festival of Lights', 400, 860);

    // Small rangoli pattern at bottom
    ctx.strokeStyle = 'rgba(255, 69, 69, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(400, 920, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(400, 920, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Diwali-Greeting-${displayName}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = getShareUrl();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="share-section">
      {/* Background confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="bg-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            backgroundColor: ['#FFD700', '#FFA500', '#FF4444', '#FF69B4', '#FF6B35'][
              Math.floor(Math.random() * 5)
            ],
            width: `${3 + Math.random() * 5}px`,
            height: `${8 + Math.random() * 8}px`,
          }}
        />
      ))}

      <div className="share-content">
        {/* Preview Card */}
        <div className="preview-card" id="greeting-card">
          <div className="preview-corner pc-tl"></div>
          <div className="preview-corner pc-tr"></div>
          <div className="preview-corner pc-bl"></div>
          <div className="preview-corner pc-br"></div>

          <div className="preview-diya">🪔</div>
          <h2 className="preview-title">Happy Diwali</h2>
          <div className="preview-divider"></div>
          <div className="preview-name-label">Dear</div>
          <h3 className="preview-name">{displayName}</h3>
          <p className="preview-message">
            May this Diwali bring you endless joy, prosperity, and the warmth of
            loved ones. 🪔✨
          </p>
        </div>

        {/* Share Buttons */}
        <div className="share-buttons">
          <button className="share-btn whatsapp-btn" onClick={handleWhatsAppShare}>
            <span className="btn-icon">📱</span>
            <span>Share on WhatsApp</span>
          </button>

          <button className="share-btn download-btn" onClick={handleDownload}>
            <span className="btn-icon">📥</span>
            <span>Download Greeting</span>
          </button>

          <button className="share-btn copy-btn" onClick={handleCopyLink}>
            <span className="btn-icon">🔗</span>
            <span>{copied ? 'Copied!' : 'Copy Greeting Link'}</span>
          </button>
        </div>

        {/* Toast notification */}
        {copied && (
          <div className="toast">
            ✅ Link copied to clipboard!
          </div>
        )}

        {/* Restart */}
        <button className="restart-btn" onClick={onRestart}>
          🎇 Start Over
        </button>

        {/* About the Developer */}
        <div className="developer-section">
          <div className="dev-divider"></div>
          <a
            href="https://rahul-protfolio-orcin.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-card"
          >
            <div className="dev-avatar">👨‍💻</div>
            <div className="dev-info">
              <div className="dev-name">Rahul Prasad</div>
              <div className="dev-role">Developer & Creator</div>
            </div>
            <div className="dev-arrow">→</div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShareCard;

