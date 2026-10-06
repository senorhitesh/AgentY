import React, { useEffect, useState, useMemo } from 'react';

import soundManager from '../lib/soundManager';

// All heavy visual and texture assets required for the 3D WebGL and editorial experience
const CRITICAL_IMAGE_ASSETS = [
  '/alpine-sanctuary-reference.jpg',
  '/alpine-sanctuary-mobile.jpg',
  '/Crumpled Paper Animated Cursor--cursor--SweezyCursors.png',
  '/Crumpled Paper Animated Cursor--pointer--SweezyCursors.png',
  '/hero-painting.jpg',
  '/hero-canvas-impasto.jpg',
  '/dark-hero-painting.jpg',
];

// Curated philosophical & calming atelier quotes with bespoke highlight segments
const ATELIER_QUOTES = [
  {
    quote: 'In the space between ink and water, eternity breathes.',
    highlight: 'eternity breathes',
    author: 'Kyoto Zen Painting Treatise',
    period: 'Circa 1480',
  },
  {
    quote: 'Art is not what you see, but what you make others see.',
    highlight: 'what you make others see',
    author: 'Edgar Degas',
    period: 'Paris Atelier, 1884',
  },
  {
    quote: 'Nature does not hurry, yet everything is accomplished.',
    highlight: 'everything is accomplished',
    author: 'Lao Tzu',
    period: 'Tao Te Ching',
  },
  {
    quote: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    highlight: 'adding the meaningful',
    author: 'John Maeda',
    period: 'The Laws of Simplicity',
  },
  {
    quote: 'Digital matter, when touched with reverie, becomes as warm as handmade paper.',
    highlight: 'warm as handmade paper',
    author: 'Aditya Rathore',
    period: 'Digital Monograph Studio',
  },
  {
    quote: 'To create something new, one must first learn the patience of stone.',
    highlight: 'the patience of stone',
    author: 'Isamu Noguchi',
    period: 'Sculptural Journal, 1968',
  },
  {
    quote: 'The details are not the details. They make the design.',
    highlight: 'They make the design',
    author: 'Charles Eames',
    period: 'Atelier Philosophy',
  },
  {
    quote: 'Stillness is not the absence of motion, but the presence of depth.',
    highlight: 'presence of depth',
    author: 'Studio Monograph',
    period: 'Paris — Tokyo',
  },
];

