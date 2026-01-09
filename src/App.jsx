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
  const [isNowPlayingVisible, setIsNowPlayingVisible] = useState(false);
  const [nowPlayingNonce, setNowPlayingNonce] = useState(0);
  const nowPlayingTimerRef = useRef(null);

  const showNowPlaying = useCallback(() => {
    setIsNowPlayingVisible(true);
    setNowPlayingNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!isNowPlayingVisible) return;
    if (nowPlayingTimerRef.current) {
      window.clearTimeout(nowPlayingTimerRef.current);
    }
    nowPlayingTimerRef.current = window.setTimeout(() => {
      setIsNowPlayingVisible(false);
    }, 3000);
    return () => {
      if (nowPlayingTimerRef.current) {
        window.clearTimeout(nowPlayingTimerRef.current);
      }
    };
  }, [nowPlayingNonce, isNowPlayingVisible]);

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
          showNowPlaying();
        } else {
          audioRef.current.pause();
        }
      }
      lastKeyRef.current = key;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNowPlaying]);

  const handleIntroDone = useCallback(() => {
    setIsIntroActive(false);
    setLogoShineNonce((n) => n + 1);
  }, []);

  // Trigger logo "shine" when user returns to the hero section (after intro).
  const handleHeroInViewChange = useCallback(
    (inView) => {
      setIsHeroInView(inView);
      const wasInView = prevHeroInView.current;
      if (!isIntroActive && inView && !wasInView) {
        setLogoShineNonce((n) => n + 1);
      }
      prevHeroInView.current = inView;
    },
    [isIntroActive]
  );

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

        <div
          className={`rv-now-playing ${
            isNowPlayingVisible ? "is-visible" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          Now playing: Cosmic (Instrumental)
        </div>

        <main>
          <HeroSection onInViewChange={handleHeroInViewChange} />
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
