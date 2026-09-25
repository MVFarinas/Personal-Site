'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, EdgesGeometry, LatheGeometry, Vector2 } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { BOOK, HOLDER, RING } from '../constants';
import { effectiveProgress, slotAngle } from '../store';
import { bookThickness } from './textures';
import { getLineworkMaterials, setLineResolution } from './linework';

const TAU = Math.PI * 2;
const SEGMENTS = 96;
const POST_SEGMENTS = 20;
const POST_TARGETS = [0.25, 0.75, 1.25, 1.75].map((f) => f * Math.PI);
// Above the angle between neighbouring side facets (3.75° on discs, 18° on posts) so only real creases
// (rims, bevels, turned rings, box edges) become strokes.
const CREASE_DEGREES = 25;

const PLAN_SEGMENTS = 160;
// The dashed plan is fully drawn from above and gone by the time the lid top leaves view.
const PLAN_FADE = [0.22, 0.72];

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
  const postScale = postRadius / 0.05;

  // Plain discs: a bevel adds a second rim line hairline-close to the first, which merges at 1x and
  // stair-steps while spinning.
  const shapes = {
    lid: new CylinderGeometry(lidRadius, lidRadius, lidThickness, SEGMENTS),
    base: new CylinderGeometry(baseRadius, baseRadius, baseThickness, SEGMENTS),
    hub: new CylinderGeometry(hubRadius, hubRadius * 1.04, 0.1, 64),
    ridge: new BoxGeometry(ridgeWidth, ridgeHeight, ridgeOuter - ridgeInner),
    post: new LatheGeometry(
      POST_PROFILE.map(([r, y]) => new Vector2(r * postScale, y * lidBottom)),
      POST_SEGMENTS,
    ),
  };
  const edges = Object.fromEntries(Object.entries(shapes).map(([key, g]) => [key, creases(g)]));
  return { shapes, edges };
}

function pushCircle(out, radius, y) {
  for (let i = 0; i < PLAN_SEGMENTS; i++) {
    const a0 = (i / PLAN_SEGMENTS) * TAU;
    const a1 = ((i + 1) / PLAN_SEGMENTS) * TAU;
    out.push(Math.sin(a0) * radius, y, Math.cos(a0) * radius, Math.sin(a1) * radius, y, Math.cos(a1) * radius);
  }
}

// Plan of the book ring (inner/outer circles and each book's footprint), laid on the lid top so it
// only shows where the lid hides the books, like hidden lines on a drafting plan.
function buildPlan(items) {
  const y = HOLDER.lidBottom + HOLDER.lidThickness + 0.002;
  const outer = RING.spineRadius;
  const inner = RING.spineRadius - BOOK.depth;
  const center = RING.spineRadius - BOOK.depth / 2;
  const points = [];
  pushCircle(points, outer, y);
  pushCircle(points, inner, y);
  items.forEach((item, i) => {
    const phi = slotAngle(i, items.length);
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const t = bookThickness(item) / 2;
    const d = BOOK.depth / 2;
    const corner = ([lx, lz]) => [
      Math.sin(phi) * center + c * lx + s * lz,
      y,
      Math.cos(phi) * center - s * lx + c * lz,
    ];
    const corners = [[-t, -d], [t, -d], [t, d], [-t, d]].map(corner);
    for (let k = 0; k < 4; k++) points.push(...corners[k], ...corners[(k + 1) % 4]);
  });
  return new LineSegmentsGeometry().setPositions(points);
}

function HiddenPlan({ items, store, material }) {
  const lines = useMemo(() => {
    const segments = new LineSegments2(buildPlan(items), material);
    segments.computeLineDistances();
    return segments;
  }, [items, material]);

  useEffect(() => () => lines.geometry.dispose(), [lines]);

  useFrame(() => {
    const [start, end] = PLAN_FADE;
    const p = effectiveProgress(store);
    const opacity = 1 - Math.min(Math.max((p - start) / (end - start), 0), 1);
    material.opacity = opacity * opacity;
    lines.visible = opacity > 0;
  });

  return <primitive object={lines} />;
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

export default function CdHolder({ slotCount, items, store }) {
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
  const { lidBottom, lidThickness, baseThickness, ridgeInner, ridgeOuter, ridgeHeight, postRingRadius } = HOLDER;
  const ridgeMid = (ridgeInner + ridgeOuter) / 2;
  const part = (key, props) => <InkedPart geometry={shapes[key]} edges={edges[key]} materials={materials} {...props} />;

  return (
    <group>
      {part('base', { position: [0, -baseThickness / 2, 0] })}
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

      {part('lid', { position: [0, lidBottom + lidThickness / 2, 0] })}
      {items && store && <HiddenPlan items={items} store={store} material={materials.hidden} />}
    </group>
  );
}
