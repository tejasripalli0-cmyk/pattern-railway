import React from 'react';
import { isMuted, setMuted, sfx } from '../utils/audio.js';

export default function TopBar({ title, subtitle, onBack, totalStars, onToggleSound, soundOn }) {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        {onBack && (
          <button className="icon-btn" onClick={() => { sfx.click(); onBack(); }} aria-label="Back">←</button>
        )}
      </div>
      <div className="top-bar-center">
        <h1 className="top-bar-title">{title}</h1>
        {subtitle && <p className="top-bar-subtitle">{subtitle}</p>}
      </div>
      <div className="top-bar-right">
        {typeof totalStars === 'number' && (
          <div className="star-counter" aria-label={`${totalStars} stars collected`}>
            <span className="star-ic">★</span>{totalStars}
          </div>
        )}
        <button
          className="icon-btn"
          onClick={() => { onToggleSound(!soundOn); }}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
}
