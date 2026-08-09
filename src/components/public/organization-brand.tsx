"use client";

import Link from "next/link";
import { OrganizationLogo } from "@/components/branding/organization-logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type OrganizationBrandVariant = "full" | "compact" | "icon-only" | "auto";

type OrganizationBrandProps = {
  /** auto = full ≥1440px, compact en dessous (via CSS). */
  variant?: OrganizationBrandVariant;
  className?: string;
  onDark?: boolean;
};

/**
 * Marque adaptative AFD — le nom long ne s’affiche que lorsqu’il y a de la place,
 * pour ne jamais chevaucher « Accueil ».
 */
export function OrganizationBrand({
  variant = "auto",
  className,
  onDark = false,
}: OrganizationBrandProps) {
  const forcedFull = variant === "full";
  const forcedCompact = variant === "compact";
  const iconOnly = variant === "icon-only";

  return (
    <Link
      href={siteConfig.routes.home}
      data-testid="organization-brand"
      data-variant={variant}
      className={cn(
        "group flex min-w-0 shrink-0 items-center gap-2.5 rounded-md sm:gap-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
        onDark && "focus-visible:ring-offset-[var(--afd-navy)]",
        className,
      )}
      aria-label={`${siteConfig.name} — Accueil`}
    >
      {/* Logo compact (<1440) */}
      <OrganizationLogo
        size="md"
        priority
        className={cn(
          "shrink-0",
          onDark ? "ring-white/35" : "ring-[var(--afd-border)]",
          forcedFull ? "hidden" : "inline-flex",
          variant === "auto" && "min-[1440px]:hidden",
        )}
      />
      {/* Logo grand (≥1440 ou full forcé) */}
      <OrganizationLogo
        size="lg"
        priority
        className={cn(
          "shrink-0",
          onDark ? "ring-white/35" : "ring-[var(--afd-border)]",
          forcedFull || variant === "auto"
            ? forcedFull
              ? "inline-flex"
              : "hidden min-[1440px]:inline-flex"
            : "hidden",
        )}
      />

      {iconOnly ? null : (
        <>
          {/* Nom complet — grand écran uniquement */}
          <span
            className={cn(
              "min-w-0 flex-col gap-0.5",
              forcedFull
                ? "flex"
                : variant === "auto"
                  ? "hidden min-[1440px]:flex"
                  : "hidden",
            )}
            data-brand-text="full"
          >
            {siteConfig.brandLines.map((line, index) => (
              <span
                key={line}
                className={cn(
                  "font-heading text-xs font-bold leading-[1.15] tracking-[0.02em]",
                  onDark ? "text-white" : "text-[var(--afd-sky)]",
                  index === siteConfig.brandLines.length - 1 &&
                    "font-semibold tracking-wide",
                )}
              >
                {line}
              </span>
            ))}
          </span>

          {/* Nom court AFD — mobile / laptop */}
          <span
            className={cn(
              "min-w-0 flex-col",
              forcedCompact
                ? "flex"
                : variant === "auto"
                  ? "flex min-[1440px]:hidden"
                  : "hidden",
            )}
            data-brand-text="compact"
          >
            <span
              className={cn(
                "font-heading truncate text-sm font-bold tracking-[0.02em] sm:text-[15px]",
                onDark ? "text-white" : "text-[var(--afd-sky)]",
              )}
            >
              {siteConfig.acronym}
            </span>
            <span
              className={cn(
                "truncate text-[10px] font-semibold uppercase tracking-[0.12em]",
                onDark ? "text-white/70" : "text-[var(--afd-muted)]",
              )}
            >
              {siteConfig.countryShort}
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
