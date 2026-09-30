"use client";

import React, { useState } from "react";
import { ExternalLink, Flame, ArrowUpRight, Layers, Sparkles } from "lucide-react";
import { useSound } from "@/components/UI/SoundManager";

interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  metrics: string[];
  github?: string;
  live?: string;
  category: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "dbook",
    title: "D-BOOK / DBOOK",
    tagline: "Startup / Real-World Mobility Platform",
    description:
      "A driver-booking platform connecting customers who have their own car with professional, verified drivers. Built as a fair-price, zero-commission-style alternative to conventional cab platforms.",
    tags: ["Startup", "Flutter / Mobile", "Node.js", "MongoDB", "Real-Time Geo"],
    metrics: ["Zero Commission", "Direct Booking", "Cross-Platform"],
    category: "Startup & Mobile",
  },
  {
    id: "digital-marketing-agency",
    title: "Digital Marketing Agency",
    tagline: "Informational & Enquiry Landing Page",
    description:
      "High-conversion web application for a digital marketing agency, engineered to showcase specialized services, case studies, and convert visitors through an interactive lead enquiry system.",
    tags: ["Web Dev", "Next.js", "React", "TypeScript", "Tailwind CSS"],
    metrics: ["High Conversion", "Responsive", "< 0.3s LCP"],
    category: "Web Platforms",
  },
  {
    id: "digital-printing-services",
    title: "Digital Printing Services",
    tagline: "Commercial Services & Enquiry Platform",
    description:
      "Dynamic commercial landing page for a digital printing enterprise, created to showcase print capabilities, material catalogs, and facilitate rapid quotation and customer enquiries.",
    tags: ["Web Dev", "Next.js", "React", "Tailwind CSS", "Form Engine"],
    metrics: ["Interactive Catalog", "Order Enquiries", "Mobile First"],
    category: "Web Platforms",
  },
];

export const Projects: React.FC = () => {
  const { playChime } = useSound();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", "Startup & Mobile", "Web Platforms"];

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-red-500/20">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-red-400 backdrop-blur-md">
              <Layers className="h-3.5 w-3.5" />
              <span>Engineered Work</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              PROJECTS <span className="text-gradient-red">WORKED IN.</span>
            </h3>

            <p className="text-sm sm:text-base text-neutral-400 font-light max-w-lg">
              Selected client works, experimental prototypes, and high-performance interactive architectures.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playChime(500);
                  setActiveFilter(cat);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === cat
                    ? "bg-red-600 text-white shadow-[0_0_15px_rgba(255,30,39,0.4)]"
                    : "border border-white/10 bg-black/60 text-neutral-400 hover:text-white hover:border-red-500/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(255,30,39,0.2)] flex flex-col justify-between"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-red-400">
                  <span>{project.category}</span>
                  <div className="flex items-center gap-2">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-400 hover:text-red-400 transition-colors"
                        aria-label="Live preview"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                  {project.title}
                </h4>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                {project.metrics.map((metric, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    <span>{metric}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
