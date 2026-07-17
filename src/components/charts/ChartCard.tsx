import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--afd-border)] bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-[var(--afd-muted)]">{description}</p>
        ) : null}
      </div>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}
