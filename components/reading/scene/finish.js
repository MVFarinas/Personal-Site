import {
  CanvasTexture,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { COLORS } from '../constants';

// Created lazily on the client; `document` isn't available during SSR.
let materials = null;
let shadowTexture = null;
let envMap = null;

function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fine powder-coat speckle. Per-pixel noise only, so it tiles without visible seams.
function speckleCanvas(size, base, seed, amount) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(seed);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const image = ctx.getImageData(0, 0, size, size);
  const px = image.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rand() - 0.5) * amount;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function makeTexture(canvas, repeat = [1, 1]) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  texture.repeat.set(repeat[0], repeat[1]);
  return texture;
}

// Reflections are assigned per material rather than via scene.environment, so the books keep
// exactly the lighting they had and only the brass (and a faint sheen on the charcoal) pick them up.
function getEnvMap(gl) {
  if (!envMap) {
    const pmrem = new PMREMGenerator(gl);
    envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }
  return envMap;
}

export function getHolderMaterials(gl) {
  if (materials) return materials;

  const env = getEnvMap(gl);
  const top = makeTexture(speckleCanvas(512, COLORS.charcoal, 5, 10), [3, 3]);
  const rim = makeTexture(speckleCanvas(256, COLORS.charcoal, 9, 10), [24, 0.4]);

  const charcoal = (options) =>
    new MeshStandardMaterial({ roughness: 0.82, metalness: 0, envMap: env, envMapIntensity: 0.35, ...options });

  materials = {
    lidTop: charcoal({ map: top, color: '#b4b0aa' }),
    lidRim: charcoal({ map: rim, roughness: 0.6, envMapIntensity: 0.5 }),
    // Only the hemisphere's ground colour and the environment reach the underside; a small emissive
    // lift keeps it reading as charcoal rather than a black band across the top of the eye-level view.
    lidUnder: charcoal({ map: top, color: '#8f8a84', emissive: '#2c2a28', emissiveIntensity: 1, envMapIntensity: 0.6 }),
    baseTop: charcoal({ map: top, color: '#a39e97' }),
    baseRim: charcoal({ map: rim, roughness: 0.6, envMapIntensity: 0.5 }),
    ridge: charcoal({ color: '#393734', roughness: 0.7 }),
    hub: charcoal({ color: '#2f2d2b', roughness: 0.75 }),
    brass: new MeshStandardMaterial({
      color: COLORS.brass,
      metalness: 1,
      roughness: 0.3,
      envMap: env,
      envMapIntensity: 1.25,
    }),
    // Faces straight up into the environment's bright ceiling, so it needs a satin finish to stay brass.
    brassInlay: new MeshStandardMaterial({
      color: COLORS.brass,
      metalness: 1,
      roughness: 0.55,
      envMap: env,
      envMapIntensity: 0.6,
    }),
  };
  return materials;
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
  gradient.addColorStop(0, 'rgba(24,23,22,0.5)');
  gradient.addColorStop(0.62, 'rgba(24,23,22,0.34)');
  gradient.addColorStop(0.8, 'rgba(24,23,22,0.12)');
  gradient.addColorStop(1, 'rgba(24,23,22,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}
