import "./App.css";
import { ReactLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import OpeningScene from "./components/OpeningScene";
import HeroSection from "./components/HeroSection";
import MemberSection from "./components/MemberSection";
import WalkThroughSection from "./components/WalkThroughSection";
import AchievementSection from "./components/AchievementSection";
import EndingSection from "./components/EndingSection";
import Logo from "./components/Logo";

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [logoShineNonce, setLogoShineNonce] = useState(0);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const prevHeroInView = useRef(true);

  // Easter egg: "rv" key sequence toggles background music
  const audioRef = useRef(null);
  const lastKeyRef = useRef("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (lastKeyRef.current === "r" && key === "v") {
        if (!audioRef.current) {
          audioRef.current = new Audio("/cosmic_sound2.mp3");
          audioRef.current.loop = true;
        }
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      lastKeyRef.current = key;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleIntroDone = useCallback(() => {
    setIsIntroActive(false);
    setLogoShineNonce((n) => n + 1);
  }, []);

  // Trigger logo "shine" when user returns to the hero section (after intro).
  useEffect(() => {
    const wasInView = prevHeroInView.current;
    if (!isIntroActive && isHeroInView && !wasInView) {
      setLogoShineNonce((n) => n + 1);
    }
    prevHeroInView.current = isHeroInView;
  }, [isHeroInView, isIntroActive]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
      }}
    >
      <div className="rv-app">
        <Logo
          hidden={isIntroActive || !isHeroInView}
          shineNonce={logoShineNonce}
        />
        <OpeningScene isActive={isIntroActive} onDone={handleIntroDone} />

        <main>
          <HeroSection onInViewChange={setIsHeroInView} />
          <section id="members" className="rv-section">
            <MemberSection />
          </section>
          <WalkThroughSection />
          <AchievementSection />
          <EndingSection />
        </main>
      </div>
    </ReactLenis>
  );
}

export default App;