export default function AtelierLoader({ onLoaded }) {
  // Pick random quote once per session
  const quoteData = useMemo(() => {
    const idx = Math.floor(Math.random() * ATELIER_QUOTES.length);
    return ATELIER_QUOTES[idx];
  }, []);

  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function preprocessAndLoadEverything() {
      const startTime = performance.now();
      const minDuration = 1100; // refined duration: serene, readable, yet fast and snappy

      // 1. Preload & GPU-decode every critical high-res texture and artwork
      const imagePromises = CRITICAL_IMAGE_ASSETS.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;

          // img.decode() decodes the image in the background GPU memory
          if (typeof img.decode === 'function') {
            img.decode()
              .then(resolve)
              .catch(() => {
                if (img.complete) resolve();
                else {
                  img.onload = resolve;
                  img.onerror = resolve;
                }
              });
          } else {
            if (img.complete) resolve();
            else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          }
        });
      });

      // 2. Wait for all Google Web Fonts to fully load and compile
      const fontPromise = (async () => {
        if (document.fonts && document.fonts.ready) {
          try {
            await document.fonts.ready;
          } catch (e) {
            // non-blocking fallback
          }
        }
      })();

      // 3. Wait for Window / Document load event
      const windowLoadPromise = new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      });

      // 4. Preload and decode all audio sound effects in memory
      const sfxPromise = soundManager.preloadAll();

      // 5. Combined asset gate with safety timeout
      const allAssetsGate = Promise.all([
        Promise.allSettled(imagePromises),
        fontPromise,
        windowLoadPromise,
        sfxPromise,
      ]);

      const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 6000));

      // Wait until ALL real assets are preprocessed & loaded (or safety timeout reached)
      await Promise.race([allAssetsGate, safetyTimeout]);

      // 5. Ensure minimum duration has also passed
      const elapsed = performance.now() - startTime;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      // 6. Guarantee that the browser paints the underlying WebGL & canvas pipeline
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      if (isCancelled) return;

      // 7. Assets and underlying scene are 100% ready — unlock audio and trigger immediate crossfade
      soundManager.unlock();
      setIsFading(true);
      onLoaded?.();

      setTimeout(() => {
        if (!isCancelled) {
          setIsRemoved(true);
        }
      }, 950);
    }

    preprocessAndLoadEverything();

    return () => {
      isCancelled = true;
    };
  }, [onLoaded]);

  if (isRemoved) return null;

  // Split quote around the highlighted phrase
  const { quote, highlight, author, period } = quoteData;
  const parts = highlight ? quote.split(highlight) : [quote];

  return (
    <div
      role="status"
      aria-live="polite"
      onPointerDown={() => soundManager.unlock()}
      onClick={() => soundManager.unlock()}
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-12 select-none overflow-hidden bg-[#FBF9F5] transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFading
          ? 'opacity-0 scale-[1.03] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* Microscopic Linen Canvas Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] linen-texture"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Gentle Breathing Warm Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse 70vw 60vh at 50% 50%, rgba(223, 186, 90, 0.15) 0%, rgba(247, 241, 230, 0.45) 45%, transparent 75%)',
        }}
      />

      {/* ===================================================================== */}
      {/* PURE CENTER CLUSTER: ANIMATED LOADING EXPERIENCE & QUOTE (NOTHING ELSE)*/}
      {/* ===================================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[640px] w-full px-2 sm:px-4">
        {/* Animated "Loading Experience" with Liquid Gold Shimmer */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <span className="font-serif text-[#C79238] text-[11px] sm:text-xs animate-[spin_10s_linear_infinite] select-none opacity-75">
            ✦
          </span>
          <h1 className="animate-shimmer-text font-cinzel text-[clamp(14px,2.2vw,19px)] tracking-[0.38em] uppercase font-medium select-none">
            Loading Experience
          </h1>
          <span className="font-serif text-[#C79238] text-[11px] sm:text-xs animate-[spin_10s_linear_infinite_reverse] select-none opacity-75">
            ✦
          </span>
        </div>

        {/* Delicate Golden Tapered Hairline Divider */}
        <div
          className="w-16 sm:w-20 h-[1.5px] my-6 sm:my-8 rounded-full opacity-65"
          style={{
            background: 'linear-gradient(to right, transparent, #DFBA5A, transparent)',
          }}
        />

        {/* Bottom of it: The Curated Quote with Gold Leaf Highlight */}
        <blockquote className="w-full">
          <p className="font-bodoni font-light text-[#151413] text-[clamp(1.18rem,3.3vw,1.95rem)] leading-[1.42] tracking-[-0.015em] max-w-[560px] mx-auto">
            {parts[0]}
            {highlight && (
              <span className="relative inline-block mx-1.5 px-2.5 py-0.5 font-normal italic text-[#1A1713] rounded-md [background:linear-gradient(120deg,rgba(223,186,90,0.22)_0%,rgba(245,230,190,0.42)_50%,rgba(223,186,90,0.22)_100%)] border-b-[1.5px] border-[#C79238]/70 shadow-[0_1px_4px_rgba(199,146,56,0.12)]">
                {highlight}
              </span>
            )}
            {parts[1] || ''}
          </p>

          {/* Author & Period Attribution */}
          <footer className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-[#7A6E5F]">
            <span className="font-cinzel text-[11px] sm:text-[12px] tracking-[0.22em] uppercase font-semibold text-[#8C6422]">
              {author}
            </span>
            <span className="text-[#8C6422]/50 text-[10px]">◇</span>
            <span className="font-serif italic text-[12px] sm:text-[13px] text-[#8C7E6C]">
              {period}
            </span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
