'use client';

import { useEffect, useMemo } from 'react';
import { BufferGeometry, CanvasTexture, SRGBColorSpace, Vector3 } from 'three';
import { GROUND } from '../constants';

const SEGMENTS = 192;

function circleGeometry(radius) {
  const points = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const a = (i / SEGMENTS) * Math.PI * 2;
    points.push(new Vector3(Math.sin(a) * radius, 0, Math.cos(a) * radius));
  }
  return new BufferGeometry().setFromPoints(points);
}

let shadowTexture = null;

// Annular shadow that peaks under the books and fades to nothing at the hub and past the outer line.
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
  gradient.addColorStop(at(1.95), 'rgba(30,26,20,0.16)');
  gradient.addColorStop(at(2.2), 'rgba(30,26,20,0.2)');
  gradient.addColorStop(at(2.45), 'rgba(30,26,20,0.12)');
  gradient.addColorStop(1, 'rgba(30,26,20,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  shadowTexture = new CanvasTexture(canvas);
  shadowTexture.colorSpace = SRGBColorSpace;
  return shadowTexture;
}

export default function GroundRing() {
  const outer = useMemo(() => circleGeometry(GROUND.lineRadius), []);
  const inner = useMemo(() => circleGeometry(GROUND.innerLineRadius), []);
  const shadow = useMemo(getRingShadowTexture, []);

  useEffect(
    () => () => {
      outer.dispose();
      inner.dispose();
    },
    [outer, inner],
  );

  const size = GROUND.shadowOuter * 2;
  return (
    <group position-y={GROUND.y}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.002} renderOrder={-1}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <lineLoop geometry={outer}>
        <lineBasicMaterial color="#000000" transparent opacity={0.32} depthWrite={false} />
      </lineLoop>
      <lineLoop geometry={inner}>
        <lineBasicMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
      </lineLoop>
    </group>
  );
}
