import Link from "next/link";
import type { ReactNode } from "react";
import { AdminBackButton } from "@/components/admin/navigation/admin-back-button";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  actions?: ReactNode;
  /**
   * Route de repli pour le bouton Retour.
   * Par défaut `/admin` (toutes les pages internes). Passer `null` pour masquer.
   */
  backFallbackHref?: string | null;
  backLabel?: string;
  backCompact?: boolean;
};

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel = "Créer",
  actions,
  backFallbackHref = "/admin",
  backLabel = "Retour",
  backCompact = false,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {backFallbackHref ? (
          <AdminBackButton
            fallbackHref={backFallbackHref}
            label={backLabel}
            compact={backCompact}
            className="mt-0.5"
          />
        ) : null}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">{title}</h1>
          {description ? (
            <p className="text-sm text-[var(--afd-muted)]">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {createHref ? (
          <Link
            className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
            href={createHref}
          >
            {createLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
