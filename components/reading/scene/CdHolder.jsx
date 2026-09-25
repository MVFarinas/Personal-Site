'use client';

import { useEffect, useMemo } from 'react';
import { BoxGeometry, CylinderGeometry } from 'three';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { getHolderMaterials } from './plaster';

const TAU = Math.PI * 2;
const SEGMENTS = 96;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);

const angularDistance = (a, b) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return Math.min(d, TAU - d);
};

function buildGeometries() {
  const {
    baseRadius, baseThickness, lidRadius, lidThickness, hubRadius,
    ridgeWidth, ridgeHeight, ridgeInner, ridgeOuter, postRadius, lidBottom,
  } = HOLDER;
  // A small chamfer on the top edges gives the slabs a crisp, machined edge.
  const chamfer = 0.01;
  const lidBodyH = lidThickness - chamfer;
  const lidBevelH = chamfer;
  const baseBodyH = baseThickness - chamfer;
  const baseBevelH = chamfer;

  return {
    lidBody: new CylinderGeometry(lidRadius, lidRadius, lidBodyH, SEGMENTS),
    lidBevel: new CylinderGeometry(lidRadius - chamfer, lidRadius, lidBevelH, SEGMENTS),
    baseBody: new CylinderGeometry(baseRadius, baseRadius, baseBodyH, SEGMENTS),
    baseBevel: new CylinderGeometry(baseRadius - chamfer, baseRadius, baseBevelH, SEGMENTS),
    hub: new CylinderGeometry(hubRadius, hubRadius, 0.025, 64),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new CylinderGeometry(postRadius, postRadius, lidBottom, 16),
    heights: { lidBodyH, lidBevelH, baseBodyH, baseBevelH },
  };
}

export default function CdHolder({ slotCount }) {
  const geometries = useMemo(buildGeometries, []);
  const materials = useMemo(getHolderMaterials, []);

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
      <mesh geometry={geometries.hub} material={materials.rib} position-y={0.0125} />

      {ridgeAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.ridge}
          material={materials.rib}
          position={[Math.sin(a) * ridgeMid, ridgeHeight / 2, Math.cos(a) * ridgeMid]}
          rotation-y={a}
        />
      ))}

      {postAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.post}
          material={materials.post}
          position={[Math.sin(a) * postRingRadius, lidBottom / 2, Math.cos(a) * postRingRadius]}
        />
      ))}

      <mesh geometry={geometries.lidBody} material={lidMaterials} position-y={lidBottom + lidBodyH / 2} />
      <mesh geometry={geometries.lidBevel} material={lidMaterials} position-y={lidBottom + lidBodyH + lidBevelH / 2} />
    </group>
  );
}
