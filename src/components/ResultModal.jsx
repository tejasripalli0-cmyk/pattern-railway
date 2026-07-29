import React, { useEffect } from 'react';
import { sfx } from '../utils/audio.js';

export default function ResultModal({ stars, isLastLevel, onNext, onRestart, onMap }) {
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < stars) sfx.star();
      i++;
      if (i > stars) clearInterval(t);
    }, 260);
    return () => clearInterval(t);
  }, [stars]);

  return (
    <div className="modal-overlay">
      <div className="modal-card result-card">
        <h2>Track Repaired!</h2>
        <p className="result-sub">The train made it safely to the destination.</p>
        <div className="result-stars">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`big-star ${i < stars ? 'won' : ''}`} style={{ animationDelay: `${i * 0.22}s` }}>★</span>
          ))}
        </div>
        <div className="result-actions">
          {!isLastLevel && (
            <button className="btn gold" onClick={() => { sfx.click(); onNext(); }}>Next Level →</button>
          )}
          <button className="btn secondary" onClick={() => { sfx.click(); onRestart(); }}>Restart Level</button>
          <button className="btn grass" onClick={() => { sfx.click(); onMap(); }}>Level Map</button>
        </div>
        {isLastLevel && <p className="result-sub">🎉 You've repaired every railway in the game!</p>}
      </div>
    </div>
  );
}
