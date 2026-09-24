'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { createReadingStore, frontAngleFor } from './store';
import { useRingInput } from './ringMotion';
import BookOverlay from './BookOverlay';
import ReadingList from './ReadingList';

const ReadingScene = dynamic(() => import('./scene/ReadingScene'), { ssr: false });

const SUBTITLE = 'What I am reading, have read, and plan to read.';

function hasWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function DebugScrubber({ store }) {
  const [value, setValue] = useState(null);

  return (
    <div className="absolute bottom-6 left-6 z-10 w-64 border border-black/10 bg-[#fffef9]/95 p-4 text-[10px] uppercase tracking-[0.2em] text-black/70">
      <div className="flex items-center justify-between">
        <span>Camera p</span>
        <span className="font-mono normal-case tracking-normal">
          {value === null ? 'scroll' : value.toFixed(3)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={value ?? store.progress}
        onChange={(e) => {
          const v = Number(e.target.value);
          store.progressOverride = v;
          setValue(v);
        }}
        className="mt-3 w-full accent-black"
        aria-label="Camera progress override"
      />
      <button
        type="button"
        onClick={() => {
          store.progressOverride = null;
          setValue(null);
        }}
        className="mt-2 underline underline-offset-2 hover:text-black"
      >
        Live scroll
      </button>
    </div>
  );
}

function CarouselStage({ items, store, stageRef, onSelect, onArrive, sceneReady, debug, frozen }) {
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const introOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    store.progress = v;
  });

  useEffect(() => {
    store.progress = scrollYProgress.get();
  }, [store, scrollYProgress]);

  useRingInput(stageRef, store);

  const togglePaused = () => {
    const next = !paused;
    store.userPaused = next;
    setPaused(next);
  };

  return (
    <section ref={sectionRef} className="relative" style={{ height: '250svh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-label="Reading carousel. Use the left and right arrow keys to turn it."
          className="absolute inset-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-black/40"
          style={{ touchAction: 'pan-y' }}
        >
          {sceneReady && (
            <ReadingScene items={items} store={store} onSelect={onSelect} onArrive={onArrive} frozen={frozen} />
          )}
        </div>

        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 pt-28"
        >
          <SectionHeader title="Reading" subtitle={SUBTITLE} />
        </motion.div>

        <motion.div
          style={{ opacity: introOpacity }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-black/50"
        >
          <span>Scroll</span>
          <span className="block h-8 w-px bg-black/20" />
        </motion.div>

        <button
          type="button"
          onClick={togglePaused}
          aria-pressed={paused}
          aria-label={paused ? 'Resume carousel rotation' : 'Pause carousel rotation'}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-full border border-black/15 bg-[#f6f5f1]/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black/70 backdrop-blur-sm transition-colors hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
        >
          {paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}
          {paused ? 'Play' : 'Pause'}
        </button>

        {debug && <DebugScrubber store={store} />}

        <ReadingList items={items} onSelect={onSelect} />
      </div>
    </section>
  );
}

export default function ReadingExperience({ items }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = createReadingStore(items.length);
  const store = storeRef.current;

  const stageRef = useRef(null);
  const pushedRef = useRef(false);
  const firstRunRef = useRef(true);
  const [webgl, setWebgl] = useState(null);
  const [phase, setPhase] = useState('approach');

  const bookParam = searchParams.get('book');
  const debug = searchParams.get('debug') === '1';
  const selectedItem = items.find((item) => item.id === bookParam) ?? null;
  const selectedId = selectedItem?.id ?? null;

  useEffect(() => {
    setWebgl(hasWebGL2());
  }, []);

  useEffect(() => {
    if (selectedId) {
      if (firstRunRef.current) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      }
      const index = items.findIndex((item) => item.id === selectedId);
      store.selectedId = selectedId;
      store.snapTarget = frontAngleFor(index, items.length, store.angle);
      store.coverShown = false;
      setPhase(webgl === false ? 'open' : 'approach');
    } else {
      store.selectedId = null;
      store.snapTarget = null;
      store.coverShown = false;
      setPhase('approach');
    }
    firstRunRef.current = false;
  }, [selectedId, webgl, items, store]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [selectedId]);

  const onSelect = useCallback(
    (id) => {
      if (id === store.selectedId) return;
      pushedRef.current = true;
      router.push(`/reading?book=${encodeURIComponent(id)}`, { scroll: false });
    },
    [router, store],
  );

  const onArrive = useCallback(
    (id) => {
      if (store.selectedId === id) setPhase('open');
    },
    [store],
  );

  const onClose = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      router.back();
    } else {
      router.replace('/reading', { scroll: false });
    }
  }, [router]);

  return (
    <div className="bg-[#f6f5f1]">
      {webgl === false ? (
        <div className="min-h-[100svh] pt-24 pb-16">
          <SectionHeader title="Reading" subtitle={SUBTITLE} />
          <ReadingList items={items} onSelect={onSelect} visible />
        </div>
      ) : (
        <CarouselStage
          items={items}
          store={store}
          stageRef={stageRef}
          onSelect={onSelect}
          onArrive={onArrive}
          sceneReady={webgl === true}
          debug={debug}
          frozen={phase === 'open'}
        />
      )}

      <AnimatePresence>
        {selectedItem && (
          <BookOverlay key={selectedItem.id} item={selectedItem} phase={phase} store={store} onClose={onClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
