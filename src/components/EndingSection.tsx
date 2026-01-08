import { motion } from "framer-motion";
import React from "react";
export default function EndingSection() {
  return (
    <section className="rv-section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.55 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rv-ending-title"
        >
          Satin meets starlight.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.55 }}
          transition={{ delay: 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rv-subtitle mt-4 max-w-2xl"
        >
          Scroll back to the top to re-summon the cosmic cards.
        </motion.p>

        <div className="mt-14 w-full max-w-3xl">
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
    </section>
  );
}
