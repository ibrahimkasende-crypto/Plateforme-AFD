import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type HeaderLogoProps = {
  compact?: boolean;
  className?: string;
};

export function HeaderLogo({ compact = false, className }: HeaderLogoProps) {
  return (
    <Link
      href={siteConfig.routes.home}
      className={cn(
        "group flex min-w-0 shrink-0 items-center gap-3.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`${siteConfig.name} — Accueil`}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[var(--afd-border)] transition-[width,height] duration-200",
          compact ? "size-14" : "size-16",
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

      <span className="hidden min-w-0 sm:flex sm:flex-col sm:gap-0.5">
        {siteConfig.brandLines.map((line, index) => (
          <span
            key={line}
            className={cn(
              "font-heading leading-[1.15] font-bold tracking-[0.02em] text-[var(--afd-navy)] transition-[font-size] duration-200",
              compact ? "text-[11px]" : "text-xs",
              index === siteConfig.brandLines.length - 1 &&
                "font-semibold tracking-wide text-[var(--afd-muted)]",
            )}
          >
            {line}
          </span>
        ))}
      </span>

      <span className="flex min-w-0 flex-col sm:hidden">
        <span className="font-heading text-sm font-bold text-[var(--afd-navy)]">
          {siteConfig.acronym}
        </span>
        <span className="text-[11px] font-semibold text-[var(--afd-muted)]">
          {siteConfig.countryShort}
        </span>
      </span>
    </Link>
  );
}
