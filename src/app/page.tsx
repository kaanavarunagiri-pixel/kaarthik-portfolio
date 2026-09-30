import { ScrollyCanvas } from "@/components/CanvasScroller/ScrollyCanvas";
import { Overlay } from "@/components/CanvasScroller/Overlay";
import { Skills } from "@/components/Portfolio/Skills";
import { Projects } from "@/components/Portfolio/Projects";
import { DeveloperTerminal } from "@/components/Code/DeveloperTerminal";
import { Contact } from "@/components/Portfolio/Contact";
import { Footer } from "@/components/Portfolio/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      {/* 1. Hero 60 FPS Scrollytelling Stage */}
      <section id="hero" className="relative w-full">
        <ScrollyCanvas totalFrames={180}>
          <Overlay />
        </ScrollyCanvas>
      </section>

      {/* 2. Technical Capabilities & Stack */}
      <section id="capabilities" className="relative">
        <Skills />
      </section>

      {/* 3. Featured Engineered Projects */}
      <section id="portfolio-projects" className="relative">
        <Projects />
      </section>

      {/* 4. Interactive Developer Terminal */}
      <section id="terminal-section" className="relative">
        <DeveloperTerminal />
      </section>

      {/* 5. Contact & Collaboration */}
      <section id="contact-section" className="relative">
        <Contact />
      </section>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
