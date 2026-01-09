import { motion, useInView } from "framer-motion";
import * as React from "react";

const { useCallback, useEffect, useMemo, useRef, useState } = React;
type Member = {
  id: "irene" | "seulgi" | "wendy" | "joy" | "yeri";
  name: string;
  tag: string;
  headline: {
    normal: string;
    emphasis: string;
  };
  description: string;
  roles: string[];
  accentVar: string;
  image: string;
};

type MemberNavDot = {
  id: Member["id"];
  label: string;
  colorVar: string;
};

function MemberPanel({
  member,
  onActive,
  reverse,
}: {
  member: Member;
  onActive: (memberId: Member["id"]) => void;
  reverse: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(member.id);
  }, [inView, member.id, onActive]);

  return (
    <section
      ref={ref}
      id={`member-${member.id}`}
      className="rv-member-panel relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24"
      style={
        {
          "--rv-accent": `var(${member.accentVar})`,
        } as React.CSSProperties
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.45 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="grid w-full items-center gap-8 md:grid-cols-2"
      >
        <div
          className={[
            "space-y-8 text-left transition-all duration-1000 delay-300",
            reverse
              ? "order-2 md:order-1 md:pr-12"
              : "order-2 md:order-2 md:pl-12",
          ].join(" ")}
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-(--rv-accent)/50" />
            <span className="text-(--rv-accent) text-xs tracking-[0.3em] uppercase font-medium [font-family:var(--rv-font-secondary)]">
              {member.tag}
            </span>
          </div>

          <h3 className="[font-family:var(--rv-font-primary)] text-5xl md:text-6xl lg:text-7xl leading-tight text-white/90 tracking-tight">
            {member.headline.normal}{" "}
            <span className="italic text-white/50">
              {member.headline.emphasis}
            </span>
          </h3>

          <p className="text-lg font-extralight leading-relaxed max-w-md text-slate-300 [font-family:var(--rv-font-secondary)]">
            {member.description}
          </p>
        </div>

        <div
          className={[
            "relative",
            reverse ? "order-1 md:order-2" : "order-1 md:order-1",
          ].join(" ")}
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            animate={inView ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative group"
          >
            <div
              className={[
                "absolute -inset-1 rounded-4xl bg-linear-to-tr from-(--rv-accent)/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md",
                inView ? "opacity-100" : "",
              ].join(" ")}
            />
            <div className="relative aspect-3/4 w-full h-[550px] rounded-4xl overflow-hidden glass-panel">
              <img
                src={member.image}
                alt={`${member.name} portrait`}
                className={[
                  "object-[50%_20%] transition-transform duration-1000 grayscale-20 group-hover:grayscale-0 group-hover:scale-105 opacity-90 w-full h-full object-cover",
                  inView ? "grayscale-0 scale-105" : "",
                ].join(" ")}
                loading="lazy"
              />

              <div className="bg-linear-to-t from-(--rv-accent)/90 via-(--rv-accent)/20 to-transparent pt-8 pr-8 pb-8 pl-8 absolute right-0 bottom-0 left-0">
                <h2 className="[font-family:var(--rv-font-primary)] text-4xl italic mb-1 text-white tracking-tight">
                  {member.name}
                </h2>
                <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-white/90 [font-family:var(--rv-font-secondary)]">
                  {member.roles.length > 0 ? (
                    <>
                      <span className="px-2 py-0.5 backdrop-blur-sm rounded bg-white/10">
                        {member.roles[0]}
                      </span>
                      {member.roles.slice(1).map((r) => (
                        <span key={r}>{r}</span>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function MemberSection({
  onActiveMemberChange,
}: {
  onActiveMemberChange?: (memberId: string) => void;
}) {
  const [activeMemberId, setActiveMemberId] = useState<Member["id"]>("irene");
  const sectionRef = useRef<HTMLElement | null>(null);
  const isMembersSectionInView = useInView(sectionRef, {
    margin: "-25% 0px -25% 0px",
  });

  const members = useMemo<Member[]>(
    () => [
      {
        id: "irene",
        name: "Irene",
        tag: "ORIGINAL VISUAL",
        headline: { normal: "The Epitome of", emphasis: "Elegance" },
        description:
          '"I\'m a little monster, be scared of me." Delicate power wrapped in satin. She commands attention with a whisper, embodying the perfect balance of authority and grace.',
        roles: ["Leader", "Main Rapper"],
        accentVar: "--rv-irene",
        image: "/img/members_section/irene_white.webp",
      },
      {
        id: "seulgi",
        name: "Seulgi",
        tag: "THE ACE",
        headline: { normal: "Artistry in", emphasis: "Motion" },
        description:
          "Sharp lines, soulful gaze. A dancer who paints with movement, bringing a golden warmth to the cool velvet night.",
        roles: ["Main Dancer", "Lead Vocal"],
        accentVar: "--rv-seulgi",
        image: "/img/members_section/seulgi_white.webp",
      },
      {
        id: "wendy",
        name: "Wendy",
        tag: "THE VOICE",
        headline: { normal: "Crystalline", emphasis: "Resonance" },
        description:
          "A vocal tone that ripples through the air like water. Pure, powerful, and healing. The emotional anchor of the velvet concept.",
        roles: ["Main Vocal"],
        accentVar: "--rv-wendy",
        image: "/img/members_section/wendy_white.webp",
      },
      {
        id: "joy",
        name: "Joy",
        tag: "THE SIREN",
        headline: { normal: "Intoxicating", emphasis: "Charm" },
        description:
          "Fresh like green apples, mysterious like a deep forest. She brings a dynamic edge and unforgettable presence to every frame.",
        roles: ["Lead Rapper", "Sub Vocal"],
        accentVar: "--rv-joy",
        image: "/img/members_section/joy_white.webp",
      },
      {
        id: "yeri",
        name: "Yeri",
        tag: "THE MUSE",
        headline: { normal: "Youthful", emphasis: "Audacity" },
        description:
          "Bold spirits and bright ideas. She completes the circle with a chic, modern sensibility that bridges the gap between fantasy and reality.",
        roles: ["Maknae", "Sub Rapper"],
        accentVar: "--rv-yeri",
        image: "/img/members_section/yeri_white.webp",
      },
    ],
    []
  );

  const navDots = useMemo<MemberNavDot[]>(
    () => [
      { id: "irene", label: "Irene", colorVar: "--rv-irene" },
      { id: "seulgi", label: "Seulgi", colorVar: "--rv-seulgi" },
      { id: "wendy", label: "Wendy", colorVar: "--rv-wendy" },
      { id: "joy", label: "Joy", colorVar: "--rv-joy" },
      { id: "yeri", label: "Yeri", colorVar: "--rv-yeri" },
    ],
    []
  );

  const handleActive = useCallback(
    (memberId: Member["id"]) => {
      setActiveMemberId(memberId);
      onActiveMemberChange?.(memberId);
    },
    [onActiveMemberChange]
  );

  const handleDotClick = useCallback((memberId: Member["id"]) => {
    const el = document.getElementById(`member-${memberId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    // When entering the members section, default the active dot to Irene
    // until a specific panel becomes active via in-view tracking.
    if (isMembersSectionInView) handleActive("irene");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMembersSectionInView]);

  return (
    <section ref={sectionRef} className="relative">
      {/* Navigation Dots (members.html style) */}
      {isMembersSectionInView ? (
        <nav
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 mix-blend-difference"
          aria-label="Page Navigation"
        >
          {navDots.map((m) => {
            const isActive = m.id === activeMemberId;
            return (
              <button
                key={m.id}
                type="button"
                aria-label={m.label}
                data-target={m.id}
                onClick={() => handleDotClick(m.id)}
                className={[
                  "nav-dot w-1.5 h-1.5 rounded-full transition-all duration-500 hover:scale-150",
                  isActive ? "opacity-100 scale-150" : "opacity-40",
                ].join(" ")}
                style={{ backgroundColor: `var(${m.colorVar})` }}
              />
            );
          })}
        </nav>
      ) : null}

      <section className="relative pt-32 pb-16 flex items-center justify-center">
        <div className="text-center z-20 px-6 space-y-4">
          <span className="text-xs tracking-[0.4em] uppercase text-white/50 border-b pb-1 [font-family:var(--rv-font-secondary)]">
            Meet the Queens
          </span>
          <h1 className="[font-family:var(--rv-font-primary)] text-5xl md:text-7xl tracking-tight text-white font-medium">
            <span className="italic font-light opacity-90">The</span> Members
          </h1>
        </div>
      </section>

      <div className="rv-members">
        {members.map((m, idx) => (
          <MemberPanel
            key={m.id}
            member={m}
            onActive={handleActive}
            reverse={idx % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
