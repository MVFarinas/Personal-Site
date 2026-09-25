import { BOOK, RING } from './constants';
import { slotAngle } from './store';

const TAU = Math.PI * 2;

export const bookThickness = (item) => item.thickness ?? BOOK.defaultThickness;

// Slot keys are `${item.id}~${copy}`.
export const slotItemId = (key) => (key ? key.slice(0, key.lastIndexOf('~')) : null);

// With few books the ring repeats the whole list so its density stays near RING.targetGap; as the
// list grows the copies drop to one. Copies of a book sit items.length slots apart.
export function buildSlots(items) {
  if (!items.length) return [];
  const avgThickness = items.reduce((sum, item) => sum + bookThickness(item), 0) / items.length;
  const circumference = TAU * RING.spineRadius;
  const copies = Math.max(1, Math.round(circumference / (avgThickness + RING.targetGap) / items.length));
  const slots = [];
  for (let copy = 0; copy < copies; copy++) {
    for (const item of items) slots.push({ key: `${item.id}~${copy}`, item, index: slots.length });
  }
  return slots;
}

const wrapAngle = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

// The copy of a book closest to the front of the ring at the given ring angle.
export function nearestSlotFor(slots, itemId, angle) {
  let best = null;
  let bestDistance = Infinity;
  for (const slot of slots) {
    if (slot.item.id !== itemId) continue;
    const distance = Math.abs(wrapAngle(slotAngle(slot.index, slots.length) + angle));
    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
    }
  }
  return best;
}
