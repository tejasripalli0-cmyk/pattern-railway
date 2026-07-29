import { pick, pickN, shuffle, intBetween } from '../utils/rng.js';

// Every puzzle piece IS a piece of track (not a symbol sitting on a track).
// "straight"/"diagonal" pieces rotate to point in a direction; "curveLeft"
// and "curveRight" are literal mirror images of each other; "cross" is a
// junction. The colour tints the rails themselves.
export const SHAPES = ['straight', 'diagonal', 'curveLeft', 'curveRight', 'cross'];

export const COLORS = [
  { id: 'red', hex: '#E4572E', name: 'Red' },
  { id: 'green', hex: '#3F9142', name: 'Green' },
  { id: 'blue', hex: '#2F6FED', name: 'Blue' },
  { id: 'gold', hex: '#F2B705', name: 'Gold' },
  { id: 'purple', hex: '#8E44AD', name: 'Purple' },
  { id: 'teal', hex: '#17A2A2', name: 'Teal' },
];

export const ROTATIONS_8 = [0, 45, 90, 135, 180, 225, 270, 315];
export const SCALES = [0.7, 0.85, 1, 1.15];

export function tilesEqual(a, b) {
  return (
    a.shape === b.shape &&
    a.color.id === b.color.id &&
    a.rotation === b.rotation &&
    a.scale === b.scale
  );
}

function base(shape, color, rotation = 0, scale = 1) {
  return { shape, color, rotation, scale };
}

// ---- Pattern family generators ----------------------------------------
// Each returns { sequence, type, ruleText, varyingAttrs }

function genDirection(rng, length) {
  const cycleLen = intBetween(rng, 2, 3);
  const cycle = pickN(rng, ROTATIONS_8, cycleLen).sort(() => rng() - 0.5);
  const color = pick(rng, COLORS);
  const shape = pick(rng, ['straight', 'diagonal']);
  const sequence = Array.from({ length }, (_, i) => base(shape, color, cycle[i % cycle.length], 1));
  return {
    type: 'direction',
    varyingAttrs: ['rotation'],
    ruleText: `The track pieces repeat a cycle of ${cycleLen} directions, over and over.`,
    sequence,
  };
}

function genRotationStep(rng, length) {
  const shape = pick(rng, ['straight', 'diagonal']);
  const color = pick(rng, COLORS);
  const step = pick(rng, [45, 90]);
  const start = pick(rng, ROTATIONS_8);
  const sequence = Array.from({ length }, (_, i) =>
    base(shape, color, (start + i * step) % 360, 1)
  );
  return {
    type: 'rotationStep',
    varyingAttrs: ['rotation'],
    ruleText: `Each track piece turns another ${step}° from the one before it, like a clock hand.`,
    sequence,
  };
}

function genShape(rng, length) {
  const cycleLen = intBetween(rng, 2, 4);
  const cycle = pickN(rng, SHAPES, cycleLen);
  const color = pick(rng, COLORS);
  const sequence = Array.from({ length }, (_, i) => base(cycle[i % cycle.length], color, 0, 1));
  return {
    type: 'shape',
    varyingAttrs: ['shape'],
    ruleText: `The track piece style repeats a cycle of ${cycleLen}: ${cycle.join(' → ')}.`,
    sequence,
  };
}

function genColor(rng, length) {
  const cycleLen = intBetween(rng, 2, 4);
  const cycle = pickN(rng, COLORS, cycleLen);
  const shape = pick(rng, SHAPES);
  const sequence = Array.from({ length }, (_, i) => base(shape, cycle[i % cycle.length], 0, 1));
  return {
    type: 'color',
    varyingAttrs: ['color'],
    ruleText: `The track colours repeat a cycle of ${cycleLen}: ${cycle.map((c) => c.name).join(' → ')}.`,
    sequence,
  };
}

function genMirror(rng, length) {
  const shape = pick(rng, SHAPES);
  const half = Math.ceil(length / 2);
  const palette = pickN(rng, COLORS, Math.min(4, COLORS.length));
  const firstHalf = Array.from({ length: half }, () => pick(rng, palette));
  const sequence = Array.from({ length }, (_, i) => {
    const mirroredIndex = i < half ? i : length - 1 - i;
    return base(shape, firstHalf[mirroredIndex], 0, 1);
  });
  return {
    type: 'mirror',
    varyingAttrs: ['color'],
    ruleText: `The track is a mirror: colours on the second half reflect the first half.`,
    sequence,
  };
}

