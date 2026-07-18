"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  isWaterRippleRouteDisabled,
  visualEffects,
} from "@/config/visual-effects";
import { useFinePointer } from "@/hooks/use-fine-pointer";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { WaterRippleOverlay } from "./water-ripple-overlay";

function subscribeViewport(onChange: () => void) {
  window.addEventListener("resize", onChange, { passive: true });
  return () => window.removeEventListener("resize", onChange);
}

function getWideEnough() {
  return window.innerWidth >= visualEffects.waterRipple.minViewportWidth;
}

export function PublicEffectsLayer() {
  const pathname = usePathname() || "/";
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const wideEnough = useSyncExternalStore(
    subscribeViewport,
    getWideEnough,
    () => false,
  );

  const enabled =
    visualEffects.waterRipple.enabled &&
    finePointer &&
    !reducedMotion &&
    wideEnough &&
    !isWaterRippleRouteDisabled(pathname);

  if (!enabled) return null;

  return <WaterRippleOverlay />;
}
