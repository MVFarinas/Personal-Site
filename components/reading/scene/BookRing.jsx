'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DoubleSide, Vector3 } from 'three';
import { BOOK, RING } from '../constants';
import { isNearFinalView } from '../store';
import { stepRing } from '../ringMotion';
import CdHolder from './CdHolder';
import Book from './Book';

const COLLIDER_RADIUS = RING.spineRadius + 0.05;
const CAMERA_REPLAY_EPSILON = 1e-4;

export default function BookRing({ items, store, onSelect, onArrive }) {
  const groupRef = useRef();
  const lastAngle = useRef(null);
  const lastReplayCamera = useRef(new Vector3(Infinity, Infinity, Infinity));
  const pointerInside = useRef(false);
  const eventTarget = useThree((s) => s.events.connected);

  // r3f keeps replaying its last pointer event even after the pointer has left the canvas, so only
  // replay while the pointer is actually over it.
  useEffect(() => {
    if (!eventTarget) return undefined;
    const enter = () => {
      pointerInside.current = true;
    };
    const leave = () => {
      pointerInside.current = false;
    };
    eventTarget.addEventListener('pointerenter', enter);
    eventTarget.addEventListener('pointermove', enter);
    eventTarget.addEventListener('pointerleave', leave);
    eventTarget.addEventListener('pointercancel', leave);
    return () => {
      eventTarget.removeEventListener('pointerenter', enter);
      eventTarget.removeEventListener('pointermove', enter);
      eventTarget.removeEventListener('pointerleave', leave);
      eventTarget.removeEventListener('pointercancel', leave);
    };
  }, [eventTarget]);

  useFrame((state, delta) => {
    stepRing(store, Math.min(delta, 0.1), performance.now());
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = store.angle;

    // r3f only raycasts when the pointer moves, so replay the last pointer event whenever the scene
    // moves under a still cursor: while the camera settles into the final view (so overRing/hover
    // engage without a mouse move) and while the ring turns under a hovered cursor.
    const nearFinal = isNearFinalView(store);
    const cameraMoved =
      nearFinal && state.camera.position.distanceTo(lastReplayCamera.current) > CAMERA_REPLAY_EPSILON;
    const ringTurned = lastAngle.current !== store.angle;
    lastAngle.current = store.angle;
    if (pointerInside.current && (cameraMoved || (ringTurned && store.overRing && nearFinal))) {
      lastReplayCamera.current.copy(state.camera.position);
      group.updateMatrixWorld();
      state.camera.updateMatrixWorld();
      state.events.update?.();
    }
  });

  return (
    <group ref={groupRef}>
      <CdHolder slotCount={items.length} items={items} store={store} />
      {items.map((item, index) => (
        <Book
          key={item.id}
          item={item}
          index={index}
          slotCount={items.length}
          store={store}
          onSelect={onSelect}
          onArrive={onArrive}
        />
      ))}
      <mesh
        position={[0, BOOK.centerY, 0]}
        onPointerOver={() => {
          store.overRing = true;
        }}
        onPointerOut={() => {
          store.overRing = false;
        }}
      >
        <cylinderGeometry args={[COLLIDER_RADIUS, COLLIDER_RADIUS, BOOK.height, 64, 1, true]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} side={DoubleSide} />
      </mesh>
    </group>
  );
}
