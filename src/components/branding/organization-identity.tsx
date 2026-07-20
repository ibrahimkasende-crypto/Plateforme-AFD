"use client";

import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type OrganizationIdentityProps = {
  mode?: "compact" | "extended";
  theme?: "light" | "dark";
  className?: string;
  showTenantLabel?: boolean;
  nameVariant?: "short" | "full" | "legal";
};

export function OrganizationIdentity({
  mode = "extended",
  theme = "dark",
  className,
  showTenantLabel = true,
  nameVariant = "full",
}: OrganizationIdentityProps) {
  const isDark = theme === "dark";
  const compact = mode === "compact";

  const name =
    nameVariant === "legal"
      ? organizationBrand.organizationLegalName
      : nameVariant === "short"
        ? organizationBrand.organizationShortName
        : organizationBrand.organizationName;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        compact ? "justify-center" : "gap-2",
        className,
      )}
      data-organization-identity
      data-mode={mode}
      title={`${productBrand.tenantLabel} : ${organizationBrand.organizationLegalName}`}
    >
      <OrganizationLogo size={compact ? "sm" : "sm"} />
      <div
        className={cn(
          "min-w-0",
          compact ? "sr-only" : "",
        )}
      >
        <p
          className={cn(
            "truncate text-[11px] font-semibold leading-tight",
            isDark ? "text-white/90" : "text-slate-800",
          )}
        >
          {name}
        </p>
        {showTenantLabel ? (
          <p
            className={cn(
              "mt-0.5 text-[9px] uppercase tracking-wide",
              isDark ? "text-white/45" : "text-slate-500",
            )}
          >
            {productBrand.tenantLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
