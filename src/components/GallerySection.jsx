import React, { useState } from 'react';
import { TOP_GALLERY_PLATES, BOTTOM_GALLERY_PLATES } from '../data/galleryData';
import soundManager from '../lib/soundManager';

// Fine-art Renaissance corner filigree bracket
const CornerFiligree = ({ className = '' }) => (
  <svg 
    viewBox="0 0 60 60" 
    className={`w-12 h-12 sm:w-16 sm:h-16 text-[#C79238] pointer-events-none select-none opacity-25 ${className}`}
    fill="none" 
    stroke="currentColor"
  >
    <path d="M4 56V12C4 7.58172 7.58172 4 12 4H56" strokeWidth="1" strokeLinecap="round" />
    <path d="M12 56V18C12 14.6863 14.6863 12 18 12H56" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
    <circle cx="8" cy="8" r="2.4" fill="#C79238" fillOpacity="0.45" stroke="none" />
    <path d="M4 22C11 22 22 11 22 4" strokeWidth="0.75" opacity="0.45" />
  </svg>
);

export default function GallerySection() {
  const [selectedPlate, setSelectedPlate] = useState(null);

  const handleCardClick = (plate) => {
    soundManager.play('click');
    setSelectedPlate(plate);
  };

  const handleCloseModal = () => {
    soundManager.play('click');
    setSelectedPlate(null);
  };

  // Render an individual prominent gallery card
  const renderCard = (card, keyPrefix) => (
    <div
      key={`${keyPrefix}-${card.id}`}
      onClick={() => handleCardClick(card)}
      className={`inline-flex items-center gap-4 sm:gap-6 md:gap-7 shrink-0 cursor-pointer group/card select-none transition-transform duration-300 ${card.verticalOffset}`}
    >
      {/* Artwork Image Plate with substantial, prominent dimensions */}
      <div 
        className={`relative overflow-hidden rounded-xs border bg-[#FAF6EE] ${card.frameBorder} transition-all duration-300 group-hover/card:border-[#C79238] group-hover/card:shadow-[0_12px_36px_rgba(199,146,56,0.30)]`}
      >
        <img
          src={card.image}
          alt={card.title}
          className={`${card.imgSize} object-cover transition-transform duration-700 ease-out group-hover/card:scale-104`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Beside Image: 3 Lines of Clear Editorial Typography */}
      <div className="flex flex-col items-start text-left min-w-[150px] max-w-[210px] sm:max-w-[260px]">
        {/* 1. Italic Serif Kicker */}
        <span className="font-serif italic text-[12.5px] sm:text-[14px] md:text-[15px] text-[#8C6422] tracking-wide leading-tight">
          {card.kicker}
        </span>
        {/* 2. Bold/Display Serif Title */}
        <h4 className="font-bodoni font-normal text-[17px] sm:text-[21px] md:text-[24px] text-[#151413] tracking-[-0.015em] leading-snug mt-1 group-hover/card:text-[#8C6422] transition-colors">
          {card.title}
        </h4>
        {/* 3. Caption */}
        <p className="font-sans text-[11.5px] sm:text-[12.5px] md:text-[13.5px] text-[#736859] leading-normal mt-1">
          {card.caption}
        </p>
      </div>
    </div>
  );

  return (
    <section 
      id="gallery"
      aria-label="Atelier Gallery Section"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-[#FBF9F5] select-none flex flex-col justify-between py-2 sm:py-4"
    >
      {/* 1. Background Microscopic Canvas Weave Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] linen-texture"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* ========================================================================= */}
      {/* 2. LIGHTWEIGHT AMBIENT BACKGROUND: Static Zero-Lag Radial Color Auras      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Warm Tuscan Ochre Light Aura (Zero-cost radial gradient) */}
        <div 
          className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(223, 186, 90, 0.08) 0%, transparent 70%)',
          }}
        />
        {/* Soft Veronese Mineral Earth Aura */}
        <div 
          className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[540px] h-[340px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(74, 96, 77, 0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. OIL-PAINTED ART CORNERS: Textured Impasto Vignettes & Renaissance Gold  */}
      {/* ========================================================================= */}
      {/* Top-Left Oil Impasto Corner */}
      <div 
        className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-5 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 75%)',
        }}
      >
        <img
          src="/hero-canvas-impasto.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20 filter contrast-110"
        />
      </div>
      <CornerFiligree className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10" />

      {/* Top-Right Tuscan Mist Oil Wash Corner */}
      <div 
        className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-5 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 20%, transparent 75%)',
        }}
      >
        <img
          src="/hero-tuscan-mist.jpg"
          alt=""
          className="w-full h-full object-cover opacity-18 filter contrast-110"
        />
      </div>
      <CornerFiligree className="absolute top-3 right-3 sm:top-5 sm:right-5 rotate-90 z-10" />

      {/* Bottom-Left Tuscan Mist Oil Wash Corner */}
      <div 
        className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-5 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle at 0% 100%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 20%, transparent 75%)',
        }}
      >
        <img
          src="/hero-tuscan-mist.jpg"
          alt=""
          className="w-full h-full object-cover opacity-18 filter contrast-110"
        />
      </div>
      <CornerFiligree className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 -rotate-90 z-10" />

      {/* Bottom-Right Oil-Painted Bushes & Flowers Botanical Vignette (Positioned low, smoothly feathered) */}
      <div 
        className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-20 right-0 w-[360px] xs:w-[440px] sm:w-[560px] md:w-[700px] lg:w-[820px] max-w-[85vw] pointer-events-none z-5 flex items-end justify-end select-none"
        style={{
          maskImage: 'linear-gradient(to top, black 40%, rgba(0,0,0,0.7) 70%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to top, black 40%, rgba(0,0,0,0.7) 70%, transparent 98%)',
        }}
      >
        <img
          src="/gallery-corner-flowers.png"
          alt="Oil painted garden bushes and blooming wildflowers"
          className="w-full h-auto object-contain object-bottom-right mix-blend-multiply opacity-85 filter contrast-105"
          loading="eager"
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. UPPER STREAM: Mathematically Seamless Infinite Marquee Loop (Right->Left) */}
      {/* ========================================================================= */}
      <div 
        aria-label="Upper Gallery Stream"
        className="relative z-20 w-full h-[32vh] sm:h-[34vh] flex items-center overflow-hidden pointer-events-auto"
      >
        <div className="gallery-stream flex w-max animate-gallery-flow will-change-transform">
          {/* Set 1 */}
          <div className="flex items-center gap-10 sm:gap-14 md:gap-18 shrink-0 pr-10 sm:pr-14 md:pr-18">
            {TOP_GALLERY_PLATES.map((card) => renderCard(card, 'u1'))}
          </div>
          {/* Set 2 (Exact clone matching gap width for 100% glitchless loop) */}
          <div className="flex items-center gap-10 sm:gap-14 md:gap-18 shrink-0 pr-10 sm:pr-14 md:pr-18" aria-hidden="true">
            {TOP_GALLERY_PLATES.map((card) => renderCard(card, 'u2'))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CENTER: Monumental Animated Title (Zero Overlap with Cards)            */}
      {/* ========================================================================= */}
      <div 
        aria-hidden="true"
        className="relative z-10 w-full text-center pointer-events-none select-none my-auto py-0 flex items-center justify-center"
      >
        {/* Soft Golden Backlight Halo behind Title */}
        <div 
          className="absolute w-[60vw] max-w-[650px] h-[140px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(223, 186, 90, 0.12) 0%, transparent 70%)',
          }}
        />

        {/* Monumental Title with Gilded Sheen Animation */}
        <h2 
          className="font-bodoni font-normal text-[clamp(4.5rem,14vw,11.5rem)] leading-none tracking-[-0.035em] whitespace-nowrap animate-gallery-title-sheen select-none inline-block drop-shadow-xs"
        >
          Gallery
        </h2>
      </div>

      {/* ========================================================================= */}
      {/* 6. LOWER STREAM: Mathematically Seamless Infinite Marquee Loop (Right->Left) */}
      {/* ========================================================================= */}
      <div 
        aria-label="Lower Gallery Stream"
        className="relative z-20 w-full h-[32vh] sm:h-[34vh] flex items-center overflow-hidden pointer-events-auto"
      >
        <div className="gallery-stream flex w-max animate-gallery-flow-slower will-change-transform">
          {/* Set 1 */}
          <div className="flex items-center gap-10 sm:gap-14 md:gap-18 shrink-0 pr-10 sm:pr-14 md:pr-18">
            {BOTTOM_GALLERY_PLATES.map((card) => renderCard(card, 'l1'))}
          </div>
          {/* Set 2 (Exact clone matching gap width for 100% glitchless loop) */}
          <div className="flex items-center gap-10 sm:gap-14 md:gap-18 shrink-0 pr-10 sm:pr-14 md:pr-18" aria-hidden="true">
            {BOTTOM_GALLERY_PLATES.map((card) => renderCard(card, 'l2'))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. ARCHIVAL PLATE INSPECTION MODAL (When clicking any card)               */}
      {/* ========================================================================= */}
      {selectedPlate && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#151413]/70 backdrop-blur-md animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-3xl bg-[#FBF9F5] rounded-xl border border-[#DFBA5A] shadow-2xl p-6 sm:p-8 overflow-hidden select-text text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Folio Meta & Close Button */}
            <div className="flex items-center justify-between border-b border-[#C79238]/25 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C79238]" />
                <span className="font-cinzel text-[10.5px] tracking-[0.24em] uppercase text-[#8C6422] font-semibold">
                  {selectedPlate.kicker} · ARCHIVAL PLATE
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border border-[#DFBA5A] flex items-center justify-center text-sm text-[#151413] hover:bg-[#8C6422] hover:text-[#FBF9F5] transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: High-Res Image & Artwork Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Artwork Plate with Venetian Gold Foil Inset */}
              <div className="relative overflow-hidden rounded-md border border-[#DFBA5A] bg-[#FAF6EE] shadow-lg">
                <img
                  src={selectedPlate.image}
                  alt={selectedPlate.title}
                  className="w-full h-auto max-h-[380px] object-cover"
                />
              </div>

              {/* Curatorial Details */}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="font-serif italic text-sm text-[#8C6422]">
                    {selectedPlate.kicker}
                  </span>
                  <h3 className="font-bodoni text-2xl sm:text-3xl font-normal text-[#151413] leading-tight mt-1">
                    {selectedPlate.title}
                  </h3>
                  <p className="font-serif italic text-base text-[#736859] mt-0.5">
                    {selectedPlate.caption}
                  </p>

                  <div className="w-12 h-[1px] bg-[#C79238]/40 my-3.5" />

                  <p className="font-serif italic text-sm sm:text-[14.5px] text-[#2A231A] leading-relaxed">
                    {selectedPlate.note}
                  </p>

                  {/* Technical Specifications */}
                  <div className="mt-4 pt-3 border-t border-[#C79238]/15 space-y-1.5 text-xs font-sans text-[#736859]">
                    <div className="flex justify-between">
                      <span className="font-cinzel text-[9.5px] uppercase tracking-wider text-[#8C6422]">Medium</span>
                      <span className="text-[#151413]">{selectedPlate.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-cinzel text-[9.5px] uppercase tracking-wider text-[#8C6422]">Dimensions</span>
                      <span className="text-[#151413]">{selectedPlate.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-cinzel text-[9.5px] uppercase tracking-wider text-[#8C6422]">Catalog Year</span>
                      <span className="text-[#151413]">{selectedPlate.year}</span>
                    </div>
                  </div>
                </div>

                {/* Palette Swatches */}
                {selectedPlate.palette && (
                  <div className="mt-5 pt-3 border-t border-[#C79238]/20 flex items-center justify-between">
                    <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#8C6422]">
                      Pigment Palette
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedPlate.palette.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          title={color}
                          className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
