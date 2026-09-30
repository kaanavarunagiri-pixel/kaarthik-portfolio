"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Flame } from "lucide-react";

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 bg-[#030303] px-6 py-12 sm:px-12 md:px-20 lg:px-28 border-t border-white/5 text-xs font-mono text-neutral-400">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Status & Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-medium">SYS: OPERATIONAL</span>
          </div>
          {timeStr && <span className="text-neutral-400">{timeStr}</span>}
        </div>

        {/* Center Credits */}
        <div className="text-center text-neutral-400">
          Engineered with Next.js 14, Canvas &amp; Framer Motion
        </div>

        {/* Right Scroll Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer group"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
