"use client";

import { Children, useRef, type ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";
import { useHorizontalScrollState } from "@/hooks/use-horizontal-scroll-state";
import { cn } from "@/lib/utils";
import { HorizontalRailItem } from "./horizontal-rail-item";
import { HorizontalScrollIndicator } from "./horizontal-scroll-indicator";

export function HorizontalCardRail({
  children,
  className,
  itemClassName,
  label,
  showIndicator = true,
  showControls,
  desktopClassName,
  itemWidth,
  gap,
  align = "start",
  featuredFirst = false,
}: {
  children: ReactNode[] | ReactNode;
  className?: string;
  itemClassName?: string;
  label: string;
  showIndicator?: boolean;
  showControls?: boolean;
  desktopClassName?: string;
  /** Classe largeur item mobile (override). */
  itemWidth?: string;
  gap?: string;
  align?: "start" | "center";
  /** Première carte un peu plus large (actions terrain). */
  featuredFirst?: boolean;
}) {
  const items = Children.toArray(children);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const enabled = visualEffects.mobileHorizontalRails.enabled;
  const scroll = useHorizontalScrollState(scrollerRef, items.length);
  const indicator = showControls ?? showIndicator;

  if (!enabled) {
    return (
      <div
        className={cn(
          desktopClassName ?? "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {items}
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
          "afd-h-rail flex overflow-x-auto overscroll-x-contain pb-1",
          "snap-x snap-mandatory scroll-px-[var(--mobile-gutter)] px-[var(--mobile-gutter)]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:snap-none",
          desktopClassName ?? "md:grid-cols-2 lg:grid-cols-3",
        )}
        style={{ gap: gap ?? "var(--card-gap-mobile)" }}
      >
        {items.map((child, index) => (
          <HorizontalRailItem
            key={index}
            featured={featuredFirst && index === 0}
            widthClassName={
              itemWidth ??
              (align === "center"
                ? "w-[min(82vw,22rem)] snap-center"
                : "w-[min(84vw,22.5rem)] max-[360px]:w-[min(88vw,22.5rem)]")
            }
            className={itemClassName}
          >
            {child}
          </HorizontalRailItem>
        ))}
      </div>
      {indicator ? (
        <div className="mt-3 px-[var(--mobile-gutter)] md:hidden">
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
