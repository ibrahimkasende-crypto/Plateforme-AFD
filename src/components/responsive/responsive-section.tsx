import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResponsiveSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[var(--section-space-mobile)] md:py-[var(--afd-section-y)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
