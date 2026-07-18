import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminFormActionsProps = {
  children: ReactNode;
  className?: string;
  align?: "start" | "end" | "between";
};

export function AdminFormActions({
  children,
  className,
  align = "end",
}: AdminFormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-t border-[var(--admin-border)] pt-4",
        align === "start" && "justify-start",
        align === "end" && "justify-end",
        align === "between" && "justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}
