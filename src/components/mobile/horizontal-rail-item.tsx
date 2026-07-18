import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HorizontalRailItem({
  children,
  className,
  widthClassName = "w-[min(84vw,22.5rem)] max-[360px]:w-[min(88vw,22.5rem)]",
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  widthClassName?: string;
  /** Première carte légèrement plus large. */
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "shrink-0 snap-start md:w-auto md:shrink md:snap-align-none",
        featured
          ? "w-[min(88vw,24rem)] max-[360px]:w-[min(90vw,24rem)]"
          : widthClassName,
        className,
      )}
    >
      {children}
    </div>
  );
}
