import type { ReactNode } from "react";

export function AdminBulkActions({
  selectedCount,
  children,
}: {
  selectedCount: number;
  children: ReactNode;
}) {
  if (selectedCount <= 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-slate-50 px-3 py-2 text-sm">
      <span className="font-medium text-[var(--admin-text)]">
        {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
