import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Conteneur public mobile-first — gutters + safe areas latéraux. */
export function ResponsiveContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--afd-container)]",
        "px-[max(var(--mobile-gutter),env(safe-area-inset-left))] pr-[max(var(--mobile-gutter),env(safe-area-inset-right))]",
        "sm:px-6 md:px-8 xl:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
