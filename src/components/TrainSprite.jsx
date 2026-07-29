import React from 'react';

// A small multi-car train drawn in SVG. The engine leads at the FRONT
// (the right-hand edge of this sprite) since the train always travels
// left-to-right; carriages trail behind it to the left. A friendly face
// on the engine's leading edge makes the direction of travel unmistakable.
export default function TrainSprite({ compartments = 2, size = 1, puffing = false }) {
  const carColors = ['#2F6FED', '#F2B705', '#8E44AD'];
  const carWidth = 70;
  const engineWidth = 92;
  const gap = 10;
  const totalWidth = engineWidth + compartments * (carWidth + gap);
  const height = 96;

  return (
    <svg
      className={`train-sprite ${puffing ? 'puffing' : ''}`}
      width={totalWidth * size}
      height={height * size}
      viewBox={`0 0 ${totalWidth} ${height}`}
      aria-hidden="true"
    >
      {/* carriages trail behind the engine, rearmost first (leftmost) */}
      {Array.from({ length: compartments }).map((_, i) => {
        const x = i * (carWidth + gap);
        const color = carColors[i % carColors.length];
        return (
          <g key={i} transform={`translate(${x} 22)`}>
            <rect x="0" y="28" width="8" height="6" fill="#5A3A24" />
            <rect x="0" y="0" width={carWidth} height="52" rx="10" fill={color} stroke="#2B2417" strokeWidth="3.5" />
            <rect x="10" y="10" width="20" height="18" rx="4" fill="#DFF4FF" stroke="#2B2417" strokeWidth="2.5" />
            <rect x="40" y="10" width="20" height="18" rx="4" fill="#DFF4FF" stroke="#2B2417" strokeWidth="2.5" />
            <circle cx="16" cy="58" r="9" fill="#2B2417" />
            <circle cx="54" cy="58" r="9" fill="#2B2417" />
            <circle cx="16" cy="58" r="3.5" fill="#8C97A6" />
            <circle cx="54" cy="58" r="3.5" fill="#8C97A6" />
          </g>
        );
      })}

      {/* engine — always the rightmost (leading) element */}
      <g transform={`translate(${compartments * (carWidth + gap)} 10)`}>
        <rect x="0" y="20" width="10" height="6" fill="#5A3A24" />
        <rect x="20" y="0" width="14" height="20" rx="3" fill="#2B2417" />
        <circle className="engine-puff engine-puff-a" cx="27" cy="-4" r="7" fill="#fff" opacity="0" />
        <circle className="engine-puff engine-puff-b" cx="27" cy="-4" r="9" fill="#fff" opacity="0" />
        <rect x="0" y="14" width={engineWidth} height="58" rx="16" fill="#E4572E" stroke="#2B2417" strokeWidth="4" />
        <rect x="10" y="24" width="24" height="22" rx="5" fill="#DFF4FF" stroke="#2B2417" strokeWidth="2.5" />
        {/* face on the leading edge, so direction of travel is obvious */}
        <circle cx="70" cy="34" r="7" fill="#2B2417" />
        <circle cx="72" cy="32" r="2.4" fill="#fff" />
        <path d="M60 48 Q72 56 84 46" stroke="#2B2417" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="86" cy="40" r="9" fill="#FFE9A8" stroke="#2B2417" strokeWidth="2.5" />
        <circle cx="20" cy="78" r="10" fill="#2B2417" />
        <circle cx="46" cy="78" r="10" fill="#2B2417" />
        <circle cx="72" cy="78" r="10" fill="#2B2417" />
        <circle cx="20" cy="78" r="4" fill="#8C97A6" />
        <circle cx="46" cy="78" r="4" fill="#8C97A6" />
        <circle cx="72" cy="78" r="4" fill="#8C97A6" />
      </g>
    </svg>
  );
}
