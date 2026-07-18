"use client";

import { useRef, type ReactNode } from "react";
import { useElementSize } from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  children,
  className,
  bodyClassName,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  action?: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useElementSize(bodyRef);

  return (
    <div className={cn("admin-panel", className)}>
      <div className="mb-1 flex shrink-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="admin-panel__title">{title}</h3>
          {description ? (
            <p className="admin-compact-hide mt-0.5 text-[11px] leading-snug text-[var(--admin-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div
        ref={bodyRef}
        className={cn("admin-panel__body relative min-h-0 min-w-0", bodyClassName)}
      >
        {children}
      </div>
    </div>
  );
}
