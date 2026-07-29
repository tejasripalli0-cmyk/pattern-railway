import React, { useEffect, useState } from 'react';
import HomeScreen from './components/HomeScreen.jsx';
import WorldMap from './components/WorldMap.jsx';
import LevelScreen from './components/LevelScreen.jsx';
import Tutorial from './components/Tutorial.jsx';
import { LEVELS, getLevel } from './data/levels.js';
import { setMuted } from './utils/audio.js';
import './App.css';

const PROGRESS_KEY = 'pr_progress_v1';
const TUTORIAL_KEY = 'pr_tutorial_seen_v1';
const SOUND_KEY = 'pr_sound_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

export default function App() {
  const [view, setView] = useState('home'); // home | map | level
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [progress, setProgress] = useState(loadProgress);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem(SOUND_KEY) !== 'off');

  useEffect(() => {
    setMuted(!soundOn);
    localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off');
  }, [soundOn]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  function handlePlay() {
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      setShowTutorial(true);
    } else {
      setView('map');
    }
  }

  function finishTutorial() {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setShowTutorial(false);
    setView('map');
  }

  function handleSelectLevel(id) {
    setCurrentLevelId(id);
    setView('level');
  }

  function handleLevelComplete(id, stars) {
    setProgress((p) => {
      const prevStars = p[id]?.stars || 0;
      return { ...p, [id]: { stars: Math.max(prevStars, stars) } };
    });
  }

  function handleNextLevel() {
    const next = currentLevelId + 1;
    if (next <= LEVELS.length) {
      setCurrentLevelId(next);
    } else {
      setView('map');
    }
  }

  const totalStars = Object.values(progress).reduce((s, p) => s + (p.stars || 0), 0);
  const currentLevel = getLevel(currentLevelId);

  return (
    <div className="app-root">
      {view === 'home' && (
        <HomeScreen
          onPlay={handlePlay}
          onHowToPlay={() => setShowTutorial(true)}
          totalStars={totalStars}
          soundOn={soundOn}
          onToggleSound={setSoundOn}
        />
      )}

      {view === 'map' && (
        <WorldMap
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onBack={() => setView('home')}
          totalStars={totalStars}
          soundOn={soundOn}
          onToggleSound={setSoundOn}
        />
      )}

      {view === 'level' && currentLevel && (
        <LevelScreen
          key={currentLevel.id}
          level={currentLevel}
          isLastLevel={currentLevel.id === LEVELS.length}
          onExitToMap={() => setView('map')}
          onNextLevel={handleNextLevel}
          onLevelComplete={handleLevelComplete}
          soundOn={soundOn}
          onToggleSound={setSoundOn}
        />
      )}

      {showTutorial && <Tutorial onFinish={finishTutorial} />}
    </div>
  );
}
