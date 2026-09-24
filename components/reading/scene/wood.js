import { CanvasTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { COLORS } from '../constants';

const DARK_WOOD = '#3b2618';

// Created lazily on the client; `document` isn't available during SSR.
let materials = null;
let shadowTexture = null;

function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = ([r, g, b], f, a) =>
  `rgba(${Math.min(255, Math.round(r * f))},${Math.min(255, Math.round(g * f))},${Math.min(255, Math.round(b * f))},${a})`;

// Grain runs along x. Wave frequencies are whole cycles per width so the texture tiles seamlessly around a rim.
function grainCanvas(size, base, seed, lineCount) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(seed);
  const rgb = hexToRgb(base);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 22; i++) {
    const y = rand() * size;
    const h = size * (0.02 + rand() * 0.09);
    const f = 0.78 + rand() * 0.4;
    const band = ctx.createLinearGradient(0, y, 0, y + h);
    band.addColorStop(0, rgba(rgb, f, 0));
    band.addColorStop(0.5, rgba(rgb, f, 0.45));
    band.addColorStop(1, rgba(rgb, f, 0));
    ctx.fillStyle = band;
    ctx.fillRect(0, y, size, h);
  }

  const step = size / 96;
  for (let i = 0; i < lineCount; i++) {
    const y0 = rand() * size;
    const amp = size * (0.002 + rand() * 0.009);
    const k = 1 + Math.floor(rand() * 3);
    const freq = (k * Math.PI * 2) / size;
    const phase = rand() * Math.PI * 2;
    const dark = rand() < 0.75;
    const f = dark ? 0.45 + rand() * 0.25 : 1.15 + rand() * 0.2;
    ctx.strokeStyle = rgba(rgb, f, 0.1 + rand() * 0.3);
    ctx.lineWidth = 0.5 + rand() * (size / 512) * 2;
    ctx.beginPath();
    for (let x = 0; x <= size; x += step) {
      const y = y0 + amp * Math.sin(x * freq + phase) + amp * 0.45 * Math.sin(x * freq * 3 + phase * 1.7);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const image = ctx.getImageData(0, 0, size, size);
  const px = image.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rand() - 0.5) * 14;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);

  return canvas;
}

function makeTexture(canvas, { repeat = [1, 1], rotation = 0 } = {}) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  texture.repeat.set(repeat[0], repeat[1]);
  if (rotation) {
    texture.center.set(0.5, 0.5);
    texture.rotation = rotation;
  }
  return texture;
}

export function getWoodMaterials() {
  if (materials) return materials;

  const top = makeTexture(grainCanvas(1024, COLORS.wood, 7, 220));
  // Rims are only ~0.1 units tall, so sample a thin strip of the canvas to keep grain at a natural scale.
  const rim = makeTexture(grainCanvas(512, COLORS.wood, 11, 160), { repeat: [6, 0.06] });
  const dark = makeTexture(grainCanvas(256, DARK_WOOD, 23, 60), { rotation: Math.PI / 2 });

  const standard = (options) => new MeshStandardMaterial({ roughness: 0.6, metalness: 0, ...options });

  materials = {
    lidTop: standard({ map: top, roughness: 0.5 }),
    lidRim: standard({ map: rim, roughness: 0.55 }),
    // Only the hemisphere's ground colour reaches the underside, which left it near-black; a little
    // self-lit grain keeps it reading as dark walnut in the eye-level view.
    lidUnder: standard({ map: top, color: '#c4a892', emissive: '#ffffff', emissiveMap: top, emissiveIntensity: 0.35, roughness: 0.85 }),
    baseTop: standard({ map: top, color: '#7a6456', roughness: 0.75 }),
    baseRim: standard({ map: rim, color: '#b39c8c', roughness: 0.6 }),
    dark: standard({ map: dark, roughness: 0.45 }),
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
  gradient.addColorStop(0, 'rgba(40,28,18,0.5)');
  gradient.addColorStop(0.66, 'rgba(40,28,18,0.32)');
  gradient.addColorStop(1, 'rgba(40,28,18,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}
