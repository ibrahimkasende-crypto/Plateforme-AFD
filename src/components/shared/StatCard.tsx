import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--afd-border)] bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--afd-muted)]">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--afd-ink)]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-[var(--afd-muted)]">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}
