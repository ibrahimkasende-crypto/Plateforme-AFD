"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--afd-border)] bg-white p-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from?: string;
  to?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-[var(--afd-muted)]">
        Du
        <input
          type="date"
          value={from ?? ""}
          onChange={(event) => onFromChange(event.target.value)}
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm text-[var(--afd-ink)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-[var(--afd-muted)]">
        Au
        <input
          type="date"
          value={to ?? ""}
          onChange={(event) => onToChange(event.target.value)}
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm text-[var(--afd-ink)]"
        />
      </label>
    </div>
  );
}
