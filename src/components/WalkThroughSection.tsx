import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import * as React from "react";
import { ReactLenis } from "lenis/react";

type GalleryItem =
  | { type: "image"; src: string; position: "top" | "center" | "bottom"; size: "sm" | "md" | "lg" }
  | { type: "text"; content: string; position: "top" | "center" | "bottom" };

export default function WalkThroughSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Horizontal translation: 0% → -78% of track width as we scroll
  // Increased to cover more content with the larger/more images
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-93%"]);

  // Gallery items with scattered positioning
  const galleryItems = useMemo<GalleryItem[]>(
    () => [
      { type: "image", src: "/img/team_pic/team_cc3.jpg", position: "top", size: "lg" },
      { type: "text", content: "Happiness! Hello, this is Red Velvet.", position: "bottom" },
      { type: "image", src: "/img/team_pic/3.webp", position: "bottom", size: "lg" },
      { type: "image", src: "/img/team_pic/4.webp", position: "center", size: "lg" },
      { type: "text", content: "Do you know Red Velvet? I'm a Korean Singer", position: "center" },
      { type: "image", src: "/img/team_pic/5.webp", position: "top", size: "lg" },
      { type: "image", src: "/img/team_pic/6.webp", position: "bottom", size: "md" },
      { type: "text", content: "SM water tastes like water", position: "center" },
      { type: "image", src: "/img/team_pic/7.webp", position: "center", size: "lg" },
      { type: "image", src: "/img/team_pic/9.webp", position: "top", size: "sm" },
      { type: "image", src: "/img/team_pic/10.webp", position: "bottom", size: "lg" },
      { type: "text", content: "Because ReVeluvs exist,\nwe exist", position: "center" },
      { type: "image", src: "/img/team_pic/11.webp", position: "center", size: "sm" },
      { type: "image", src: "/img/team_pic/12.webp", position: "top", size: "lg" },
      // { type: "image", src: "/img/team_pic/13.webp", position: "bottom", size: "sm" },
      { type: "image", src: "/img/team_pic/14.webp", position: "center", size: "md" },
      // { type: "text", content: "I don't have a daughter like you", position: "bottom" },

      { type: "image", src: "/img/team_pic/team_cc2.jpg", position: "top", size: "md" },
      // { type: "image", src: "/img/team_pic/team_cc2.jpg", position: "top", size: "md" },

    ],
    []
  );

  const getPositionClasses = (position: "top" | "center" | "bottom") => {
    switch (position) {
      case "top":
        return "self-start mt-8 md:mt-16";
      case "center":
        return "self-center";
      case "bottom":
        return "self-end mb-8 md:mb-16";
    }
  };

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "h-[180px] w-[140px] md:h-[240px] md:w-[180px]";
      case "md":
        return "h-[260px] w-[200px] md:h-[340px] md:w-[260px]";
      case "lg":
        return "h-[320px] w-[260px] md:h-[420px] md:w-[490px]";
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-50 h-[4px] rounded-full  origin-left"
          style={{
            scaleX: scrollYProgress,
            backgroundColor: "#ffa38c",
          }}
        />

        {/* Subtle backdrop glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(194,30,86,0.12),transparent)] blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-[500px] w-[700px] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,112,184,0.10),transparent)] blur-3xl" />
        </div>

        {/* Horizontal scrolling track */}
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center gap-8 md:gap-16 px-[10vw]"
          style={{
            x: trackX,
            width: "fit-content",
          }}
        >
          {galleryItems.map((item, idx) => {
            if (item.type === "text") {
              return (
                <motion.div
                  key={`text-${idx}`}
                  className={`flex-shrink-0 ${getPositionClasses(item.position)}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="max-w-[280px] whitespace-pre-line text-lg md:text-2xl font-light leading-relaxed text-white/70 italic"
                    style={{ fontFamily: "var(--rv-font-primary)" }}
                  >
                    {item.content}
                  </p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`img-${idx}`}
                className={`flex-shrink-0 ${getPositionClasses(item.position)}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={`${getSizeClasses(item.size)} overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
