"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkle: number;
  speed: number;
};

type StarFieldCanvasProps = {
  className?: string;
  reducedMotion?: boolean;
  density?: "full" | "low";
};

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: 0.35 + Math.random() * 0.65,
    r: 0.4 + Math.random() * 1.2,
    baseAlpha: 0.25 + Math.random() * 0.55,
    twinkle: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.025,
  }));
}

export function StarFieldCanvas({
  className,
  reducedMotion = false,
  density = "full",
}: StarFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count =
        density === "low"
          ? Math.min(70, Math.floor((clientWidth * clientHeight) / 18000))
          : Math.min(120, Math.max(60, Math.floor((clientWidth * clientHeight) / 14000)));
      stars = createStars(clientWidth, clientHeight, count);
    };

    const drawStatic = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(210, 230, 255, ${star.baseAlpha})`;
        ctx.arc(star.x, star.y, star.r * star.z, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        star.twinkle += dt * 0.0012;
        const alpha =
          star.baseAlpha *
          (0.72 + 0.28 * Math.sin(star.twinkle));
        star.x += star.speed * star.z * dt * 0.02;
        star.y += star.speed * star.z * dt * 0.012;
        if (star.x > w + 2) star.x = -2;
        if (star.y > h + 2) star.y = -2;

        ctx.beginPath();
        ctx.fillStyle = `rgba(210, 230, 255, ${alpha})`;
        ctx.arc(star.x, star.y, star.r * star.z, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
        return;
      }
      if (reducedMotion) {
        drawStatic();
        return;
      }
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reducedMotion) {
      drawStatic();
    } else {
      raf = window.requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
