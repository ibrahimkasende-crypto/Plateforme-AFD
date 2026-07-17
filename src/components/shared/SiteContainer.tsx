import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SiteContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--afd-container)] px-4 sm:px-6 md:px-8 xl:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
