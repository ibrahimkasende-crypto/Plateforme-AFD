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
        "group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)] focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`${siteConfig.name} — Accueil`}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[var(--afd-border)] transition-[width,height] duration-200",
          compact ? "size-10" : "size-12",
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

      <span className="hidden min-w-0 sm:flex sm:flex-col">
        {siteConfig.brandLines.map((line, index) => (
          <span
            key={line}
            className={cn(
              "leading-tight font-semibold tracking-wide text-[var(--afd-accent)] transition-[font-size] duration-200",
              compact ? "text-[10px]" : "text-[11px]",
              index === siteConfig.brandLines.length - 1 &&
                "font-medium text-[var(--afd-muted)]",
            )}
          >
            {line}
          </span>
        ))}
      </span>

      <span className="flex min-w-0 flex-col sm:hidden">
        <span className="text-sm font-semibold text-[var(--afd-accent)]">
          {siteConfig.acronym}
        </span>
        <span className="text-[10px] font-medium text-[var(--afd-muted)]">
          {siteConfig.countryShort}
        </span>
      </span>
    </Link>
  );
}
