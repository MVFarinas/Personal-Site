'use client';

import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { GROUND } from '../constants';
import { getLineworkMaterials } from './linework';

const SEGMENTS = 192;

function circleGeometry(radius) {
  const points = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const a0 = (i / SEGMENTS) * Math.PI * 2;
    const a1 = ((i + 1) / SEGMENTS) * Math.PI * 2;
    points.push(Math.sin(a0) * radius, 0, Math.cos(a0) * radius, Math.sin(a1) * radius, 0, Math.cos(a1) * radius);
  }
  return new LineSegmentsGeometry().setPositions(points);
}

let shadowTexture = null;

// Annular shadow that peaks under the books and fades to nothing at the hub and past the base rim.
function getRingShadowTexture() {
  if (shadowTexture) return shadowTexture;
  const size = 512;
  const c = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const { shadowInner, shadowOuter } = GROUND;
  const at = (r) => r / shadowOuter;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(30,26,20,0)');
  gradient.addColorStop(at(shadowInner), 'rgba(30,26,20,0)');
  gradient.addColorStop(at(1.95), 'rgba(30,26,20,0.12)');
  gradient.addColorStop(at(2.2), 'rgba(30,26,20,0.15)');
  gradient.addColorStop(at(2.45), 'rgba(30,26,20,0.09)');
  gradient.addColorStop(1, 'rgba(30,26,20,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}

export default function GroundRing() {
  const shadow = useMemo(getRingShadowTexture, []);
  const line = useMemo(() => new LineSegments2(circleGeometry(GROUND.lineRadius), getLineworkMaterials().ground), []);

  useEffect(() => () => line.geometry.dispose(), [line]);

  const size = GROUND.shadowOuter * 2;
  return (
    <group position-y={GROUND.y}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.002} renderOrder={-1}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <primitive object={line} />
    </group>
  );
}
