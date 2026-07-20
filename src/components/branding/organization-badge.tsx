"use client";

import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type OrganizationBadgeProps = {
  className?: string;
  showSelectorHint?: boolean;
  /** Futur : true si l’utilisateur a plusieurs organisations. */
  multiOrg?: boolean;
  onOpenSelector?: () => void;
};

/**
 * Badge organisation active (header admin).
 * Le sélecteur multi-org n’apparaît que si multiOrg=true.
 */
export function OrganizationBadge({
  className,
  showSelectorHint = false,
  multiOrg = false,
  onOpenSelector,
}: OrganizationBadgeProps) {
  const content = (
    <>
      <OrganizationLogo size="xs" />
      <span className="hidden min-w-0 sm:inline">
        <span className="block truncate text-[11px] font-semibold leading-tight text-slate-800">
          {organizationBrand.organizationShortName}
        </span>
        <span className="block truncate text-[9px] text-slate-500">
          {productBrand.tenantLabel}
        </span>
      </span>
    </>
  );

  if (multiOrg && onOpenSelector) {
    return (
      <button
        type="button"
        onClick={onOpenSelector}
        className={cn(
          "inline-flex max-w-[200px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100",
          className,
        )}
        aria-label={`Changer d’organisation — ${organizationBrand.organizationLegalName}`}
        title={organizationBrand.organizationLegalName}
        data-organization-badge
        data-multi-org="true"
      >
        {content}
        {showSelectorHint ? (
          <span className="text-[10px] text-slate-400" aria-hidden>
            ▾
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1",
        className,
      )}
      title={organizationBrand.organizationLegalName}
      data-organization-badge
      data-multi-org="false"
    >
      {content}
    </div>
  );
}
