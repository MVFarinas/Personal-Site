'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { CAMERA, HOLDER } from '../constants';
import BookRing from './BookRing';
import CameraRig from './CameraRig';
import { getShadowTexture } from './finish';

function GroundShadow() {
  const texture = useMemo(getShadowTexture, []);
  const size = HOLDER.baseRadius * 2.7;
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-HOLDER.baseThickness - 0.002} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export default function ReadingScene({ items, store, onSelect, onArrive, frozen = false }) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 2]}
      frameloop={frozen ? 'never' : 'always'}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: CAMERA.fov, position: CAMERA.keyframes[0].position, near: 0.1, far: 100 }}
      flat
    >
      <hemisphereLight args={['#fff8ee', '#77726c', 1.6]} />
      <directionalLight position={[4, 9, 7]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} />
      <CameraRig store={store} />
      <GroundShadow />
      <BookRing items={items} store={store} onSelect={onSelect} onArrive={onArrive} />
    </Canvas>
  );
}
