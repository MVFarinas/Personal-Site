'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, MathUtils, Quaternion, Vector3 } from 'three';
import { BOOK, INTERACTION, RING } from '../constants';
import { isNearFinalView, slotAngle } from '../store';
import { bookThickness, getBookMaterials } from './textures';

const HOVER_DAMPING = INTERACTION.hover.damping;
const RETURN_DAMPING = 12;
const TAU = Math.PI * 2;
const SETTLED_TOLERANCE = 0.02;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const geometries = new Map();
function getGeometry(thickness) {
  const key = thickness.toFixed(3);
  let geometry = geometries.get(key);
  if (!geometry) {
    geometry = new BoxGeometry(thickness, BOOK.height, BOOK.depth);
    geometries.set(key, geometry);
  }
  return geometry;
}

const Y_AXIS = new Vector3(0, 1, 0);
const COVER_TO_VIEWER = new Quaternion().setFromAxisAngle(Y_AXIS, -Math.PI / 2);
const IDENTITY = new Quaternion();
const _worldPos = new Vector3();
const _worldQuat = new Quaternion();
const _parentQuat = new Quaternion();

// Angle of the book around the ring as seen from the camera, wrapped to (-π, π]; 0 = front.
const wrapAngle = (a) => MathUtils.euclideanModulo(a + Math.PI, TAU) - Math.PI;

// While presented (or flying back) the book is drawn after everything else and ignores depth, so the
// neighbouring books can't cut into it. A convex, back-face-culled box never overlaps
// itself, so skipping the depth test is safe for the book's own faces.
function setElevated(mesh, materials, elevated) {
  mesh.renderOrder = elevated ? 1000 : 0;
  for (const material of materials) material.depthTest = !elevated;
}

// r3f replays its last event (possibly a wheel event) when the ring turns under a still cursor.
const isMouseEvent = (e) => (e.nativeEvent?.pointerType ?? e.pointerType) === 'mouse' || e.nativeEvent?.type === 'wheel';

// Nearest book on the camera-facing half of the ring; far-side books seen through gaps don't count.
function nearestBookId(e, store) {
  for (const hit of e.intersections) {
    const { bookId, phi } = hit.object.userData;
    if (bookId != null && Math.abs(wrapAngle(phi + store.angle)) <= Math.PI / 2) return bookId;
  }
  return null;
}

function setCursor(pointer) {
  document.body.style.cursor = pointer ? 'pointer' : '';
}

// Presentation pose: the cover face (+x) fills store.coverRect, facing the camera, upright.
function presentationPose(camera, size, rect, thickness, outPos, outQuat) {
  const tanHalf = Math.tan(MathUtils.degToRad(camera.fov / 2));
  let ndcX = -0.3;
  let ndcY = 0;
  let distance = 2;
  if (rect && rect.height > 0 && size.width > 0 && size.height > 0) {
    ndcX = ((rect.x + rect.width / 2 - (size.left ?? 0)) / size.width) * 2 - 1;
    ndcY = -(((rect.y + rect.height / 2 - (size.top ?? 0)) / size.height) * 2 - 1);
    distance = (BOOK.height * size.height) / (rect.height * 2 * tanHalf);
  }
  outPos.set(ndcX * distance * tanHalf * camera.aspect, ndcY * distance * tanHalf, -(distance + thickness / 2));
  camera.localToWorld(outPos);
  outQuat.copy(camera.quaternion).multiply(COVER_TO_VIEWER);
}

