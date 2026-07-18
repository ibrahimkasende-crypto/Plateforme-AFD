import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Chevauchement léger entre deux sections (carte flottante / pont). */
export function SectionBridge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative z-10 -mt-8 mb-2 px-4 sm:-mt-10 sm:px-6 lg:-mt-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
