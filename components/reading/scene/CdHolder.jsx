'use client';

import { useEffect, useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, LatheGeometry, Vector2 } from 'three';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { getWoodMaterials } from './wood';

const TAU = Math.PI * 2;
const SEGMENTS = 96;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);

const angularDistance = (a, b) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return Math.min(d, TAU - d);
};

// Turned-post silhouette: [radius at postRadius = 0.05, height fraction of the lid gap].
const POST_PROFILE = [
  [0.001, 0], [0.062, 0], [0.062, 0.032], [0.046, 0.055], [0.042, 0.11], [0.056, 0.14],
  [0.042, 0.17], [0.036, 0.5], [0.042, 0.83], [0.056, 0.86], [0.042, 0.89], [0.046, 0.945],
  [0.062, 0.968], [0.062, 1], [0.001, 1],
];

function buildGeometries() {
  const {
    baseRadius, baseThickness, lidRadius, lidThickness, hubRadius,
    ridgeWidth, ridgeHeight, ridgeInner, ridgeOuter, postRadius, lidBottom,
  } = HOLDER;
  const lidBodyH = lidThickness * 0.65;
  const lidBevelH = lidThickness - lidBodyH;
  const baseBodyH = baseThickness * 0.75;
  const baseBevelH = baseThickness - baseBodyH;
  const postScale = postRadius / 0.05;

  return {
    lidBody: new CylinderGeometry(lidRadius, lidRadius, lidBodyH, SEGMENTS),
    lidBevel: new CylinderGeometry(lidRadius - 0.035, lidRadius, lidBevelH, SEGMENTS),
    baseBody: new CylinderGeometry(baseRadius, baseRadius, baseBodyH, SEGMENTS),
    baseBevel: new CylinderGeometry(baseRadius - 0.03, baseRadius, baseBevelH, SEGMENTS),
    hub: new CylinderGeometry(hubRadius, hubRadius * 1.04, 0.1, 64),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new LatheGeometry(
      POST_PROFILE.map(([r, y]) => new Vector2(r * postScale, y * lidBottom)),
      20,
    ),
    heights: { lidBodyH, lidBevelH, baseBodyH, baseBevelH },
  };
}

export default function CdHolder({ slotCount }) {
  const geometries = useMemo(buildGeometries, []);
  const materials = useMemo(getWoodMaterials, []);

  useEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose?.());
    },
    [geometries],
  );

  const { ridgeAngles, postAngles } = useMemo(() => {
    const ridges = Array.from({ length: slotCount }, (_, j) => slotAngle(j, slotCount) + Math.PI / slotCount);
    const posts = new Set(
      POST_TARGETS.map((target) =>
        ridges.reduce((best, a) => (angularDistance(a, target) < angularDistance(best, target) ? a : best)),
      ),
    );
    return { ridgeAngles: ridges, postAngles: [...posts] };
  }, [slotCount]);

  const { lidBodyH, lidBevelH, baseBodyH, baseBevelH } = geometries.heights;
  const { lidBottom, baseThickness, ridgeInner, ridgeOuter, ridgeHeight, postRingRadius } = HOLDER;
  const ridgeMid = (ridgeInner + ridgeOuter) / 2;

  const lidMaterials = useMemo(
    () => [materials.lidRim, materials.lidTop, materials.lidUnder],
    [materials],
  );
  const baseMaterials = useMemo(
    () => [materials.baseRim, materials.baseTop, materials.baseTop],
    [materials],
  );

  return (
    <group>
      <mesh geometry={geometries.baseBody} material={baseMaterials} position-y={-baseThickness + baseBodyH / 2} />
      <mesh geometry={geometries.baseBevel} material={baseMaterials} position-y={-baseBevelH / 2} />
      <mesh geometry={geometries.hub} material={materials.dark} position-y={0.05} />

      {ridgeAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.ridge}
          material={materials.dark}
          position={[Math.sin(a) * ridgeMid, ridgeHeight / 2, Math.cos(a) * ridgeMid]}
          rotation-y={a}
        />
      ))}

      {postAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.post}
          material={materials.dark}
          position={[Math.sin(a) * postRingRadius, 0, Math.cos(a) * postRingRadius]}
        />
      ))}

      <mesh geometry={geometries.lidBody} material={lidMaterials} position-y={lidBottom + lidBodyH / 2} />
      <mesh geometry={geometries.lidBevel} material={lidMaterials} position-y={lidBottom + lidBodyH + lidBevelH / 2} />
    </group>
  );
}
