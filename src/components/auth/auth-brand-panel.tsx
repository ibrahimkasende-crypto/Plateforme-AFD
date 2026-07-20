"use client";

import Image from "next/image";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type AuthBrandPanelProps = {
  className?: string;
  compact?: boolean;
};

/**
 * Panneau de marque pour la connexion administrative LISUNGI.
 * Conserve une présence visuelle AFD (organisation cliente).
 */
export function AuthBrandPanel({ className, compact = false }: AuthBrandPanelProps) {
  const productPx = compact ? 48 : 72;
  const orgPx = compact ? 36 : 44;

  return (
    <div className={cn("text-center", className)} data-auth-product-brand>
      <div className="mx-auto flex items-center justify-center gap-3">
        <div
          className={cn(
            "overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-white/15",
            compact ? "size-14 p-1" : "size-20 p-1.5",
            "motion-safe:animate-[afd-logo-breathe_4.5s_ease-in-out_infinite]",
          )}
        >
          <Image
            src={productBrand.logo.src}
            alt={productBrand.logo.alt}
            width={productPx}
            height={productPx}
            className="size-full object-contain"
            priority
          />
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-white/20",
            compact ? "size-9" : "size-11",
          )}
          title={organizationBrand.organizationLegalName}
        >
          <Image
            src={organizationBrand.logo.src}
            alt={organizationBrand.logo.alt}
            width={orgPx}
            height={orgPx}
            className="size-full object-cover"
            priority
          />
        </div>
      </div>
      <p
        className={cn(
          "font-semibold uppercase tracking-[0.18em] text-[#9fd0ff]",
          compact ? "mt-2.5 text-[10px]" : "mt-4 text-xs",
        )}
      >
        {productBrand.productName}
      </p>
      <p
        className={cn(
          "font-display font-semibold text-white/95",
          compact ? "mt-1 text-[13px]" : "mt-1.5 text-[15px]",
        )}
      >
        {productBrand.productDescription}
      </p>
      <p
        className={cn(
          "text-white/55",
          compact ? "mt-1 text-[10px]" : "mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/70",
        )}
      >
        {productBrand.poweredByLabel}
      </p>
    </div>
  );
}
