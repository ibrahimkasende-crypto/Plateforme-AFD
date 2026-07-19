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
          compact ? "size-14 p-1" : "size-20 p-1.5",
          "motion-safe:animate-[afd-logo-breathe_4.5s_ease-in-out_infinite]",
        )}
      >
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          width={compact ? 48 : 72}
          height={compact ? 48 : 72}
          className="size-full rounded-full object-cover"
          priority
        />
      </div>
      <p
        className={cn(
          "font-semibold uppercase tracking-[0.18em] text-[#9fd0ff]",
          compact ? "mt-2.5 text-[10px]" : "mt-4 text-xs",
        )}
      >
        {siteConfig.shortName}
      </p>
      <p
        className={cn(
          "font-display font-semibold text-white/95",
          compact ? "mt-1 text-[13px]" : "mt-1.5 text-[15px]",
        )}
      >
        Alliance des Femmes pour le Développement
      </p>
      {!compact ? (
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/70">
          Espace sécurisé de gestion, de suivi et de publication.
        </p>
      ) : null}
    </div>
  );
}
