import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

// Black at ~62% over the page colour, kept opaque so overlapping strokes don't darken or need sorting.
export const LINE_COLOR = '#5d5c59';
// A lighter ink for secondary strokes (the posts), so they sit behind the rims in the drawing's hierarchy.
export const GROUND_LINE_COLOR = '#9a978f';
// CSS pixels, so strokes look the same on standard and retina screens.
export const LINE_WIDTH = 1.1;

let materials = null;

export function getLineworkMaterials() {
  if (materials) return materials;
  materials = {
    line: new LineMaterial({ color: LINE_COLOR, linewidth: LINE_WIDTH }),
    ground: new LineMaterial({ color: GROUND_LINE_COLOR, linewidth: LINE_WIDTH }),
  };
  return materials;
}

export function setLineResolution(width, height) {
  const all = getLineworkMaterials();
  all.line.resolution.set(width, height);
  all.ground.resolution.set(width, height);
}
