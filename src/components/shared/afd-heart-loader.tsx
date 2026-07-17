"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function AfdHeartLoader({
  className,
  label = "Plateforme-AFD",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-5",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Chargement de la plateforme AFD"
    >
      <div className="relative flex size-28 items-center justify-center">
        <span
          className="afd-ring-pulse absolute inset-0 rounded-full border border-[var(--afd-blue)]/25"
          aria-hidden
        />
        <span
          className="afd-ring-pulse absolute inset-2 rounded-full border border-[var(--afd-orange)]/20 [animation-delay:280ms]"
          aria-hidden
        />
        <Heart
          className="afd-heart-breathe absolute size-[5.5rem] fill-[var(--afd-orange)]/15 text-[var(--afd-orange)]"
          aria-hidden
          strokeWidth={1.25}
        />
        <span className="relative z-10 overflow-hidden rounded-full bg-white shadow-[0_8px_28px_rgba(6,38,83,0.16)] ring-2 ring-white">
          <Image
            src={siteConfig.logo.src}
            alt=""
            width={64}
            height={64}
            className="size-16 object-cover"
            priority
          />
        </span>
      </div>
      <p className="font-heading text-sm font-bold tracking-wide text-[var(--afd-navy)]">
        {label}
      </p>
    </div>
  );
}
