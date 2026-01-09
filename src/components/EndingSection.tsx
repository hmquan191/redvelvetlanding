import { motion, useInView } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

const ENDING_TIMING = {
  textInMs: 900,
  starDelayMs: 500,
  starTravelMs: 900,
  impactAt: 0.58, // fraction of travel where the star "hits" the text
  brightenMs: 520,
} as const;

function ShootingStar({
  runKey,
  delayMs,
  travelMs,
}: {
  runKey: number;
  delayMs: number;
  travelMs: number;
}) {
  return (
    <motion.div
      // key forces the animation to restart on each viewport entry
      key={runKey}
      aria-hidden="true"
      className="pointer-events-none absolute left-[-35%] top-[42%]"
      initial={{ x: "0%", opacity: 0 }}
      animate={{ x: "220%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: travelMs / 1000,
        delay: delayMs / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transform: "rotate(-10deg)",
        willChange: "transform, opacity",
      }}
    >
      {/* tail */}
      <div className="h-[3px] w-[280px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),rgba(255,255,255,0.15),transparent)] blur-[0.2px]" />
      {/* head glow */}
      <div className="absolute right-[64px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-white/90 blur-[0.6px] shadow-[0_0_22px_rgba(255,255,255,0.65)]" />
      {/* soft bloom */}
      <div className="absolute right-[50px] top-1/2 h-[90px] w-[90px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),transparent)] blur-xl" />
    </motion.div>
  );
}
export default function EndingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.55 });

  // Tracking: replay once per viewport entry, reset when leaving
  const hasPlayed = useRef(false);
  const [runKey, setRunKey] = useState(0);
  const [impactOn, setImpactOn] = useState(false);

  useEffect(() => {
    if (inView && !hasPlayed.current) {
      hasPlayed.current = true;
      setImpactOn(false);
      setRunKey((k) => k + 1);

      const impactAtMs =
        ENDING_TIMING.starDelayMs +
        ENDING_TIMING.starTravelMs * ENDING_TIMING.impactAt;
      const t = window.setTimeout(() => setImpactOn(true), impactAtMs);
      return () => window.clearTimeout(t);
    }

    if (!inView) {
      hasPlayed.current = false;
      setImpactOn(false);
    }
  }, [inView]);

  const memoryMotes = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `mote-${i}`,
        left: `${Math.round(Math.random() * 100)}%`,
        top: `${Math.round(Math.random() * 100)}%`,
        size: 70 + Math.round(Math.random() * 150),
        delay: Math.random() * 2.2,
        duration: 6 + Math.random() * 7,
        opacity: 0.04 + Math.random() * 0.06,
      })),
    []
  );

  return (
    <section ref={sectionRef} className="rv-section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        {/* emotional "memory" backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_42%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute -bottom-72 left-[-20%] h-[560px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(194,30,86,0.18),transparent)] blur-3xl" />
        <div className="absolute -bottom-72 right-[-20%] h-[560px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(0,112,184,0.16),transparent)] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)] blur-3xl" />

        {/* subtle film grain for "memorable" emotion */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 4px)",
            mixBlendMode: "overlay",
          }}
          animate={{ opacity: [0.06, 0.1, 0.07] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* slow drifting motes */}
        {memoryMotes.map((m) => (
          <motion.span
            key={m.id}
            className="absolute rounded-full"
            style={{
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%)",
              opacity: m.opacity,
              filter: "blur(14px)",
              mixBlendMode: "screen",
            }}
            animate={{
              y: [0, -18, 0, 12, 0],
              opacity: [m.opacity * 0.7, m.opacity, m.opacity * 0.75],
            }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="relative inline-block">
          {/* star sweep across the text */}
          {inView ? (
            <ShootingStar
              runKey={runKey}
              delayMs={ENDING_TIMING.starDelayMs}
              travelMs={ENDING_TIMING.starTravelMs}
            />
          ) : null}

          {/* impact glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              impactOn
                ? { opacity: 1, scale: 1.05 }
                : { opacity: 0, scale: 0.94 }
            }
            transition={{
              duration: ENDING_TIMING.brightenMs / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(238,178,17,0.10), rgba(194,30,86,0.08), transparent 68%)",
              filter: "blur(10px)",
              mixBlendMode: "screen",
            }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 14, filter: "blur(10px)" }
            }
            transition={{
              duration: ENDING_TIMING.textInMs / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rv-ending-title mt-5"
            style={{
              color: impactOn
                ? "rgba(255,255,255,0.97)"
                : "rgba(255,255,255,0.78)",
              textShadow: impactOn
                ? "0 0 26px rgba(255,255,255,0.22), 0 0 62px rgba(238,178,17,0.12)"
                : "0 0 18px rgba(255,255,255,0.10)",
              transition: `color ${ENDING_TIMING.brightenMs}ms ease, text-shadow ${ENDING_TIMING.brightenMs}ms ease`,
            }}
          >
            The end
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 10, filter: "blur(8px)" }
            }
            transition={{
              delay: 0.05,
              duration: ENDING_TIMING.textInMs / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rv-subtitle mt-4 max-w-2xl"
            style={{
              color: impactOn
                ? "rgba(255,255,255,0.92)"
                : "rgba(255,255,255,0.68)",
              textShadow: impactOn ? "0 0 18px rgba(255,255,255,0.14)" : "none",
              transition: `color ${ENDING_TIMING.brightenMs}ms ease, text-shadow ${ENDING_TIMING.brightenMs}ms ease`,
            }}
          >
            Wishing Red Velvet and Reveluv all the best for 2026!
          </motion.p>
        </div>

        <div className="mt-7 w-full max-w-3xl">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_22px_80px_rgba(0,0,0,0.45)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/fmr.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </div>

      {/* Clip source: https://www.youtubetrimmer.com/view/?v=Bl0s-1c5L0M&start=206&end=214&loop=1 */}
      <footer className="relative z-20 py-12 mt-8 text-center text-xs uppercase font-light text-white/30">
        <p className=" hover:text-white">
          © SM Entertainment. Fan Concept Design.
        </p>
        <a
          href="https://www.threads.com/@liam.quan_6"
          className="hover:text-amber-500"
        >
          @liam.quan_6
        </a>
      </footer>
    </section>
  );
}
