import React from 'react';
import { sfx } from '../utils/audio.js';

export default function LevelNode({ level, locked, stars, offsetX, current, onSelect }) {
  return (
    <div className="level-node-row" style={{ '--offset': `${offsetX}%` }}>
      <button
        className={`level-node ${locked ? 'locked' : 'unlocked'} ${current ? 'current' : ''}`}
        disabled={locked}
        onClick={() => { if (!locked) { sfx.click(); onSelect(level.id); } }}
        aria-label={locked ? `Level ${level.levelInWorld}, locked` : `Level ${level.levelInWorld}, ${level.difficulty}`}
      >
        {locked ? <span className="lock-ic">🔒</span> : <span className="level-num">{level.levelInWorld}</span>}
      </button>
      {!locked && (
        <div className="level-stars" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>★</span>
          ))}
        </div>
      )}
    </div>
  );
}
