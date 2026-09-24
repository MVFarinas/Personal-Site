'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { BOOK, CAMERA, HOLDER, RING } from '../constants';
import { effectiveProgress } from '../store';

// Minimum number of slot spacings visible across the width in the final view.
const FIT_SLOTS = 2.2;
// Share of the viewport width the lid may span in the overview poses.
const LID_FIT = 0.9;
// Screen space left free for the title (top) and scroll hint (bottom) in the top-down view, and the
// radius of the lid's visible ground shadow, which must fit between them.
const INTRO_TOP_PX = 210;
const INTRO_BOTTOM_PX = 100;
const SHADOW_FIT_RADIUS = 3.2;

const smoothstep = (t) => t * t * (3 - 2 * t);

export default function CameraRig({ store }) {
  const camera = useThree((s) => s.camera);
  const progress = useRef(null);

  const path = useMemo(() => {
    const keyframes = CAMERA.keyframes;
    const positions = keyframes.map((k) => new Vector3(...k.position));
    const targets = keyframes.map((k) => new Vector3(...k.target));
    const last = keyframes.length - 1;
    const frontSpine = new Vector3(0, BOOK.centerY, RING.spineRadius);
    const lidCenter = new Vector3(0, HOLDER.lidBottom + HOLDER.lidThickness / 2, 0);
    return {
      curve: new CatmullRomCurve3(positions, false, 'centripetal'),
      targets,
      stops: keyframes.map((k) => k.p),
      last,
      // Overview poses frame the whole lid; the final pose frames the front of the ring.
      fitDistances: positions.map((pos, i) => (i === last ? pos.distanceTo(frontSpine) : pos.distanceTo(lidCenter))),
      pullBacks: new Float32Array(keyframes.length),
      frontSpine,
      position: new Vector3(),
      target: new Vector3(),
      viewDir: new Vector3(),
    };
  }, []);

  // An up vector tilted toward -z keeps lookAt stable when the camera is directly above the lid;
  // every pose lies in the x = 0 plane, so it doesn't roll the angled or final views.
  useEffect(() => {
    camera.up.set(0, 1, -1).normalize();
  }, [camera]);

  useFrame((state, delta) => {
    const goal = MathUtils.clamp(effectiveProgress(store), 0, 1);
    if (progress.current === null) progress.current = goal;
    else progress.current += (goal - progress.current) * (1 - Math.exp(-CAMERA.progressDamping * Math.min(delta, 0.1)));
    const p = progress.current;

    const { curve, targets, stops, last, fitDistances, pullBacks, frontSpine, position, target, viewDir } = path;
    let k = 0;
    while (k < stops.length - 2 && p > stops[k + 1]) k++;
    const local = smoothstep(MathUtils.clamp((p - stops[k]) / (stops[k + 1] - stops[k]), 0, 1));
    curve.getPoint((k + local) / (stops.length - 1), position);
    target.lerpVectors(targets[k], targets[k + 1], local);

    // Narrow viewports: back each pose off along its view direction until the lid (overview) or
    // FIT_SLOTS books (final view) fit the width, blending the amounts between keyframes.
    const halfTan = Math.tan(MathUtils.degToRad(camera.fov) / 2);
    const aspect = state.size.width / state.size.height;
    const widthPerDistance = 2 * halfTan * aspect;
    const slotSpacing = (2 * Math.PI * RING.spineRadius) / store.slotCount;
    for (let i = 0; i <= last; i++) {
      const span = i === last ? FIT_SLOTS * slotSpacing : (2 * HOLDER.lidRadius) / LID_FIT;
      pullBacks[i] = Math.max(0, span / widthPerDistance - fitDistances[i]);
    }

    // Top-down pose: also fit the lid's shadow into the band between the title and the scroll hint.
    const height = state.size.height;
    const band = Math.max(height - INTRO_TOP_PX - INTRO_BOTTOM_PX, height * 0.4);
    const introDistance = (SHADOW_FIT_RADIUS * height) / (halfTan * band);
    pullBacks[0] = Math.max(pullBacks[0], introDistance - fitDistances[0]);

    const pullBack = MathUtils.lerp(pullBacks[k], pullBacks[k + 1], local);
    if (pullBack > 0) {
      viewDir.subVectors(target, position).normalize();
      position.addScaledVector(viewDir, -pullBack);
    }

    // Then center it in that band. Screen-up is world −z when looking straight down (see camera.up),
    // so moving the camera toward −z moves the lid down the screen. Fades out toward the angled view.
    if (k === 0) {
      const pxPerUnit = height / (2 * (fitDistances[0] + pullBacks[0]) * halfTan);
      const offsetPx = INTRO_TOP_PX + band / 2 - height / 2;
      const shift = (offsetPx / pxPerUnit) * (1 - local);
      position.z -= shift;
      target.z -= shift;
    }

    camera.position.copy(position);
    camera.lookAt(target);

    const d = camera.position.distanceTo(frontSpine);
    store.pxPerRad = (RING.spineRadius * state.size.height) / (2 * d * halfTan);
  });

  return null;
}
