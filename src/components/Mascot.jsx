import React from 'react';

export function MascotFace({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="var(--gold)" stroke="#2B2417" strokeWidth="4" />
      <circle cx="34" cy="46" r="7" fill="#2B2417" />
      <circle cx="66" cy="46" r="7" fill="#2B2417" />
      <path d="M32 64 Q50 80 68 64" stroke="#2B2417" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="20" y="14" width="60" height="14" rx="7" fill="var(--signal)" stroke="#2B2417" strokeWidth="3" />
      <rect x="34" y="4" width="32" height="14" rx="4" fill="var(--signal)" stroke="#2B2417" strokeWidth="3" />
    </svg>
  );
}

export default function Mascot({ text, onDismiss, dismissLabel = 'Got it', size = 64, className = '' }) {
  return (
    <div className={`mascot-wrap ${className}`}>
      <div className="mascot-face"><MascotFace size={size} /></div>
      {text && (
        <div className="mascot-bubble">
          <p>{text}</p>
          {onDismiss && (
            <button className="btn gold small" onClick={onDismiss}>{dismissLabel}</button>
          )}
        </div>
      )}
    </div>
  );
}
