"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AuthBrandPanelProps = {
  className?: string;
  compact?: boolean;
};

export function AuthBrandPanel({ className, compact = false }: AuthBrandPanelProps) {
  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "mx-auto overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-white/15",
          compact ? "size-20 p-1.5" : "size-24 p-2",
          "motion-safe:animate-[afd-logo-breathe_4.5s_ease-in-out_infinite]",
        )}
      >
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          width={compact ? 72 : 88}
          height={compact ? 72 : 88}
          className="size-full rounded-full object-cover"
          priority
        />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd0ff]">
        {siteConfig.shortName}
      </p>
      <p className="mt-1.5 font-display text-[15px] font-semibold text-white/95">
        Alliance des Femmes pour le Développement
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/70">
        Espace sécurisé de gestion, de suivi et de publication.
      </p>
    </div>
  );
}
