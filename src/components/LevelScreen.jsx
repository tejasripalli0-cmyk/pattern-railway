import React, { useEffect, useMemo, useRef, useState } from 'react';
import Background from './Background.jsx';
import TopBar from './TopBar.jsx';
import TrackTile from './TrackTile.jsx';
import TrainAnimation from './TrainAnimation.jsx';
import QuizModal from './QuizModal.jsx';
import ResultModal from './ResultModal.jsx';
import Mascot from './Mascot.jsx';
import { tilesEqual, ROTATIONS_8 } from '../data/patterns.js';
import { WORLD_THEMES } from '../data/worldThemes.js';
import { sfx } from '../utils/audio.js';

const DECOR_TILE = { shape: 'straight', color: { id: 'deco', hex: '#8C97A6' }, rotation: 0, scale: 1 };

function scoreStars(wrongAttempts) {
  if (wrongAttempts === 0) return 3;
  if (wrongAttempts <= 2) return 2;
  return 1;
}

export default function LevelScreen({ level, isLastLevel, onExitToMap, onNextLevel, onLevelComplete, soundOn, onToggleSound }) {
  const buildInitialTray = () => level.tray.map((o) => ({ ...o, tile: { ...o.tile } }));

  const [tray, setTray] = useState(buildInitialTray);
  const [placed, setPlaced] = useState({}); // slotIndex -> tile
  const [selectedId, setSelectedId] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [flash, setFlash] = useState({}); // slotIndex -> 'correct' | 'wrong'
  const [trayFlash, setTrayFlash] = useState({}); // optionId -> 'wrong'
  const [phase, setPhase] = useState('playing'); // playing | training | quiz | result
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState(null); // { text, kind: 'good'|'bad' }
  const dragState = useRef(null);
  const [dragPos, setDragPos] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const solved = level.slots.length > 0 && level.slots.every((s) => placed[s.index]);

  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Fit every piece on screen (start + destination + approach + all tiles)
  // rather than forcing the player to scroll to see the full pattern.
  const tileSize = useMemo(() => {
    const slotsForApproach = level.length + 6;
    const available = Math.max(300, viewportWidth - 80);
    const perTile = available / slotsForApproach;
    return Math.max(38, Math.min(88, Math.floor(perTile)));
  }, [viewportWidth, level.length]);

  function resetAll() {
    setTray(buildInitialTray());
    setPlaced({});
    setSelectedId(null);
    setWrongAttempts(0);
    setFlash({});
    setPhase('playing');
    setShowHint(false);
  }

  // reset whenever a new level id is shown
  const lastLevelId = useRef(level.id);
  if (lastLevelId.current !== level.id) {
    lastLevelId.current = level.id;
    resetAll();
  }

  function attemptPlace(optionId, slotIndex) {
    if (placed[slotIndex]) return;
    const item = tray.find((t) => t.id === optionId);
    if (!item) return;
    const slot = level.slots.find((s) => s.index === slotIndex);
    if (!slot) return;

    if (tilesEqual(item.tile, slot.correct)) {
      setPlaced((p) => ({ ...p, [slotIndex]: item.tile }));
      setTray((t) => t.filter((x) => x.id !== optionId));
      setFlash((f) => ({ ...f, [slotIndex]: 'correct' }));
      sfx.correct();
      setMessage({ text: '✅ Correct!', kind: 'good' });
      setTimeout(() => setFlash((f) => ({ ...f, [slotIndex]: null })), 500);
    } else {
      setWrongAttempts((w) => w + 1);
      setFlash((f) => ({ ...f, [slotIndex]: 'wrong' }));
      setTrayFlash((f) => ({ ...f, [optionId]: 'wrong' }));
      sfx.wrong();
      setMessage({ text: '❌ Incorrect — try again!', kind: 'bad' });
      setTimeout(() => {
        setFlash((f) => ({ ...f, [slotIndex]: null }));
        setTrayFlash((f) => ({ ...f, [optionId]: null }));
      }, 500);
    }
    setSelectedId(null);
    setTimeout(() => setMessage(null), 1400);
  }

  function rotateOption(optionId) {
    sfx.rotate();
    setTray((t) =>
      t.map((o) => {
        if (o.id !== optionId) return o;
        const idx = ROTATIONS_8.indexOf(o.tile.rotation);
        const nextRotation = ROTATIONS_8[(idx + 1) % ROTATIONS_8.length];
        return { ...o, tile: { ...o.tile, rotation: nextRotation } };
      })
    );
  }

  function selectOption(id) {
    sfx.pickup();
    setSelectedId((cur) => (cur === id ? null : id));
  }

  // ---- pointer-based drag & drop -----------------------------------
  function onCardPointerDown(e, id) {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    dragState.current = { id, startX: e.clientX, startY: e.clientY, dragging: false };
  }
  function onCardPointerMove(e) {
    const ds = dragState.current;
    if (!ds) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
    if (!ds.dragging && Math.hypot(dx, dy) > 10) {
      ds.dragging = true;
      setDraggingId(ds.id);
    }
    if (ds.dragging) {
      setDragPos({ x: e.clientX, y: e.clientY });
    }
  }
  function onCardPointerUp(e, id) {
    const ds = dragState.current;
    if (ds && ds.dragging) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el && el.closest ? el.closest('.rail-slot') : null;
      if (slotEl) {
        const idx = Number(slotEl.getAttribute('data-slot-index'));
        attemptPlace(id, idx);
      }
    } else {
      selectOption(id);
    }
    dragState.current = null;
    setDraggingId(null);
    setDragPos(null);
  }

  function onSlotClick(index) {
    if (placed[index]) return;
    if (selectedId) {
      attemptPlace(selectedId, index);
    } else {
      sfx.click();
    }
  }

  const draggingItem = tray.find((t) => t.id === draggingId);

  // The instant every slot holds the correct piece, the train departs on
  // its own — no extra button press needed.
  useEffect(() => {
    if (solved && phase === 'playing') {
      sfx.success();
      const t = setTimeout(() => setPhase('training'), 650);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, phase]);

  useEffect(() => {
    if (phase === 'result') {
      onLevelComplete(level.id, scoreStars(wrongAttempts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <Background variant="level" theme={WORLD_THEMES[level.worldIndex]} floatingDensity="rich">
      <div
        className="level-screen"
        onPointerMove={onCardPointerMove}
      >
        <TopBar
          title={level.title}
          subtitle={`${level.difficulty} • ${level.slots.length} missing signal${level.slots.length > 1 ? 's' : ''}`}
          onBack={onExitToMap}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
        />

        <div className="level-toolbar">
          <button className="btn secondary small" onClick={() => { sfx.click(); resetAll(); }}>⟲ Restart Level</button>
          <button className="btn gold small" onClick={() => { sfx.click(); setShowHint((h) => !h); }}>
            💡 Hint
          </button>
        </div>

        {showHint && (
          <Mascot text={level.ruleText} onDismiss={() => setShowHint(false)} dismissLabel="Thanks!" size={52} className="hint-mascot" />
        )}

        <div className="rail-viewport">
          <div className="rail-container">
            <div className="rail-line" />
            <div className="station start-station"><span>🚉</span><p>Start</p></div>
            <div className="rail-approach">
              {[0, 1].map((i) => (
                <div className="rail-sleeper decor" key={`pre-${i}`}>
                  <TrackTile tile={DECOR_TILE} size={tileSize} />
                </div>
              ))}
            </div>
            <div className="rail-track">
              {level.sequence.map((tile, idx) => {
                const isSlot = level.slots.some((s) => s.index === idx);
                if (!isSlot) {
                  return (
                    <div className="rail-sleeper" key={idx}>
                      <TrackTile tile={tile} size={tileSize} />
                    </div>
                  );
                }
                const filledTile = placed[idx];
                return (
                  <div className="rail-sleeper" key={idx}>
                    <div
                      className={`rail-slot ${flash[idx] || ''}`}
                      data-slot-index={idx}
                      onClick={() => onSlotClick(idx)}
                    >
                      {filledTile ? (
                        <TrackTile tile={filledTile} size={tileSize} state="locked" />
                      ) : (
                        <TrackTile empty size={tileSize} state={flash[idx] || (selectedId ? 'targetable' : 'idle')} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rail-approach">
              {[0, 1].map((i) => (
                <div className="rail-sleeper decor" key={`post-${i}`}>
                  <TrackTile tile={DECOR_TILE} size={tileSize} />
                </div>
              ))}
            </div>
            <div className="station end-station"><span>🏁</span><p>Destination</p></div>
            <TrainAnimation running={phase === 'training'} onComplete={() => setPhase('quiz')} />
          </div>
        </div>

        <div className="options-tray">
          <p className="tray-label">Repair Pieces — tap or drag onto the track</p>
          <div className="tray-row">
            {tray.map((item) => (
              <div
                key={item.id}
                className={`tray-card ${selectedId === item.id ? 'selected' : ''} ${trayFlash[item.id] || ''} ${draggingId === item.id ? 'dragging-source' : ''}`}
                onPointerDown={(e) => onCardPointerDown(e, item.id)}
                onPointerUp={(e) => onCardPointerUp(e, item.id)}
              >
                <TrackTile tile={item.tile} size={Math.max(52, tileSize - 8)} />
                <button
                  className="rotate-btn"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); rotateOption(item.id); }}
                  aria-label="Rotate piece"
                >⟳</button>
              </div>
            ))}
            {tray.length === 0 && <p className="tray-empty">All pieces placed!</p>}
          </div>
        </div>

        {draggingItem && dragPos && (
          <div className="drag-ghost" style={{ left: dragPos.x, top: dragPos.y }}>
            <TrackTile tile={draggingItem.tile} size={Math.max(56, tileSize - 4)} />
          </div>
        )}

        {message && (
          <div className={`feedback-toast ${message.kind}`}>{message.text}</div>
        )}

        {solved && phase === 'playing' && (
          <div className="solved-banner">
            <p>🚂 All signals repaired — the train is departing!</p>
          </div>
        )}

        {phase === 'quiz' && (
          <QuizModal quiz={level.quiz} onSolved={() => setPhase('result')} />
        )}

        {phase === 'result' && (
          <ResultModal
            stars={scoreStars(wrongAttempts)}
            isLastLevel={isLastLevel}
            onNext={onNextLevel}
            onRestart={resetAll}
            onMap={onExitToMap}
          />
        )}
      </div>
    </Background>
  );
}
