"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowDown, Flame, Terminal, Code2, Sparkles, ChevronDown } from "lucide-react";
import { useScrolly } from "./ScrollyCanvas";

export const Overlay: React.FC = () => {
  const scrolly = useScrolly();

  // Safe fallback if context is missing
  const progress = scrolly ? scrolly.smoothProgress : undefined;

  // Milestone 1: Hero (0% to ~22%)
  const s1Opacity = useTransform(progress || { on: () => () => {} } as any, [0, 0.12, 0.22], [1, 0.9, 0]);
  const s1Y = useTransform(progress || { on: () => () => {} } as any, [0, 0.22], [0, -60]);

  // Milestone 2: Discipline (25% to ~48%)
  const s2Opacity = useTransform(progress || { on: () => () => {} } as any, [0.23, 0.30, 0.44, 0.50], [0, 1, 1, 0]);
  const s2Y = useTransform(progress || { on: () => () => {} } as any, [0.23, 0.32, 0.44, 0.50], [40, 0, 0, -40]);

  // Milestone 3: Capabilities (52% to ~75%)
  const s3Opacity = useTransform(progress || { on: () => () => {} } as any, [0.51, 0.58, 0.70, 0.77], [0, 1, 1, 0]);
  const s3Y = useTransform(progress || { on: () => () => {} } as any, [0.51, 0.60, 0.70, 0.77], [40, 0, 0, -40]);

  // Milestone 4: Climax (80% to ~98%)
  const s4Opacity = useTransform(progress || { on: () => () => {} } as any, [0.78, 0.85, 0.95, 1.0], [0, 1, 1, 0.3]);
  const s4Y = useTransform(progress || { on: () => () => {} } as any, [0.78, 0.87, 0.95, 1.0], [40, 0, 0, -20]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-full w-full pointer-events-none select-none px-6 sm:px-12 md:px-20 lg:px-28">
      {/* ============================================================ */}
      {/* MILESTONE 1: Hero Opening (0% - 22%)                        */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s1Opacity, y: s1Y }}
        className="absolute inset-0 flex flex-col justify-between py-24 sm:py-28 px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36"
      >
        {/* Top Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/60 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300">
              AVAILABLE FOR SELECT PROJECTS
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-[11px] font-mono text-red-400 backdrop-blur-md">
            <Flame className="h-3 w-3 text-red-500 animate-pulse" />
            <span>60 FPS SCROLLYTELLING</span>
          </div>
        </div>

        {/* Center Hero Titles */}
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl space-y-4">
          <div className="inline-block rounded-md border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-mono tracking-widest text-red-400 uppercase">
            FULL STACK WEB AND APP DEVELOPER
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
            KAARTHIK
          </h1>
          <h2 className="text-gradient-red text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight">
            BUILDING NEXT-GEN WEB &amp; MOBILE EXPERIENCES
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-md lg:max-w-lg leading-relaxed">
            Engineering scalable web architectures, cross-platform mobile applications, and immersive interactive digital products.
          </p>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span>SCROLL DOWN TO ADVANCE</span>
          </div>
          <div className="animate-bounce text-neutral-400">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* MILESTONE 2: Digital Impact (25% - 48%)                     */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s2Opacity, y: s2Y }}
        className="absolute inset-0 flex flex-col justify-center items-start py-20 px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36"
      >
        <div className="max-w-2xl space-y-4 rounded-2xl border border-red-500/20 bg-black/60 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(255,30,39,0.15)]">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-red-400 uppercase">
            <Code2 className="h-4 w-4" />
            <span>ENGINEERING PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            WEB &amp; APP ARCHITECTURE <br />
            <span className="text-gradient-flame">BUILT FOR SCALE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            From intuitive client-facing web portals to high-reliability mobile apps, every system is engineered with speed, clean architecture, and seamless user experiences.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
              ⚡ Cross-Platform Mobile
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
              ⚡ Scalable Web Systems
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
              ⚡ Clean Code &amp; API Design
            </span>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* MILESTONE 3: Capabilities (52% - 75%)                       */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s3Opacity, y: s3Y }}
        className="absolute inset-0 flex flex-col justify-center items-end py-20 px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36 text-left"
      >
        <div className="max-w-2xl space-y-4 rounded-2xl border border-red-500/20 bg-black/60 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(255,30,39,0.15)] text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-red-400 uppercase">
            <Sparkles className="h-4 w-4" />
            <span>FULL STACK CORE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight text-left">
            VERSATILE TECH. <br />
            <span className="text-gradient-red">SEAMLESS DELIVERY.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed text-left">
            Delivering robust end-to-end solutions with modern web frameworks, mobile SDKs, and rock-solid database backends.
          </p>
          <div className="pt-2 flex flex-wrap justify-start gap-2 text-xs font-mono">
            {["Next.js / React", "Flutter", "React Native", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "MongoDB"].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-red-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* MILESTONE 4: Climax / Portal (80% - 98%)                    */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s4Opacity, y: s4Y }}
        className="absolute inset-0 flex flex-col justify-center items-center text-center py-20 px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36"
      >
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1 text-xs font-mono uppercase tracking-widest text-red-400">
            <Flame className="h-3.5 w-3.5" />
            <span>SCROLL MILESTONE COMPLETED</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            EXPLORE KAARTHIK&apos;S <br />
            <span className="text-gradient-flame">PORTFOLIO.</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light max-w-md mx-auto">
            Explore projects worked in, launch the interactive developer terminal, or inspect technical capabilities.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-3 pointer-events-auto">
            <button
              onClick={() => scrollTo("portfolio-projects")}
              className="rounded-full bg-gradient-to-r from-red-600 to-red-800 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              Explore Projects
            </button>
            <button
              onClick={() => scrollTo("terminal-section")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs sm:text-sm font-mono text-neutral-200 hover:border-red-500 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            >
              <Terminal className="h-3.5 w-3.5 text-red-400" />
              <span>Launch Terminal</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
