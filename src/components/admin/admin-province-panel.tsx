"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  RDC_MAP_VIEWBOX,
  RDC_PROVINCE_PATHS,
} from "@/features/intervention-zones/data/rdc-province-paths";
import { matchLocationToProvinceId } from "@/features/intervention-zones/utils/normalize-province";
import type { ProvinceProjectsDatum } from "@/features/statistiques/types/dashboard";
import { slugify } from "@/lib/slugify";

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
  data: ProvinceProjectsDatum[];
};

export function AdminProvincePanel({ data }: AdminProvincePanelProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, ProvinceProjectsDatum>();
    for (const row of data) {
      const id = matchLocationToProvinceId(row.name);
      if (!id) continue;
      const prev = map.get(id);
      if (!prev) {
        map.set(id, row);
        continue;
      }
      map.set(id, {
        ...prev,
        value: prev.value + row.value,
        beneficiaries: (prev.beneficiaries ?? 0) + (row.beneficiaries ?? 0),
        activities: (prev.activities ?? 0) + (row.activities ?? 0),
      });
    }
    return map;
  }, [data]);

  const max = useMemo(
    () => Math.max(1, ...[...byId.values()].map((row) => row.value)),
    [byId],
  );

  const ranked = useMemo(
    () => [...data].sort((a, b) => b.value - a.value).slice(0, 8),
    [data],
  );

  return (
    <div className="flex h-full min-h-0 gap-2" data-province-projects-panel>
      <div className="relative min-h-0 min-w-0 flex-[1.15]">
        <svg
          viewBox={RDC_MAP_VIEWBOX}
          className="h-full w-full"
          role="img"
          aria-label="Carte des projets par province en RDC"
          data-rdc-map
        >
          {RDC_PROVINCE_PATHS.map((path) => {
            const row = byId.get(path.id);
            const value = row?.value ?? 0;
            const covered = COVERED_IDS.has(path.id) || value > 0;
            const fill = covered ? fillForValue(value, max) : "#edf1f5";
            const isHover = hovered === path.id;
            const slug = row?.slug ?? slugify(path.name);

            return (
              <path
                key={path.id}
                d={path.d}
                fill={fill}
                stroke={isHover ? "#07152f" : "#ffffff"}
                strokeWidth={isHover ? 1.4 : 0.6}
                className={covered ? "cursor-pointer transition-[fill,stroke-width] duration-200" : "transition-[fill,stroke-width] duration-200"}
                tabIndex={covered ? 0 : -1}
                aria-label={`${path.name}: ${value} projet(s)`}
                onMouseEnter={() => setHovered(path.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(path.id)}
                onBlur={() => setHovered(null)}
                onClick={() => {
                  if (!covered) return;
                  router.push(`/admin/projets?province=${encodeURIComponent(slug)}`);
                }}
                onKeyDown={(event) => {
                  if (!covered) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/projets?province=${encodeURIComponent(slug)}`);
                  }
                }}
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
        {ranked.map((row) => {
          const slug = row.slug ?? slugify(row.name);
          return (
            <li key={row.name}>
              <Link
                href={`/admin/projets?province=${encodeURIComponent(slug)}`}
                className="flex items-center justify-between gap-1 rounded px-1 py-0.5 hover:bg-slate-50"
              >
                <span className="min-w-0 truncate text-[var(--admin-text)]">
                  {row.name}
                  {typeof row.percent === "number" ? (
                    <span className="ml-1 text-[10px] text-[var(--admin-muted)]">
                      {row.percent}%
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-display font-bold text-[var(--admin-primary)]">
                  {row.value}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
