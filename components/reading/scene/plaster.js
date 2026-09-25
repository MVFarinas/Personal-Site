import { CanvasTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { COLORS } from '../constants';

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

// Matte plaster: soft low-frequency mottling plus fine speckle. Blobs wrap at the edges so it tiles.
function plasterCanvas(size, base, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(seed);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 28; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = size * (0.18 + rand() * 0.3);
    const light = rand() < 0.5;
    const tone = light ? '255,255,255' : '90,80,68';
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        g.addColorStop(0, `rgba(${tone},${0.012 + rand() * 0.014})`);
        g.addColorStop(1, `rgba(${tone},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
  }

  const image = ctx.getImageData(0, 0, size, size);
  const px = image.data;
  for (let i = 0; i < px.length; i += 4) {
    let n = (rand() - 0.5) * 6;
    const speck = rand();
    if (speck < 0.003) n -= 16 + rand() * 14;
    else if (speck > 0.997) n += 14;
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

export function getHolderMaterials() {
  if (materials) return materials;

  const surface = makeTexture(plasterCanvas(512, COLORS.plaster, 7), [2, 2]);
  // Rims are thin bands, so sample a short strip to keep the speckle at the same scale as the top.
  const rim = makeTexture(plasterCanvas(512, COLORS.plaster, 11), [8, 0.08]);
  const matte = (options) => new MeshStandardMaterial({ roughness: 0.92, metalness: 0, ...options });

  materials = {
    lidTop: matte({ map: surface }),
    lidRim: matte({ map: rim, color: '#f7f5f0', emissive: '#ffffff', emissiveMap: rim, emissiveIntensity: 0.18 }),
    // Only the hemisphere's ground colour reaches the underside; a little self-light keeps it a soft
    // light shade instead of a grey band in the eye-level view.
    lidUnder: matte({ map: surface, color: '#e6e0d6', emissive: '#ffffff', emissiveMap: surface, emissiveIntensity: 0.82 }),
    baseTop: matte({ map: surface, color: '#f1ede6' }),
    baseRim: matte({ map: rim, color: '#f7f5f0', emissive: '#ffffff', emissiveMap: rim, emissiveIntensity: 0.16 }),
    rib: matte({ map: surface, color: COLORS.plasterShade, emissive: '#ffffff', emissiveMap: surface, emissiveIntensity: 0.12 }),
    post: new MeshStandardMaterial({ color: COLORS.ink, roughness: 0.55, metalness: 0.1 }),
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
  gradient.addColorStop(0, 'rgba(58,52,44,0.26)');
  gradient.addColorStop(0.62, 'rgba(58,52,44,0.18)');
  gradient.addColorStop(0.8, 'rgba(58,52,44,0.07)');
  gradient.addColorStop(1, 'rgba(58,52,44,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}
