import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import React from "react";
export default function HeroSection({
  onInViewChange,
}: {
  onInViewChange?: (inView: boolean) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const inView = useInView(ref, { margin: "-15% 0px -70% 0px" });
  useEffect(() => {
    onInViewChange?.(inView);
  }, [inView, onInViewChange]);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const hazeOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 0.15]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const stars = useMemo(
    () =>
      Array.from({ length: 52 }).map((_, i) => {
        const base = 0.18 + Math.random() * 0.55;
        const a = Math.max(0.04, base * (0.25 + Math.random() * 0.35));
        const b = Math.min(1, base * (0.95 + Math.random() * 0.55));
        const c = Math.max(0.06, base * (0.35 + Math.random() * 0.35));
        const d = Math.min(1, base * (0.7 + Math.random() * 0.65));

        return {
          id: `star-${i}`,
          left: `${Math.round(Math.random() * 100)}%`,
          top: `${Math.round(Math.random() * 100)}%`,
          size: Math.round(1 + Math.random() * 2),
          delay: Math.random() * 2.2,
          duration: 2.2 + Math.random() * 3.2,
          repeatDelay: Math.random() * 1.8,
          opacity: base,
          opKeyframes: [a, b, c, d, a],
          scKeyframes: [1, 1.18, 0.95, 1.12, 1],
          blurKeyframes: [0, 0.2, 0, 0.35, 0],
        };
      }),
    []
  );

  const dust = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `dust-${i}`,
        left: `${Math.round(Math.random() * 100)}%`,
        top: `${Math.round(Math.random() * 100)}%`,
        size: 40 + Math.round(Math.random() * 90),
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 6,
        opacity: 0.05 + Math.random() * 0.08,
      })),
    []
  );

  return (
    <section ref={ref} className="rv-section relative overflow-hidden">
      {/* vibrant aurora base */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 50% 35%, rgba(255,255,255,0.10), transparent 58%), radial-gradient(700px 520px at 18% 76%, color-mix(in srgb, var(--rv-irene) 25%, transparent), transparent 60%), radial-gradient(760px 520px at 82% 72%, color-mix(in srgb, var(--rv-wendy) 26%, transparent), transparent 62%), radial-gradient(680px 520px at 80% 18%, color-mix(in srgb, var(--rv-seulgi) 22%, transparent), transparent 58%), radial-gradient(720px 520px at 18% 18%, color-mix(in srgb, var(--rv-yeri) 30%, transparent), transparent 60%), radial-gradient(760px 560px at 52% 92%, color-mix(in srgb, var(--rv-joy) 18%, transparent), transparent 65%)",
          filter: "saturate(1.15) contrast(1.02)",
        }}
        animate={{
          opacity: [0.9, 1, 0.92],
        }}
        transition={{ duration: 6.5, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* soft stardust haze */}
      <motion.div
        style={{ opacity: hazeOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-48 left-1/2 h-[540px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)] blur-2xl" />
        <div className="absolute -bottom-64 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(194,30,86,0.18),transparent)] blur-3xl" />
        <div className="absolute -bottom-64 left-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(0,112,184,0.16),transparent)] blur-3xl" />
      </motion.div>

      {/* drifting stardust motes */}
      <motion.div className="pointer-events-none absolute inset-0">
        {dust.map((d) => (
          <motion.span
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%)",
              filter: "blur(10px)",
              opacity: d.opacity,
              mixBlendMode: "screen",
            }}
            animate={{
              y: [0, -18, 0, 14, 0],
              opacity: [d.opacity * 0.6, d.opacity, d.opacity * 0.65],
              scale: [1, 1.05, 0.98, 1.06, 1],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* twinkling stars */}
      <motion.div
        style={{ y: starsY }}
        className="pointer-events-none absolute inset-0"
      >
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              boxShadow: "0 0 14px rgba(255,255,255,0.62)",
            }}
            animate={{
              opacity: s.opKeyframes,
              scale: s.scKeyframes,
              filter: s.blurKeyframes.map((b: number) => `blur(${b}px)`),
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatType: "mirror",
              repeatDelay: s.repeatDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-block mb-4">
          <span className="text-xs tracking-[0.6em] uppercase border-b pb-2 text-white/70 border-white/20 hover:text-white">
            The ReVe Festival
          </span>
        </div>
        <motion.h1
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="rv-title"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight text-shadow-sm text-white">
            <span className="block italic font-light opacity-90 hover:opacity-100">Cosmic</span>{" "}
            Velvet
          </h1>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rv-subtitle mt-5 max-w-2xl"
        >
          <motion.p
            className="font-light tracking-wide text-sm md:text-lg max-w-xl mx-auto leading-relaxed text-white/60"
            animate={{
              textShadow: [
                "0 0 0 rgba(255,255,255,0)",
                "0 0 18px rgba(255,255,255,0.18)",
                "0 0 0 rgba(255,255,255,0)",
              ],
              opacity: [1, 1, 0.98],
            }}
            transition={{
              duration: 0.85,
              repeat: Infinity,
              repeatDelay: 3.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {" "}
            A symphony of elegance and duality. <br />
            Welcome to the new era of satin and starlight.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
