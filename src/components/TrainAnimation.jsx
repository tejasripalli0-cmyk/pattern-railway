import React, { useEffect } from 'react';
import { sfx, playTrainRun } from '../utils/audio.js';
import TrainSprite from './TrainSprite.jsx';

const DURATION_MS = 3200;

export default function TrainAnimation({ running, onComplete }) {
  useEffect(() => {
    if (!running) return;
    sfx.whistle();
    playTrainRun(DURATION_MS - 300);
    const bellTimer = setTimeout(() => sfx.bell(), DURATION_MS - 250);
    const doneTimer = setTimeout(() => onComplete && onComplete(), DURATION_MS + 200);
    return () => {
      clearTimeout(bellTimer);
      clearTimeout(doneTimer);
    };
  }, [running]); // eslint-disable-line

  return (
    <div
      className={`traveling-train ${running ? 'running' : ''}`}
      style={{ transitionDuration: running ? `${DURATION_MS}ms` : '0ms' }}
      aria-hidden="true"
    >
      <TrainSprite compartments={2} puffing={running} />
    </div>
  );
}
