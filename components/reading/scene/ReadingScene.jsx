'use client';

import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CAMERA, COLORS, HOLDER } from '../constants';
import BookRing from './BookRing';
import CameraRig from './CameraRig';
import { getShadowTexture, setHolderEnvironment } from './holderMaterials';

// A neutral studio room for the glass and steel to reflect.
function HolderEnvironment() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    // Frosted glass blurs what it transmits anyway, so the transmission pass stays at half a CSS pixel's
    // resolution whatever the device pixel ratio, instead of growing 4x on retina screens.
    gl.transmissionResolutionScale = 0.5 / gl.getPixelRatio();
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    setHolderEnvironment(envMap);
    return () => {
      setHolderEnvironment(null);
      envMap.dispose();
    };
  }, [gl]);
  return null;
}

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
      dpr={[1, 1.5]}
      frameloop={frozen ? 'never' : 'always'}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: CAMERA.fov, position: CAMERA.keyframes[0].position, near: 0.1, far: 100 }}
      flat
    >
      {/* Transmission samples what's behind the glass from the scene, so the page colour has to be in it. */}
      <color attach="background" args={[COLORS.background]} />
      <HolderEnvironment />
      <hemisphereLight args={['#fff8ee', '#8a7560', 1.6]} />
      <directionalLight position={[4, 9, 7]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} />
      <CameraRig store={store} />
      <GroundShadow />
      <BookRing items={items} store={store} onSelect={onSelect} onArrive={onArrive} />
    </Canvas>
  );
}
