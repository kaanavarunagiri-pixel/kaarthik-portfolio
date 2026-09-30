"use client";

import React, { useState, useEffect } from "react";
import { SoundButton } from "@/components/UI/SoundManager";
import { Terminal, Code2, Sparkles, Send } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-3 sm:py-4 ${
        scrolled ? "bg-black/80 backdrop-blur-lg border-b border-red-500/20 py-2.5 sm:py-3" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Left Side: Brand Monogram + Quick Access Nav */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-black border border-red-500/40 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,30,39,0.3)] group-hover:scale-105 transition-transform font-mono">
              K
            </div>
            <span className="font-bold text-sm sm:text-base tracking-wider text-white uppercase group-hover:text-red-400 transition-colors">
              KAARTHIK
            </span>
          </div>

          {/* Quick Access Navigation Links right near Kaarthik */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
            <button
              onClick={() => scrollTo("capabilities")}
              className="px-3 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors hover:bg-white/5 rounded-full cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollTo("portfolio-projects")}
              className="px-3 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors hover:bg-white/5 rounded-full cursor-pointer"
            >
              Projects
            </button>
            <button
              onClick={() => scrollTo("terminal-section")}
              className="px-3 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors hover:bg-white/5 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <Terminal className="h-3 w-3 text-red-500" />
              <span>Terminal</span>
            </button>
            <button
              onClick={() => scrollTo("contact-section")}
              className="px-3 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors hover:bg-white/5 rounded-full cursor-pointer"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Right: Sound Toggle + CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SoundButton />
          
          <button
            onClick={() => scrollTo("contact")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-800 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(255,30,39,0.4)] hover:brightness-110 hover:shadow-[0_0_25px_rgba(255,30,39,0.6)] transition-all cursor-pointer"
          >
            <Send className="h-3 w-3" />
            <span>Let&apos;s Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
