"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { sampleSurfaceWhiteness } from "./sample-surface-whiteness";
import type { WaterRippleProps } from "./types";
import { WaterRippleScene } from "./water-ripple-scene";

const DISABLE_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [data-disable-water-effect], [role='dialog'], video, canvas[data-map], .leaflet-container";

export function WaterRippleCanvas({
  intensity,
  radius,
  decayMs,
  maxDevicePixelRatio,
}: WaterRippleProps) {
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const strengthRef = useRef(0);
  const skyBoostRef = useRef(0.35);
  const lastMoveRef = useRef(0);
  const lastSampleRef = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onVisibility() {
      setVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    let raf: number | null = null;
    let decaying = false;

    function tick() {
      const idle = performance.now() - lastMoveRef.current > decayMs;
      if (idle) {
        strengthRef.current = Math.max(0, strengthRef.current - 0.028);
      } else {
        strengthRef.current = Math.min(1, strengthRef.current + 0.16);
      }

      if (strengthRef.current > 0.001) {
        decaying = true;
        raf = requestAnimationFrame(tick);
      } else {
        decaying = false;
        raf = null;
      }
    }

    function ensureLoop() {
      if (raf == null) raf = requestAnimationFrame(tick);
    }

    function onMove(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest(DISABLE_SELECTOR)) {
        strengthRef.current = Math.min(strengthRef.current, 0.08);
        pointerRef.current.active = false;
        return;
      }

      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
      lastMoveRef.current = performance.now();

      const now = performance.now();
      if (now - lastSampleRef.current > 48) {
        lastSampleRef.current = now;
        const targetBoost = sampleSurfaceWhiteness(event.clientX, event.clientY);
        skyBoostRef.current += (targetBoost - skyBoostRef.current) * 0.35;
      }

      ensureLoop();
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    ensureLoop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf != null) cancelAnimationFrame(raf);
      void decaying;
    };
  }, [decayMs]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="afd-water-ripple pointer-events-none fixed inset-0 z-[90]"
      style={{ contain: "strict", pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, maxDevicePixelRatio]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
          premultipliedAlpha: true,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          pointerEvents: "none",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <WaterRippleScene
          intensity={intensity}
          radius={radius}
          decayMs={decayMs}
          maxDevicePixelRatio={maxDevicePixelRatio}
          pointerRef={pointerRef}
          strengthRef={strengthRef}
          skyBoostRef={skyBoostRef}
        />
      </Canvas>
    </div>
  );
}
