'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Pause, Play } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Disc from '@/components/reading/Disc';
import { reading, shelves } from '@/data/reading';

const statusLabel = {
  reading: 'Now Playing',
  finished: 'Played',
  queued: 'Up Next',
};

const pad = (n) => String(n).padStart(2, '0');

export default function ReadingPage() {
  const reduce = useReducedMotion();
  const [shelf, setShelf] = useState('all');
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(true);

  const deck = useMemo(
    () => (shelf === 'all' ? reading : reading.filter((e) => e.status === shelf)),
    [shelf]
  );

  const active = deck.length ? deck[Math.min(index, deck.length - 1)] : null;

  const go = useCallback(
    (delta) =>
      setIndex((i) => Math.min(Math.max(i + delta, 0), deck.length - 1)),
    [deck.length]
  );

  useEffect(() => setIndex(0), [shelf]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          title="Reading"
          subtitle="Everything I am reading, have read, and have queued up - pressed to disc."
        />

        {/* Shelf selector */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
          {shelves.map((s) => {
            const on = s.id === shelf;
            const count =
              s.id === 'all'
                ? reading.length
                : reading.filter((e) => e.status === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setShelf(s.id)}
                aria-pressed={on}
                className={`relative text-[10px] tracking-[0.22em] uppercase pb-1 transition-colors duration-300 ${
                  on ? 'text-black' : 'text-black/45 hover:text-black/75'
                }`}
              >
                {s.label}
                <sup className="ml-1.5 font-mono text-[8px] text-black/35">{count}</sup>
                {on && (
                  <motion.span
                    layoutId="shelf-underline"
                    className="absolute left-0 right-0 -bottom-px h-px bg-black/60"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Carousel */}
        <motion.div
          className="cd-stage relative h-[clamp(230px,46vw,330px)] mb-8"
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(1);
            if (info.offset.x > 50) go(-1);
          }}
        >
          {deck.map((entry, i) => {
            const o = i - index;
            const far = Math.abs(o) > 3;
            return (
              <div
                key={entry.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 20 - Math.abs(o) }}
              >
                <motion.button
                  type="button"
                  aria-hidden={far}
                  tabIndex={far ? -1 : 0}
                  aria-label={`Select ${entry.title}`}
                  onClick={() => (o === 0 ? setSpinning((s) => !s) : setIndex(i))}
                  className="pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-black/40 rounded-full"
                  initial={false}
                  animate={{
                    x: `${o * 58}%`,
                    scale: Math.max(1 - Math.abs(o) * 0.17, 0.42),
                    rotateY: o * -26,
                    opacity: far ? 0 : 1 - Math.abs(o) * 0.2,
                    filter: o === 0 ? 'blur(0px)' : 'blur(0.6px)',
                  }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 220, damping: 30 }
                  }
                  style={{ pointerEvents: far ? 'none' : 'auto' }}
                >
                  <Disc
                    entry={entry}
                    spinning={o === 0 && spinning && !reduce}
                    speed={16}
                  />
                </motion.button>
              </div>
            );
          })}
        </motion.div>

        {/* Transport */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            className="cd-transport"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            className="cd-transport"
            onClick={() => setSpinning((s) => !s)}
            aria-label={spinning ? 'Stop the disc' : 'Spin the disc'}
          >
            {spinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="font-mono text-[10px] tracking-[0.22em] text-black/40 w-16 text-center">
            {pad(index + 1)} / {pad(deck.length)}
          </span>

          <button
            className="cd-transport"
            onClick={() => go(1)}
            disabled={index >= deck.length - 1}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Liner notes for the selected disc */}
        <div className="max-w-2xl mx-auto min-h-[190px]">
          <AnimatePresence mode="wait">
            {active && (
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#fffef9] border border-black/10 p-8 text-center"
            >
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/40">
                {statusLabel[active.status]} · {active.subject}
              </p>

              <h3 className="font-serif text-black text-2xl leading-snug mt-3">
                {active.title}
              </h3>

              <p className="text-[10px] tracking-[0.25em] uppercase text-black/55 mt-2">
                {active.author} · {active.kind}
              </p>

              <div className="w-10 h-px bg-black/15 mx-auto my-5" />

              <p className="text-black/70 text-xs leading-relaxed">{active.note}</p>

              <div className="flex items-center justify-center gap-5 mt-5">
                <span className="font-mono text-[10px] text-black/40">
                  {active.status === 'reading'
                    ? `Started ${active.started}`
                    : active.status === 'finished'
                    ? `Finished ${active.finished}`
                    : 'Shelved'}
                </span>
                {active.rating && (
                  <span className="font-mono text-[10px] text-black/40">
                    {'★'.repeat(active.rating)}
                    <span className="text-black/15">{'★'.repeat(5 - active.rating)}</span>
                  </span>
                )}
                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-mono text-[10px] tracking-[0.15em] text-black/30 text-center mt-8">
          Drag, use the arrow keys, or click a disc to change tracks
        </p>
      </div>
    </div>
  );
}
