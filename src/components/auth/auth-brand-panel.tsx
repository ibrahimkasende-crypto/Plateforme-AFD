"use client";

import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type AuthBrandPanelProps = {
  className?: string;
  compact?: boolean;
};

/**
 * Panneau de marque pour la connexion administrative AFD.
 */
export function AuthBrandPanel({ className, compact = false }: AuthBrandPanelProps) {
  return (
    <div className={cn("text-center", className)} data-auth-product-brand>
      <div
        className={cn(
          "mx-auto flex items-center justify-center overflow-visible",
          "motion-safe:animate-[afd-logo-breathe_4.5s_ease-in-out_infinite]",
        )}
      >
        <OrganizationLogo
          size={compact ? "lg" : "xl"}
          src={productBrand.logo.src}
          alt={productBrand.logo.alt}
          priority
        />
      </div>
      <p
        className={cn(
          "font-semibold uppercase tracking-[0.18em] text-[#9fd0ff]",
          compact ? "mt-2.5 text-[10px]" : "mt-4 text-xs",
        )}
      >
        {organizationBrand.organizationShortName}
      </p>
      <p
        className={cn(
          "font-display font-semibold text-white/95",
          compact ? "mt-1 text-[13px]" : "mt-1.5 text-[15px]",
        )}
      >
        {organizationBrand.organizationName}
      </p>
      <p
        className={cn(
          "text-white/55",
          compact
            ? "mt-1 text-[10px]"
            : "mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/70",
        )}
      >
        {productBrand.productDescription}
      </p>
    </div>
  );
}
