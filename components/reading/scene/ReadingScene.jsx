'use client';

import { Canvas } from '@react-three/fiber';
import { CAMERA } from '../constants';
import BookRing from './BookRing';
import CameraRig from './CameraRig';
import GroundRing from './GroundRing';

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
      <hemisphereLight args={['#fff8ee', '#8a7560', 1.6]} />
      <directionalLight position={[4, 9, 7]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} />
      <CameraRig store={store} />
      <GroundRing />
      <BookRing items={items} store={store} onSelect={onSelect} onArrive={onArrive} />
    </Canvas>
  );
}
