'use client';

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, EdgesGeometry, LatheGeometry, Vector2 } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { HOLDER } from '../constants';
import { slotAngle } from '../store';
import { getLineworkMaterials, setLineResolution } from './linework';

const TAU = Math.PI * 2;
const SEGMENTS = 96;
const POST_SEGMENTS = 20;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);
// Above the angle between neighbouring side facets (3.75° on discs, 18° on posts) so only real creases
// (rims, bevels, turned rings, box edges) become strokes.
const CREASE_DEGREES = 25;

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

const creases = (geometry) => new LineSegmentsGeometry().fromEdgesGeometry(new EdgesGeometry(geometry, CREASE_DEGREES));

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

  const shapes = {
    lidBody: new CylinderGeometry(lidRadius, lidRadius, lidBodyH, SEGMENTS),
    lidBevel: new CylinderGeometry(lidRadius - 0.035, lidRadius, lidBevelH, SEGMENTS),
    baseBody: new CylinderGeometry(baseRadius, baseRadius, baseBodyH, SEGMENTS),
    baseBevel: new CylinderGeometry(baseRadius - 0.03, baseRadius, baseBevelH, SEGMENTS),
    hub: new CylinderGeometry(hubRadius, hubRadius * 1.04, 0.1, 64),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new LatheGeometry(
      POST_PROFILE.map(([r, y]) => new Vector2(r * postScale, y * lidBottom)),
      POST_SEGMENTS,
    ),
  };
  const edges = Object.fromEntries(Object.entries(shapes).map(([key, g]) => [key, creases(g)]));
  return { shapes, edges, heights: { lidBodyH, lidBevelH, baseBodyH, baseBevelH } };
}

// One holder part drawn as a hidden-line drawing: a page-coloured fill that hides what's behind it,
// crease strokes, and (for curved parts) a silhouette outline.
function InkedPart({ geometry, edges, materials, outline = true, position, rotation }) {
  const strokes = useMemo(() => new LineSegments2(edges, materials.line), [edges, materials.line]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={materials.fill} />
      {outline && <mesh geometry={geometry} material={materials.outline} />}
      <primitive object={strokes} />
    </group>
  );
}

export default function CdHolder({ slotCount }) {
  const geometries = useMemo(buildGeometries, []);
  const materials = useMemo(getLineworkMaterials, []);
  const size = useThree((s) => s.size);

  useEffect(() => {
    setLineResolution(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(
    () => () => {
      [...Object.values(geometries.shapes), ...Object.values(geometries.edges)].forEach((g) => g.dispose());
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

  const { shapes, edges } = geometries;
  const { lidBodyH, lidBevelH, baseBodyH, baseBevelH } = geometries.heights;
  const { lidBottom, baseThickness, ridgeInner, ridgeOuter, ridgeHeight, postRingRadius } = HOLDER;
  const ridgeMid = (ridgeInner + ridgeOuter) / 2;
  const part = (key, props) => <InkedPart geometry={shapes[key]} edges={edges[key]} materials={materials} {...props} />;

  return (
    <group>
      {part('baseBody', { position: [0, -baseThickness + baseBodyH / 2, 0] })}
      {part('baseBevel', { position: [0, -baseBevelH / 2, 0] })}
      {part('hub', { position: [0, 0.05, 0] })}

      {ridgeAngles.map((a) => (
        <InkedPart
          key={a}
          geometry={shapes.ridge}
          edges={edges.ridge}
          materials={materials}
          outline={false}
          position={[Math.sin(a) * ridgeMid, ridgeHeight / 2, Math.cos(a) * ridgeMid]}
          rotation={[0, a, 0]}
        />
      ))}

      {postAngles.map((a) => (
        <InkedPart
          key={a}
          geometry={shapes.post}
          edges={edges.post}
          materials={materials}
          position={[Math.sin(a) * postRingRadius, 0, Math.cos(a) * postRingRadius]}
        />
      ))}

      {part('lidBody', { position: [0, lidBottom + lidBodyH / 2, 0] })}
      {part('lidBevel', { position: [0, lidBottom + lidBodyH + lidBevelH / 2, 0] })}
    </group>
  );
}
