// Lightweight synthesized sound effects using the Web Audio API.
// No external audio files are required, which keeps the game fast to load
// and easy to ship. All sounds are generated on the fly, routed through a
// master gain + limiter so everything is loud, punchy, and never clips.

let ctx = null;
let master = null;
let muted = false;

const MASTER_BOOST = 2.4; // overall loudness multiplier

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 1;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -8;
      limiter.knee.value = 12;
      limiter.ratio.value = 8;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.15;
      master.connect(limiter).connect(ctx.destination);
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
}
export function isMuted() {
  return muted;
}

function tone({ freq = 440, duration = 0.15, type = 'sine', gain = 0.18, delay = 0, sweep = null }) {
  const audio = getCtx();
  if (!audio || muted) return;
  const t0 = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(sweep, t0 + duration);
  const g0 = Math.min(1.2, gain * MASTER_BOOST);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(g0, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noiseBurst({ duration = 0.08, gain = 0.15, delay = 0, filterFreq = 900 }) {
  const audio = getCtx();
  if (!audio || muted) return;
  const t0 = audio.currentTime + delay;
  const bufferSize = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const g = audio.createGain();
  const g0 = Math.min(1.2, gain * MASTER_BOOST);
  g.gain.setValueAtTime(g0, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  src.connect(filter).connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  click: () => tone({ freq: 560, duration: 0.08, type: 'triangle', gain: 0.2 }),
  pickup: () => tone({ freq: 700, duration: 0.1, type: 'triangle', gain: 0.22 }),
  rotate: () => tone({ freq: 420, duration: 0.07, type: 'square', gain: 0.16 }),
  correct: () => {
    tone({ freq: 523.25, duration: 0.15, type: 'sine', gain: 0.34 });
    tone({ freq: 659.25, duration: 0.15, type: 'sine', gain: 0.26, delay: 0.07 });
    tone({ freq: 783.99, duration: 0.2, type: 'sine', gain: 0.34, delay: 0.14 });
  },
  wrong: () => {
    // A cartoonish "oops" glide (friendly, not harsh) so it's clearly
    // negative feedback without sounding like an alarm.
    tone({ freq: 330, duration: 0.16, type: 'triangle', gain: 0.28, sweep: 220 });
    tone({ freq: 220, duration: 0.22, type: 'triangle', gain: 0.24, sweep: 150, delay: 0.13 });
  },
  success: () => {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      tone({ freq: f, duration: 0.28, type: 'sine', gain: 0.36, delay: i * 0.1 })
    );
  },
  star: () => tone({ freq: 1200, duration: 0.18, type: 'sine', gain: 0.28, sweep: 1900 }),
  bell: () => {
    tone({ freq: 1568, duration: 0.55, type: 'sine', gain: 0.26 });
    tone({ freq: 2093, duration: 0.55, type: 'sine', gain: 0.2, delay: 0.05 });
    tone({ freq: 3136, duration: 0.45, type: 'sine', gain: 0.12, delay: 0.1 });
  },
  chug: (delay = 0) => {
    noiseBurst({ duration: 0.11, gain: 0.3, delay, filterFreq: 200 });
    tone({ freq: 90, duration: 0.09, type: 'sine', gain: 0.22, delay });
  },
  whistle: () => {
    tone({ freq: 523, duration: 0.8, type: 'sawtooth', gain: 0.26, sweep: 660 });
    tone({ freq: 660, duration: 0.8, type: 'triangle', gain: 0.2, sweep: 780, delay: 0.03 });
    tone({ freq: 784, duration: 0.7, type: 'sine', gain: 0.14, delay: 0.06 });
  },
  lock: () => tone({ freq: 200, duration: 0.1, type: 'square', gain: 0.16 }),
  swoosh: () => tone({ freq: 300, duration: 0.2, type: 'sine', gain: 0.18, sweep: 900 }),
};

// Plays a steady rhythmic "chug chug chug" while the train travels.
export function playTrainRun(durationMs) {
  const steps = Math.max(4, Math.floor(durationMs / 160));
  for (let i = 0; i < steps; i++) {
    sfx.chug((i * 160) / 1000);
  }
}
