'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CAMERA, COLORS, HOLDER } from '../constants';
import BookRing from './BookRing';
import CameraRig from './CameraRig';
import { getShadowTexture, setGlassQuality, setHolderEnvironment } from './holderMaterials';

const SLOW_FRAME_SECONDS = 1 / 45;
const QUALITY_WARMUP_SECONDS = 1.5;
const QUALITY_WINDOW_FRAMES = 90;

// Real frosted glass (transmission) roughly doubles render cost. Touch devices start with the light
// fallback, and anything else drops to it for good if frames run slow. `?glass=full|lite` forces a mode.
function GlassQuality() {
  const monitor = useRef({ active: true, warmup: 0, total: 0, frames: 0 });

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('glass');
    const lite = forced ? forced === 'lite' : window.matchMedia('(pointer: coarse)').matches;
    monitor.current.active = !forced && !lite;
    setGlassQuality(!lite);
    return () => setGlassQuality(true);
  }, []);

  useFrame((_, delta) => {
    const m = monitor.current;
    if (!m.active || delta > 0.25) return;
    if (m.warmup < QUALITY_WARMUP_SECONDS) {
      m.warmup += delta;
      return;
    }
    m.total += delta;
    m.frames += 1;
    if (m.frames < QUALITY_WINDOW_FRAMES) return;
    if (m.total / m.frames > SLOW_FRAME_SECONDS) {
      m.active = false;
      setGlassQuality(false);
    }
    m.total = 0;
    m.frames = 0;
  });

  return null;
}

// A neutral studio room for the glass and steel to reflect.
function HolderEnvironment() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    // Frosted glass blurs what it transmits anyway, so a half-resolution transmission pass is invisible and far cheaper.
    gl.transmissionResolutionScale = 0.5;
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
      dpr={[1, 2]}
      frameloop={frozen ? 'never' : 'always'}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: CAMERA.fov, position: CAMERA.keyframes[0].position, near: 0.1, far: 100 }}
      flat
    >
      {/* Transmission samples what's behind the glass from the scene, so the page colour has to be in it. */}
      <color attach="background" args={[COLORS.background]} />
      <HolderEnvironment />
      <GlassQuality />
      <hemisphereLight args={['#fff8ee', '#8a7560', 1.6]} />
      <directionalLight position={[4, 9, 7]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} />
      <CameraRig store={store} />
      <GroundShadow />
      <BookRing items={items} store={store} onSelect={onSelect} onArrive={onArrive} />
    </Canvas>
  );
}