// A literal mirror-image pattern: curveLeft/curveRight pieces (true mirror
// shapes of each other) arranged as a palindrome around the centre.
function genMirrorShape(rng, length) {
  const color = pick(rng, COLORS);
  const half = Math.ceil(length / 2);
  const firstHalf = Array.from({ length: half }, () => pick(rng, ['curveLeft', 'curveRight']));
  const sequence = Array.from({ length }, (_, i) => {
    const mirroredIndex = i < half ? i : length - 1 - i;
    const isMirroredSide = i >= half && length % 2 === 0 ? true : i >= half;
    let shape = firstHalf[mirroredIndex];
    // on the reflected side, a mirrored curve literally flips left<->right
    if (i >= half) shape = shape === 'curveLeft' ? 'curveRight' : 'curveLeft';
    return base(shape, color, 0, 1);
  });
  return {
    type: 'mirrorShape',
    varyingAttrs: ['shape'],
    ruleText: `The curves are literal mirror images: the second half flips every curve left-to-right.`,
    sequence,
  };
}

function genIncreasing(rng, length) {
  const shape = pick(rng, SHAPES);
  const color = pick(rng, COLORS);
  const cycle = [...SCALES];
  const sequence = Array.from({ length }, (_, i) => base(shape, color, 0, cycle[i % cycle.length]));
  return {
    type: 'increasing',
    varyingAttrs: ['scale'],
    ruleText: `The track pieces grow bigger then reset to small again, in a steady repeating cycle.`,
    sequence,
  };
}

function genMixed(rng, length) {
  const colorCycle = pickN(rng, COLORS, intBetween(rng, 2, 3));
  const rotCycle = pickN(rng, ROTATIONS_8, intBetween(rng, 2, 3));
  const shape = pick(rng, ['straight', 'diagonal']);
  const sequence = Array.from({ length }, (_, i) =>
    base(shape, colorCycle[i % colorCycle.length], rotCycle[i % rotCycle.length], 1)
  );
  return {
    type: 'mixed',
    varyingAttrs: ['color', 'rotation'],
    ruleText: `Two patterns run at once: colour cycles on its own rhythm while direction cycles on another.`,
    sequence,
  };
}

export const GENERATORS = {
  direction: genDirection,
  rotationStep: genRotationStep,
  shape: genShape,
  color: genColor,
  mirror: genMirror,
  mirrorShape: genMirrorShape,
  increasing: genIncreasing,
  mixed: genMixed,
};

export const RULE_STATEMENTS = {
  direction: 'The track pieces repeat a fixed cycle of directions.',
  rotationStep: 'Each track piece rotates a fixed amount further than the one before it.',
  shape: 'The style of each track piece repeats in a steady cycle.',
  color: 'The colour of each track piece repeats in a steady cycle.',
  mirror: 'The second half of the track mirrors the colours of the first half.',
  mirrorShape: 'The curves are literal mirror images across the middle of the track.',
  increasing: 'The track pieces grow and shrink in a steady repeating cycle of sizes.',
  mixed: 'Two patterns overlap: colour and direction each cycle at their own rhythm.',
};

// Builds a "near miss" distractor tile: same descriptor but one varying
// attribute nudged to a different, still-plausible value.
export function makeDistractor(rng, correct, varyingAttrs) {
  const clone = { ...correct };
  const attr = pick(rng, varyingAttrs);
  if (attr === 'rotation') {
    let r;
    do {
      r = pick(rng, ROTATIONS_8);
    } while (r === correct.rotation);
    clone.rotation = r;
  } else if (attr === 'shape') {
    let s;
    do {
      s = pick(rng, SHAPES);
    } while (s === correct.shape);
    clone.shape = s;
  } else if (attr === 'color') {
    let c;
    do {
      c = pick(rng, COLORS);
    } while (c.id === correct.color.id);
    clone.color = c;
  } else if (attr === 'scale') {
    let s;
    do {
      s = pick(rng, SCALES);
    } while (s === correct.scale);
    clone.scale = s;
  }
  return clone;
}
