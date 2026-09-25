import { CanvasTexture, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace } from 'three';

// Created lazily on the client; `document` isn't available during SSR.
let materials = null;
let shadowTexture = null;

// Slightly less than full transmission leaves a pale diffuse layer, so the disc reads against the cream page.
const FROST = {
  color: '#e6e9e8',
  metalness: 0,
  roughness: 0.45,
  transmission: 0.9,
  thickness: 0.12,
  ior: 1.5,
  attenuationColor: '#eef3f1',
  attenuationDistance: 6,
  // A glossy coat mirrors the studio's ceiling light as a hot spot when viewed from straight above.
  clearcoat: 0.1,
  clearcoatRoughness: 0.6,
  envMapIntensity: 0.22,
};

// A thin polished rim with a cool tint. Kept thin so the fins behind it don't refract into dark smears.
const POLISHED_EDGE = {
  ...FROST,
  transmission: 1,
  roughness: 0.04,
  thickness: 0.07,
  attenuationColor: '#cfe0da',
  attenuationDistance: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1,
};

// Seen from inside the ring, the underside only gets the dim ground light; a faint glow keeps it reading as lit frost.
const UNDERSIDE = { ...FROST, roughness: 0.55, emissive: '#ffffff', emissiveIntensity: 0.12 };

// Satin rather than mirror steel, so fins and hub read as soft shapes through the frosted lid instead of glints.
const SATIN_STEEL = { color: '#a9aeb3', metalness: 0.55, roughness: 0.5 };

// Lite mode drops transmission (half the render cost). These are tuned to match the full glass's tones on
// the cream page rather than just switching transmission off.
// Opaque-ish surfaces catch the full scene lights, so these sit well below the tones they end up rendering as.
const LITE = {
  lidFace: { color: '#b9bdb8', opacity: 0.93 },
  lidUnder: { color: '#d9e1dc', opacity: 0.93, emissiveIntensity: 0.42 },
  lidEdge: { color: '#adbab5', opacity: 0.85 },
  baseFace: { color: '#b3bcb5', opacity: 0.9 },
  baseEdge: { color: '#adbab5', opacity: 0.85 },
};

// Decided once, before the first frame, so the look never swaps mid-view. Touch devices get lite;
// `?glass=full|lite` forces a mode.
function wantsFullGlass() {
  const forced = new URLSearchParams(window.location.search).get('glass');
  if (forced === 'full' || forced === 'lite') return forced === 'full';
  return !window.matchMedia('(pointer: coarse)').matches;
}

function glass(options, key, full) {
  const material = new MeshPhysicalMaterial(options);
  if (!full) {
    material.transmission = 0;
    material.transparent = true;
    material.depthWrite = false;
    material.color.set(LITE[key].color);
    material.opacity = LITE[key].opacity;
    if (LITE[key].emissiveIntensity != null) material.emissiveIntensity = LITE[key].emissiveIntensity;
  }
  return material;
}

export function getHolderMaterials() {
  if (materials) return materials;
  const full = wantsFullGlass();
  materials = {
    lidFace: glass(FROST, 'lidFace', full),
    lidUnder: glass(UNDERSIDE, 'lidUnder', full),
    lidEdge: glass(POLISHED_EDGE, 'lidEdge', full),
    baseFace: glass({ ...FROST, roughness: 0.5, envMapIntensity: 0.18 }, 'baseFace', full),
    baseEdge: glass(POLISHED_EDGE, 'baseEdge', full),
    steel: new MeshStandardMaterial({ color: '#dfe2e6', metalness: 1, roughness: 0.18 }),
    satinSteel: new MeshStandardMaterial(SATIN_STEEL),
    // A polished bevel line around the lid's top, so the disc keeps a crisp outline over the blurred glass.
    rim: new MeshStandardMaterial({ color: '#b7c8c1', metalness: 0, roughness: 0.25, envMapIntensity: 0.8 }),
  };
  return materials;
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
