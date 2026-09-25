// Scene units: 1 unit = book height. Starting values; tune visually.

export const BOOK = {
  height: 1,
  depth: 0.68,
  defaultThickness: 0.28,
  centerY: 0.5,
};

export const RING = {
  spineRadius: 2.4,
  // Desired empty space between neighbouring spines; sets how many times a short list repeats.
  targetGap: 0.37,
};

// The books float just above the ground; hairline circles and a soft ring of shadow mark the circle.
export const GROUND = {
  y: -0.08,
  lineRadius: 2.62,
  innerLineRadius: 1.5,
  shadowInner: 1.45,
  shadowOuter: 2.85,
  // Outer extent of everything drawn on the ground, used to frame the overview.
  footprintRadius: 2.85,
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
    { p: 1, position: [0, 1.2, 5.6], target: [0, 0.24, 0.5] },
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
