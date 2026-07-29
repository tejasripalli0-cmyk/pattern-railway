import React from 'react';

// Purely decorative, gently drifting objects that sit in the empty side
// margins of wide screens (and drift softly over the scene everywhere else)
// so the page always feels alive and never flat. Pointer-events are
// disabled so they never block taps.

function Cloud({ style }) {
  return (
    <svg viewBox="0 0 120 60" style={style} className="floaty">
      <ellipse cx="30" cy="38" rx="26" ry="18" fill="white" opacity="0.85" />
      <ellipse cx="60" cy="28" rx="32" ry="24" fill="white" opacity="0.85" />
      <ellipse cx="92" cy="38" rx="24" ry="16" fill="white" opacity="0.85" />
    </svg>
  );
}

function Balloon({ style }) {
  return (
    <svg viewBox="0 0 60 110" style={style} className="floaty">
      <path d="M30 4 C50 4 54 34 44 52 C38 62 22 62 16 52 C6 34 10 4 30 4 Z" fill="var(--signal)" stroke="#2B2417" strokeWidth="2.5" />
      <line x1="24" y1="60" x2="18" y2="84" stroke="#2B2417" strokeWidth="2" />
      <line x1="36" y1="60" x2="42" y2="84" stroke="#2B2417" strokeWidth="2" />
      <rect x="16" y="84" width="28" height="18" rx="4" fill="var(--wood)" stroke="#2B2417" strokeWidth="2.5" />
    </svg>
  );
}

function Bird({ style }) {
  return (
    <svg viewBox="0 0 40 20" style={style} className="floaty bird">
      <path d="M2 12 Q10 0 20 10 Q30 0 38 12" stroke="#2B2417" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SignalFlag({ style, color }) {
  return (
    <svg viewBox="0 0 40 60" style={style} className="floaty">
      <line x1="4" y1="4" x2="4" y2="56" stroke="var(--wood)" strokeWidth="4" />
      <path d="M4 6 L36 14 L4 24 Z" fill={color} stroke="#2B2417" strokeWidth="2" />
    </svg>
  );
}

function Gear({ style }) {
  return (
    <svg viewBox="0 0 60 60" style={style} className="floaty spin-slow">
      <g fill="var(--steel)" stroke="#2B2417" strokeWidth="2">
        <circle cx="30" cy="30" r="16" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="27" y="2" width="6" height="12" rx="2" transform={`rotate(${i * 45} 30 30)`} />
        ))}
      </g>
      <circle cx="30" cy="30" r="7" fill="var(--cream)" stroke="#2B2417" strokeWidth="2" />
    </svg>
  );
}

