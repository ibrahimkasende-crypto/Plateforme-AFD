"use client";

import { cn } from "@/lib/utils";

export type ChartLegendItem = {
  id: string;
  label: string;
  color: string;
  active?: boolean;
};

type ChartLegendProps = {
  items: ChartLegendItem[];
  onToggle?: (id: string) => void;
  className?: string;
};

export function ChartLegend({ items, onToggle, className }: ChartLegendProps) {
  return (
    <ul
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="Légende du graphique"
    >
      {items.map((item) => {
        const active = item.active !== false;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle?.(item.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                active
                  ? "border-slate-200 bg-white text-[var(--admin-text)]"
                  : "border-transparent bg-slate-100 text-slate-400 line-through",
              )}
              aria-pressed={active}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
