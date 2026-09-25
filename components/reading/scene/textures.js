'use client';

import {
  CanvasTexture,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { BOOK, COLORS } from '../constants';
import { bookThickness } from '../slots';
import {
  TEX_HEIGHT,
  coverWidthFor,
  drawBack,
  drawCover,
  drawSpine,
  fontsLoaded,
  makeCanvas,
  whenFontsReady,
} from '../placeholderArt';

// BoxGeometry UVs (three r173): on the +x face u runs +z → −z and v runs bottom → top; on the +z face
// u runs −x → +x. Viewed from outside, both faces map the canvas upright and unmirrored, so the
// drawings below need no flips. Spine text is rotated +90° so it reads top-to-bottom with letter
// tops pointing at the front cover (+x), like a US book standing on a shelf.

// Backs are just a frame and a diamond, so a small canvas is plenty and keeps GPU memory down.
const BACK_HEIGHT = 256;

const spineTextures = new Map();
const coverTextures = new Map();
const backTextures = new Map();
const bookMaterials = new Map();
let pageMaterial = null;

function toTexture(canvas) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function loadImageTexture(url) {
  const texture = new TextureLoader().load(url);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Draws now with whatever fonts are available, then once more after the site fonts load.
function drawnTexture(width, height, draw) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = toTexture(canvas);
  if (!fontsLoaded()) {
    whenFontsReady().then(() => {
      draw(ctx, width, height);
      texture.needsUpdate = true;
    });
  }
  return texture;
}

export { bookThickness };

export function getSpineTexture(item) {
  let texture = spineTextures.get(item.id);
  if (texture) return texture;
  if (item.spine) {
    texture = loadImageTexture(item.spine);
  } else {
    const width = Math.max(32, Math.round((TEX_HEIGHT * bookThickness(item)) / BOOK.height));
    texture = drawnTexture(width, TEX_HEIGHT, (ctx, w, h) => drawSpine(ctx, item, w, h));
  }
  spineTextures.set(item.id, texture);
  return texture;
}

export function getCoverTexture(item) {
  let texture = coverTextures.get(item.id);
  if (texture) return texture;
  texture = item.cover
    ? loadImageTexture(item.cover)
    : drawnTexture(coverWidthFor(TEX_HEIGHT), TEX_HEIGHT, (ctx, w, h) => drawCover(ctx, item, w, h));
  coverTextures.set(item.id, texture);
  return texture;
}

function getBackTexture(item) {
  let texture = backTextures.get(item.id);
  if (!texture) {
    texture = drawnTexture(coverWidthFor(BACK_HEIGHT), BACK_HEIGHT, (ctx, w, h) => drawBack(ctx, item, w, h));
    backTextures.set(item.id, texture);
  }
  return texture;
}

export function getPageMaterial() {
  if (pageMaterial) return pageMaterial;
  const canvas = makeCanvas(128, 8);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, 128, 8);
  ctx.fillStyle = 'rgba(120, 98, 66, 0.14)';
  for (let x = 1; x < 128; x += 3) ctx.fillRect(x, 0, 1, 8);
  const texture = toTexture(canvas);
  texture.wrapS = RepeatWrapping;
  pageMaterial = new MeshStandardMaterial({ map: texture, roughness: 0.95, metalness: 0 });
  return pageMaterial;
}

// Face order matches BoxGeometry groups: +x, −x, +y, −y, +z, −z. Every material array is unique to its
// ring slot (repeated books get their own copies; textures stay shared per book) so per-slot render
// state such as depthTest can change without affecting any other book.
export function getBookMaterials(item, cacheKey = item.id) {
  let materials = bookMaterials.get(cacheKey);
  if (materials) return materials;
  const page = getPageMaterial().clone();
  materials = [
    new MeshStandardMaterial({ map: getCoverTexture(item), roughness: 0.62, metalness: 0 }),
    new MeshStandardMaterial({ map: getBackTexture(item), roughness: 0.7, metalness: 0 }),
    page,
    page,
    new MeshStandardMaterial({ map: getSpineTexture(item), roughness: 0.6, metalness: 0 }),
    page,
  ];
  bookMaterials.set(cacheKey, materials);
  return materials;
}

export { placeholderCoverDataURL } from '../placeholderArt';
