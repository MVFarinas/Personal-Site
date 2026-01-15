'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Bone/Off-White Background with Subtle Texture */}
      <div className="absolute inset-0">
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

      {/* Main Business Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div 
          className="relative max-w-3xl w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card Shadow */}
          <div 
            className={`absolute inset-0 bg-black/5 blur-2xl transition-all duration-700 ${
              isHovered ? 'translate-y-3 opacity-10' : 'translate-y-1 opacity-5'
            }`}
          ></div>
          
          {/* The Card */}
          <div className={`relative bg-[#fffef9] border border-gray-300/30 p-16 transition-all duration-700 ${
            isHovered ? 'transform -translate-y-0.5' : ''
          }`}>
            
            {/* Subtle embossed texture overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at top, rgba(0,0,0,0.02) 0%, transparent 70%),
                    radial-gradient(ellipse at bottom, rgba(0,0,0,0.02) 0%, transparent 70%)
                  `
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
                <span className="tracking-[0.2em]">farinas@ualberta.ca</span> · <span className="tracking-[0.15em] lowercase">github.com/MVFarinas</span>
              </div>
            </div>

            {/* Subtle Corner Accent - barely visible */}
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
          
          {/* Hover hint */}
          <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}>
            <p className="text-black/50 text-[10px] tracking-[0.3em] uppercase font-light">
              Look at that subtle off-white coloring
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Minimalist Style 
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-6">
          <Link 
            href="/projects"
            className="text-black/70 text-[10px] tracking-[0.25em] uppercase hover:text-black transition-colors duration-300 font-normal"
          >
            View Portfolio
          </Link>
          <span className="text-black/30">·</span>
          <Link 
            href="/about"
            className="text-black/70 text-[10px] tracking-[0.25em] uppercase hover:text-black transition-colors duration-300 font-normal"
          >
            About
          </Link>
        </div>
      </div>
      */}

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-3 right-6 animate-pulse">
        <ChevronDown className="w-3 h-3 text-black/20" />
      </div>
    </div>
  );
}