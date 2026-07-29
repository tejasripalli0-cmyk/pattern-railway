# 🚂 Pattern Railway

An educational puzzle game built with React. Storms have knocked out signal
pieces along the railway — the player studies the repeating pattern of the
signals that survived, then repairs the missing ones so the train can ride
from the **Start Station** to the **Destination**.

## Running it

```bash
npm install
npm run dev       # local dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

No backend, no accounts, no API keys — it's a fully static site. `npm run
build` output in `dist/` can be dropped on any static host (Netlify, Vercel,
GitHub Pages, S3, etc).

## What's inside

- **100 hand-tuned procedurally generated levels** across **10 themed
  worlds** (`src/data/levels.js`), each built from 7 pattern families:
  direction, rotation-step, shape, colour, mirror/symmetry, increasing /
  decreasing size, and mixed (colour + direction together). Difficulty
  (track length, number of missing signals, distractor closeness) ramps up
  world by world.
- **World map** (`WorldMap.jsx`) — a Candy-Crush-style winding path of level
  nodes, grouped by world, showing lock state and up to 3 stars per level.
- **Puzzle screen** (`LevelScreen.jsx`) — the rail is drawn continuously;
  missing "signal" pieces are empty slots. Players **tap-to-select +
  tap-to-place**, or **drag pieces directly onto a slot** (built on native
  Pointer Events, so it works with mouse, touch, and pen alike). Every piece
  has a **rotate (⟳) control** for direction/rotation puzzles. Feedback is
  immediate: a green pop + chime on a correct placement, a red shake + buzz
  on a wrong one — wrong guesses cost stars, never a life, so the player can
  always keep trying.
- **Train animation** — once every slot is correctly filled, the player taps
  "Send the Train" and a train sprite travels the rail to the destination
  with a whistle, chugging rhythm, smoke puffs, and an arrival bell — all
  synthesized in `src/utils/audio.js` via the Web Audio API (no external
  sound files to download).
- **"Spot the Logic" quiz** — after the train arrives, a 4-option quiz asks
  the player to name the rule they just used (e.g. "the colours repeat a
  cycle" vs. "the shapes get bigger and smaller"), reinforcing the pattern
  vocabulary they just practiced.
- **Star rating, Next Level, and Restart Level** — 0 wrong placements = 3
  stars, 1–2 wrong = 2 stars, 3+ = 1 star. Stars and unlocked levels persist
  in `localStorage`.
- **First-time tutorial** with a conductor mascot, step-by-step guidance,
  and a **Skip** button, shown once via `localStorage` (also replayable from
  the home screen's "How to Play" button).
- **Sound toggle**, big rounded typography, and a calm, storybook village
  backdrop (hills, sun, clouds, trees) drawn entirely in SVG — no image
  assets required, so the whole game is a handful of KB.

## Project structure

```
src/
  data/
    patterns.js     shape/colour vocabulary + the 7 pattern generators
    levels.js        builds all 100 levels deterministically
  utils/
    rng.js           seeded PRNG so levels are stable across reloads
    audio.js         Web Audio synthesized sound effects
  components/
    Background.jsx   SVG village scenery
    HomeScreen.jsx    landing hero
    WorldMap.jsx      level-select map
    LevelNode.jsx     single level node/button
    LevelScreen.jsx   the puzzle itself (rail, tray, drag/drop, phases)
    TrackTile.jsx     renders one signal icon (shape/colour/rotation/scale)
    TrainAnimation.jsx the solved-level train run
    QuizModal.jsx     "Spot the Logic" post-solve quiz
    ResultModal.jsx   star rating + Next/Restart/Map
    Tutorial.jsx      first-time onboarding
    Mascot.jsx        conductor character used in tutorial + hints
    TopBar.jsx        shared header bar
  App.jsx             view routing + persisted progress
  App.css / index.css design tokens + all styling
```

## Design notes

Rather than requiring a full 2D pathfinding grid, the railway is modeled as
a single continuous rail (always visually connected) with a sequence of
signal markers mounted on it. This keeps the "continuous path from Start to
Destination" requirement simple and always true visually, while the actual
puzzle — the repeating pattern the player must complete — lives entirely in
the signal markers. It reads cleanly for every pattern family in the brief
(direction, rotation, shape, colour, mirror, increasing/decreasing, mixed)
without needing a different renderer per pattern type.

See `MOBILE_PLAN.md` for how this would be adapted into a native mobile app.
