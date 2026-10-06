import React, { useEffect, useState } from 'react';
import soundManager from '../lib/soundManager';

/**
 * SfxToggle Component (Master Audio Controller)
 * Artisanal Japanese Deckled Washi Paper Slip positioned in the top-left corner.
 * Features:
 * - Master Audio Controller: Stops/Starts ALL sound across the website (Background Music + All SFX).
 * - Animated Equalizer Sound Bars (No rings): 4 rhythmic pulsating vertical bars.
 * - Layered Venetian gold leaf, fine ink and deckled washi paper styling.
 * - Real-time subscription to SoundManager state.
 */
export default function SfxToggle() {
  const [audioState, setAudioState] = useState({ isMuted: soundManager.isMuted });

  useEffect(() => {
    const unsubscribe = soundManager.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsubscribe();
  }, []);

  const isLive = !audioState.isMuted;

  return (
    <button
      type="button"
      data-sfx="click"
      onClick={() => soundManager.toggleMaster()}
      aria-label={isLive ? 'Mute all sounds and background music' : 'Enable all sounds and background music'}
      title={isLive ? 'Mute All Audio (Background Music & Sound Effects)' : 'Enable All Audio'}
      className="group fixed top-4 left-4 sm:top-6 sm:left-8 z-40 inline-flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rotate-1 hover:rotate-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 [-webkit-tap-highlight-color:transparent] cursor-pointer select-none
      [clip-path:polygon(0%_12%,2.5%_4%,10%_5.5%,22%_2%,36%_4.5%,50%_1.5%,65%_4%,78%_1.8%,89%_4.5%,97%_2%,100%_12%,98%_32%,100%_50%,98%_70%,99.5%_88%,96.5%_97%,85%_95.5%,72%_98.5%,55%_96%,42%_98.5%,28%_96%,14%_98%,3.5%_95%,0%_88%,2%_68%,0.5%_50%,2.2%_30%)]
      [background:repeating-linear-gradient(118deg,rgba(199,146,56,0.05)_0px_2px,transparent_2px_7px),radial-gradient(130%_150%_at_28%_18%,#FFFDF9_0%,#F8F3E7_58%,#EDE2CD_100%)]
      border border-[#C79238]/40
      [filter:drop-shadow(0_2px_4px_rgba(21,20,19,0.12))_drop-shadow(0_8px_18px_rgba(21,20,19,0.14))]
      hover:[filter:drop-shadow(0_3px_6px_rgba(21,20,19,0.16))_drop-shadow(0_12px_24px_rgba(199,146,56,0.28))]
      hover:border-[#C79238]/70"
    >
      {/* Animated Soundwave Equalizer Bars (No Rings) */}
      <span className="relative flex items-center justify-center w-[18px] h-4">
        {isLive ? (
          <span className="flex items-end gap-[2.5px] h-4 w-[18px] justify-center pb-0.5">
            <span className="w-[2px] bg-[#8C6422] rounded-full animate-soundbar-1" />
            <span className="w-[2.5px] bg-[#C79238] rounded-full animate-soundbar-2" />
            <span className="w-[2px] bg-[#8C6422] rounded-full animate-soundbar-3" />
            <span className="w-[2.5px] bg-[#C79238] rounded-full animate-soundbar-4" />
          </span>
        ) : (
          <span className="relative flex items-center justify-center w-[18px] h-4">
            {/* Resting Sound Bars */}
            <span className="flex items-center gap-[2.5px] w-[18px] justify-center">
              <span className="w-[2px] h-[3px] bg-[#968F84] rounded-full" />
              <span className="w-[2.5px] h-[3px] bg-[#968F84] rounded-full" />
              <span className="w-[2px] h-[3px] bg-[#968F84] rounded-full" />
              <span className="w-[2.5px] h-[3px] bg-[#968F84] rounded-full" />
            </span>
            {/* Calligraphic Mute Slash */}
            <span className="absolute w-[18px] h-[1.8px] bg-[#B85032] -rotate-45 rounded-full" />
          </span>
        )}
      </span>

      {/* Typographic Label */}
      <span
        className={`font-cinzel text-[10px] sm:text-[10.5px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ${
          isLive ? 'text-[#241D16]' : 'text-[#7A7369]'
        }`}
      >
        {isLive ? 'SOUND ON' : 'SOUND OFF'}
      </span>

      {/* Decorative Gold Pip ✦ */}
      <span
        className={`font-serif text-[10.5px] leading-none transition-all duration-300 ${
          isLive ? 'text-[#C79238] scale-100 group-hover:scale-125' : 'text-[#A0988C] scale-75'
        }`}
      >
        ✦
      </span>
    </button>
  );
}
