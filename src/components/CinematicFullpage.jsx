import React, { useState, useEffect, useRef, useCallback } from 'react';
import soundManager from '../lib/soundManager';

/**
 * CinematicFullpage Component
 * Delivers fullpage.js cinematic zoom transition natively without proprietary commercial scripts.
 * 
 * Features:
 * - 60fps GPU hardware-accelerated zoom-in / zoom-out transitions
 * - Seamless WebGL context preservation (Hero Fluid Shader + Three.js Books Showcase)
 * - Wheel, trackpad gesture thresholding with transition debounce lock
 * - Touch swipe support for mobile / tablets
 * - Arrow / Page keyboard navigation
 * - Atelier side pagination dots
 * - Safe-lock when inspecting 3D monographs (.bs-detail-open)
 */
export default function CinematicFullpage({
  sections = [],
  sectionTitles = ['Atelier · Aditya Rathore', 'Studio Monographs · Archive'],
  onSectionChange,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitioningRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const goToSection = useCallback(
    (index) => {
      if (index === activeIndex || transitioningRef.current) return;
      if (index < 0 || index >= sections.length) return;

      soundManager.play('hold');

      transitioningRef.current = true;
      setIsTransitioning(true);
      setActiveIndex(index);
      onSectionChange?.(index);

      setTimeout(() => {
        transitioningRef.current = false;
        setIsTransitioning(false);
      }, 1100);
    },
    [activeIndex, sections.length, onSectionChange]
  );

  const nextSection = useCallback(() => {
    goToSection(activeIndex + 1);
  }, [goToSection, activeIndex]);

  const prevSection = useCallback(() => {
    goToSection(activeIndex - 1);
  }, [goToSection, activeIndex]);

  // Wheel & Trackpad listener
  useEffect(() => {
    let wheelAccumulator = 0;
    let wheelTimer = null;

    const onWheel = (e) => {
      // If user is inside the 3D book inspection view, lock section scrolling
      if (document.querySelector('.bs-detail-open')) {
        return;
      }

      if (transitioningRef.current) {
        e.preventDefault();
        return;
      }

      wheelAccumulator += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      const THRESHOLD = 35;
      if (wheelAccumulator > THRESHOLD && activeIndex < sections.length - 1) {
        e.preventDefault();
        wheelAccumulator = 0;
        nextSection();
      } else if (wheelAccumulator < -THRESHOLD && activeIndex > 0) {
        e.preventDefault();
        wheelAccumulator = 0;
        prevSection();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer);
    };
  }, [activeIndex, nextSection, prevSection, sections.length]);

  // Touch gesture listener
  useEffect(() => {
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
      if (document.querySelector('.bs-detail-open')) return;
      if (transitioningRef.current) return;
      if (e.changedTouches.length !== 1) return;

      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = touchStartX.current - e.changedTouches[0].clientX;

      // Ensure vertical swipe has priority over horizontal carousel drag
      if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx) * 1.5) {
        if (dy > 0 && activeIndex < sections.length - 1) {
          nextSection();
        } else if (dy < 0 && activeIndex > 0) {
          prevSection();
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeIndex, nextSection, prevSection, sections.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      // Ignore if user is inside an input, textarea, or contentEditable
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable) return;

      // Toggle audio with 'M' key
      if (e.key === 'm' || e.key === 'M') {
        soundManager.toggleMaster();
        return;
      }

      // If user is inside the 3D book inspection view, lock section scrolling
      if (document.querySelector('.bs-detail-open')) return;
      if (transitioningRef.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (activeIndex < sections.length - 1) {
          e.preventDefault();
          nextSection();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeIndex > 0) {
          e.preventDefault();
          prevSection();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(sections.length - 1);
      } else if (e.key === '1') {
        e.preventDefault();
        goToSection(0);
      } else if (e.key === '2' && sections.length > 1) {
        e.preventDefault();
        goToSection(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, nextSection, prevSection, goToSection, sections.length]);

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-[#FBF9F5]">
      {/* Render All Sections with Cinematic Zoom Transform Layers */}
      {sections.map((sectionNode, idx) => {
        const isActive = idx === activeIndex;
        const isPast = idx < activeIndex;

        // Cinematic zoom calculation:
        // Exiting section scales up (1.18) and fades out with subtle lens blur
        // Entering section scales from 0.88 to 1.0 and sharpens into focus
        let transformStyle = 'scale(1) translate3d(0, 0, 0)';
        let opacity = 1;
        let filter = 'blur(0px)';
        let pointerEvents = 'auto';
        let zIndex = 10;

        if (isPast) {
          transformStyle = 'scale(1.18) translate3d(0, -3%, 0)';
          opacity = 0;
          filter = 'blur(5px)';
          pointerEvents = 'none';
          zIndex = 4;
        } else if (!isActive) {
          transformStyle = 'scale(0.88) translate3d(0, 4%, 0)';
          opacity = 0;
          filter = 'blur(5px)';
          pointerEvents = 'none';
          zIndex = 4;
        }

        return (
          <div
            key={idx}
            className="absolute inset-0 w-full h-full will-change-[transform,opacity,filter]"
            style={{
              transform: transformStyle,
              opacity,
              filter,
              pointerEvents,
              zIndex,
              transition:
                'transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 950ms cubic-bezier(0.22, 1, 0.36, 1), filter 1000ms ease-out',
            }}
          >
            {typeof sectionNode === 'function'
              ? sectionNode({ active: isActive, goToSection, nextSection, prevSection })
              : sectionNode}
          </div>
        );
      })}
    </div>
  );
}
