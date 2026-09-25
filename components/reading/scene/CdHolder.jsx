'use client';

import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, RingGeometry } from 'three';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { attachEnvironment, getHolderMaterials } from './finish';

const TAU = Math.PI * 2;
const SEGMENTS = 128;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);
const BAND_HEIGHT = 0.012;
// Bands sit a hair proud of the rims so they never z-fight with them.
const BAND_OFFSET = 0.003;
const CAP_HEIGHT = 0.018;
// Thin brass ring set into the lid top, so the top-down opening view carries the accent too.
const INLAY_INSET = 0.09;
const INLAY_WIDTH = 0.014;

const angularDistance = (a, b) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return Math.min(d, TAU - d);
};

function buildGeometries() {
  const {
    baseRadius, baseThickness, lidRadius, lidThickness, hubRadius,
    ridgeWidth, ridgeHeight, ridgeInner, ridgeOuter, postRadius, lidBottom,
  } = HOLDER;
  const lidBodyH = lidThickness * 0.8;
  const lidBevelH = lidThickness - lidBodyH;
  const baseBodyH = baseThickness * 0.85;
  const baseBevelH = baseThickness - baseBodyH;

  return {
    lidBody: new CylinderGeometry(lidRadius, lidRadius, lidBodyH, SEGMENTS),
    lidBevel: new CylinderGeometry(lidRadius - 0.012, lidRadius, lidBevelH, SEGMENTS),
    lidInlay: new RingGeometry(lidRadius - INLAY_INSET - INLAY_WIDTH, lidRadius - INLAY_INSET, SEGMENTS),
    lidBand: new CylinderGeometry(lidRadius + BAND_OFFSET, lidRadius + BAND_OFFSET, BAND_HEIGHT, SEGMENTS, 1, true),
    baseBody: new CylinderGeometry(baseRadius, baseRadius, baseBodyH, SEGMENTS),
    baseBevel: new CylinderGeometry(baseRadius - 0.012, baseRadius, baseBevelH, SEGMENTS),
    baseBand: new CylinderGeometry(baseRadius + BAND_OFFSET, baseRadius + BAND_OFFSET, BAND_HEIGHT, SEGMENTS, 1, true),
    hub: new CylinderGeometry(hubRadius, hubRadius, 0.06, 96),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new CylinderGeometry(postRadius, postRadius, lidBottom, 24),
    postCap: new CylinderGeometry(postRadius * 1.4, postRadius * 1.4, CAP_HEIGHT, 24),
    heights: { lidBodyH, lidBevelH, baseBodyH, baseBevelH },
  };
}

export default function CdHolder({ slotCount }) {
  const gl = useThree((s) => s.gl);
  const geometries = useMemo(buildGeometries, []);
  const materials = useMemo(getHolderMaterials, []);

  useLayoutEffect(() => attachEnvironment(gl, materials), [gl, materials]);

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
      <mesh
        geometry={geometries.baseBand}
        material={materials.brass}
        position-y={-baseBevelH - BAND_HEIGHT / 2 - 0.006}
      />
      <mesh geometry={geometries.hub} material={materials.hub} position-y={0.03} />

      {ridgeAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.ridge}
          material={materials.ridge}
          position={[Math.sin(a) * ridgeMid, ridgeHeight / 2, Math.cos(a) * ridgeMid]}
          rotation-y={a}
        />
      ))}

      {postAngles.map((a) => (
        <group key={a} position={[Math.sin(a) * postRingRadius, 0, Math.cos(a) * postRingRadius]}>
          <mesh geometry={geometries.post} material={materials.brass} position-y={lidBottom / 2} />
          <mesh geometry={geometries.postCap} material={materials.brass} position-y={CAP_HEIGHT / 2} />
          <mesh geometry={geometries.postCap} material={materials.brass} position-y={lidBottom - CAP_HEIGHT / 2} />
        </group>
      ))}

      <mesh geometry={geometries.lidBody} material={lidMaterials} position-y={lidBottom + lidBodyH / 2} />
      <mesh geometry={geometries.lidBevel} material={lidMaterials} position-y={lidBottom + lidBodyH + lidBevelH / 2} />
      <mesh
        geometry={geometries.lidInlay}
        material={materials.brassInlay}
        rotation-x={-Math.PI / 2}
        position-y={lidBottom + HOLDER.lidThickness + 0.0008}
      />
      <mesh
        geometry={geometries.lidBand}
        material={materials.brass}
        position-y={lidBottom + lidBodyH / 2}
      />
    </group>
  );
}
