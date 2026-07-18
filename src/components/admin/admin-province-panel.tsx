"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  RDC_MAP_VIEWBOX,
  RDC_PROVINCE_PATHS,
} from "@/features/intervention-zones/data/rdc-province-paths";
import { matchLocationToProvinceId } from "@/features/intervention-zones/utils/normalize-province";
import type { ProvinceBeneficiaries } from "@/features/statistiques/types/dashboard";

const COVERED_IDS = new Set(
  [
    "Kinshasa",
    "Kwilu",
    "Kwango",
    "Haut-Katanga",
    "Ituri",
    "Tshopo",
    "Tshuapa",
    "Nord-Kivu",
  ]
    .map((name) => matchLocationToProvinceId(name))
    .filter((id): id is string => Boolean(id)),
);

function fillForValue(value: number, max: number): string {
  if (value <= 0 || max <= 0) return "#edf1f5";
  const ratio = value / max;
  if (ratio >= 0.75) return "#034ea2";
  if (ratio >= 0.45) return "#0865d8";
  if (ratio >= 0.2) return "#3ba3e6";
  return "#9cc7f0";
}

type AdminProvincePanelProps = {
  data: ProvinceBeneficiaries[];
};

export function AdminProvincePanel({ data }: AdminProvincePanelProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of data) {
      const id = matchLocationToProvinceId(row.name);
      if (!id) continue;
      map.set(id, (map.get(id) ?? 0) + row.value);
    }
    return map;
  }, [data]);

  const max = useMemo(
    () => Math.max(1, ...[...byId.values()]),
    [byId],
  );

  const ranked = useMemo(
    () => [...data].sort((a, b) => b.value - a.value).slice(0, 8),
    [data],
  );

  return (
    <div className="flex h-full min-h-0 gap-2">
      <div className="relative min-h-0 min-w-0 flex-[1.2]">
        <svg
          viewBox={RDC_MAP_VIEWBOX}
          className="h-full w-full"
          role="img"
          aria-label="Carte des bénéficiaires par province en RDC"
        >
          {RDC_PROVINCE_PATHS.map((path) => {
            const value = byId.get(path.id) ?? 0;
            const covered = COVERED_IDS.has(path.id) || value > 0;
            const fill = covered ? fillForValue(value, max) : "#edf1f5";
            const isHover = hovered === path.id;

            return (
              <path
                key={path.id}
                d={path.d}
                fill={fill}
                stroke={isHover ? "#07152f" : "#ffffff"}
                strokeWidth={isHover ? 1.4 : 0.6}
                className="transition-[fill,stroke-width] duration-200"
                tabIndex={covered ? 0 : -1}
                aria-label={`${path.name}: ${value.toLocaleString("fr-FR")} bénéficiaires`}
                onMouseEnter={() => setHovered(path.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(path.id)}
                onBlur={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-1.5 text-[10px] text-[var(--admin-muted)]">
          <span>Moins</span>
          <span className="inline-flex h-2 w-16 overflow-hidden rounded-sm">
            <span className="flex-1 bg-[#9cc7f0]" />
            <span className="flex-1 bg-[#3ba3e6]" />
            <span className="flex-1 bg-[#0865d8]" />
            <span className="flex-1 bg-[#034ea2]" />
          </span>
          <span>Plus</span>
        </div>
      </div>

      <ul className="min-h-0 min-w-0 flex-1 space-y-0.5 overflow-y-auto text-[11px]">
        {ranked.map((row) => (
          <li key={row.name}>
            <Link
              href={`/admin/zones-intervention?province=${encodeURIComponent(row.name)}`}
              className="flex items-center justify-between gap-1 rounded px-1 py-0.5 hover:bg-slate-50"
            >
              <span className="truncate text-[var(--admin-text)]">{row.name}</span>
              <span className="shrink-0 font-display font-bold text-[var(--admin-primary)]">
                {row.value.toLocaleString("fr-FR")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
