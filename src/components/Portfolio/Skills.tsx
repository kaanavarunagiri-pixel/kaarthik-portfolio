"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Globe,
  Smartphone,
  Server,
  Database,
  Terminal,
  Zap,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useSound } from "@/components/UI/SoundManager";

interface TacticalLoadout {
  slot: string;
  category: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  status: string;
  specs: { label: string; value: string }[];
  arsenal: string[];
}

const LOADOUTS: TacticalLoadout[] = [
  {
    slot: "SLOT 01 // PRIMARY WEAPON",
    category: "Full-Stack Web Engineering",
    title: "Next.js 14+ & React 19 Engine",
    tagline: "Ultra-fast, server-rendered web applications with modern component architecture.",
    icon: <Globe className="h-5 w-5 text-red-500" />,
    status: "MISSION READY // ACTIVE",
    specs: [
      { label: "Core Language", value: "TypeScript (Strict Mode)" },
      { label: "Design System", value: "Tailwind CSS v4 & Cyber Mesh" },
      { label: "Architecture", value: "Server Components (RSC) + Hydration" },
      { label: "Key Strengths", value: "Sub-Second LCP, Responsive UI, Clean Code" },
    ],
    arsenal: [
      "Next.js 14+",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Responsive Systems",
      "Clean Component Design",
    ],
  },
  {
    slot: "SLOT 02 // TACTICAL SIDEARM",
    category: "Cross-Platform Mobile",
    title: "Flutter & React Native Suite",
    tagline: "Deploying high-performance iOS and Android mobile apps from unified codebases.",
    icon: <Smartphone className="h-5 w-5 text-orange-500" />,
    status: "FIELD DEPLOYED // VERIFIED",
    specs: [
      { label: "Target Ecosystem", value: "Universal iOS & Android Native" },
      { label: "State Architecture", value: "Provider, Riverpod, Redux Flow" },
      { label: "Native Device APIs", value: "Real-Time Geolocation, Camera, Auth" },
      { label: "Flagship Production", value: "D-BOOK Real-Time Driver Booking" },
    ],
    arsenal: [
      "Flutter",
      "Dart",
      "React Native",
      "Cross-Platform UI",
      "Mobile State Management",
      "Device APIs",
    ],
  },
  {
    slot: "SLOT 03 // HEAVY ARTILLERY",
    category: "Backend & API Architecture",
    title: "Node.js & Express Server Logic",
    tagline: "Scalable asynchronous backend services, API pipelines, and secure middleware.",
    icon: <Server className="h-5 w-5 text-red-400" />,
    status: "OPERATIONAL // HIGH SECURITY",
    specs: [
      { label: "Runtime Engine", value: "Node.js V8 Asynchronous Event-Loop" },
      { label: "Communication", value: "RESTful Microservices & WebSockets" },
      { label: "Security & Auth", value: "JWT Tokens, Route Guards, Sanitization" },
      { label: "Throughput", value: "Non-Blocking I/O, High Concurrency" },
    ],
    arsenal: [
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JWT Authentication",
      "Middleware Design",
      "API Security",
    ],
  },
  {
    slot: "SLOT 04 // DATA VAULT",
    category: "Database & Cloud Infrastructure",
    title: "MongoDB & PostgreSQL Matrix",
    tagline: "High-integrity database modeling for relational schemas and dynamic document stores.",
    icon: <Database className="h-5 w-5 text-amber-500" />,
    status: "SYNCHRONIZED // HIGH AVAILABILITY",
    specs: [
      { label: "Data Paradigms", value: "Document NoSQL + Relational SQL" },
      { label: "Persistence Engines", value: "MongoDB (Mongoose) & PostgreSQL" },
      { label: "Deployment & CI/CD", value: "Git, GitHub Actions, Cloud Hosting" },
      { label: "Data Integrity", value: "Schema Validation, Indexed Queries, ACID" },
    ],
    arsenal: [
      "MongoDB",
      "PostgreSQL",
      "Mongoose",
      "SQL Schemas",
      "Git & GitHub",
      "Cloud Deployment",
    ],
  },
];

export const Skills: React.FC = () => {
  const { playChime } = useSound();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  return (
    <section
      id="skills"
      className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-red-500/20"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-red-400 backdrop-blur-md">
              <Crosshair className="h-3.5 w-3.5 text-red-500 animate-spin-slow" />
              <span>Tactical Loadout // Technical Arsenal</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              ENGINEERING <span className="text-gradient-red">WEAPONS OF CHOICE.</span>
            </h3>

            <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl">
              Precision-calibrated tools and battle-tested frameworks engineered to build scalable web platforms, native mobile applications, and resilient backends.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 font-mono text-xs text-neutral-500">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span>ARSENAL ONLINE: 4 OPERATIONAL TIERS</span>
          </div>
        </div>

        {/* 2x2 Tactical Loadout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {LOADOUTS.map((loadout, index) => {
            const isHovered = activeSlot === index;

            return (
              <div
                key={loadout.slot}
                onMouseEnter={() => {
                  playChime(500 + index * 60);
                  setActiveSlot(index);
                }}
                onMouseLeave={() => setActiveSlot(null)}
                className={`group relative rounded-2xl border bg-black/75 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-crosshair ${
                  isHovered
                    ? "border-red-500 shadow-[0_0_40px_rgba(255,30,39,0.22)] -translate-y-1"
                    : "border-white/10 hover:border-red-500/40"
                }`}
              >
                {/* Top Tactical Laser Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="space-y-6">
                  {/* Card Header & Status HUD */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase">
                      {loadout.slot}
                    </span>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-950/40 px-2.5 py-0.5 text-[10px] font-mono text-red-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>{loadout.status}</span>
                    </div>
                  </div>

                  {/* Title & Domain Icon */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-white shadow-[0_0_15px_rgba(255,30,39,0.2)]">
                        {loadout.icon}
                      </div>
                      <div>
                        <span className="text-xs font-mono uppercase text-neutral-400">
                          {loadout.category}
                        </span>
                        <h4 className="text-xl font-black uppercase text-white tracking-wide group-hover:text-red-400 transition-colors">
                          {loadout.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed pt-1">
                      {loadout.tagline}
                    </p>
                  </div>

                  {/* Technical Spec Sheet */}
                  <div className="rounded-xl border border-white/5 bg-neutral-950/60 p-4 space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest pb-1 border-b border-white/5">
                      // SYSTEM SPECIFICATIONS
                    </div>
                    {loadout.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-4 py-1 text-xs"
                      >
                        <span className="text-neutral-400">{spec.label}</span>
                        <span className="text-white text-right font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Weapon Arsenal Chips */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      // ACTIVE MODULES
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {loadout.arsenal.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-red-500/20 bg-red-950/20 px-2.5 py-1 text-[11px] font-mono text-red-200 transition-colors group-hover:border-red-500/40 group-hover:bg-red-950/40"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom HUD Footprint */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Zap className="h-3 w-3 text-red-500" />
                    <span>PRODUCTION READY</span>
                  </span>
                  <span className="text-neutral-600 group-hover:text-red-400 transition-colors">
                    SYS_LOAD // 100%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
