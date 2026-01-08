import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import * as React from "react";

const { useEffect, useMemo, useRef, useState } = React;
type Card = {
  id: "irene" | "seulgi" | "wendy" | "joy" | "yeri";
  name: string;
  colorVar: string;
  src: string;
};

function WandSvg() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wandGrad" x1="30" y1="40" x2="190" y2="200">
          <stop stopColor="rgba(255,255,255,0.95)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.35)" />
        </linearGradient>
      </defs>
      <path
        d="M55 165 L165 55"
        stroke="url(#wandGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleBurst({ isOn }: { isOn: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 18;
        const r = 60 + Math.random() * 80;
        return {
          id: `p-${i}`,
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
          size: 2 + Math.random() * 3,
          delay: Math.random() * 0.08,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {isOn ? (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                width: p.size,
                height: p.size,
                boxShadow: "0 0 18px rgba(255,255,255,0.85)",
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, 1, 0],
                scale: [0.6, 1.1, 0.7],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            className="absolute left-[-140px] top-[-140px] h-[280px] w-[280px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.22), transparent)",
              filter: "blur(6px)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function OpeningScene({
  isActive,
  onDone,
}: {
  isActive: boolean;
  onDone: () => void;
}) {
  const lenis = useLenis((l) => l);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [burstOn, setBurstOn] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [introFontFamily, setIntroFontFamily] = useState<string>(
    "var(--rv-font-logo)"
  );
  const [introSlideUp, setIntroSlideUp] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [fanDealt, setFanDealt] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const wasAtTop = useRef(true);

  const cards = useMemo<Card[]>(
    () => [
      {
        id: "irene",
        name: "Irene",
        colorVar: "--rv-irene",
        src: "/img/fan_animation/irene_cosmic.jpg",
      },
      {
        id: "seulgi",
        name: "Seulgi",
        colorVar: "--rv-seulgi",
        src: "/img/fan_animation/seulgi_cosmic.jpg",
      },
      {
        id: "wendy",
        name: "Wendy",
        colorVar: "--rv-wendy",
        src: "/img/fan_animation/wendy_cosmic.jpg",
      },
      {
        id: "joy",
        name: "Joy",
        colorVar: "--rv-joy",
        src: "/img/fan_animation/joy_cosmic.jpg",
      },
      {
        id: "yeri",
        name: "Yeri",
        colorVar: "--rv-yeri",
        src: "/img/fan_animation/yeri_cosmic.jpg",
      },
    ],
    []
  );

  // block scrolling while intro is active
  useEffect(() => {
    if (!lenis) return;
    if (isActive) lenis.stop();
    else lenis.start();
  }, [isActive, lenis]);

  // run opening sequence once
  useEffect(() => {
    if (!isActive) return;

    setOverlayVisible(true);
    setBurstOn(false);
    setShowTitle(false);
    setCardsVisible(false);
    setFanDealt(false);
    setIntroSlideUp(false);

    // Copycat timing:
    // - 2s font cycling
    // - +0.5s: slide up intro screen
    // - +0.5s: fan cards deal (stagger)
    // - +0.8s: enable scroll
    const tBurst = window.setTimeout(() => setBurstOn(true), 820);
    const tShowTitle = window.setTimeout(() => setShowTitle(true), 980);

    const fonts = [
      "var(--rv-font-secondary)",
      "var(--rv-font-primary)",
      "'Cinzel', serif",
      "'Dancing Script', cursive",
      "'Anton', sans-serif",
      "'Abril Fatface', cursive",
      "'Permanent Marker', cursive",
      "'Roboto Slab', serif",
      "'Pacifico', cursive",
      "'Oswald', sans-serif",
      "'Lobster', cursive",
      "'Shadows Into Light', cursive",
      "'Monoton', cursive",
      "'Righteous', cursive",
      "'Bangers', cursive",
      "'Creepster', cursive",
      "'Gloria Hallelujah', cursive",
      "'Courier New', monospace",
    ];

    const totalDuration = 2500;
    const intervalDuration = 100;
    const steps = Math.floor(totalDuration / intervalDuration);
    let fontIndex = 0;
    let currentStep = 0;

    // prevent body scroll during intro
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fontInterval = window.setInterval(() => {
      setIntroFontFamily(fonts[fontIndex % fonts.length]);
      fontIndex++;
      currentStep++;
      if (currentStep >= steps) {
        window.clearInterval(fontInterval);
        setIntroFontFamily("var(--rv-font-primary)");

        // slide up
        window.setTimeout(() => {
          setIntroSlideUp(true);
          setCardsVisible(true); // show fan overlay

          // deal fan cards
          window.setTimeout(() => setFanDealt(true), 300);

          // hide intro overlay fully after slide transition
          window.setTimeout(() => setOverlayVisible(false));

          // enable scroll
          window.setTimeout(() => {
            document.body.style.overflow = prevOverflow;
            onDone();
          }, 1300);
        }, 500);
      }
    }, intervalDuration);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(tBurst);
      window.clearTimeout(tShowTitle);
      window.clearInterval(fontInterval);
    };
  }, [isActive, onDone]);

  // fade overlay out after intro completes
  useEffect(() => {
    if (isActive) return;
    const t = window.setTimeout(() => setOverlayVisible(false), 650);
    return () => window.clearTimeout(t);
  }, [isActive]);

  // re-show cards when user scrolls back to top
  useLenis((l) => {
    if (!l) return;
    const atTopNow = (l.scroll ?? 0) < 12;
    if (!isActive && atTopNow && !wasAtTop.current) {
      setCardsVisible(true);
    }
    wasAtTop.current = atTopNow;
  });

  // idle hide cards after 2s (only when visible + not interacting)
  useEffect(() => {
    if (!cardsVisible) return;

    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    // Copycat: 3s initial auto-hide, then 2s after hover leave
    hideTimer.current = window.setTimeout(() => setCardsVisible(false), 3000);

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [cardsVisible]);

  const showOverlay = overlayVisible;

  return (
    <>
      <AnimatePresence>
        {showOverlay ? (
          <motion.div
            className="rv-opening-overlay"
            initial={{ opacity: 0 }}
            animate={
              introSlideUp
                ? {
                    opacity: 1,
                    y: "-100%",
                    rotate: -5,
                    scale: 1.1,
                    borderBottomLeftRadius: "50% 20%",
                    borderBottomRightRadius: "50% 20%",
                  }
                : { opacity: 1, y: 0, rotate: 0, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[720px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)] blur-3xl" />
              <div className="absolute -top-56 left-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(238,178,17,0.10),transparent)] blur-3xl" />
              <div className="absolute -top-56 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(108,48,130,0.10),transparent)] blur-3xl" />
            </div>

            <SparkleBurst isOn={burstOn} />

            {/* wand */}
            <motion.div
              className="pointer-events-none absolute right-[10%] top-[18%] drop-shadow-[0_0_22px_rgba(255,255,255,0.25)]"
              initial={{ rotate: -12, y: 0, x: 0, opacity: 0 }}
              animate={
                isActive
                  ? {
                      opacity: 1,
                      rotate: [-12, -6, -10, 6],
                      y: [0, -6, 0, 4],
                      x: [0, 0, 0, -24],
                    }
                  : { opacity: 0 }
              }
              transition={{
                duration: 1.25,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <WandSvg />
            </motion.div>

            {/* title */}
            <AnimatePresence>
              {showTitle ? (
                <motion.div
                  className="rv-opening-title"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="rv-opening-title-text"
                    style={{ fontFamily: introFontFamily }}
                  >
                    RED VELVET
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* cards overlay (also used when user scrolls back to top) */}
      <AnimatePresence>
        {cardsVisible ? (
          <motion.div
            className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative flex h-96 w-full max-w-4xl items-center justify-center perspective-[1000px]">
              {cards.map((c) => {
                const fan = {
                  irene: { rotate: -20, translate: -200, z: 1 },
                  wendy: { rotate: -10, translate: -100, z: 2 },
                  yeri: { rotate: 0, translate: 0, z: 3 },
                  joy: { rotate: 10, translate: 100, z: 4 },
                  seulgi: { rotate: 20, translate: 200, z: 5 },
                }[c.id];

                return (
                  <motion.div
                    key={c.id}
                    className="pointer-events-none absolute h-72 w-48 rounded-xl border border-white/20 bg-cover bg-center shadow-2xl"
                    style={
                      {
                        "--rv-accent": `var(${c.colorVar})`,
                        zIndex: fan.z,
                        transformOrigin: "bottom left",
                      } as React.CSSProperties
                    }
                    initial={{ opacity: 0, x: 0, rotate: 0, scale: 0.96 }}
                    animate={{
                      opacity: fanDealt ? 1 : 0,
                      x: fanDealt ? fan.translate : 0,
                      rotate: fanDealt ? fan.rotate : 0,
                      scale: fanDealt ? 1 : 0.96,
                      y: 0,
                      filter: "saturate(1.05)",
                      boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.5)",
                      borderColor: "rgba(255,255,255,0.2)",
                    }}
                    transition={{
                      duration: 1.2,
                      delay: fanDealt ? fan.z * 0.08 : 0,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                  >
                    <img
                      src={c.src}
                      alt={`${c.name} cosmic card`}
                      className="h-full w-full rounded-xl object-cover opacity-95"
                      draggable={false}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
