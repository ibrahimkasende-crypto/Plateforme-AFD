"use client";

import type { InterventionProvince } from "@/features/intervention-zones/types/intervention-zone";
import { cn } from "@/lib/utils";

export function ProvinceList({
  provinces,
  selectedId,
  hoveredId = null,
  onSelect,
  filter = "all",
  className,
}: {
  provinces: InterventionProvince[];
  selectedId: string | null;
  hoveredId?: string | null;
  onSelect: (id: string) => void;
  filter?: "all" | "active";
  className?: string;
}) {
  const items = (
    filter === "active"
      ? provinces.filter((province) => province.active)
      : provinces
  )
    .slice()
    .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, "fr"));

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold tracking-wide text-[var(--afd-muted)] uppercase">
        Liste des provinces
      </p>
      <ul
        className="mt-2 max-h-[280px] space-y-1 overflow-y-auto overscroll-contain pr-1 sm:max-h-[340px]"
        role="listbox"
        aria-label="Provinces de la République démocratique du Congo"
      >
        {items.map((province) => {
          const selected = selectedId === province.id;
          const hovered = hoveredId === province.id;
          return (
            <li key={province.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onSelect(province.id)}
                className={cn(
                  "flex w-full min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-200",
                  selected
                    ? "bg-[var(--afd-blue)] text-white"
                    : hovered
                      ? "bg-[var(--afd-light-blue)] text-[var(--afd-navy)] ring-1 ring-[var(--afd-blue)]/30"
                      : province.active
                        ? "bg-[#eaf5fd] text-[var(--afd-text)] hover:bg-[var(--afd-light-blue)]"
                        : "bg-white text-[var(--afd-text)] hover:bg-[var(--afd-light-blue)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]",
                )}
              >
                <span className="flex min-w-0 items-center gap-2 truncate font-medium">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      selected
                        ? "bg-white"
                        : province.active
                          ? "bg-[var(--afd-blue)]"
                          : "bg-[#c5d0db]",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{province.name}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[11px]",
                    selected ? "text-white/85" : "text-[var(--afd-muted)]",
                  )}
                >
                  {province.active
                    ? `${province.projectCount} projet${province.projectCount > 1 ? "s" : ""}`
                    : "—"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {filter === "active" && items.length === 0 ? (
        <p className="mt-2 text-xs text-[var(--afd-muted)]">
          Aucune province avec intervention publiée pour le moment.
        </p>
      ) : null}
    </div>
  );
}
