import React, { useState, useEffect } from "react";
import BooksShowcase from "./components/BooksShowcase";
import CustomCursor from "./components/CustomCursor";
import CinematicFullpage from "./components/CinematicFullpage";
import AtelierLoader from "./components/AtelierLoader";
import { MONOGRAPHS_DATA } from "./data/monographsData";
import soundManager from "./lib/soundManager";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cleanup = soundManager.initGlobalListeners();
    return () => cleanup?.();
  }, []);

  const handleLoaded = () => {
    setLoaded(true);
    soundManager.startBgMusic();
  };

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-[#FBF9F5] text-[#151413] selection:bg-[#C79238] selection:text-white">
      {/* Atmospheric Atelier Preloader */}
      <AtelierLoader onLoaded={handleLoaded} />
      <CustomCursor />
      {/* Fullpage Cinematic Zoom Experience */}
      <CinematicFullpage
        sections={[
          ({ prevSection }) => (
            <section
              id="publications"
              className="relative w-full h-full bg-[#FBF9F5]"
            >
              <BooksShowcase
                books={MONOGRAPHS_DATA}
                heroTitle=""
                navTitle=""
                onNavigateBack={prevSection}
              />
            </section>
          ),
        ]}
      />
    </div>
  );
}
