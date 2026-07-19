import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type HeaderLogoProps = {
  compact?: boolean;
  className?: string;
  /** Texte clair pour fonds sombre (ex. drawer mobile). */
  onDark?: boolean;
};

export function HeaderLogo({
  compact = false,
  className,
  onDark = false,
}: HeaderLogoProps) {
  return (
    <Link
      href={siteConfig.routes.home}
      className={cn(
        "group flex min-w-0 shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2 sm:gap-3.5",
        onDark && "focus-visible:ring-offset-[var(--afd-navy)]",
        className,
      )}
      aria-label={`${siteConfig.name} — Accueil`}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-[var(--afd-surface-elevated)] ring-1 transition-[width,height] duration-200",
          onDark ? "ring-white/35" : "ring-[var(--afd-border)]",
          "size-11 min-[1200px]:size-[3.25rem]",
          compact && "min-[1200px]:size-12",
        )}
      >
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          width={siteConfig.logo.width}
          height={siteConfig.logo.height}
          className="size-full object-cover"
          priority
        />
      </span>

      {/* Desktop / tablette large : nom complet */}
      <span className="hidden min-w-0 min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:gap-0.5">
        {siteConfig.brandLines.map((line, index) => (
          <span
            key={line}
            className={cn(
              "font-heading leading-[1.15] font-bold tracking-[0.02em] transition-[font-size] duration-200",
              onDark ? "text-white" : "text-[var(--afd-sky)]",
              compact ? "text-[11px]" : "text-xs",
              index === siteConfig.brandLines.length - 1 &&
                "font-semibold tracking-wide",
            )}
          >
            {line}
          </span>
        ))}
      </span>

      {/* Mobile / tablette : libellé court */}
      <span className="flex min-w-0 flex-col min-[1200px]:hidden">
        <span
          className={cn(
            "font-heading truncate text-sm font-bold",
            onDark ? "text-white" : "text-[var(--afd-sky)]",
          )}
        >
          {siteConfig.shortName}
        </span>
      </span>
    </Link>
  );
}
