import React, { useState } from 'react';
import { sfx } from '../utils/audio.js';
import { MascotFace } from './Mascot.jsx';

export default function QuizModal({ quiz, onSolved }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong

  function choose(i) {
    if (status === 'correct') return;
    setSelected(i);
    if (i === quiz.correctIndex) {
      setStatus('correct');
      sfx.correct();
      setTimeout(() => onSolved(), 850);
    } else {
      setStatus('wrong');
      sfx.wrong();
      setTimeout(() => setStatus('idle'), 500);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card quiz-card">
        <div className="quiz-header">
          <MascotFace size={48} />
          <h2>Spot the Logic</h2>
        </div>
        <p className="quiz-question">{quiz.question}</p>
        <div className="quiz-options">
          {quiz.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (selected === i && status === 'correct') cls += ' correct';
            else if (selected === i && status === 'wrong') cls += ' wrong';
            return (
              <button key={i} className={cls} onClick={() => choose(i)}>
                {opt}
              </button>
            );
          })}
        </div>
        {status === 'wrong' && <p className="quiz-feedback wrong-text">Not quite — take another look!</p>}
        {status === 'correct' && <p className="quiz-feedback correct-text">Exactly right! 🎉</p>}
      </div>
    </div>
  );
}
