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
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
        <Inbox className="size-6" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-[var(--afd-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
