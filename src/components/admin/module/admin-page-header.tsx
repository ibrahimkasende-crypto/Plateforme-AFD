import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel = "Créer",
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? (
          <p className="text-sm text-[var(--afd-muted)]">{description}</p>
        ) : null}
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
