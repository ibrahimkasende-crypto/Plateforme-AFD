import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminFilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      className={cn(
        "flex flex-wrap items-end gap-3 rounded-lg border border-[var(--admin-border)] bg-white p-3",
        className,
      )}
    >
      {children}
    </form>
  );
}
