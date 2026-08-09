"use client";

import Image from "next/image";
import { organizationBrand } from "@/config/organization-brand";
import { cn } from "@/lib/utils";

type OrganizationLogoProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
  src?: string | null;
  alt?: string;
};

const SIZES = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 88,
} as const;

type FitMode = "cover" | "contain";

/**
 * Logo organisation en cercle — overflow masqué, fond neutre léger,
 * cadrage interne pour réduire l’effet de marge blanche carrée.
 */
export function OrganizationLogo({
  size = "md",
  className,
  priority = false,
  src,
  alt,
  fit = "cover",
}: OrganizationLogoProps & { fit?: FitMode }) {
  const px = SIZES[size];
  const logoSrc = src || organizationBrand.logo.src;
  const logoAlt = alt || organizationBrand.logo.alt;
  const inset = Math.round(px * 0.08);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 aspect-square overflow-hidden rounded-full",
        "bg-slate-50/80 shadow-[0_2px_10px_rgba(3,78,162,0.18)] ring-1 ring-black/5",
        "dark:bg-slate-800/60 dark:ring-white/10",
        className,
      )}
      style={{ width: px, height: px }}
      data-organization-logo
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={px}
        height={px}
        className={cn(
          "absolute object-center",
          fit === "contain" ? "object-contain" : "object-cover",
        )}
        style={{
          inset: fit === "contain" ? inset : 0,
          width: fit === "contain" ? `calc(100% - ${inset * 2}px)` : "100%",
          height: fit === "contain" ? `calc(100% - ${inset * 2}px)` : "100%",
        }}
        priority={priority}
      />
    </span>
  );
}
