import React from 'react';
import FluidShaderCanvas from './FluidShaderCanvas';
import soundManager from '../lib/soundManager';

// Custom-crafted atelier social media handles (Venetian gold foil & fine ink medallions)
const SOCIAL_HANDLES = [
  {
    name: 'GitHub',
    label: 'GITHUB · CODE-XCEED',
    url: 'https://github.com/Code-Xceed',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] md:w-[22px] md:h-[22px] transition-transform duration-300 group-hover:scale-110" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    label: 'DISCORD · CODEXCEED',
    url: 'https://discord.com/users/codexceed',
    title: 'Discord: codexceed',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] md:w-[21px] md:h-[21px] transition-transform duration-300 group-hover:scale-110" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    label: 'LINKEDIN · ATELIER',
    url: 'https://www.linkedin.com/in/aditya-rathore-110125385',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] md:w-[21px] md:h-[21px] transition-transform duration-300 group-hover:scale-110" fill="currentColor">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5H0v14h5V8zm7.982 0H8.014v14h4.969v-7.399c0-4.07 5.253-4.405 5.253 0V22H23.2v-8.878c0-6.91-7.447-6.666-10.218-3.256V8z" />
        <circle cx="2.5" cy="3.5" r="1.3" fill="#C79238" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    label: 'INSTAGRAM · JOURNAL',
    url: 'https://www.instagram.com/aditya.13201/',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] md:w-[22px] md:h-[22px] transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Email',
    label: 'MAIL · DISPATCH',
    url: 'mailto:aditya.rathore10101@gmail.com',
    svg: (
      <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] md:w-[22px] md:h-[22px] transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
        <path d="M3.5 5.5l8.5 7 8.5-7" />
        <circle cx="12" cy="12.5" r="1.2" fill="#C79238" stroke="none" />
      </svg>
    ),
  },
];

