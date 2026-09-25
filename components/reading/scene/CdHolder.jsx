'use client';

import { useEffect, useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, RingGeometry } from 'three';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { getHolderMaterials } from './holderMaterials';

const TAU = Math.PI * 2;
const SEGMENTS = 128;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);
const CAP_HEIGHT = 0.014;
const RIM_WIDTH = 0.035;

const angularDistance = (a, b) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return Math.min(d, TAU - d);
};

function buildGeometries() {
  const { baseRadius, baseThickness, lidRadius, lidThickness, hubRadius, ridgeWidth, ridgeHeight, ridgeInner, ridgeOuter, postRadius, lidBottom } =
    HOLDER;
  return {
    lid: new CylinderGeometry(lidRadius, lidRadius, lidThickness, SEGMENTS),
    base: new CylinderGeometry(baseRadius, baseRadius, baseThickness, SEGMENTS),
    hub: new CylinderGeometry(hubRadius, hubRadius, 0.03, 64),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new CylinderGeometry(postRadius, postRadius, lidBottom - CAP_HEIGHT * 2, 24),
    cap: new CylinderGeometry(postRadius * 1.8, postRadius * 1.8, CAP_HEIGHT, 24),
    rim: new RingGeometry(lidRadius - RIM_WIDTH, lidRadius, SEGMENTS),
  };
}

export default function CdHolder({ slotCount }) {
  const geometries = useMemo(buildGeometries, []);
  const materials = useMemo(getHolderMaterials, []);

  useEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
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

  const { lidBottom, lidThickness, baseThickness, ridgeInner, ridgeOuter, ridgeHeight, postRingRadius } = HOLDER;
  const ridgeMid = (ridgeInner + ridgeOuter) / 2;

  // CylinderGeometry groups: side, top cap, bottom cap. Polished glass on the edge, frosted faces.
  const lidMaterials = useMemo(() => [materials.lidEdge, materials.lidFace, materials.lidUnder], [materials]);
  const baseMaterials = useMemo(() => [materials.baseEdge, materials.baseFace, materials.baseFace], [materials]);

  return (
    <group>
      <mesh geometry={geometries.base} material={baseMaterials} position-y={-baseThickness / 2} />
      <mesh geometry={geometries.hub} material={materials.satinSteel} position-y={0.015} />

      {ridgeAngles.map((a) => (
        <mesh
          key={a}
          geometry={geometries.ridge}
          material={materials.satinSteel}
          position={[Math.sin(a) * ridgeMid, ridgeHeight / 2, Math.cos(a) * ridgeMid]}
          rotation-y={a}
        />
      ))}

      {postAngles.map((a) => {
        const x = Math.sin(a) * postRingRadius;
        const z = Math.cos(a) * postRingRadius;
        return (
          <group key={a} position={[x, 0, z]}>
            <mesh geometry={geometries.cap} material={materials.steel} position-y={CAP_HEIGHT / 2} />
            <mesh geometry={geometries.post} material={materials.steel} position-y={lidBottom / 2} />
            <mesh geometry={geometries.cap} material={materials.steel} position-y={lidBottom - CAP_HEIGHT / 2} />
          </group>
        );
      })}

      <mesh geometry={geometries.lid} material={lidMaterials} position-y={lidBottom + lidThickness / 2} />
      <mesh
        geometry={geometries.rim}
        material={materials.rim}
        position-y={lidBottom + lidThickness + 0.001}
        rotation-x={-Math.PI / 2}
      />
    </group>
  );
}
