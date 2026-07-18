"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { visualEffects } from "@/config/visual-effects";
import { WaterRippleErrorBoundary } from "./water-ripple-error-boundary";
import { WaterRippleFallback } from "./water-ripple-fallback";

const WaterRippleCanvas = dynamic(
  () =>
    import("./water-ripple/water-ripple-canvas").then(
      (mod) => mod.WaterRippleCanvas,
    ),
  { ssr: false, loading: () => null },
);

function isWebGlAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

function isSaveData(): boolean {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  return Boolean(connection?.saveData);
}

function subscribeNoop() {
  return () => undefined;
}

function getClientMode(): "webgl" | "fallback" | "off" {
  if (!visualEffects.waterRipple.enabled) return "off";
  if (isSaveData() || !isWebGlAvailable()) return "fallback";
  return "webgl";
}

export function WaterRippleOverlay() {
  const mode = useSyncExternalStore(
    subscribeNoop,
    getClientMode,
    () => "off" as const,
  );
  const cfg = visualEffects.waterRipple;

  if (mode === "off") return null;

  if (mode === "fallback") {
    return <WaterRippleFallback />;
  }

  return (
    <WaterRippleErrorBoundary fallback={<WaterRippleFallback />}>
      <WaterRippleCanvas
        intensity={cfg.intensity}
        radius={cfg.radius}
        decayMs={cfg.decayMs}
        maxDevicePixelRatio={cfg.maxDevicePixelRatio}
      />
    </WaterRippleErrorBoundary>
  );
}
