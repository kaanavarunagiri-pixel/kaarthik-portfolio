"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, Trash2, Sparkles, CornerDownLeft } from "lucide-react";
import { useSound } from "@/components/UI/SoundManager";

interface CommandLog {
  cmd: string;
  output: string;
}

export const DeveloperTerminal: React.FC = () => {
  const { playChime } = useSound();
  const [inputVal, setInputVal] = useState("");
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isFirstMountRef = useRef(true);

  const [history, setHistory] = useState<CommandLog[]>([
    {
      cmd: "whoami",
      output:
        "KAARTHIK — Full Stack Web and App Developer specializing in modern web frameworks, cross-platform mobile apps, and scalable digital architectures.",
    },
    {
      cmd: "help",
      output: "Available commands: whoami, skills, projects, stack, contact, clear",
    },
  ]);

  const commandResponses: Record<string, string> = {
    whoami:
      "KAARTHIK — Full Stack Web and App Developer specializing in scalable web systems, cross-platform mobile apps, and modern digital platforms.",
    skills:
      "• Web: React 19, Next.js 14+, TypeScript, Tailwind CSS v4, Modern UI Architecture\n• Mobile: Flutter, React Native, Cross-Platform State & APIs\n• Backend & DB: Node.js, Express, MongoDB, PostgreSQL, RESTful APIs\n• Motion & Systems: 60 FPS Scrollytelling, Canvas 2D, Framer Motion, Lenis",
    stack:
      "Frontend: Next.js & React • Mobile: Flutter & React Native • Backend: Node.js • Databases: MongoDB & PostgreSQL • Styling: Tailwind CSS",
    projects:
      "1. D-BOOK / DBOOK — Driver-booking platform connecting car owners with verified drivers (fair-price, zero-commission).\n2. Digital Marketing Agency — Informational & customer lead enquiry landing page.\n3. Digital Printing Services — Commercial services showcase & order enquiry platform.",
    contact:
      "Email: kaarthiksri989@gmail.com\nLinkedIn: https://www.linkedin.com/in/kaarthik-arunagiri-66b0973b1\nInstagram: @kaarthik27_official\nStatus: Available for Select Web & App Projects",
    help: "Available commands: whoami, skills, projects, stack, contact, clear",
  };

  const runCommand = (cmdText: string) => {
    playChime(620);
    const cleaned = cmdText.trim().toLowerCase();
    if (!cleaned) return;

    if (cleaned === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    const resp =
      commandResponses[cleaned] ||
      `Command not recognized: "${cmdText}". Type "help" for a list of available commands.`;

    setHistory((prev) => [...prev, { cmd: cmdText, output: resp }]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(inputVal);
    }
  };

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section id="terminal" className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-red-500/20">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-red-400 backdrop-blur-md">
            <Terminal className="h-3.5 w-3.5" />
            <span>Interactive Console</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            DEVELOPER <span className="text-gradient-red">TERMINAL.</span>
          </h3>

          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl">
            Query system specs, inspect engineering architecture, or explore capabilities directly via the interactive shell.
          </p>
        </div>

        {/* Quick Command Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-500 mr-1">Quick execute:</span>
          {["whoami", "skills", "projects", "stack", "contact", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runCommand(cmd)}
              className="rounded-lg border border-red-500/20 bg-black/60 px-3 py-1 text-xs font-mono text-neutral-300 hover:border-red-500 hover:bg-red-950/30 hover:text-red-300 transition-colors cursor-pointer"
            >
              $ {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Window Box */}
        <div className="rounded-2xl border border-red-500/30 bg-[#080808]/90 shadow-[0_0_50px_rgba(255,30,39,0.1)] overflow-hidden font-mono text-xs sm:text-sm">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-red-500/20 bg-neutral-950/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-orange-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-neutral-400">bash — 80×24</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear terminal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Terminal Body */}
          <div ref={terminalBodyRef} className="p-4 sm:p-6 space-y-4 max-h-[360px] overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="text-neutral-500">guest@portfolio:~$</span>
                  <span className="font-semibold text-white">{item.cmd}</span>
                </div>
                <div className="whitespace-pre-line pl-4 text-neutral-300 leading-relaxed border-l-2 border-red-500/30">
                  {item.output}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Input Prompt */}
          <div className="flex items-center border-t border-red-500/20 bg-black/80 px-4 py-3">
            <span className="text-red-500 font-bold mr-2">&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command (try 'skills' or 'projects') and press Enter..."
              className="flex-1 bg-transparent text-white placeholder-neutral-600 outline-none font-mono text-xs sm:text-sm"
            />
            <button
              onClick={() => runCommand(inputVal)}
              className="text-neutral-500 hover:text-red-400 transition-colors ml-2 cursor-pointer"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
