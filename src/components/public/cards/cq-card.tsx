import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Conteneur de carte avec container queries.
 * Les enfants peuvent utiliser `@min-[…]` / `@max-[…]` (Tailwind v4).
 */
export function CqCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag className={cn("@container/card min-w-0 w-full", className)}>
      {children}
    </Tag>
  );
}
