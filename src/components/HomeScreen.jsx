import React from 'react';
import Background from './Background.jsx';
import TrainSprite from './TrainSprite.jsx';
import { sfx } from '../utils/audio.js';

export default function HomeScreen({ onPlay, onHowToPlay, totalStars, soundOn, onToggleSound }) {
  return (
    <Background variant="day" floatingDensity="rich">
      <div className="home-screen">
        <button
          className="icon-btn home-sound-toggle"
          onClick={() => onToggleSound(!soundOn)}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>

        <div className="home-card">
          <p className="eyebrow">A repeating-pattern puzzle adventure</p>
          <h1 className="home-title">Pattern Railway</h1>
          <p className="home-tagline">Repair the tracks. Crack the pattern. Ride the rails.</p>

          <div className="home-rail-big">
            <div className="home-rail-line-big" />
            {Array.from({ length: 14 }).map((_, i) => (
              <div className="home-sleeper-big" key={i} style={{ left: `${3 + i * 7}%` }} />
            ))}
            <div className="home-flag start">🚉</div>
            <div className="home-flag end">🏁</div>
            <div className="home-train-track">
              <div className="home-train-loop">
                <TrainSprite compartments={2} puffing />
              </div>
            </div>
          </div>

          <div className="home-actions">
            <button
              className="btn gold big glow-pulse"
              onClick={() => { sfx.whistle(); onPlay(); }}
            >
              ▶ Play
            </button>
            <button className="btn secondary big" onClick={() => { sfx.click(); onHowToPlay(); }}>
              How to Play
            </button>
          </div>

          {totalStars > 0 && (
            <p className="home-progress"><span className="star-ic">★</span> {totalStars} stars collected so far</p>
          )}
        </div>
      </div>
    </Background>
  );
}
