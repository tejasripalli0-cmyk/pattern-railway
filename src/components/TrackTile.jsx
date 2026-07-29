import React from 'react';

// Renders one railway puzzle piece. Unlike a symbol sitting on a neutral
// rail, the piece IS the track: its shape decides which way it runs
// (straight / diagonal / curving left / curving right / crossing), its
// colour tints the rails themselves, and curveLeft/curveRight are literal
// mirror images of one another.

const TIE_POSITIONS = [14, 32, 50, 68, 86];

function Ties({ opacity = 1 }) {
  return (
    <g opacity={opacity}>
      {TIE_POSITIONS.map((x) => (
        <rect key={x} x={x - 5} y="32" width="10" height="36" rx="2.5" fill="var(--wood)" />
      ))}
    </g>
  );
}

function RailArt({ shape, hex }) {
  const dark = 'rgba(0,0,0,0.22)';
  switch (shape) {
    case 'straight':
      return (
        <g>
          <Ties />
          <line x1="0" y1="50" x2="100" y2="50" stroke={hex} strokeWidth="18" strokeLinecap="round" />
          <line x1="4" y1="50" x2="96" y2="50" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'diagonal':
      return (
        <g transform="rotate(45 50 50)">
          <Ties />
          <line x1="0" y1="50" x2="100" y2="50" stroke={hex} strokeWidth="18" strokeLinecap="round" />
          <line x1="4" y1="50" x2="96" y2="50" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'curveLeft':
      return (
        <g>
          <path d="M50 97 A47 47 0 0 1 3 50" stroke="var(--wood)" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.55" />
          <path d="M50 97 A47 47 0 0 1 3 50" stroke={hex} strokeWidth="17" fill="none" strokeLinecap="round" />
          <path d="M50 93 A43 43 0 0 1 7 50" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'curveRight':
      return (
        <g>
          <path d="M50 97 A47 47 0 0 0 97 50" stroke="var(--wood)" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.55" />
          <path d="M50 97 A47 47 0 0 0 97 50" stroke={hex} strokeWidth="17" fill="none" strokeLinecap="round" />
          <path d="M50 93 A43 43 0 0 0 93 50" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'cross':
      return (
        <g>
          <Ties />
          <line x1="0" y1="50" x2="100" y2="50" stroke={hex} strokeWidth="16" strokeLinecap="round" />
          <line x1="50" y1="0" x2="50" y2="100" stroke={hex} strokeWidth="16" strokeLinecap="round" />
          <circle cx="50" cy="50" r="9" fill={dark} />
        </g>
      );
    default:
      return (
        <g>
          <Ties />
          <line x1="0" y1="50" x2="100" y2="50" stroke={hex} strokeWidth="18" strokeLinecap="round" />
        </g>
      );
  }
}

export default function TrackTile({ tile, size = 56, empty = false, state = 'idle' }) {
  if (empty) {
    return (
      <div
        className={`track-tile empty-slot ${state}`}
        style={{ width: size, height: size }}
        aria-label="Missing track piece"
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="4" y="4" width="92" height="92" rx="18" className="empty-slot-outline" />
          <g opacity="0.3">
            <Ties opacity={0.6} />
            <line x1="6" y1="50" x2="94" y2="50" stroke="var(--steel-dark)" strokeWidth="10" strokeDasharray="8 7" strokeLinecap="round" />
          </g>
          <text x="50" y="66" textAnchor="middle" fontSize="42" className="empty-slot-mark">?</text>
        </svg>
      </div>
    );
  }

  const { shape, color, rotation, scale } = tile;
  return (
    <div className={`track-tile filled ${state}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="2" y="2" width="96" height="96" rx="16" className="track-tile-plank" />
        <g
          style={{
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transformOrigin: '50px 50px',
            transition: 'transform 0.18s ease',
          }}
        >
          <RailArt shape={shape} hex={color.hex} />
        </g>
      </svg>
    </div>
  );
}
