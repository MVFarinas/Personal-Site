'use client';

import { useEffect } from 'react';
import { MOTION } from './constants';
import { isFinalView, isNearFinalView, nearestSlotAngle } from './store';

const TAU = Math.PI * 2;
const DRAG_LOCK_PX = 8;

const clamp = (v, max) => Math.max(-max, Math.min(max, v));

// Per-store snap spring state, kept out of the shared store so the contract fields stay clean.
const snapState = new WeakMap();

function getSnap(store) {
  let s = snapState.get(store);
  if (!s) {
    s = { active: false, v: 0 };
    snapState.set(store, s);
  }
  return s;
}

export function stepRing(store, dt, now) {
  dt = Math.min(Math.max(dt, 0), 0.1);
  const snap = getSnap(store);

  if (store.dragging) {
    snap.active = false;
    return;
  }

  if (store.snapTarget != null) {
    if (!snap.active) {
      snap.active = true;
      snap.v = store.velocity;
    }
    // Exact critically damped spring step: stable for any dt.
    const k = MOTION.snapStiffness;
    const x0 = store.angle - store.snapTarget;
    const v0 = snap.v;
    const decay = Math.exp(-k * dt);
    const c = v0 + k * x0;
    const x = (x0 + c * dt) * decay;
    snap.v = (v0 - k * c * dt) * decay;
    store.angle = store.snapTarget + x;
    store.velocity = 0;

    if (Math.abs(x) < 1e-4 && Math.abs(snap.v) < 1e-3) {
      store.angle = store.snapTarget;
      snap.v = 0;
      if (!store.selectedId) {
        store.snapTarget = null;
        snap.active = false;
      }
    }
    return;
  }
  snap.active = false;

  const hovered = store.overRing && isNearFinalView(store);
  const recentlyTouched = now - store.lastInteraction < MOTION.resumeDelayMs;
  const target =
    hovered || store.selectedId || store.userPaused || store.reducedMotion || recentlyTouched
      ? 0
      : MOTION.autoSpeed;
  // Touch flings coast longer than wheel spins, like native momentum scrolling on phones.
  const friction = (store.coastFriction ?? MOTION.friction) * (store.reducedMotion ? 4 : 1);

  store.velocity = target + (store.velocity - target) * Math.exp(-friction * dt);
  store.angle += store.velocity * dt;
}

export function useRingInput(stageRef, store, enabled = true) {
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return undefined;

    let lastWheelAt = -Infinity;
    let lastWheelIntercepted = false;

    const onWheel = (e) => {
      const now = performance.now();
      const continuation = !lastWheelIntercepted && now - lastWheelAt < MOTION.gestureGapMs;
      const canSpin = isFinalView(store) && store.overRing && !store.selectedId && !continuation;
      lastWheelAt = now;
      lastWheelIntercepted = canSpin;
      if (!canSpin) return;

      e.preventDefault();
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const input = (e.deltaY + e.deltaX) * scale;
      store.velocity = clamp(store.velocity - input * MOTION.wheelGain, MOTION.maxSpeed);
      store.coastFriction = MOTION.friction;
      store.snapTarget = null;
      store.lastInteraction = now;
    };

    let touch = null;

    const endDrag = (withFling) => {
      if (!touch) return;
      if (store.dragging) {
        const now = performance.now();
        let velocity = 0;
        if (withFling) {
          const recent = touch.samples.filter((s) => now - s.t <= MOTION.flingSampleMs);
          if (recent.length >= 2) {
            const first = recent[0];
            const last = recent[recent.length - 1];
            const span = (last.t - first.t) / 1000;
            if (span > 0.008) velocity = (last.angle - first.angle) / span;
          }
        }
        store.velocity = clamp(velocity, MOTION.maxSpeed);
        store.coastFriction = MOTION.flingFriction;
        store.dragging = false;
        store.lastInteraction = now;
      }
      touch = null;
    };

    const onPointerDown = (e) => {
      if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
      if (touch || !isNearFinalView(store) || store.selectedId) return;
      touch = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        tracking: true,
        samples: [],
      };
    };

    const onPointerMove = (e) => {
      if (!touch || e.pointerId !== touch.id || !touch.tracking) return;
      const dx = e.clientX - touch.startX;
      const dy = e.clientY - touch.startY;

      if (!store.dragging) {
        if (Math.abs(dx) >= DRAG_LOCK_PX && Math.abs(dx) > Math.abs(dy)) {
          store.dragging = true;
          store.snapTarget = null;
          store.velocity = 0;
          touch.lastX = touch.startX;
        } else if (Math.abs(dy) >= DRAG_LOCK_PX) {
          touch.tracking = false;
          return;
        } else {
          return;
        }
      }

      const now = performance.now();
      store.angle += (e.clientX - touch.lastX) / Math.max(store.pxPerRad, 1);
      touch.lastX = e.clientX;
      store.lastInteraction = now;
      touch.samples.push({ t: now, angle: store.angle });
      while (touch.samples.length > 2 && now - touch.samples[0].t > MOTION.flingSampleMs * 2) {
        touch.samples.shift();
      }
    };

    const onPointerUp = (e) => {
      if (!touch || e.pointerId !== touch.id) return;
      endDrag(true);
    };

    // With touch-action: pan-y the browser cancels the pointer when it takes over a vertical pan.
    const onPointerCancel = (e) => {
      if (!touch || e.pointerId !== touch.id) return;
      endDrag(false);
    };

    const onKeyDown = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      if (store.selectedId) return;
      e.preventDefault();
      const step = TAU / store.slotCount;
      const base = nearestSlotAngle(store.slotCount, store.snapTarget ?? store.angle);
      store.snapTarget = e.key === 'ArrowRight' ? base - step : base + step;
      store.velocity = 0;
      store.lastInteraction = performance.now();
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => {
      store.reducedMotion = mq.matches;
    };
    syncReducedMotion();

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerCancel);
    el.addEventListener('keydown', onKeyDown);
    mq.addEventListener('change', syncReducedMotion);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerCancel);
      el.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener('change', syncReducedMotion);
      if (store.dragging) {
        store.dragging = false;
        store.lastInteraction = performance.now();
      }
    };
  }, [stageRef, store, enabled]);
}
