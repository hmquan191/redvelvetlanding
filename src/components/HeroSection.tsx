import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import React from "react";
export default function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const hazeOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 0.15]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const stars = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: `star-${i}`,
        left: `${Math.round(Math.random() * 100)}%`,
        top: `${Math.round(Math.random() * 100)}%`,
        size: Math.round(1 + Math.random() * 2),
        delay: Math.random() * 2,
        duration: 1.8 + Math.random() * 2.2,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <section ref={ref} className="rv-section relative overflow-hidden">
      {/* soft stardust haze */}
      <motion.div
        style={{ opacity: hazeOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-48 left-1/2 h-[540px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)] blur-2xl" />
        <div className="absolute -bottom-64 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(194,30,86,0.18),transparent)] blur-3xl" />
        <div className="absolute -bottom-64 left-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(0,112,184,0.16),transparent)] blur-3xl" />
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
              boxShadow: "0 0 12px rgba(255,255,255,0.55)",
            }}
            animate={{
              opacity: [s.opacity * 0.4, s.opacity, s.opacity * 0.45],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-block mb-4">
          <span className="text-xs tracking-[0.4em] uppercase border-b pb-2 text-white/70 border-white/20">
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
            <span className="block italic font-light opacity-90">Cosmic</span>{" "}
            Velvet
          </h1>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rv-subtitle mt-5 max-w-2xl"
        >
          <p className="font-light tracking-wide text-sm md:text-lg max-w-xl mx-auto leading-relaxed text-white/60">
            {" "}
            A symphony of elegance and duality. <br />
            Welcome to the new era of satin and starlight.
          </p>
        </motion.p>
      </div>
    </section>
  );
}
