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

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  width: number;
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
    r: 0.35 + Math.random() * 1.35,
    baseAlpha: 0.3 + Math.random() * 0.6,
    twinkle: Math.random() * Math.PI * 2,
    speed: 0.012 + Math.random() * 0.04,
  }));
}

function spawnShootingStar(width: number, height: number): ShootingStar {
  const fromTop = Math.random() > 0.35;
  const x = fromTop ? Math.random() * width * 0.85 : -20;
  const y = fromTop ? -10 : Math.random() * height * 0.55;
  const speed = 0.55 + Math.random() * 0.85;
  return {
    x,
    y,
    vx: speed * (0.85 + Math.random() * 0.35),
    vy: speed * (0.35 + Math.random() * 0.45),
    life: 0,
    maxLife: 650 + Math.random() * 900,
    length: 55 + Math.random() * 90,
    width: 1.1 + Math.random() * 1.4,
  };
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
    let shooters: ShootingStar[] = [];
    let raf = 0;
    let running = true;
    let last = performance.now();
    let nextSpawn = 400 + Math.random() * 900;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count =
        density === "low"
          ? Math.min(90, Math.floor((clientWidth * clientHeight) / 14000))
          : Math.min(160, Math.max(80, Math.floor((clientWidth * clientHeight) / 11000)));
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

    const drawShooter = (s: ShootingStar) => {
      const progress = s.life / s.maxLife;
      const fade =
        progress < 0.15
          ? progress / 0.15
          : progress > 0.7
            ? Math.max(0, 1 - (progress - 0.7) / 0.3)
            : 1;
      const trailX = s.x - s.vx * s.length;
      const trailY = s.y - s.vy * s.length;
      const gradient = ctx.createLinearGradient(trailX, trailY, s.x, s.y);
      gradient.addColorStop(0, "rgba(180, 220, 255, 0)");
      gradient.addColorStop(0.55, `rgba(170, 210, 255, ${0.35 * fade})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${0.95 * fade})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * fade})`;
      ctx.arc(s.x, s.y, s.width * 1.15, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        star.twinkle += dt * 0.0022;
        const alpha = star.baseAlpha * (0.55 + 0.45 * Math.sin(star.twinkle));
        star.x += star.speed * star.z * dt * 0.045;
        star.y += star.speed * star.z * dt * 0.028;
        if (star.x > w + 2) star.x = -2;
        if (star.y > h + 2) star.y = -2;

        ctx.beginPath();
        ctx.fillStyle = `rgba(210, 230, 255, ${alpha})`;
        ctx.arc(star.x, star.y, star.r * star.z, 0, Math.PI * 2);
        ctx.fill();
      }

      nextSpawn -= dt;
      const maxShooters = density === "low" ? 2 : 4;
      if (nextSpawn <= 0 && shooters.length < maxShooters) {
        shooters.push(spawnShootingStar(w, h));
        if (Math.random() > 0.65 && shooters.length < maxShooters) {
          shooters.push(spawnShootingStar(w, h));
        }
        nextSpawn = 500 + Math.random() * 1400;
      }

      shooters = shooters.filter((s) => {
        s.life += dt;
        s.x += s.vx * dt * 0.35;
        s.y += s.vy * dt * 0.35;
        if (s.life >= s.maxLife || s.x > w + 80 || s.y > h + 80) return false;
        drawShooter(s);
        return true;
      });

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
