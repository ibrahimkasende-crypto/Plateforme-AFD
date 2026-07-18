"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bouton flottant « Faire un don » — cœur qui respire, ancré à droite.
 */
export function FloatingDonateButton() {
  const pathname = usePathname();
  const hideOnDonatePage =
    pathname === "/soutenir" || pathname.startsWith("/soutenir/");

  if (hideOnDonatePage) return null;

  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(0.85rem,env(safe-area-inset-right))] z-[60] sm:bottom-8 sm:right-5">
      <Link
        href="/soutenir"
        className={cn(
          "afd-donate-float pointer-events-auto group relative flex items-center gap-2.5 rounded-full",
          "bg-[var(--afd-orange)] py-2.5 pl-3 pr-4 text-white shadow-[0_10px_28px_rgba(232,93,4,0.45)]",
          "transition duration-200 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-orange)]",
          "motion-reduce:animate-none sm:gap-3 sm:py-3 sm:pl-3.5 sm:pr-5",
        )}
        aria-label="Fait un don et sauve une vie — soutenir l’AFD"
        title="Fait un don et sauve une vie"
      >
        <span
          className="afd-ring-pulse absolute inset-0 rounded-full bg-[var(--afd-orange)]/35"
          aria-hidden
        />
        <span
          className="relative z-[1] flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 sm:size-11"
          aria-hidden
        >
          <Heart className="afd-heart-breathe size-5 fill-white text-white motion-reduce:animate-none sm:size-6" />
        </span>
        <span className="relative z-[1] flex flex-col leading-tight">
          <span className="text-[12px] font-bold tracking-tight sm:text-[13px]">
            Fait un don
          </span>
          <span className="text-[11px] font-semibold text-white/95 sm:text-xs">
            et sauve une vie
          </span>
        </span>
      </Link>
    </div>
  );
}
