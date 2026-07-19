import Link from "next/link";
import type { ReactNode } from "react";

type AdminFormHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  status?: ReactNode;
  actions?: ReactNode;
};

export function AdminFormHeader({
  title,
  description,
  breadcrumb,
  status,
  actions,
}: AdminFormHeaderProps) {
  return (
    <header className="space-y-3">
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav aria-label="Fil d’Ariane" className="text-xs text-[var(--admin-muted)]">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumb.map((item, index) => (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {item.href ? (
                  <Link href={item.href} className="hover:text-[var(--admin-primary)]">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[var(--admin-text)]">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--admin-text)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-[var(--admin-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status}
          {actions}
        </div>
      </div>
    </header>
  );
}
