"use client";

import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { useScroll, useSpring, MotionValue } from "framer-motion";

interface ScrollyContextType {
  scrollYProgress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
}

const ScrollyContext = createContext<ScrollyContextType | null>(null);

export const useScrolly = () => useContext(ScrollyContext);

interface ScrollyCanvasProps {
  totalFrames?: number;
  children?: React.ReactNode;
}

const MOBILE_TARGETS = [0.0, 0.35, 0.65, 0.90];

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  totalFrames = 180,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentMobileStage, setCurrentMobileStage] = useState<number>(0);
  const currentMobileStageRef = useRef<number>(0);
  const stageAtStartRef = useRef<number>(0);

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);

  // Scroll tracking across container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Inertia spring smoothing for 60-120fps glide
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.2,
    restDelta: 0.0001,
  });

  // Object-fit: cover math on HTML5 canvas
  const drawImageCover = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement
    ) => {
      const w = canvas.width;
      const h = canvas.height;
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      if (!imgW || !imgH) return;

      const imgAspect = imgW / imgH;
      const canvasAspect = w / h;

      let renderW = w;
      let renderH = h;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        // Canvas is wider: scale to canvas width
        renderW = w;
        renderH = w / imgAspect;
        offsetY = (h - renderH) / 2;
      } else {
        // Canvas is taller: scale to canvas height
        renderH = h;
        renderW = h * imgAspect;
        offsetX = (w - renderW) / 2;
      }

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, imgW, imgH, offsetX, offsetY, renderW, renderH);
    },
    []
  );

  // Render a specific frame with nearest-frame fallback
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
      currentFrameRef.current = clampedIndex;
      const img = imagesRef.current[clampedIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback to nearest loaded frame
        for (let offset = 1; offset < totalFrames; offset++) {
          const prev = imagesRef.current[clampedIndex - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            drawImageCover(ctx, canvas, prev);
            return;
          }
          const next = imagesRef.current[clampedIndex + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            drawImageCover(ctx, canvas, next);
            return;
          }
        }
        return;
      }

      drawImageCover(ctx, canvas, img);
    },
    [totalFrames, drawImageCover]
  );

  // Responsive resize with devicePixelRatio scaling
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
    }

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload all 180 frames into memory
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    let loaded = 0;

    const getFramePath = (index: number) => {
      const padded = String(index + 1).padStart(3, "0");
      return `/sequence/frame_${padded}.webp`;
    };

    // Priority load: First frame for instant render
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loaded++;
      setLoadedCount(loaded);
      setIsReady(true);
      handleResize();
      renderFrame(0);

      // Progressively load all remaining frames
      for (let i = 1; i < totalFrames; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          imagesRef.current[i] = img;
          loaded++;
          setLoadedCount(loaded);
        };
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalFrames, handleResize, renderFrame]);

  // Hook frame updates to spring-smoothed scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const targetIndex = Math.min(
        totalFrames - 1,
        Math.floor(latest * totalFrames)
      );
      renderFrame(targetIndex);
    });

    return () => unsubscribe();
  }, [smoothProgress, totalFrames, renderFrame]);

  // Programmatic scroll helper for mobile step transitions
  const scrollToMobileStage = useCallback((stageIndex: number) => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    if (stageIndex >= MOBILE_TARGETS.length) {
      // Exit hero section into capabilities/skills
      const targetY = maxScroll + 50;
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.85 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      return;
    }

    const targetProgress = MOBILE_TARGETS[Math.max(0, stageIndex)];
    const targetY = maxScroll * targetProgress;
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 0.85 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  // Track active mobile stage from scroll position
  useEffect(() => {
    if (!isMobile) return;

    const updateStage = () => {
      if (!containerRef.current) return;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const p = Math.max(0, Math.min(1, window.scrollY / maxScroll));

      let stage = 0;
      if (p < 0.20) stage = 0;
      else if (p < 0.50) stage = 1;
      else if (p < 0.80) stage = 2;
      else stage = 3;

      setCurrentMobileStage(stage);
      currentMobileStageRef.current = stage;
    };

    window.addEventListener("scroll", updateStage, { passive: true });
    updateStage();
    return () => window.removeEventListener("scroll", updateStage);
  }, [isMobile]);

  // Touch swipe listener for mobile: 1 vertical swipe = 1 card transition
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      // Only active while user is inside the hero scrollytelling section
      if (window.scrollY > maxScroll + 20) return;

      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      stageAtStartRef.current = currentMobileStageRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      // If user has scrolled below hero section, allow standard touch scroll completely
      if (window.scrollY > maxScroll + 20) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY.current - currentY;
      const deltaX = touchStartX.current - currentX;

      // Prevent chaotic native scroll jitter inside the sticky video section
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }

      // Trigger 1-card transition once swipe passes threshold (28px)
      if (
        !isTransitioningRef.current &&
        Math.abs(deltaY) > 28 &&
        Math.abs(deltaY) > Math.abs(deltaX)
      ) {
        isTransitioningRef.current = true;

        if (deltaY > 0) {
          // Swipe UP -> Advance to next card or exit hero
          const nextStage = stageAtStartRef.current + 1;
          scrollToMobileStage(nextStage);
        } else {
          // Swipe DOWN -> Go back to previous card
          const prevStage = Math.max(0, stageAtStartRef.current - 1);
          scrollToMobileStage(prevStage);
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 700);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!containerRef.current || isTransitioningRef.current) return;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (window.scrollY > maxScroll + 20) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = touchStartY.current - endY;
      const deltaX = touchStartX.current - endX;

      // Catch quick flick gestures
      if (Math.abs(deltaY) > 28 && Math.abs(deltaY) > Math.abs(deltaX)) {
        isTransitioningRef.current = true;

        if (deltaY > 0) {
          const nextStage = stageAtStartRef.current + 1;
          scrollToMobileStage(nextStage);
        } else {
          const prevStage = Math.max(0, stageAtStartRef.current - 1);
          scrollToMobileStage(prevStage);
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 700);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, scrollToMobileStage]);

  return (
    <ScrollyContext.Provider value={{ scrollYProgress, smoothProgress }}>
      <div
        ref={containerRef}
        className="relative h-[450vh] md:h-[550vh] w-full bg-[#050505]"
      >
        {/* Sticky Viewport Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Cinematic Vignette & Bottom Dissolve Gradient */}
          <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-black/20 to-black/80" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505]/80 to-transparent" />

          {/* Narrative Content Overlays */}
          <div className="relative z-10 h-full w-full">
            {children}
          </div>

          {/* Mobile-Only Interactive Dot Pagination (Right Screen Edge) */}
          {isMobile && (
            <div className="pointer-events-auto absolute right-3.5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 rounded-full border border-red-500/25 bg-black/70 px-2 py-3 backdrop-blur-md">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollToMobileStage(index)}
                  aria-label={`Go to card ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentMobileStage === index
                      ? "h-5 w-1.5 bg-red-500 shadow-[0_0_10px_#ff1e27]"
                      : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Mobile-Only Swipe Indicator Hint */}
          {isMobile && (
            <div className="pointer-events-none absolute bottom-4 inset-x-0 z-20 flex justify-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-black/80 px-3.5 py-1 text-[10px] font-mono text-neutral-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                <span>
                  {currentMobileStage < 3 ? "SWIPE UP FOR NEXT CARD" : "SWIPE UP TO EXPLORE"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollyContext.Provider>
  );
};
