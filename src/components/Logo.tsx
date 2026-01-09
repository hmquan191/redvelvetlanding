import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";

export default function Logo({
  hidden = false,
  shineNonce = 0,
}: {
  hidden?: boolean;
  shineNonce?: number;
}) {
  const [isHover, setIsHover] = useState(false);
  const [autoShine, setAutoShine] = useState(false);

  useEffect(() => {
    if (hidden) return;
    if (!shineNonce) return;

    setAutoShine(true);
    const t = window.setTimeout(() => setAutoShine(false), 1100);
    return () => window.clearTimeout(t);
  }, [hidden, shineNonce]);

  const shouldShine = (isHover || autoShine) && !hidden;

  return (
    <div
      className="pointer-events-none fixed left-5 top-5 z-40"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <motion.div
        className={`relative select-none ${
          hidden ? "pointer-events-none" : "pointer-events-auto"
        }`}
        onHoverStart={() => setIsHover(true)}
        onHoverEnd={() => setIsHover(false)}
      >
        <div className="rv-logo-text">
          <span className="text-xl italic font-serif text-white/90 ">
            Red Velvet
            {/* shine sweep */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(120deg, transparent 0%, black 18%, black 28%, transparent 42%)",
                maskImage:
                  "linear-gradient(120deg, transparent 0%, black 18%, black 28%, transparent 42%)",
              }}
              initial={{ x: "-140%", opacity: 0 }}
              animate={
                shouldShine
                  ? { x: ["-140%", "140%"], opacity: [0, 1, 0] }
                  : { x: "-140%", opacity: 0 }
              }
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)]" />
            </motion.span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
