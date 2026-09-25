import { CanvasTexture, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace } from 'three';

// Created lazily on the client; `document` isn't available during SSR.
let materials = null;
let shadowTexture = null;

const FROST = {
  color: '#eef0ef',
  metalness: 0,
  roughness: 0.3,
  transmission: 1,
  thickness: 0.12,
  ior: 1.5,
  attenuationColor: '#eef3f1',
  attenuationDistance: 6,
  clearcoat: 0.25,
  clearcoatRoughness: 0.2,
  envMapIntensity: 0.22,
};

// Thick glass edges read as glass because light travels far through them and picks up a cool green tint.
const POLISHED_EDGE = {
  ...FROST,
  roughness: 0.04,
  thickness: 0.5,
  attenuationColor: '#cfe0da',
  attenuationDistance: 1.1,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1,
};

export function getHolderMaterials() {
  if (materials) return materials;
  materials = {
    lidFace: new MeshPhysicalMaterial(FROST),
    lidEdge: new MeshPhysicalMaterial(POLISHED_EDGE),
    baseFace: new MeshPhysicalMaterial({ ...FROST, roughness: 0.5, envMapIntensity: 0.18 }),
    baseEdge: new MeshPhysicalMaterial(POLISHED_EDGE),
    steel: new MeshStandardMaterial({ color: '#dfe2e6', metalness: 1, roughness: 0.18 }),
    satinSteel: new MeshStandardMaterial({ color: '#aeb2b6', metalness: 1, roughness: 0.5 }),
  };
  return materials;
}

// Without transmission the glass falls back to plain translucency: no blur behind it, but half the render cost.
const LITE_OPACITY = { lidFace: 0.55, lidEdge: 0.8, baseFace: 0.7, baseEdge: 0.8 };
// Attenuation (the green edge tint) only exists with transmission, so the fallback tints edges directly.
const LITE_EDGE_COLOR = '#c4d8d0';

export function setGlassQuality(full) {
  const all = getHolderMaterials();
  for (const [key, opacity] of Object.entries(LITE_OPACITY)) {
    const material = all[key];
    material.transmission = full ? 1 : 0;
    material.transparent = !full;
    material.opacity = full ? 1 : opacity;
    material.depthWrite = full;
    if (key.endsWith('Edge')) material.color.set(full ? POLISHED_EDGE.color : LITE_EDGE_COLOR);
    material.needsUpdate = true;
  }
}

// The environment only lights the holder; the books keep the scene's plain lights so their colours stay true.
export function setHolderEnvironment(envMap) {
  for (const material of Object.values(getHolderMaterials())) {
    material.envMap = envMap;
    material.needsUpdate = true;
  }
}

export function getShadowTexture() {
  if (shadowTexture) return shadowTexture;

  const size = 256;
  const c = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(38,42,46,0.26)');
  gradient.addColorStop(0.66, 'rgba(38,42,46,0.17)');
  gradient.addColorStop(1, 'rgba(38,42,46,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}
