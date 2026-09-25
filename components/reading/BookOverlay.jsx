'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { BOOK } from './constants';
import { placeholderCoverDataURL } from './placeholderArt';
import { slotItemId } from './slots';

const STATUS_LABELS = {
  reading: 'Reading',
  finished: 'Read',
  planned: 'Plan to read',
};

const SERIF = 'var(--font-cormorant), Georgia, serif';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function BookOverlay({ item, phase, store, onClose }) {
  const open = phase === 'open';
  const dialogRef = useRef(null);
  const innerRef = useRef(null);
  const slotRef = useRef(null);
  const imgRef = useRef(null);
  const closeRef = useRef(null);
  const [src, setSrc] = useState(item.cover ?? null);

  useEffect(() => {
    if (!item.cover) setSrc(placeholderCoverDataURL(item));
  }, [item]);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return undefined;
    const measure = () => {
      const r = slot.getBoundingClientRect();
      store.coverRect = { x: r.left, y: r.top, width: r.width, height: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      store.coverRect = null;
    };
  }, [store]);

  // Hide the 3D book only once the HTML cover is decoded and painted in the same spot, so the swap never flashes.
  useEffect(() => {
    if (!open || !src) return undefined;
    let cancelled = false;
    const img = imgRef.current;
    const show = () => {
      if (!cancelled && slotItemId(store.selectedId) === item.id) store.coverShown = true;
    };
    if (img?.decode) img.decode().then(show, show);
    else show();
    return () => {
      cancelled = true;
    };
  }, [open, src, store, item.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Clicking non-focusable content inside the dialog drops focus to <body>, so the trap lives on the document.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const focusables = () =>
      [...dialog.querySelectorAll(FOCUSABLE)].filter((n) => !n.closest('[aria-hidden="true"]'));
    const onFocusIn = (e) => {
      if (!dialog.isConnected || dialog.contains(e.target)) return;
      (closeRef.current ?? dialog).focus({ preventScroll: true });
    };
    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active) || active === dialog) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onTab);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onTab);
    };
  }, []);

  // Declared after the trap so its cleanup (restoring focus) runs once the trap listeners are gone.
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  const onBackdropClick = (e) => {
    if (!open) return;
    if (e.target === dialogRef.current || e.target === innerRef.current) onClose();
  };

  const titleId = `book-overlay-title-${item.id}`;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onClick={onBackdropClick}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className={`fixed inset-0 z-[60] overflow-y-auto outline-none ${open ? '' : 'pointer-events-none'}`}
    >
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 bg-[#f6f5f1]/85 backdrop-blur-sm"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="pointer-events-auto fixed top-20 right-6 z-10 flex items-center gap-2 rounded-full border border-black/15 bg-[#f6f5f1]/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
      >
        <X size={12} aria-hidden="true" />
        Close
      </button>

      <div
        ref={innerRef}
        className="relative flex min-h-full flex-col items-center justify-center gap-8 px-6 pb-10 pt-32 md:flex-row md:gap-12 md:pt-24"
      >
        <div
          ref={slotRef}
          className="relative h-[min(42vh,560px)] shrink-0 md:h-[min(62vh,640px)]"
          style={{ aspectRatio: `${BOOK.depth} / ${BOOK.height}` }}
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={src}
              alt={`Cover of ${item.title} by ${item.author}`}
              className="absolute inset-0 h-full w-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]"
              style={{ opacity: open ? 1 : 0 }}
            />
          )}
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0, x: open ? 0 : 12 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: open ? 0.1 : 0 }}
          className="w-full max-w-[360px] border border-black/10 bg-[#fffef9] p-8"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/50">
            {[item.kind, STATUS_LABELS[item.status] ?? item.status].filter(Boolean).map((part, i) => (
              <span key={part} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <span>{part}</span>
              </span>
            ))}
          </div>
          <h2 id={titleId} className="mt-4 text-3xl leading-tight text-black" style={{ fontFamily: SERIF }}>
            {item.title}
          </h2>
          <p className="mt-2 text-xs text-black/60">{item.author}</p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-black/70 hover:text-black"
            >
              Source <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          )}

          <div className="mt-6 h-px w-12 bg-black/20" />

          <h3 className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-black">Notes</h3>
          <div className="mt-3 border border-dashed border-black/15 px-4 py-6 text-center text-xs tracking-wider text-black/40">
            Notes coming soon
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
