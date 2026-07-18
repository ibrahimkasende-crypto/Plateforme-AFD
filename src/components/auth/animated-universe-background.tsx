"use client";

import { useEffect, useState } from "react";
import { StarFieldCanvas } from "@/components/auth/star-field-canvas";
import { cn } from "@/lib/utils";

type AnimatedUniverseBackgroundProps = {
  className?: string;
};

export function AnimatedUniverseBackground({
  className,
}: AnimatedUniverseBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowDensity, setLowDensity] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      setReducedMotion(mq.matches);
      setLowDensity(narrow.matches || mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    narrow.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      narrow.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 20% 10%, rgba(8, 101, 216, 0.35), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(3, 27, 60, 0.85), transparent 50%), linear-gradient(165deg, #031b3c 0%, #062653 42%, #011a57 100%)",
        }}
      />
      <div
        className={cn(
          "absolute -left-1/4 top-1/4 h-[50%] w-[70%] rounded-full blur-3xl",
          !reducedMotion && "animate-[afd-nebula_18s_ease-in-out_infinite]",
        )}
        style={{ background: "rgba(8, 119, 209, 0.12)" }}
      />
      <div
        className={cn(
          "absolute -right-1/5 bottom-0 h-[45%] w-[55%] rounded-full blur-3xl",
          !reducedMotion && "animate-[afd-nebula_22s_ease-in-out_infinite_reverse]",
        )}
        style={{ background: "rgba(59, 163, 230, 0.08)" }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g stroke="rgba(180,210,255,0.45)" strokeWidth="0.15" fill="none">
          <path d="M8 20 L28 34 L48 22 L72 40 L92 28" />
          <path d="M12 70 L34 58 L56 74 L78 60 L94 78" />
          <circle cx="28" cy="34" r="0.6" fill="rgba(210,230,255,0.7)" stroke="none" />
          <circle cx="72" cy="40" r="0.5" fill="rgba(210,230,255,0.6)" stroke="none" />
          <circle cx="56" cy="74" r="0.55" fill="rgba(210,230,255,0.65)" stroke="none" />
        </g>
      </svg>
      <StarFieldCanvas
        className="absolute inset-0 h-full w-full"
        reducedMotion={reducedMotion}
        density={lowDensity ? "low" : "full"}
      />
    </div>
  );
}
