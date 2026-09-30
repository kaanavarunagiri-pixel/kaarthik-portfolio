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

  // Scroll tracking across the 500vh container
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

  return (
    <ScrollyContext.Provider value={{ scrollYProgress, smoothProgress }}>
      <div ref={containerRef} className="relative h-[550vh] w-full bg-[#050505]">
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
        </div>
      </div>
    </ScrollyContext.Provider>
  );
};
