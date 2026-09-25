'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { getLineworkMaterials, setLineResolution } from './linework';

const TAU = Math.PI * 2;
const RIM_SEGMENTS = 192;
const HUB_SEGMENTS = 96;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);

const angularDistance = (a, b) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return Math.min(d, TAU - d);
};

function pushCircle(out, radius, y, segments) {
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    out.push(Math.sin(a0) * radius, y, Math.cos(a0) * radius, Math.sin(a1) * radius, y, Math.cos(a1) * radius);
  }
}

// Everything that doesn't depend on the view: the rim circles of the lid, base and hub, and one
// stroke along the top of each rib.
function buildRims(ridgeAngles) {
  const { lidRadius, lidBottom, lidThickness, baseRadius, baseThickness, hubRadius, hubHeight } = HOLDER;
  const { ridgeInner, ridgeOuter, ridgeHeight } = HOLDER;
  const points = [];
  pushCircle(points, lidRadius, lidBottom, RIM_SEGMENTS);
  pushCircle(points, lidRadius, lidBottom + lidThickness, RIM_SEGMENTS);
  pushCircle(points, baseRadius, 0, RIM_SEGMENTS);
  pushCircle(points, baseRadius, -baseThickness, RIM_SEGMENTS);
  pushCircle(points, hubRadius, 0, HUB_SEGMENTS);
  pushCircle(points, hubRadius, hubHeight, HUB_SEGMENTS);
  for (const a of ridgeAngles) {
    const s = Math.sin(a);
    const c = Math.cos(a);
    points.push(s * ridgeInner, ridgeHeight, c * ridgeInner, s * ridgeOuter, ridgeHeight, c * ridgeOuter);
  }
  return new LineSegmentsGeometry().setPositions(points);
}

const _camera = new Vector3();

// With no fills there's nothing to outline, so each vertical cylinder (lid and base edges, hub, posts)
// gets its two side silhouettes drawn explicitly. For a camera at horizontal distance D from the axis,
// they're the verticals at the tangent points, ±acos(r / D) either side of the direction to the camera.
function Silhouettes({ cylinders, material, groupRef }) {
  const camera = useThree((s) => s.camera);

  const lines = useMemo(
    () =>
      cylinders.map(() => {
        const segments = new LineSegments2(new LineSegmentsGeometry().setPositions(new Float32Array(12)), material);
        segments.frustumCulled = false;
        return segments;
      }),
    [cylinders, material],
  );

  useEffect(() => () => lines.forEach((l) => l.geometry.dispose()), [lines]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    _camera.copy(camera.position);
    group.worldToLocal(_camera);
    cylinders.forEach(([x, z, r, y0, y1], i) => {
      const dx = _camera.x - x;
      const dz = _camera.z - z;
      const distance = Math.hypot(dx, dz);
      const line = lines[i];
      // Camera over the top of the cylinder: no side silhouettes, only the rim circles show.
      line.visible = distance > r * 1.02;
      if (!line.visible) return;
      const toward = Math.atan2(dx, dz);
      const spread = Math.acos(r / distance);
      const buffer = line.geometry.attributes.instanceStart.data;
      const out = buffer.array;
      for (let k = 0; k < 2; k++) {
        const a = toward + (k === 0 ? spread : -spread);
        const px = x + Math.sin(a) * r;
        const pz = z + Math.cos(a) * r;
        const o = k * 6;
        out[o] = px;
        out[o + 1] = y0;
        out[o + 2] = pz;
        out[o + 3] = px;
        out[o + 4] = y1;
        out[o + 5] = pz;
      }
      buffer.needsUpdate = true;
    });
  });

  return lines.map((line, i) => <primitive key={i} object={line} />);
}

// The CD stand as a see-through drawing: strokes only, no surfaces, so the books and the far side of
// the stand stay visible through it. Books still hide the strokes behind them through the depth test.
export default function CdHolder({ slotCount }) {
  const groupRef = useRef();
  const materials = useMemo(getLineworkMaterials, []);
  const size = useThree((s) => s.size);

  useEffect(() => {
    setLineResolution(size.width, size.height);
  }, [size.width, size.height]);

  const { ridgeAngles, postAngles } = useMemo(() => {
    const ridges = Array.from({ length: slotCount }, (_, j) => slotAngle(j, slotCount) + Math.PI / slotCount);
    const posts = new Set(
      POST_TARGETS.map((target) =>
        ridges.reduce((best, a) => (angularDistance(a, target) < angularDistance(best, target) ? a : best)),
      ),
    );
    return { ridgeAngles: ridges, postAngles: [...posts] };
  }, [slotCount]);

  const rims = useMemo(() => new LineSegments2(buildRims(ridgeAngles), materials.line), [ridgeAngles, materials.line]);

  useEffect(() => () => rims.geometry.dispose(), [rims]);

  const cylinders = useMemo(() => {
    const { lidRadius, lidBottom, lidThickness, baseRadius, baseThickness, hubRadius, hubHeight } = HOLDER;
    const { postRadius, postRingRadius } = HOLDER;
    return [
      [0, 0, lidRadius, lidBottom, lidBottom + lidThickness],
      [0, 0, baseRadius, -baseThickness, 0],
      [0, 0, hubRadius, 0, hubHeight],
      ...postAngles.map((a) => [Math.sin(a) * postRingRadius, Math.cos(a) * postRingRadius, postRadius, 0, lidBottom]),
    ];
  }, [postAngles]);

  return (
    <group ref={groupRef}>
      <primitive object={rims} />
      <Silhouettes cylinders={cylinders} material={materials.line} groupRef={groupRef} />
    </group>
  );
}
