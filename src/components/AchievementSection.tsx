import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

const { useMemo, useState } = React;

type Stat = {
  label: string;
  value: string;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function SprayBurst({
  isOn,
  seed,
  color,
}: {
  isOn: boolean;
  seed: number;
  color: string;
}) {
  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    const count = 22;
    return Array.from({ length: count }).map((_, i) => {
      const angle = rand() * Math.PI * 2;
      const r = 42 + rand() * 88;
      return {
        id: `spray-${seed}-${i}`,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r * (0.75 + rand() * 0.6),
        size: 2 + rand() * 4.5,
        delay: rand() * 0.07,
        blur: rand() * 0.7,
        opacity: 0.55 + rand() * 0.35,
      };
    });
  }, [seed]);

  return (
    <AnimatePresence>
      {isOn ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: color,
                boxShadow: `0 0 18px color-mix(in srgb, ${color} 65%, transparent)`,
                filter: `blur(${p.blur}px)`,
                opacity: p.opacity,
                mixBlendMode: "screen",
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, p.opacity, 0],
                scale: [0.7, 1.12, 0.85],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.65,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* soft ink bloom */}
          <motion.div
            className="absolute left-[-130px] top-[-130px] h-[260px] w-[260px] rounded-full"
            style={{
              background: `radial-gradient(closest-side, color-mix(in srgb, ${color} 26%, transparent), transparent 70%)`,
              filter: "blur(10px)",
              mixBlendMode: "screen",
              opacity: 0.9,
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const sprayColor = "#FFA38C";

  return (
    <div className="relative p-2 sm:p-4">
      <div className="min-w-0">
        <div className="text-sm sm:text-base md:text-lg uppercase tracking-[0.22em] text-white/70 [font-family:var(--rv-font-logo)]">
          {stat.label}
        </div>
      </div>

      <div className="relative mt-3 sm:mt-4">
        <button
          type="button"
          className="relative inline-flex w-full select-none items-baseline justify-start text-left outline-none"
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          aria-label={`${stat.label} ${stat.value}`}
        >
          <span
            className="relative z-20 block text-7xl sm:text-8xl md:text-9xl leading-none tracking-tight text-white/95"
            style={{
              fontFamily: "var(--rv-font-achievement)",
              textShadow: isActive
                ? "0 0 34px rgba(255,255,255,0.10)"
                : "0 0 18px rgba(255,255,255,0.06)",
              transition: "text-shadow 240ms ease",
            }}
          >
            {stat.value}
          </span>

          {/* hover spray */}
          <SprayBurst
            isOn={isActive}
            seed={1200 + index * 17}
            color={sprayColor}
          />

          {/* OT5 stamp */}
          <AnimatePresence>
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute z-30 inline-flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.92, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -14 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  color: sprayColor,
                  textShadow:
                    "0 0 18px rgba(255,163,140,0.35), 0 0 44px rgba(255,163,140,0.12)",
                  fontFamily: "var(--rv-font-stamp)",
                }}
              >
                <span className="text-7xl font-extrabold">OT5</span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export default function AchievementSection() {
  const stats = useMemo<Stat[]>(
    () => [
      { label: "Music Show Total Wins", value: "84" },
      { label: "YouTube Total Views", value: "3.3B" },
      { label: "Full Group MV 100M+ Views", value: "12" },

      { label: "Spotify Total Streams", value: "3.8B" },
    ],
    []
  );

  return (
    <section id="achievements" className="rv-section relative overflow-hidden">
      {/* RV-style backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_38%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute -top-72 left-[-18%] h-[560px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(194,30,86,0.18),transparent)] blur-3xl" />
        <div className="absolute -bottom-72 right-[-18%] h-[560px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(0,112,184,0.16),transparent)] blur-3xl" />
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
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-start gap-10 lg:grid-cols-2"
        >
          {/* Left: title + image */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-[#FFA38C]/15" />
              <span className="text-xs text-[#FFA38C] tracking-[0.6em] uppercase [font-family:var(--rv-font-secondary)]">
                Achievements
              </span>
            </div>

            <div className="mt-10">
              <h2
                className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white/95"
                style={{ fontFamily: "var(--rv-font-primary)" }}
              >
                <span className="block font-semibold">RV CAREER</span>
                <span className="mt-2 block italic font-light text-white/55">
                  SINCE 2018
                </span>
              </h2>
            </div>

            <div className="mt-5">
              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_22px_80px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent_65%)]" />
                <img
                  src="/img/team_pic/8.webp"
                  alt="Red Velvet group"
                  className="relative h-[320px] w-full object-cover object-[50%_35%] opacity-90"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="mt-15 grid gap-6 sm:grid-cols-2">
            {stats.map((s, idx) => (
              <StatCard key={s.label} stat={s} index={idx} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
