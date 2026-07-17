import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ReportPreview({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--adf-border)] bg-white p-6 shadow-sm",
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--adf-accent)]">
        Aperçu du rapport
      </p>
      <h3 className="font-display text-xl font-semibold text-[var(--adf-ink)]">
        {title}
      </h3>
      <div className="mt-4 prose-sm max-w-none text-[var(--adf-muted)]">
        {children}
      </div>
    </div>
  );
}
