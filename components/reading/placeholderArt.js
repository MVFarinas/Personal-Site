import { BOOK } from './constants';

export const TEX_HEIGHT = 1024;
const DATA_URL_HEIGHT = 1536;
const GOLD = '#c9a54e';
const GOLD_SOFT = 'rgba(201, 165, 78, 0.6)';

const isBrowser = typeof document !== 'undefined';

const coverDataURLs = new Map();
let fontsReady = false;
let fontsPromise = null;

export const fontsLoaded = () => fontsReady;

function cssFont(varName, fallback) {
  if (!isBrowser) return fallback;
  const family = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return family ? `${family}, ${fallback}` : fallback;
}

const serif = () => cssFont('--font-cormorant', 'Georgia, "Times New Roman", serif');
const sans = () => cssFont('--font-inter', 'system-ui, sans-serif');

// next/font only downloads a face once something uses it, and canvas text doesn't count, so the
// faces are requested explicitly and every placeholder is redrawn once they arrive.
export function whenFontsReady() {
  if (!fontsPromise) {
    const loading =
      isBrowser && document.fonts
        ? Promise.all([
            document.fonts.load(`500 64px ${serif()}`),
            document.fonts.load(`400 64px ${serif()}`),
            document.fonts.load(`500 32px ${sans()}`),
          ]).then(() => document.fonts.ready)
        : Promise.resolve();
    fontsPromise = loading
      .catch(() => {})
      .then(() => {
        fontsReady = true;
      });
  }
  return fontsPromise;
}

export function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function lastName(author = '') {
  const first = author
    .split(/\s*(?:&|,|\band\b)\s*/i)[0]
    .replace(/\bet al\.?/i, '')
    .trim();
  const words = first.split(/\s+/).filter(Boolean);
  return words[words.length - 1] || '';
}

function setSpacing(ctx, px) {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
}

function fitFontSize(ctx, text, maxWidth, start, min, fontFor) {
  let size = start;
  ctx.font = fontFor(size);
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = fontFor(size);
  }
  return size;
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function diamond(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fill();
}

function drawRotatedText(ctx, text, cx, cy, font, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 2);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function drawSpine(ctx, item, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = item.color;
  ctx.fillRect(0, 0, w, h);

  const shade = ctx.createLinearGradient(0, 0, w, 0);
  shade.addColorStop(0, 'rgba(0,0,0,0.30)');
  shade.addColorStop(0.2, 'rgba(255,255,255,0.05)');
  shade.addColorStop(0.45, 'rgba(255,255,255,0.12)');
  shade.addColorStop(0.8, 'rgba(0,0,0,0.05)');
  shade.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);

  const band = Math.max(3, h * 0.006);
  ctx.fillStyle = GOLD;
  for (const y of [0.035, 0.05, 0.95, 0.965]) ctx.fillRect(0, h * y - band / 2, w, band);

  const inset = Math.max(4, w * 0.16);
  const panelTop = h * 0.09;
  const panelBottom = h * 0.91;
  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = Math.max(1.5, w * 0.02);
  ctx.strokeRect(inset, panelTop, w - inset * 2, panelBottom - panelTop);

  const gem = Math.min(w * 0.14, 12);
  diamond(ctx, w / 2, h * 0.07, gem, GOLD);
  diamond(ctx, w / 2, h * 0.93, gem, GOLD);

  const innerWidth = w - inset * 2;
  const titleSpan = h * 0.52;
  const titleSize = fitFontSize(
    ctx,
    item.title,
    titleSpan,
    Math.min(innerWidth * 0.8, 84),
    10,
    (s) => `500 ${s}px ${serif()}`
  );
  setSpacing(ctx, 0);
  drawRotatedText(ctx, item.title, w / 2, h * 0.39, `500 ${titleSize}px ${serif()}`, item.textColor);

  const author = lastName(item.author).toUpperCase();
  if (author) {
    setSpacing(ctx, Math.max(1, innerWidth * 0.04));
    const authorSize = fitFontSize(
      ctx,
      author,
      h * 0.15,
      Math.min(innerWidth * 0.4, 26),
      8,
      (s) => `500 ${s}px ${sans()}`
    );
    ctx.globalAlpha = 0.8;
    drawRotatedText(ctx, author, w / 2, h * 0.78, `500 ${authorSize}px ${sans()}`, item.textColor);
    ctx.globalAlpha = 1;
    setSpacing(ctx, 0);
  }
}

function drawCoverBase(ctx, item, w, h) {
  const s = h / TEX_HEIGHT;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = item.color;
  ctx.fillRect(0, 0, w, h);

  const light = ctx.createLinearGradient(0, 0, w, h);
  light.addColorStop(0, 'rgba(255,255,255,0.08)');
  light.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  return s;
}