export default function Book({ item, index, slotCount, store, onSelect, onArrive }) {
  const animRef = useRef();
  const meshRef = useRef();
  const phase = useRef(null);
  const arrived = useRef(false);
  const targetPos = useRef(new Vector3());
  const targetQuat = useRef(new Quaternion());
  const fromPos = useRef(new Vector3());
  const fromQuat = useRef(new Quaternion());
  const phaseStart = useRef(0);
  const elevated = useRef(false);

  const thickness = bookThickness(item);
  const geometry = getGeometry(thickness);
  const materials = useMemo(() => getBookMaterials(item), [item]);

  const rest = useMemo(() => {
    const phi = slotAngle(index, slotCount);
    const radius = RING.spineRadius - BOOK.depth / 2;
    return {
      phi,
      position: [Math.sin(phi) * radius, BOOK.centerY, Math.cos(phi) * radius],
      rotation: [0, phi, 0],
    };
  }, [index, slotCount]);

  useEffect(
    () => () => {
      if (store.hoveredId === item.id) {
        store.hoveredId = null;
        setCursor(false);
      }
    },
    [store, item.id]
  );

  useFrame((state, delta) => {
    const anim = animRef.current;
    if (!anim) return;
    const dt = Math.min(delta, 0.1);
    const pos = targetPos.current;
    const quat = targetQuat.current;
    const selected = store.selectedId === item.id;

    if (!selected) {
      phase.current = null;
      arrived.current = false;
      if (store.hoveredId === item.id && !store.selectedId) {
        const { turn, minTurn, maxTurn, lift, pullOut } = INTERACTION.hover;
        pos.set(0, lift, pullOut * BOOK.depth);
        // Turn so the front cover ends up facing the viewer the same way from anywhere on the ring.
        const angle = MathUtils.clamp(turn - wrapAngle(rest.phi + store.angle), minTurn, maxTurn);
        quat.setFromAxisAngle(Y_AXIS, angle);
      } else {
        pos.set(0, 0, 0);
        quat.copy(IDENTITY);
      }
      const k = 1 - Math.exp(-(elevated.current ? RETURN_DAMPING : HOVER_DAMPING) * dt);
      anim.position.lerp(pos, k);
      anim.quaternion.slerp(quat, k);
    } else {
      // Fixed-duration eased tweens (not exponential damping) so opening has no slow settling tail.
      const now = state.clock.elapsedTime;
      const { pullOut, pullSeconds, flySeconds } = INTERACTION.select;
      if (phase.current === null) {
        phase.current = 'pull';
        phaseStart.current = now;
        fromPos.current.copy(anim.position);
        fromQuat.current.copy(anim.quaternion);
      }

      if (phase.current === 'pull') {
        pos.set(0, 0, pullOut * BOOK.depth);
        quat.copy(IDENTITY);
        const u = Math.min((now - phaseStart.current) / pullSeconds, 1);
        const e = easeOutCubic(u);
        anim.position.lerpVectors(fromPos.current, pos, e);
        anim.quaternion.slerpQuaternions(fromQuat.current, quat, e);
        if (u >= 1) {
          phase.current = 'fly';
          phaseStart.current = now;
          fromPos.current.copy(pos);
          fromQuat.current.copy(quat);
        }
      } else {
        // The target is recomputed every frame because the ring is still turning the book to the front.
        presentationPose(state.camera, state.size, store.coverRect, thickness, _worldPos, _worldQuat);
        const parent = anim.parent;
        parent.updateWorldMatrix(true, false);
        pos.copy(parent.worldToLocal(_worldPos));
        parent.getWorldQuaternion(_parentQuat);
        quat.copy(_parentQuat.invert().multiply(_worldQuat));
        const u = Math.min((now - phaseStart.current) / flySeconds, 1);
        const e = easeInOutCubic(u);
        anim.position.lerpVectors(fromPos.current, pos, e);
        anim.quaternion.slerpQuaternions(fromQuat.current, quat, e);
        if (u >= 1 && !arrived.current) {
          arrived.current = true;
          onArrive?.(item.id);
        }
      }
    }

    const mesh = meshRef.current;
    if (mesh) {
      mesh.visible = !(selected && store.coverShown);
      let lift = elevated.current;
      if (selected && phase.current === 'fly') lift = true;
      else if (!selected && lift && anim.position.distanceTo(pos) < SETTLED_TOLERANCE && anim.quaternion.angleTo(quat) < SETTLED_TOLERANCE) lift = false;
      if (lift !== elevated.current) {
        elevated.current = lift;
        setElevated(mesh, materials, lift);
      }
    }
  });

  const updateHover = (e) => {
    if (!isMouseEvent(e)) return;
    if (!isNearFinalView(store) || store.selectedId) {
      if (store.hoveredId) store.hoveredId = null;
      setCursor(false);
      return;
    }
    const id = nearestBookId(e, store);
    if (store.hoveredId !== id) store.hoveredId = id;
    setCursor(id != null);
  };

  const handleOut = () => {
    if (store.hoveredId === item.id) {
      store.hoveredId = null;
      setCursor(false);
    }
  };

  const handleClick = (e) => {
    if (e.delta > INTERACTION.clickMaxDeltaPx || !isNearFinalView(store) || store.selectedId) return;
    if (nearestBookId(e, store) !== item.id) return;
    e.stopPropagation();
    onSelect?.(item.id);
  };

  return (
    <group position={rest.position} rotation={rest.rotation}>
      <group ref={animRef}>
        <mesh ref={meshRef} geometry={geometry} material={materials} />
      </group>
      {/* Pointer target stays at the rest pose so a pulled-out, turned book can't slide out from under the cursor. */}
      <mesh
        geometry={geometry}
        visible={false}
        userData={{ bookId: item.id, phi: rest.phi }}
        onPointerOver={updateHover}
        onPointerMove={updateHover}
        onPointerOut={handleOut}
        onClick={handleClick}
      />
    </group>
  );
}
