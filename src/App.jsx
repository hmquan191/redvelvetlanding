import "./App.css";
import { ReactLenis } from "lenis/react";
import { useCallback, useState } from "react";
import OpeningScene from "./components/OpeningScene";
import HeroSection from "./components/HeroSection";
import MemberSection from "./components/MemberSection";
import EndingSection from "./components/EndingSection";
import Logo from "./components/Logo";

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);

  const handleIntroDone = useCallback(() => setIsIntroActive(false), []);

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
        <Logo />
        <OpeningScene isActive={isIntroActive} onDone={handleIntroDone} />

        <main>
          <HeroSection />
          <section id="members" className="rv-section">
            <MemberSection />
          </section>
          <EndingSection />
        </main>
      </div>
    </ReactLenis>
  );
}

export default App;
