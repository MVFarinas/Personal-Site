// Scene units: 1 unit = book height. Starting values; tune visually.

export const BOOK = {
  height: 1,
  depth: 0.68,
  defaultThickness: 0.28,
  centerY: 0.5,
};

export const RING = {
  spineRadius: 2.4,
};

export const HOLDER = {
  baseRadius: 2.6,
  baseThickness: 0.12,
  ridgeInner: 0.9,
  ridgeOuter: 2.5,
  ridgeWidth: 0.03,
  ridgeHeight: 0.08,
  hubRadius: 0.6,
  postRadius: 0.05,
  postRingRadius: 2.5,
  postCount: 4,
  lidRadius: 2.7,
  lidThickness: 0.1,
  lidBottom: 1.1,
};

export const COLORS = {
  paper: '#f3efe6',
  background: '#f6f5f1',
};

export const CAMERA = {
  fov: 35,
  keyframes: [
    { p: 0, position: [0, 17, 0.01], target: [0, 0.5, 0] },
    { p: 0.5, position: [0, 5.5, 11.8], target: [0, 0.6, 0] },
    { p: 1, position: [0, 1.0, 5.6], target: [0, 0.3, 0.5] },
  ],
  progressDamping: 16,
};

// Negative angular velocity moves the front of the ring (+z, facing the camera) to the left.
export const MOTION = {
  autoSpeed: -(2 * Math.PI) / 60,
  friction: 7,
  flingFriction: 3,
  wheelGain: 0.02,
  maxSpeed: 4 * Math.PI,
  resumeDelayMs: 1500,
  gestureGapMs: 150,
  flingSampleMs: 100,
  snapStiffness: 12,
};

export const INTERACTION = {
  finalViewProgress: 0.999,
  nearFinalProgress: 0.9,
  clickMaxDeltaPx: 6,
  hover: { pullOut: 0.45, lift: 0.09, turn: -0.61, minTurn: -1.3, maxTurn: 0, damping: 20 },
  select: { pullOut: 0.9, pullSeconds: 0.18, flySeconds: 0.45 },
};
