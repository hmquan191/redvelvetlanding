import { AnimatePresence, motion, useInView } from "framer-motion";
import * as React from "react";

const { useEffect, useMemo, useRef, useState } = React;

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
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.55, margin: "-10% 0px -10% 0px" });

  const [displayValue, setDisplayValue] = useState(stat.value);

  useEffect(() => {
    // Parse values like: "85", "12", "3.3B"
    const match = String(stat.value).trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplayValue(stat.value);
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] ?? "";
    const decimals = (match[1].split(".")[1] ?? "").length;

    const format = (n: number) => `${n.toFixed(decimals)}${suffix}`;

    if (!inView) {
      setDisplayValue(format(0));
      return;
    }

    let raf = 0;
    const durationMs = 600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(format(target * eased));
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  return (
    <div ref={ref} className="relative p-2 sm:p-4">
      <div className="min-w-0">
        <div className="whitespace-pre-line text-sm sm:text-base md:text-lg uppercase tracking-wide text-white/70 [font-family:var(--rv-font-logo)]">
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
            className="relative font-semibold z-20 block text-7xl sm:text-8xl md:text-9xl  tracking-tight text-white/95"
            style={{
              fontFamily: "var(--rv-font-logo)",
              textShadow: isActive
                ? "0 0 34px rgba(255,255,255,0.10)"
                : "0 0 18px rgba(255,255,255,0.06)",
              transition: "text-shadow 240ms ease",
            }}
          >
            {displayValue}
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

type MusicShowRow = {
  no: number;
  show: string;
  wins: string;
  image: string;
};

export default function AchievementSection() {
  const stats = useMemo<Stat[]>(
    () => [
      { label: "Music Show\nTotal Wins", value: "84" },
      { label: "YouTube\nTotal Views", value: "3.3B" },
      { label: "Full Group MV\n100M+ Views", value: "12" },

      { label: "Spotify\nTotal Streams", value: "3.8B" },
    ],
    []
  );

  const musicShowData = useMemo<MusicShowRow[]>(
    () => [
      { no: 1, show: "Inkigayo", wins: "19", image: "/img/music_show/inkigayo.jpg" },
      { no: 2, show: "M COUNTDOWN", wins: "16", image: "/img/music_show/mcountdown.jpg" },
      { no: 3, show: "Music Bank", wins: "15", image: "/img/music_show/musicbank.jpg" },
      { no: 4, show: "Show Champion", wins: "14", image: "/img/music_show/showchampion.jpg" },
      { no: 5, show: "Show! Music Core", wins: "12", image: "/img/music_show/musicore.jpg" },
      { no: 6, show: "THE SHOW", wins: "8", image: "/img/music_show/theshow.jpg" },
    ],
    []
  );

  const [hoveredShow, setHoveredShow] = useState<MusicShowRow | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Preload all music show images on mount
  useEffect(() => {
    const imagePromises = musicShowData.map((row) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = row.image;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't block on error
      });
    });

    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, [musicShowData]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    });
  };

  // Smart positioning: flip image to other side if near edge
  const imageWidth = 220;
  const imageHeight = 180;
  const offset = 24;

  const getImagePosition = () => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

    // Horizontal: if image would overflow right, show on left of cursor
    const showOnLeft = mousePos.x + offset + imageWidth + 20 > vw;
    const left = showOnLeft
      ? mousePos.x - offset - imageWidth
      : mousePos.x + offset;

    // Vertical: center on cursor, but clamp to viewport
    let top = mousePos.y - imageHeight / 2;
    
    // Clamp to viewport bounds with padding
    const padding = 20;
    top = Math.max(padding, Math.min(top, vh - imageHeight - padding));

    return { left, top };
  };

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
              <span className="mt-5 text-xs text-[#FFA38C] tracking-[0.6em] uppercase [font-family:var(--rv-font-secondary)]">
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

      {/* Hover image preview - fixed position, follows cursor smartly */}
      <AnimatePresence>
        {hoveredShow ? (
          <motion.div
            key={hoveredShow.no}
            className="pointer-events-none fixed z-[9999]"
            style={getImagePosition()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-black/50">
              <img
                src={hoveredShow.image}
                alt={hoveredShow.show}
                className="h-[180px] w-[220px] object-cover"
                draggable={false}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Full-bleed music show wins table */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-16">
        <div className="overflow-x-auto" onMouseMove={handleMouseMove}>
          <table
            className="w-full border-collapse"

          >
            <thead>
              <tr className="text-sm font-extrabold border-b border-white/10 text-white/50 text-xs uppercase tracking-[0.25em]"
            style={{ fontFamily: "var(--rv-font-logo)" }}
            >
                <th className="px-6 py-4 font-medium">No.</th>
                <th className="px-6 py-4 font-medium">Music Show</th>
                <th className="px-6 py-4 font-medium"># of Wins</th>
              </tr>
            </thead>
            <tbody>
              {musicShowData.map((row) => (
                <tr
                  key={row.no}
                  className="text-3xl font-extrabold border-b border-white/10 text-white transition-colors duration-150 hover:bg-[#FFA38C] hover:text-black cursor-pointer"
                  onMouseEnter={() => {
                    // Clear any pending timeout
                    if (hoverTimeoutRef.current) {
                      window.clearTimeout(hoverTimeoutRef.current);
                    }
                    // Set new hover immediately for responsive feel
                    setHoveredShow(row);
                  }}
                  onMouseLeave={() => {
                    // Small delay before hiding to prevent flicker between rows
                    hoverTimeoutRef.current = window.setTimeout(() => {
                      setHoveredShow(null);
                    }, 50);
                  }}
                >
                  <td className="px-6 py-5 text-center"
            style={{ fontFamily: "var(--rv-font-logo)" }}
            >{row.no}</td>
                  <td className="px-6 py-5 text-center italic"
            style={{ fontFamily: "var(--rv-font-primary)" }}
            >{row.show}</td>
                  <td className="px-6 py-5 text-center"
            style={{ fontFamily: "var(--rv-font-logo)" }}
          
                  >{row.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
