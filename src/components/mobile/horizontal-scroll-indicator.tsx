"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HorizontalScrollIndicator({
  canScrollPrev,
  canScrollNext,
  currentIndex,
  total,
  onPrev,
  onNext,
  label,
}: {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  label: string;
}) {
  if (total <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs font-medium text-[var(--afd-muted)]" aria-live="polite">
        {Math.min(currentIndex + 1, total)} / {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canScrollPrev}
          aria-label={`${label} — précédent`}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full border border-[var(--afd-border)] bg-white text-[var(--afd-navy)]",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canScrollNext}
          aria-label={`${label} — suivant`}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full border border-[var(--afd-border)] bg-white text-[var(--afd-navy)]",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
