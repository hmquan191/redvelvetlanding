import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import React from "react";
export default function Logo() {
  const [isHover, setIsHover] = useState(false);

  const glints = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: `glint-${i}`,
        left: `${8 + Math.random() * 84}%`,
        top: `${10 + Math.random() * 70}%`,
        delay: Math.random() * 0.25,
        size: 5 + Math.round(Math.random() * 8),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed left-5 top-5 z-50">
      <motion.div
        className="pointer-events-auto relative select-none"
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
                isHover
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
