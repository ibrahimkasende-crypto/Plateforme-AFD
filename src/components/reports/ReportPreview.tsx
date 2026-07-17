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
        "rounded-2xl border border-[var(--afd-border)] bg-white p-6 shadow-sm",
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
        Aperçu du rapport
      </p>
      <h3 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
        {title}
      </h3>
      <div className="mt-4 prose-sm max-w-none text-[var(--afd-muted)]">
        {children}
      </div>
    </div>
  );
}
