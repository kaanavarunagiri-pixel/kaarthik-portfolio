"use client";

import React, { useState } from "react";
import { Mail, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/UI/Icons";
import { useSound } from "@/components/UI/SoundManager";

export const Contact: React.FC = () => {
  const { playChime } = useSound();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playChime(700);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-red-500/20">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-red-400 backdrop-blur-md">
            <Mail className="h-3.5 w-3.5" />
            <span>Initiate Collaboration</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            LET&apos;S BUILD SOMETHING <br />
            <span className="text-gradient-red">EXTRAORDINARY.</span>
          </h3>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Have a project in mind, need creative development expertise, or want to discuss opportunities? Send a transmission below.
          </p>
        </div>

        {/* Contact Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Left Info Card */}
          <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-black/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
                DIRECT INBOX
              </span>
              <a
                href="mailto:kaarthiksri989@gmail.com"
                className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors break-all"
              >
                kaarthiksri989@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-1.5 pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                LOCATION &amp; TIME
              </span>
              <p className="text-sm text-neutral-300">
                Remote Worldwide • Available Immediately
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                CONNECT
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/kaarthik-arunagiri-66b0973b1"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:border-red-500/50 hover:bg-red-950/30 transition-all cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/kaarthik27_official"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:border-red-500/50 hover:bg-red-950/30 transition-all cursor-pointer"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-3 rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-xl">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-red-500 animate-bounce" />
                <h4 className="text-xl font-bold text-white">Transmission Received</h4>
                <p className="text-sm text-neutral-400 max-w-sm">
                  Thank you for reaching out. I will review your inquiry and respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400 uppercase">Project Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, or idea..."
                    className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-red-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,30,39,0.4)] hover:brightness-110 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
