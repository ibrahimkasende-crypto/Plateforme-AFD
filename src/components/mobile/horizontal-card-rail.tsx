"use client";

import { useRef, type ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";
import { useHorizontalScrollState } from "@/hooks/use-horizontal-scroll-state";
import { cn } from "@/lib/utils";
import { HorizontalScrollIndicator } from "./horizontal-scroll-indicator";

export function HorizontalCardRail({
  children,
  className,
  itemClassName,
  label,
  showIndicator = true,
  desktopClassName,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  label: string;
  showIndicator?: boolean;
  /** Classes grille desktop (md+). */
  desktopClassName?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const enabled = visualEffects.mobileHorizontalRails.enabled;
  const scroll = useHorizontalScrollState(scrollerRef, children.length);

  if (!enabled) {
    return (
      <div
        className={cn(
          desktopClassName ?? "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn("@container/rail", className)}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "afd-h-rail flex gap-[var(--afd-rail-gap,1rem)] overflow-x-auto overscroll-x-contain pb-1",
          "snap-x snap-mandatory scroll-px-4 px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:snap-none",
          desktopClassName ?? "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              "w-[min(86vw,22.5rem)] shrink-0 snap-start",
              "max-[360px]:w-[min(88vw,22.5rem)]",
              "md:w-auto md:shrink md:snap-align-none",
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>
      {showIndicator ? (
        <div className="mt-3 px-4 md:hidden">
          <HorizontalScrollIndicator
            label={label}
            canScrollPrev={scroll.canScrollPrev}
            canScrollNext={scroll.canScrollNext}
            currentIndex={scroll.currentIndex}
            total={scroll.total}
            onPrev={() => scroll.scrollByPage(-1)}
            onNext={() => scroll.scrollByPage(1)}
          />
        </div>
      ) : null}
    </div>
  );
}
