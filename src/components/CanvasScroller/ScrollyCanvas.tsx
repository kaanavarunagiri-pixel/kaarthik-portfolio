"use client";

import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { useScroll, useSpring, useMotionValue, animate, MotionValue } from "framer-motion";

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
// Milestone keyframe indices to prioritize for mobile cards (frames 1, 63, 117, 162)
const MILESTONE_FRAME_INDICES = [0, 62, 116, 161];

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  totalFrames = 180,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const isMobileRef = useRef<boolean>(false);
  const [currentMobileStage, setCurrentMobileStage] = useState<number>(0);
  const currentMobileStageRef = useRef<number>(0);

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const swipedInGestureRef = useRef<boolean>(false);
  const mobileAnimRef = useRef<any>(null);

  // Dedicated discrete motion value for mobile 1-swipe transitions
  const mobileProgress = useMotionValue<number>(0.0);

  // Desktop continuous scroll tracking across 550vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Desktop inertia spring smoothing for 60-120fps glide
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.2,
    restDelta: 0.0001,
  });

  // Active progress supplied to context (mobile discrete vs desktop continuous)
  const activeProgress = isMobile ? mobileProgress : smoothProgress;

  // Optimized object-fit: cover math with zero fillRect overdraw
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
        renderW = w;
        renderH = w / imgAspect;
        offsetY = (h - renderH) / 2;
      } else {
        renderH = h;
        renderW = h * imgAspect;
        offsetX = (w - renderW) / 2;
      }

      ctx.drawImage(img, 0, 0, imgW, imgH, offsetX, offsetY, renderW, renderH);
    },
    []
  );

  // Render frame with nearest-frame fallback & cached 2D context
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = ctxRef.current || canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      ctxRef.current = ctx;

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

  // Responsive resize with mobile resolution & performance optimization
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    isMobileRef.current = mobile;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use DPR 1 on mobile to prevent GPU fill-rate throttling; DPR up to 2 on desktop
    const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const renderW = Math.round(displayWidth * dpr);
    const renderH = Math.round(displayHeight * dpr);

    if (canvas.width !== renderW || canvas.height !== renderH) {
      canvas.width = renderW;
      canvas.height = renderH;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = mobile ? "medium" : "high";
        ctxRef.current = ctx;
      }
    }

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload frames with milestone priority for instant mobile responsiveness
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    let loaded = 0;

    const getFramePath = (index: number) => {
      const padded = String(index + 1).padStart(3, "0");
      return `/sequence/frame_${padded}.webp`;
    };

    // Priority 1: Load First Frame immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loaded++;
      setLoadedCount(loaded);
      setIsReady(true);
      handleResize();
      renderFrame(0);

      // Priority 2: Milestone card keyframes (frames 63, 117, 162)
      MILESTONE_FRAME_INDICES.forEach((idx) => {
        if (idx !== 0) {
          const keyImg = new Image();
          keyImg.src = getFramePath(idx);
          keyImg.onload = () => {
            imagesRef.current[idx] = keyImg;
            loaded++;
            setLoadedCount(loaded);
          };
        }
      });

      // Priority 3: Progressively load remaining frames in background
      for (let i = 1; i < totalFrames; i++) {
        if (!MILESTONE_FRAME_INDICES.includes(i)) {
          const img = new Image();
          img.src = getFramePath(i);
          img.onload = () => {
            imagesRef.current[i] = img;
            loaded++;
            setLoadedCount(loaded);
          };
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalFrames, handleResize, renderFrame]);

  // Render frame on activeProgress change (60fps animation)
  useEffect(() => {
    const unsubscribe = activeProgress.on("change", (latest) => {
      const targetIndex = Math.min(
        totalFrames - 1,
        Math.floor(latest * totalFrames)
      );
      renderFrame(targetIndex);
    });

    return () => unsubscribe();
  }, [activeProgress, totalFrames, renderFrame]);

  // Jump to mobile stage with snappy, hardware-accelerated Framer Motion animation
  const goToMobileStage = useCallback(
    (stageIndex: number) => {
      if (stageIndex < 0) stageIndex = 0;

      if (stageIndex >= MOBILE_TARGETS.length) {
        // Exit hero section into portfolio skills / rest of site
        setCurrentMobileStage(3);
        currentMobileStageRef.current = 3;
        const lenis = (window as any).__lenis;
        const nextSection = document.getElementById("portfolio-skills");
        if (lenis && nextSection) {
          lenis.scrollTo(nextSection, { duration: 0.85 });
        } else if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }
        return;
      }

      setCurrentMobileStage(stageIndex);
      currentMobileStageRef.current = stageIndex;

      if (mobileAnimRef.current) {
        mobileAnimRef.current.stop();
      }

      const targetP = MOBILE_TARGETS[stageIndex];
      mobileAnimRef.current = animate(mobileProgress, targetP, {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1], // Ultra-snappy cubic bezier
      });
    },
    [mobileProgress]
  );

  // Mobile Touch Swipe Handling: 1 Swipe = Exactly 1 Card Transition
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only active when near top / in hero section
      if (window.scrollY > 25) return;

      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
      swipedInGestureRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 25) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY.current - currentY;
      const deltaX = touchStartX.current - currentX;
      const absY = Math.abs(deltaY);
      const absX = Math.abs(deltaX);

      // In Hero stages 0, 1, 2: prevent native vertical scroll so it never lags or fights
      if (currentMobileStageRef.current < 3 && absY > 6 && absY > absX) {
        if (e.cancelable) e.preventDefault();
      }

      // If at Stage 3 and swiping DOWN, intercept to go back to Stage 2
      if (currentMobileStageRef.current === 3 && deltaY < -6 && absY > absX) {
        if (e.cancelable) e.preventDefault();
      }

      // Once swipe passes 24px threshold, fire discrete 1-card transition immediately!
      if (!swipedInGestureRef.current && absY > 24 && absY > absX) {
        swipedInGestureRef.current = true;

        if (deltaY > 0) {
          // Swipe UP -> Next card
          goToMobileStage(currentMobileStageRef.current + 1);
        } else {
          // Swipe DOWN -> Previous card
          goToMobileStage(Math.max(0, currentMobileStageRef.current - 1));
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY > 25) return;

      // Handle fast flick gesture if touchmove didn't trigger
      if (!swipedInGestureRef.current) {
        const elapsed = Date.now() - touchStartTime.current;
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = touchStartY.current - endY;
        const deltaX = touchStartX.current - endX;
        const absY = Math.abs(deltaY);
        const absX = Math.abs(deltaX);

        if (elapsed < 350 && absY > 20 && absY > absX) {
          swipedInGestureRef.current = true;
          if (deltaY > 0) {
            goToMobileStage(currentMobileStageRef.current + 1);
          } else {
            goToMobileStage(Math.max(0, currentMobileStageRef.current - 1));
          }
        }
      }

      swipedInGestureRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, goToMobileStage]);

  return (
    <ScrollyContext.Provider
      value={{
        scrollYProgress: isMobile ? mobileProgress : scrollYProgress,
        smoothProgress: activeProgress,
      }}
    >
      <div
        ref={containerRef}
        className="relative h-screen md:h-[550vh] w-full bg-[#050505]"
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
                  onClick={() => goToMobileStage(index)}
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
