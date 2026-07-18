"use client";

import { useEffect, useRef } from "react";
import { visualEffects } from "@/config/visual-effects";

/** Fallback Canvas 2D : anneau transparent, sans traînée. */
export function WaterRippleFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, t: 0 });
  const { radius, decayMs } = visualEffects.waterRipple;

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;
    const context = surface.getContext("2d");
    if (!context) return;

    const canvasEl: HTMLCanvasElement = surface;
    const ctx2d: CanvasRenderingContext2D = context;
    let raf: number | null = null;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvasEl.width = Math.floor(window.innerWidth * dpr);
      canvasEl.height = Math.floor(window.innerHeight * dpr);
      canvasEl.style.width = `${window.innerWidth}px`;
      canvasEl.style.height = `${window.innerHeight}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      const elapsed = now - pointer.current.t;
      ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (elapsed < decayMs && pointer.current.x > 0) {
        const progress = elapsed / decayMs;
        const r = radius * (0.55 + progress * 0.55);
        const alpha = (1 - progress) * 0.12;
        ctx2d.beginPath();
        ctx2d.arc(pointer.current.x, pointer.current.y, r, 0, Math.PI * 2);
        ctx2d.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx2d.lineWidth = 1.25;
        ctx2d.stroke();
        raf = requestAnimationFrame(draw);
      } else {
        raf = null;
      }
    }

    function onMove(event: MouseEvent) {
      pointer.current = {
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
      };
      if (raf == null) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [decayMs, radius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="afd-water-ripple pointer-events-none fixed inset-0 z-[90]"
      style={{ pointerEvents: "none" }}
    />
  );
}