// New: a fluttering butterfly with a soft wing-flap animation
function Butterfly({ style, color = 'var(--signal)' }) {
  return (
    <svg viewBox="0 0 44 34" style={style} className="floaty butterfly">
      <g className="butterfly__wings">
        <ellipse cx="14" cy="14" rx="12" ry="9" fill={color} opacity="0.9" />
        <ellipse cx="14" cy="24" rx="8" ry="6" fill={color} opacity="0.7" />
        <ellipse cx="30" cy="14" rx="12" ry="9" fill={color} opacity="0.9" />
        <ellipse cx="30" cy="24" rx="8" ry="6" fill={color} opacity="0.7" />
      </g>
      <line x1="22" y1="6" x2="22" y2="28" stroke="#2B2417" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// New: a warm glowing firefly / spark — uses an actual radial glow via
// filter + box-shadow-like layered circles, fitting the countryside dusk.
function Firefly({ style }) {
  return (
    <svg viewBox="0 0 30 30" style={style} className="floaty firefly">
      <circle cx="15" cy="15" r="10" fill="var(--gold)" opacity="0.25" />
      <circle cx="15" cy="15" r="5" fill="var(--gold)" opacity="0.55" />
      <circle cx="15" cy="15" r="2.4" fill="#FFFDE8" />
    </svg>
  );
}

// New: a drifting leaf/petal, tumbling gently as it floats
function Leaf({ style, color = 'var(--grass-deep)' }) {
  return (
    <svg viewBox="0 0 28 28" style={style} className="floaty leaf">
      <path d="M14 2 C22 6 26 16 14 26 C2 16 6 6 14 2 Z" fill={color} stroke="#2B2417" strokeWidth="1.5" opacity="0.9" />
      <line x1="14" y1="6" x2="14" y2="22" stroke="#2B2417" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// New: a sunflower head bobbing gently — pure village/field flavor
function Sunflower({ style }) {
  return (
    <svg viewBox="0 0 40 40" style={style} className="floaty">
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <ellipse key={i} cx="20" cy="8" rx="4" ry="9" fill="var(--gold)" transform={`rotate(${i * 36} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="8" fill="var(--wood-dark)" />
      </g>
    </svg>
  );
}

const DENSITY_MULTIPLIER = { low: 0.6, normal: 1, rich: 1.6 };

export default function FloatingLayer({ density = 'normal' }) {
  const extra = density === 'rich';
  return (
    <div className="floating-layer" aria-hidden="true">
      <Cloud style={{ top: '8%', left: '2%', width: 100, animationDuration: '22s' }} />
      <Cloud style={{ top: '16%', right: '3%', width: 130, animationDuration: '26s', animationDelay: '-6s' }} />
      <Cloud style={{ top: '58%', left: '5%', width: 80, animationDuration: '19s', animationDelay: '-3s' }} />
      <Balloon style={{ top: '30%', right: '6%', width: 54, animationDuration: '7s' }} />
      <Balloon style={{ top: '68%', left: '4%', width: 40, animationDuration: '8.5s', animationDelay: '-2s' }} />
      <Bird style={{ top: '22%', left: '14%', width: 34, animationDuration: '14s' }} />
      <Bird style={{ top: '24%', left: '19%', width: 26, animationDuration: '14s', animationDelay: '-1.4s' }} />
      <Bird style={{ top: '76%', right: '16%', width: 30, animationDuration: '16s', animationDelay: '-5s' }} />
      <SignalFlag color="var(--gold)" style={{ top: '46%', right: '3%', width: 34, animationDuration: '6s' }} />
      <SignalFlag color="var(--success)" style={{ top: '82%', right: '8%', width: 28, animationDuration: '6.5s', animationDelay: '-2s' }} />

      {/* Village/field flavor — butterflies, fireflies, leaves, sunflowers */}
      <Butterfly style={{ top: '38%', left: '8%', width: 30, animationDuration: '5.5s' }} color="var(--signal)" />
      <Butterfly style={{ top: '64%', right: '12%', width: 26, animationDuration: '6.2s', animationDelay: '-1.8s' }} color="var(--gold)" />
      <Firefly style={{ top: '50%', left: '18%', width: 22, animationDuration: '4.2s' }} />
      <Firefly style={{ top: '20%', right: '22%', width: 18, animationDuration: '4.8s', animationDelay: '-1.4s' }} />
      <Firefly style={{ top: '80%', left: '30%', width: 20, animationDuration: '5.1s', animationDelay: '-2.6s' }} />
      <Leaf style={{ top: '12%', left: '32%', width: 22, animationDuration: '9s' }} />
      <Leaf style={{ top: '70%', right: '30%', width: 18, animationDuration: '10.5s', animationDelay: '-3s' }} color="var(--grass)" />
      <Sunflower style={{ top: '86%', left: '10%', width: 36, animationDuration: '6.8s' }} />
      <Sunflower style={{ top: '6%', right: '9%', width: 30, animationDuration: '7.4s', animationDelay: '-2s' }} />

      {extra && (
        <>
          <Gear style={{ top: '40%', left: '2%', width: 44, animationDuration: '9s' }} />
          <SignalFlag color="var(--signal)" style={{ top: '10%', left: '9%', width: 26, animationDuration: '6.2s', animationDelay: '-1s' }} />
          <Butterfly style={{ top: '12%', left: '46%', width: 22, animationDuration: '5.8s', animationDelay: '-0.6s' }} color="var(--success)" />
          <Firefly style={{ top: '34%', right: '5%', width: 16, animationDuration: '4.6s', animationDelay: '-0.9s' }} />
          <Firefly style={{ top: '60%', left: '4%', width: 24, animationDuration: '5.3s', animationDelay: '-1.1s' }} />
          <Leaf style={{ top: '48%', right: '4%', width: 20, animationDuration: '8.4s', animationDelay: '-1.6s' }} color="var(--hill-near)" />
          <Sunflower style={{ top: '46%', left: '50%', width: 24, animationDuration: '6.4s', animationDelay: '-1.2s' }} />
        </>
      )}
    </div>
  );
}
