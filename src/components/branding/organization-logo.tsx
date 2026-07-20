"use client";

import Image from "next/image";
import { organizationBrand } from "@/config/organization-brand";
import { cn } from "@/lib/utils";

type OrganizationLogoProps = {
  size?: "xs" | "sm" | "md" | "lg";
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
} as const;

export function OrganizationLogo({
  size = "md",
  className,
  priority = false,
  src,
  alt,
}: OrganizationLogoProps) {
  const px = SIZES[size];
  const logoSrc = src || organizationBrand.logo.src;
  const logoAlt = alt || organizationBrand.logo.alt;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-white",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={px}
        height={px}
        className="size-full object-cover"
        priority={priority}
      />
    </span>
  );
}
