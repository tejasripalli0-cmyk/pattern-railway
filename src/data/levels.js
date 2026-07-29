import { mulberry32, pick, pickN, shuffle, intBetween } from '../utils/rng.js';
import { GENERATORS, RULE_STATEMENTS, makeDistractor, tilesEqual } from './patterns.js';

export const WORLDS = [
  { name: 'Meadow Junction', blurb: 'Where every young engineer begins.' },
  { name: 'Sunflower Fields', blurb: 'Bright colours, gentle curves.' },
  { name: 'Pine Hollow', blurb: 'The forest teaches new shapes.' },
  { name: 'River Bend', blurb: 'Signals spin as the track turns.' },
  { name: 'Windmill Valley', blurb: 'Reflections across the water.' },
  { name: 'Canyon Pass', blurb: 'Steady turns along the ridge.' },
  { name: 'Harvest Farms', blurb: 'Watch the signals grow and shrink.' },
  { name: 'Frostpeak', blurb: 'Two rhythms, one track.' },
  { name: 'Starlight Prairie', blurb: 'Night riddles for sharp eyes.' },
  { name: 'Grand Terminus', blurb: 'The final stretch to glory.' },
];

function poolForTier(tier) {
  const pool = ['direction', 'color'];
  if (tier >= 2) pool.push('shape', 'rotationStep');
  if (tier >= 4) pool.push('mirror', 'mirrorShape');
  if (tier >= 6) pool.push('increasing');
  if (tier >= 8) pool.push('mixed');
  return pool;
}

function difficultyLabel(tier) {
  if (tier <= 1) return 'Easy';
  if (tier <= 4) return 'Medium';
  if (tier <= 7) return 'Hard';
  return 'Expert';
}

function buildLevel(index) {
  const rng = mulberry32(9000 + index * 37);
  const tier = Math.floor(index / 10);
  const worldIndex = tier;
  const levelInWorld = (index % 10) + 1;

  const length = Math.min(5 + tier, 12);
  const missingCount = Math.min(
    tier <= 2 ? 1 : tier <= 5 ? 2 : tier <= 7 ? 3 : 4,
    length - 3
  );

  const pool = poolForTier(tier);
  const type = pick(rng, pool);
  const gen = GENERATORS[type](rng, length);
  const { sequence, varyingAttrs, ruleText } = gen;

  // choose interior indices for missing pieces, spread apart
  const candidateIdx = [];
  for (let i = 1; i < length - 1; i++) candidateIdx.push(i);
  const missingIdx = pickN(rng, candidateIdx, missingCount).sort((a, b) => a - b);

  const slots = missingIdx.map((i) => ({ index: i, correct: sequence[i] }));

  const extra = missingCount <= 2 ? 2 : missingCount === 3 ? 2 : 1;
  const distractors = [];
  let tries = 0;
  while (distractors.length < extra && tries < 40) {
    tries++;
    const seedSlot = pick(rng, slots);
    const d = makeDistractor(rng, seedSlot.correct, varyingAttrs);
    const clashesWithSlot = slots.some((s) => tilesEqual(s.correct, d));
    const clashesWithDistractor = distractors.some((x) => tilesEqual(x, d));
    if (!clashesWithSlot && !clashesWithDistractor) distractors.push(d);
  }

  const trayRaw = [
    ...slots.map((s, i) => ({ id: `opt-${index}-c-${i}`, tile: s.correct, matchIndex: s.index })),
    ...distractors.map((d, i) => ({ id: `opt-${index}-d-${i}`, tile: d, matchIndex: null })),
  ];
  const tray = shuffle(rng, trayRaw);

  // quiz
  const otherTypes = Object.keys(RULE_STATEMENTS).filter((t) => t !== type);
  const wrongStatements = pickN(rng, otherTypes, 3).map((t) => RULE_STATEMENTS[t]);
  const quizOptions = shuffle(rng, [RULE_STATEMENTS[type], ...wrongStatements]);
  const correctIndex = quizOptions.indexOf(RULE_STATEMENTS[type]);

  return {
    id: index + 1,
    worldIndex,
    levelInWorld,
    title: `${WORLDS[worldIndex].name} ${levelInWorld}`,
    difficulty: difficultyLabel(tier),
    length,
    sequence,
    slots,
    tray,
    patternType: type,
    ruleText,
    quiz: {
      question: 'What pattern rule completes this railway?',
      options: quizOptions,
      correctIndex,
    },
  };
}

export const LEVELS = Array.from({ length: 100 }, (_, i) => buildLevel(i));

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

export function levelsByWorld() {
  const map = Array.from({ length: WORLDS.length }, () => []);
  LEVELS.forEach((l) => map[l.worldIndex].push(l));
  return map;
}
