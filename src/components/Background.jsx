import React from 'react';
import FloatingLayer from './FloatingLayer.jsx';
import { themeToVars } from '../data/worldThemes.js';

// A calm, storybook village backdrop, built purely from SVG shapes so no
// external image assets are required. `variant` slightly tunes layout,
// `theme` (optional, from worldThemes.js) recolours the whole scene so
// each world/level feels different, and `floating` toggles the ambient
// drifting decorations (clouds, balloon, birds...).
export default function Background({ variant = 'day', theme = null, floating = true, floatingDensity = 'normal', children }) {
  const isNight = !!(theme && theme.night);
  return (
    <div className={`scenic-bg ${variant} ${isNight ? 'night' : ''}`} style={themeToVars(theme)}>
      <svg className="scenic-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sky-top)" />
            <stop offset="100%" stopColor="var(--sky-bottom)" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--hill-far)" />
            <stop offset="100%" stopColor="var(--hill-near)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="600" fill="url(#skyGrad)" />
        {isNight ? (
          <g>
            {[...Array(28)].map((_, i) => {
              const x = (i * 149) % 1000;
              const y = (i * 83) % 260;
              return <circle key={i} cx={x} cy={y + 10} r={i % 4 === 0 ? 2.4 : 1.4} fill="#fff" opacity={0.5 + (i % 5) * 0.1} />;
            })}
            <circle cx="820" cy="90" r="42" fill="#FFF7E8" opacity="0.9" />
          </g>
        ) : (
          <>
            <circle cx="860" cy="110" r="60" fill="var(--gold)" opacity="0.85" />
            <g opacity="0.9">
              <ellipse cx="150" cy="120" rx="55" ry="20" fill="white" opacity="0.7" />
              <ellipse cx="200" cy="130" rx="40" ry="16" fill="white" opacity="0.7" />
              <ellipse cx="640" cy="90" rx="45" ry="16" fill="white" opacity="0.6" />
            </g>
          </>
        )}
        <path d="M0 360 Q150 300 320 350 T650 340 T1000 370 V600 H0 Z" fill="url(#hillFar)" opacity="0.8" />
        <path d="M0 430 Q200 380 420 425 T800 415 T1000 440 V600 H0 Z" fill="var(--grass)" />
        <path d="M0 480 Q250 450 500 480 T1000 470 V600 H0 Z" fill="var(--grass-deep)" />
        {[70, 930].map((x, i) => (
          <g key={i} transform={`translate(${x} 375)`} opacity="0.85">
            <rect x="-6" y="10" width="12" height="30" fill="var(--wood-dark)" />
            <circle cx="0" cy="0" r="22" fill="var(--hill-near)" />
            <circle cx="-13" cy="8" r="15" fill="var(--hill-near)" />
            <circle cx="13" cy="8" r="15" fill="var(--hill-near)" />
          </g>
        ))}

        {/* Village windmill — anchors the "not-a-city" countryside feel */}
        <g className="windmill" transform="translate(120 300)" opacity="0.92">
          <rect x="-10" y="10" width="20" height="70" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="2" />
          <polygon points="-14,10 14,10 8,-8 -8,-8" fill="var(--wood)" stroke="var(--wood-dark)" strokeWidth="2" />
          <g className="windmill__blades">
            <rect x="-3" y="-46" width="6" height="46" rx="3" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="1.5" transform="rotate(0 0 0)" />
            <rect x="-3" y="-46" width="6" height="46" rx="3" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="1.5" transform="rotate(90 0 0)" />
            <rect x="-3" y="-46" width="6" height="46" rx="3" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="1.5" transform="rotate(180 0 0)" />
            <rect x="-3" y="-46" width="6" height="46" rx="3" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="1.5" transform="rotate(270 0 0)" />
          </g>
        </g>

        {/* Little farmhouse on the opposite hill */}
        <g transform="translate(860 330)" opacity="0.92">
          <rect x="-24" y="0" width="48" height="34" fill="var(--cream)" stroke="var(--wood-dark)" strokeWidth="2" />
          <polygon points="-30,0 30,0 0,-24" fill="var(--signal)" stroke="var(--wood-dark)" strokeWidth="2" />
          <rect x="-6" y="14" width="12" height="20" fill="var(--wood)" />
          <rect x="8" y="8" width="8" height="8" fill="var(--sky-top)" stroke="var(--wood-dark)" strokeWidth="1.5" />
        </g>

        {/* A low row of wheat stalks along the near field, so the train
            visibly runs between crops rather than empty grass */}
        <g opacity="0.8">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = 10 + i * 25;
            return (
              <g key={i} transform={`translate(${x} 520)`}>
                <line x1="0" y1="0" x2="0" y2="-16" stroke="var(--grass-deep)" strokeWidth="2" />
                <circle cx="0" cy="-18" r="3" fill="var(--gold)" opacity="0.85" />
              </g>
            );
          })}
        </g>
      </svg>
      {floating && <FloatingLayer density={floatingDensity} />}
      {children}
    </div>
  );
}
