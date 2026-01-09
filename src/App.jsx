import "./App.css";
import { ReactLenis } from "lenis/react";
import { useCallback, useState } from "react";
import OpeningScene from "./components/OpeningScene";
import HeroSection from "./components/HeroSection";
import MemberSection from "./components/MemberSection";
import AchievementSection from "./components/AchievementSection";
import EndingSection from "./components/EndingSection";
import Logo from "./components/Logo";

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [logoShineNonce, setLogoShineNonce] = useState(0);

  const handleIntroDone = useCallback(() => {
    setIsIntroActive(false);
    setLogoShineNonce((n) => n + 1);
  }, []);

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
        <Logo hidden={isIntroActive} shineNonce={logoShineNonce} />
        <OpeningScene isActive={isIntroActive} onDone={handleIntroDone} />

        <main>
          <HeroSection />
          <section id="members" className="rv-section">
            <MemberSection />
          </section>
          <AchievementSection />
          <EndingSection />
        </main>
      </div>
    </ReactLenis>
  );
}

export default App;
