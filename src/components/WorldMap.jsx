import React, { useMemo, useRef, useEffect } from 'react';
import Background from './Background.jsx';
import TopBar from './TopBar.jsx';
import LevelNode from './LevelNode.jsx';
import { WORLDS, levelsByWorld } from '../data/levels.js';

export default function WorldMap({ progress, onSelectLevel, onBack, totalStars, soundOn, onToggleSound }) {
  const worlds = useMemo(() => levelsByWorld(), []);
  const scrollRef = useRef(null);

  const nextPlayableId = useMemo(() => {
    for (const w of worlds) {
      for (const lvl of w) {
        if (!progress[lvl.id]) return lvl.id;
      }
    }
    return null;
  }, [worlds, progress]);

  useEffect(() => {
    const el = document.getElementById(`level-anchor-${nextPlayableId}`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, []); // eslint-disable-line

  return (
    <Background variant="map" floatingDensity="rich">
      <div className="world-map-screen">
        <TopBar
          title="Choose a Level"
          onBack={onBack}
          totalStars={totalStars}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
        />
        <div className="world-map-scroll" ref={scrollRef}>
          {worlds.map((levels, wi) => {
            const worldStars = levels.reduce((s, l) => s + (progress[l.id]?.stars || 0), 0);
            const worldUnlocked = wi === 0 || worlds[wi - 1].every((l) => progress[l.id]);
            return (
              <section className="world-section" key={wi}>
                <div className="world-header">
                  <h2>{WORLDS[wi].name}</h2>
                  <p>{WORLDS[wi].blurb}</p>
                  <div className="world-stars">
                    <span className="star-ic">★</span> {worldStars} / {levels.length * 3}
                  </div>
                </div>
                <div className="level-path">
                  {levels.map((lvl, li) => {
                    const isUnlockedWorld = worldUnlocked;
                    const prevDone = li === 0 ? isUnlockedWorld : !!progress[levels[li - 1].id];
                    const locked = !(isUnlockedWorld && prevDone);
                    const offsetX = Math.sin(li * 0.9) * 26;
                    return (
                      <div id={`level-anchor-${lvl.id}`} key={lvl.id}>
                        <LevelNode
                          level={lvl}
                          locked={locked}
                          stars={progress[lvl.id]?.stars || 0}
                          offsetX={offsetX}
                          current={lvl.id === nextPlayableId}
                          onSelect={onSelectLevel}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Background>
  );
}