// The spine edge is on the left of the front cover and on the right of the back cover.
function drawHinge(ctx, w, h, onLeft) {
  const width = w * 0.08;
  const x0 = onLeft ? 0 : w;
  const x1 = onLeft ? width : w - width;
  const hinge = ctx.createLinearGradient(x0, 0, x1, 0);
  hinge.addColorStop(0, 'rgba(0,0,0,0.35)');
  hinge.addColorStop(0.6, 'rgba(255,255,255,0.06)');
  hinge.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = hinge;
  ctx.fillRect(onLeft ? 0 : w - width, 0, width, h);
}

function drawFrame(ctx, x, y, fw, fh, s) {
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3 * s;
  ctx.strokeRect(x, y, fw, fh);
  const gap = 12 * s;
  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = 1.5 * s;
  ctx.strokeRect(x + gap, y + gap, fw - gap * 2, fh - gap * 2);
  const r = 7 * s;
  for (const [cx, cy] of [
    [x + gap, y + gap],
    [x + fw - gap, y + gap],
    [x + gap, y + fh - gap],
    [x + fw - gap, y + fh - gap],
  ]) {
    diamond(ctx, cx, cy, r, GOLD);
  }
}

export function drawCover(ctx, item, w, h) {
  const s = drawCoverBase(ctx, item, w, h);
  drawHinge(ctx, w, h, true);

  const frameX = w * 0.1;
  const frameW = w * 0.84;
  drawFrame(ctx, frameX, h * 0.05, frameW, h * 0.9, s);
  const cx = frameX + frameW / 2;
  const maxWidth = frameW * 0.78;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (item.kind) {
    setSpacing(ctx, 6 * s);
    ctx.font = `500 ${18 * s}px ${sans()}`;
    ctx.fillStyle = GOLD;
    ctx.fillText(item.kind.toUpperCase(), cx, h * 0.14);
  }

  setSpacing(ctx, 0);
  let titleSize = 92 * s;
  let lines;
  for (;;) {
    ctx.font = `500 ${titleSize}px ${serif()}`;
    lines = wrapLines(ctx, item.title, maxWidth);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if ((lines.length <= 3 && widest <= maxWidth) || titleSize <= 36 * s) break;
    titleSize -= 2 * s;
  }
  const lineHeight = titleSize * 1.08;
  const titleTop = h * 0.4 - ((lines.length - 1) * lineHeight) / 2;
  ctx.fillStyle = item.textColor;
  lines.forEach((line, i) => ctx.fillText(line, cx, titleTop + i * lineHeight));

  const ornamentY = titleTop + (lines.length - 1) * lineHeight + titleSize * 0.95;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - frameW * 0.22, ornamentY);
  ctx.lineTo(cx - 16 * s, ornamentY);
  ctx.moveTo(cx + 16 * s, ornamentY);
  ctx.lineTo(cx + frameW * 0.22, ornamentY);
  ctx.stroke();
  diamond(ctx, cx, ornamentY, 8 * s, GOLD);

  if (item.author) {
    setSpacing(ctx, 4 * s);
    const authorText = item.author.toUpperCase();
    const size = fitFontSize(ctx, authorText, maxWidth, 26 * s, 12 * s, (px) => `500 ${px}px ${sans()}`);
    ctx.font = `500 ${size}px ${sans()}`;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = item.textColor;
    ctx.fillText(authorText, cx, h * 0.8);
    ctx.globalAlpha = 1;
    setSpacing(ctx, 0);
  }
}

export function drawBack(ctx, item, w, h) {
  const s = drawCoverBase(ctx, item, w, h);
  drawHinge(ctx, w, h, false);
  // Real books get a plain back in their cover colour; the gold frame is placeholder ornament.
  if (item.cover) return;
  const frameX = w * 0.06;
  const frameW = w * 0.84;
  drawFrame(ctx, frameX, h * 0.05, frameW, h * 0.9, s);
  diamond(ctx, frameX + frameW / 2, h * 0.5, 10 * s, GOLD);
}

export const coverWidthFor = (height) => Math.round((height * BOOK.depth) / BOOK.height);

export function placeholderCoverDataURL(item) {
  if (!isBrowser) return '';
  const cached = coverDataURLs.get(item.id);
  if (cached) return cached;
  const canvas = makeCanvas(coverWidthFor(DATA_URL_HEIGHT), DATA_URL_HEIGHT);
  drawCover(canvas.getContext('2d'), item, canvas.width, canvas.height);
  const url = canvas.toDataURL('image/png');
  if (fontsReady) coverDataURLs.set(item.id, url);
  else whenFontsReady();
  return url;
}
