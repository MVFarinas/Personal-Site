'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import CatalogueCard from '@/components/reading/CatalogueCard';
import { reading, shelves } from '@/data/reading';

export default function ReadingPage() {
  const [shelf, setShelf] = useState('all');
  const reduce = useReducedMotion();

  const counts = useMemo(
    () =>
      shelves.reduce((acc, s) => {
        acc[s.id] =
          s.id === 'all'
            ? reading.length
            : reading.filter((e) => e.status === s.id).length;
        return acc;
      }, {}),
    []
  );

  const visible = useMemo(
    () => (shelf === 'all' ? reading : reading.filter((e) => e.status === shelf)),
    [shelf]
  );

  const activeLabel = shelves.find((s) => s.id === shelf).label;

  return (
    <div className="catalogue min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          title="Reading"
          subtitle="A card catalogue of what I am reading, have read, and mean to get to."
        />

        {/* Drawer face: label plate, pull, and the filter tabs */}
        <div className="catalogue-drawer px-6 pt-6 pb-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="catalogue-plate px-8 py-2">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/60">
                {activeLabel} · {counts[shelf]}
              </span>
            </div>
            <div className="catalogue-pull mt-2" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-7">
            {shelves.map((s) => {
              const on = s.id === shelf;
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
                  <sup className="ml-1.5 font-mono text-[8px] text-black/35">
                    {counts[s.id]}
                  </sup>
                  {on && (
                    <motion.span
                      layoutId="catalogue-tab"
                      className="absolute left-0 right-0 -bottom-px h-px bg-black/60"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* The cards themselves */}
        <motion.div
          layout={!reduce}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((entry, i) => (
              <motion.div
                key={entry.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 18, rotate: -0.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, rotate: 0.6 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: reduce ? 0 : i * 0.03 }}
              >
                <CatalogueCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="font-mono text-[10px] tracking-[0.15em] text-black/35 text-center mt-12">
          {visible.length} card{visible.length === 1 ? '' : 's'} in this drawer
        </p>
      </div>
    </div>
  );
}