export default function Hero({ onNavigateToPublications }) {
  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] flex flex-col justify-end items-start px-5 xs:px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pb-6 sm:pb-8 lg:pb-14 xl:pb-16 overflow-hidden select-none bg-[#FBF9F5]">
      {/* Interactive WebGL Fluid Shader Canvas (Alpine Mountain Sanctuary Background with Fluid Hover Reveal) */}
      <FluidShaderCanvas 
        imageSrc="/alpine-sanctuary-reference.jpg" 
        mobileImageSrc="/alpine-sanctuary-mobile.jpg" 
      />

      {/* ========================================================================= */}
      {/* MOBILE & TABLET PORTRAIT: HIGH-FASHION SCULPTURAL EDITORIAL (< 1024px)     */}
      {/* ========================================================================= */}
      <div className="flex lg:hidden flex-col justify-between w-full h-full relative z-10 pointer-events-none pt-12 xs:pt-14 sm:pt-16 pb-6 xs:pb-7 sm:pb-8">
        {/* 1. TOP MASTHEAD & EDITORIAL STATEMENT (Lowered & Refined) */}
        <header className="w-full flex flex-col items-start text-left">
          {/* Monumental Sculptural Masthead: ADITYA RATHORE */}
          <h1 className="leading-[0.84] tracking-[-0.035em] text-left w-full">
            <span 
              className="block font-bodoni font-light text-[#151413] text-[clamp(4.0rem,19.5vw,6.8rem)] tracking-[-0.035em]"
              style={{
                textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 14px rgba(251,249,245,0.95), 0 0 28px rgba(251,249,245,0.85)',
              }}
            >
              ADITYA
            </span>
            <span 
              className="block font-bodoni italic font-normal text-[#151413] text-[clamp(4.4rem,21.5vw,7.4rem)] ml-1 xs:ml-1.5 mt-0.5 sm:mt-1"
              style={{
                textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 14px rgba(251,249,245,0.95), 0 0 28px rgba(251,249,245,0.85)',
              }}
            >
              Rathore
            </span>
          </h1>

          {/* About Statement: Web dev -> Solutions for any problem -> Gaming & Minecraft mods */}
          <div className="mt-3.5 xs:mt-4 max-w-[90%] xs:max-w-[85%] sm:max-w-[78%]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-cinzel text-[10px] tracking-[0.22em] uppercase text-[#8C6422] font-semibold">
                ABOUT · ADITYA · INDIA 🇮🇳
              </span>
              <span className="w-1 h-1 rounded-full bg-[#C79238]" />
            </div>

            <p 
              className="font-serif italic font-normal text-[#151413] text-[clamp(1.05rem,4.0vw,1.35rem)] leading-[1.32] tracking-[-0.012em]"
              style={{
                textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 8px rgba(251,249,245,0.9)',
              }}
            >
              I mainly build <span className="font-bodoni not-italic font-normal">websites &amp; web apps</span>, craft solutions for problems of literally any format, and love gaming and making <span className="font-bodoni not-italic font-normal">Minecraft mods</span>.
            </p>

            {/* Fine Gold Tapered Hairline Accent Bar */}
            <div 
              className="w-14 h-[1.5px] my-2.5 rounded-full"
              style={{
                background: 'linear-gradient(to right, #C79238, #DFBA5A, rgba(199, 146, 56, 0.2))',
              }}
            />

            {/* Sub-line */}
            <p 
              className="font-sans font-normal text-[#48423B] text-[clamp(11.5px,2.8vw,13px)] leading-[1.45] tracking-[0.01em]"
              style={{
                textShadow: '0 1px 2px rgba(251,249,245,0.98)',
              }}
            >
              College student from India · Passionate about creating &amp; managing projects · Working on building my own startup.
            </p>
          </div>
        </header>

        {/* 2. MIDDLE: Open Canvas for Interactive Fluid Painting (Pure Touch Zone) */}
        <div className="flex-1 w-full min-h-[30px] pointer-events-none" />

        {/* 3. BOTTOM: Studio Inquiries Beacon, Big Connect Me ↗, & 5 Gold Medallions (Centered & Refined) */}
        <footer className="w-full flex flex-col items-center justify-center text-center pt-2 pb-1">
          {/* Active Inquiries Beacon */}
          <div className="flex items-center justify-center gap-2 mb-1.5 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C79238] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C6422]" />
            </span>
            <span 
              className="font-cinzel text-[10.5px] sm:text-[11.5px] tracking-[0.24em] uppercase text-[#8C6422] font-semibold"
              style={{ textShadow: '0 1px 2px rgba(251,249,245,0.98)' }}
            >
              INQUIRIES &amp; DIALOGUE
            </span>
          </div>

          {/* Big Cool Animated "Connect Me ↗" Anchor (Enlarged & Centered) */}
          <a 
            href="mailto:aditya.rathore10101@gmail.com"
            aria-label="Connect With Aditya Rathore"
            className="group/connect pointer-events-auto relative inline-flex items-center justify-center gap-2.5 py-0.5 cursor-pointer select-none"
          >
            <span 
              className="font-bodoni italic font-normal text-[#151413] text-[clamp(2.5rem,11vw,3.4rem)] leading-none tracking-[-0.02em] transition-colors duration-300 group-hover/connect:text-[#8C6422]"
              style={{
                textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 12px rgba(251,249,245,0.92), 0 0 24px rgba(251,249,245,0.85)',
              }}
            >
              Connect Me
            </span>
            <span 
              className="font-serif not-italic text-[clamp(1.9rem,8vw,2.5rem)] text-[#8C6422] transition-transform duration-300 ease-out group-hover/connect:translate-x-1 group-hover/connect:-translate-y-1 group-hover/connect:text-[#C79238] select-none"
            >
              ↗
            </span>

            {/* Kinetic Gold Foil Underline */}
            <span 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFBA5A] to-transparent scale-x-0 group-hover/connect:scale-x-100 transition-transform duration-500 ease-out" 
            />
          </a>

          {/* 5 Custom Atelier Social Media Medallions (Enlarged & Centered) */}
          <nav 
            aria-label="Social Profiles and Atelier Channels"
            className="flex items-center justify-center gap-3 xs:gap-3.5 sm:gap-4 mt-3.5 xs:mt-4 pointer-events-auto"
          >
            {SOCIAL_HANDLES.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="group relative w-[44px] h-[44px] xs:w-[48px] xs:h-[48px] sm:w-[52px] sm:h-[52px] rounded-full bg-[#FAF6EE]/96 backdrop-blur-sm border-[1.5px] border-[#DFBA5A] shadow-[0_2px_8px_rgba(21,20,19,0.06)] flex items-center justify-center text-[#151413] hover:text-[#8C6422] transition-all duration-300 hover:scale-110 active:scale-95 hover:border-[#8C6422] hover:shadow-[0_4px_14px_rgba(199,146,56,0.35)]"
              >
                {item.svg}
              </a>
            ))}
          </nav>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= 1024px): 100% PRESERVED 3-CORNER ARCHITECTURAL BALANCE */}
      {/* ========================================================================= */}

      {/* Top-Right Curatorial About Me Statement (Desktop Only) */}
      <aside 
        aria-label="About Aditya Rathore"
        className="hidden lg:flex absolute top-12 lg:top-14 xl:top-16 right-12 lg:right-16 xl:right-20 z-10 pointer-events-none flex-col items-end text-right w-auto max-w-[560px] xl:max-w-[620px]"
      >
        {/* Archival Eyebrow Kicker with Gold Folio Accent */}
        <div className="flex items-center justify-end gap-2.5 mb-2 sm:mb-2.5">
          <span className="font-cinzel text-[11.5px] md:text-[12px] tracking-[0.28em] uppercase text-[#8C6422] font-semibold select-none">
            ABOUT · ADITYA RATHORE · INDIA 🇮🇳
          </span>
          <span className="inline-block w-1.5 h-1.5 rotate-45 border border-[#8C6422]/60 bg-[#C79238]/40" />
        </div>

        {/* Primary Editorial About Statement with Typographic Contrast */}
        <p 
          className="font-serif italic font-normal text-[#151413] text-[clamp(1.4rem,1.82vw,2.05rem)] leading-[1.24] tracking-[-0.015em]"
          style={{
            textWrap: 'balance',
            textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 10px rgba(251,249,245,0.92), 0 0 24px rgba(251,249,245,0.85)',
          }}
        >
          I primarily build <span className="font-bodoni not-italic font-normal tracking-[-0.02em] text-[#151413]">websites &amp; web apps</span>, create product solutions for <span className="font-bodoni not-italic font-normal tracking-[-0.02em] text-[#151413]">problems of any format</span>, and love gaming &amp; developing <span className="font-bodoni not-italic font-normal tracking-[-0.02em] text-[#151413]">Minecraft mods</span>.
        </p>

        {/* Delicate Gold Tapered Hairline Accent */}
        <div 
          className="w-16 h-[1px] my-3 opacity-75"
          style={{
            background: 'linear-gradient(to left, #C79238, rgba(199, 146, 56, 0.15))',
          }} 
        />

        {/* Sub-line / Focus Discipline */}
        <p 
          className="font-sans font-normal text-[#48423B] text-[clamp(13px,0.95vw,14.5px)] leading-[1.58] tracking-[0.015em] max-w-[44ch]"
          style={{
            textWrap: 'balance',
            textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 8px rgba(251,249,245,0.9)',
          }}
        >
          College student from India · Super curious about creating &amp; managing projects · Aiming to build something big of my own like a startup or company.
        </p>
      </aside>

      {/* Bottom-Right Curatorial Connect Block with 5 Custom Gold Medallions (Desktop Only) */}
      <div 
        className="hidden lg:flex absolute right-12 lg:right-16 xl:right-20 bottom-12 lg:bottom-14 xl:bottom-16 z-20 pointer-events-none flex-col items-end text-right"
      >
        {/* Active Inquiries Beacon */}
        <div className="flex items-center gap-2 mb-1 justify-end">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C79238] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C6422]" />
          </span>
          <span 
            className="font-cinzel text-[11px] tracking-[0.24em] uppercase text-[#8C6422] font-semibold select-none"
            style={{
              textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 8px rgba(251,249,245,0.9)',
            }}
          >
            INQUIRIES &amp; DIALOGUE
          </span>
        </div>

        {/* Big Cool Animated "Connect Me" Anchor */}
        <a 
          href="mailto:aditya.rathore10101@gmail.com"
          aria-label="Connect With Aditya Rathore"
          className="group/connect pointer-events-auto relative inline-flex items-center gap-2.5 cursor-pointer py-0.5 select-none"
        >
          <span 
            className="font-bodoni italic font-normal text-[#151413] text-[clamp(1.65rem,3.4vw,2.9rem)] leading-none tracking-[-0.02em] transition-colors duration-300 group-hover/connect:text-[#8C6422]"
            style={{
              textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 10px rgba(251,249,245,0.92), 0 0 24px rgba(251,249,245,0.85)',
            }}
          >
            Connect Me
          </span>
          <span 
            className="font-serif not-italic text-[clamp(1.35rem,2.8vw,2.4rem)] text-[#8C6422] transition-transform duration-300 ease-out group-hover/connect:translate-x-1 group-hover/connect:-translate-y-1 group-hover/connect:text-[#C79238] select-none"
          >
            ↗
          </span>

          {/* Kinetic Gold Foil Underline */}
          <span 
            className="absolute -bottom-1 right-0 w-full h-[1.5px] bg-gradient-to-l from-[#C79238] via-[#DFBA5A] to-transparent scale-x-0 group-hover/connect:scale-x-100 origin-right transition-transform duration-500 ease-out" 
          />
        </a>

        {/* 5 Custom Atelier Social Media Medallions */}
        <nav 
          aria-label="Social Profiles and Atelier Channels"
          className="flex items-center gap-3.5 mt-3.5 pointer-events-auto"
        >
          {SOCIAL_HANDLES.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="group relative flex items-center justify-center w-[46px] h-[46px] lg:w-[50px] lg:h-[50px] rounded-full bg-[#FAF6EE]/96 hover:bg-[#FAF2E2] border-[1.5px] border-[#DFBA5A] hover:border-[#8C6422] shadow-[0_2px_8px_rgba(21,20,19,0.06)] hover:shadow-[0_4px_16px_rgba(199,146,56,0.35)] text-[#151413] hover:text-[#8C6422] transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              {/* Archival Tooltip */}
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap font-cinzel text-[9.5px] tracking-[0.2em] uppercase text-[#8C6422] font-semibold bg-[#FBF9F5]/98 px-2 py-0.5 rounded border border-[#C79238]/35 shadow-sm">
                {item.label}
              </span>
              {item.svg}
            </a>
          ))}
        </nav>
      </div>

      {/* Monumental Sculptural Typography (Desktop Only - Positioned in bottom-left corner) */}
      <div className="hidden lg:flex relative z-10 pointer-events-none w-full max-w-7xl flex-col justify-end items-start">
        <h1 className="leading-[0.88] tracking-[-0.04em] w-full text-left">
          {/* Top Line: ADITYA */}
          <span 
            className="block font-bodoni font-light text-[#151413] text-[clamp(3.8rem,12vw,10.5rem)] tracking-[-0.03em]"
            style={{
              textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 10px rgba(251,249,245,0.92), 0 0 28px rgba(251,249,245,0.85)',
            }}
          >
            ADITYA
          </span>
          {/* Bottom Line: Rathore */}
          <span 
            className="block font-bodoni italic font-normal text-[#151413] text-[clamp(4.4rem,14vw,12.5rem)] ml-14 lg:ml-16 xl:ml-20 mt-3 md:mt-4 lg:mt-3"
            style={{
              textShadow: '0 1px 2px rgba(251,249,245,0.98), 0 2px 10px rgba(251,249,245,0.92), 0 0 28px rgba(251,249,245,0.85)',
            }}
          >
            Rathore
          </span>
        </h1>
      </div>

      {/* Subtle Scroll Hint towards Perspective II: Projects Archive */}
      {onNavigateToPublications && (
        <button
          type="button"
          onClick={() => {
            soundManager.play('hold');
            onNavigateToPublications();
          }}
          className="group cursor-pointer absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-1.5 opacity-65 hover:opacity-100 transition-all duration-300 pointer-events-auto select-none"
        >
          <span className="font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.26em] uppercase text-[#151413]/70 group-hover:text-[#C79238] transition-colors">
            Gallery · Explore
          </span>
          <svg
            className="w-3.5 h-3.5 text-[#151413]/50 group-hover:text-[#C79238] animate-bounce transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Discreet Keyboard Shortcuts Affordance (Desktop Only) */}
      <div 
        aria-hidden="true" 
        className="hidden 2xl:flex absolute bottom-8 left-12 lg:left-16 xl:left-20 z-20 pointer-events-none items-center gap-3 opacity-40 hover:opacity-85 transition-opacity duration-300 font-cinzel text-[9.5px] tracking-[0.2em] uppercase text-[#151413]/70 select-none"
      >
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#C79238]/40 text-[9px] font-mono text-[#8C6422] shadow-xs">M</kbd>
          Audio
        </span>
        <span className="text-[#C79238]/40">·</span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#C79238]/40 text-[9px] font-mono text-[#8C6422] shadow-xs">↓</kbd>
          Archive
        </span>
      </div>
    </section>
  );
}
