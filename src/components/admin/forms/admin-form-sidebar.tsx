import type { ReactNode } from "react";

export function AdminFormSidebar({
  title = "Résumé",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-2xl border border-[var(--admin-border)] bg-white p-4">
      <h2 className="font-display text-sm font-bold">{title}</h2>
      <div className="mt-3 space-y-2 text-sm text-[var(--admin-muted)]">
        {children}
      </div>
    </aside>
  );
}
