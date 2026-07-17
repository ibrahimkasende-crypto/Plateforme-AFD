import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--adf-border)] bg-[var(--adf-surface)] px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[var(--adf-accent-soft)] text-[var(--adf-accent)]">
        <Inbox className="size-6" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-[var(--adf-ink)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-[var(--adf-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
