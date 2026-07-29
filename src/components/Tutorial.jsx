import React, { useState } from 'react';
import { MascotFace } from './Mascot.jsx';
import { sfx } from '../utils/audio.js';

const STEPS = [
  {
    title: 'Welcome, Engineer!',
    body: "Storms knocked out signals along the railway. I'm Rusty the conductor, and I'll show you how to fix them.",
  },
  {
    title: 'Spot the Pattern',
    body: 'Every railway repeats a pattern — a direction, a shape, a colour, or a rotation. Look at the signals that are still standing to figure out what comes next.',
  },
  {
    title: 'Place the Signal',
    body: 'Tap a signal piece below to select it, then tap the empty slot to place it. You can also drag a piece straight onto a slot.',
  },
  {
    title: 'Rotate to Fit',
    body: 'Some pieces need turning! Tap the ⟳ button on a piece to rotate it before placing it.',
  },
  {
    title: 'All Aboard!',
    body: "Fix every missing signal and the train will ride the rails to the destination. Ready to roll?",
  },
];

export default function Tutorial({ onFinish }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  function next() {
    sfx.click();
    if (isLast) onFinish();
    else setStep((s) => s + 1);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card tutorial-card">
        <button className="tutorial-skip" onClick={() => { sfx.click(); onFinish(); }}>Skip</button>
        <MascotFace size={72} />
        <h2>{STEPS[step].title}</h2>
        <p>{STEPS[step].body}</p>
        <div className="tutorial-dots">
          {STEPS.map((_, i) => <span key={i} className={i === step ? 'dot active' : 'dot'} />)}
        </div>
        <button className="btn gold" onClick={next}>{isLast ? "Let's Play!" : 'Next'}</button>
      </div>
    </div>
  );
}
