import { INTERACTION } from './constants';

const TAU = Math.PI * 2;

// One mutable object shared by the DOM layer and the 3D scene. Per-frame values live here
// instead of React state so the scene never re-renders while animating.
export function createReadingStore(slotCount) {
  return {
    slotCount,
    progress: 0,
    progressOverride: null,
    angle: 0,
    velocity: 0,
    snapTarget: null,
    dragging: false,
    lastInteraction: -Infinity,
    overRing: false,
    hoveredId: null,
    selectedId: null,
    coverShown: false,
    coverRect: null,
    userPaused: false,
    reducedMotion: false,
    pxPerRad: 300,
  };
}

export const effectiveProgress = (s) => s.progressOverride ?? s.progress;
export const isFinalView = (s) => effectiveProgress(s) >= INTERACTION.finalViewProgress;
export const isNearFinalView = (s) => effectiveProgress(s) > INTERACTION.nearFinalProgress;

export const slotAngle = (index, slotCount) => (index * TAU) / slotCount;

// Ring angle (closest to `current`) that puts slot `index` directly in front of the camera.
export function frontAngleFor(index, slotCount, current) {
  const target = -slotAngle(index, slotCount);
  return target + TAU * Math.round((current - target) / TAU);
}

// Ring angle of the slot nearest the front, closest to `current`.
export function nearestSlotAngle(slotCount, current) {
  const step = TAU / slotCount;
  return Math.round(current / step) * step;
}
