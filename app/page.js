'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const insideLinks = [
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/research', label: 'Research' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

/* Bone/off-white background with subtle paper texture and watermark. */
function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base off-white/bone color */}
      <div className="absolute inset-0 bg-[#f6f5f1]"></div>

      {/* Subtle paper texture using CSS patterns */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            )
          `,
        }}
      ></div>

      {/* Subtle watermark effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.015]">
        <div className="text-[25rem] font-serif tracking-[0.3em] text-black select-none font-light">
          MF
        </div>
      </div>
    </div>
  );
}

/* The visible face of the business card. */
function CardFront() {
  return (
    <div className="relative bg-[#fffef9] border border-gray-300/30 p-16">
      {/* Subtle embossed texture overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at top, rgba(0,0,0,0.02) 0%, transparent 70%),
              radial-gradient(ellipse at bottom, rgba(0,0,0,0.02) 0%, transparent 70%)
            `,
          }}
        ></div>
      </div>

      {/* Top Section - Phone Number */}
      <div className="flex justify-between items-start mb-16">
        <div className="text-black text-[13px] tracking-[0.25em] font-normal">
          780.802.0708
        </div>
        <div className="text-right">
          <div className="text-black text-[11px] tracking-[0.35em] font-semibold">
            MACEWAN UNIVERSITY
          </div>
          <div className="text-black/80 text-[9px] tracking-[0.25em] font-normal mt-0.5">
            & UALBERTA ALUMNI
          </div>
        </div>
      </div>

      {/* Center - Name */}
      <div className="text-center mb-16">
        <h1 className="text-black text-3xl tracking-[0.35em] font-normal mb-2 uppercase">
          MARK FARINAS
        </h1>
        <div className="text-black/90 text-[13px] tracking-[0.4em] font-medium uppercase">
          Software Developer
        </div>
      </div>

      {/* Bottom Section - Address/Info */}
      <div className="text-center">
        <div className="text-black/85 text-[11px] tracking-[0.3em] font-normal uppercase leading-relaxed">
          Edmonton, Alberta, Canada
          <br />
          <span className="tracking-[0.2em]">farinasm@mymacewan.ca</span> ·{' '}
          <span className="tracking-[0.15em] lowercase">github.com/MVFarinas</span>
        </div>
      </div>

      {/* Subtle Corner Accents - barely visible */}
      <div className="absolute top-4 left-4">
        <div className="w-6 h-6 border-t border-l border-gray-400/10"></div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 border-t border-r border-gray-400/10"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-6 h-6 border-b border-l border-gray-400/10"></div>
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-6 h-6 border-b border-r border-gray-400/10"></div>
      </div>
    </div>
  );
}

/* The "inside" of the card - the site index revealed by the flip. */
function CardInside() {
  return (
    <div className="relative bg-[#fffef9] border border-gray-300/30 p-16 h-full flex flex-col justify-center">
      {/* Subtle embossed texture overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at top, rgba(0,0,0,0.02) 0%, transparent 70%),
              radial-gradient(ellipse at bottom, rgba(0,0,0,0.02) 0%, transparent 70%)
            `,
          }}
        ></div>
      </div>

      <div className="text-center mb-10">
        <div className="text-black/40 text-[10px] tracking-[0.4em] uppercase font-light">
          ↳ Step Inside
        </div>
      </div>

      <nav className="flex flex-col items-center gap-5">
        {insideLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-black/70 text-[13px] tracking-[0.4em] uppercase font-normal hover:text-black hover:tracking-[0.5em] transition-all duration-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Subtle Corner Accents - barely visible */}
      <div className="absolute top-4 left-4">
        <div className="w-6 h-6 border-t border-l border-gray-400/10"></div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 border-t border-r border-gray-400/10"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-6 h-6 border-b border-l border-gray-400/10"></div>
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-6 h-6 border-b border-r border-gray-400/10"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // One card, two solid faces (CardFront / CardInside) mounted back-to-back on a
  // single rotating element. backfaceVisibility hides whichever face points away,
  // so the front shows from 0-90deg and the back from 90-180deg, each fully opaque
  // and equally bright. The flip completes by 80% of the track, then the fully
  // revealed back rests pinned through the bottom of the scroll.
  const rotateX = useTransform(scrollYProgress, [0, 0.8], [0, 180]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Reduced-motion / no-JS-friendly fallback: a static stacked layout.
  if (prefersReduced) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 gap-10">
          <div className="max-w-3xl w-full">
            <CardFront />
          </div>
          <div className="max-w-3xl w-full">
            <CardInside />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Background />

      {/* Tall scroll track gives the flip room to scrub. */}
      <div ref={ref} className="relative h-[220vh]">
        {/* Pinned stage */}
        <div className="sticky top-0 h-screen flex items-center justify-center px-6 overflow-hidden">
          <div className="relative w-full max-w-3xl" style={{ perspective: 1600 }}>
            <motion.div
              className="relative w-full"
              style={{ rotateX, transformStyle: 'preserve-3d' }}
            >
              {/* Front face - defines the card height */}
              <div style={{ backfaceVisibility: 'hidden' }}>
                <CardFront />
              </div>

              {/* Back face - the inside, pre-rotated so it reads correctly */}
              <motion.div
                className="absolute inset-0"
                style={{
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <CardInside />
              </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <p className="text-black/50 text-[10px] tracking-[0.3em] uppercase font-light">
                Scroll to Flip
              </p>
              <ChevronDown className="w-3 h-3 text-black/30 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
