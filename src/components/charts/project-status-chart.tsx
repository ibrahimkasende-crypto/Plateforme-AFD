"use client";

import { useRouter } from "next/navigation";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import type { NamedCount } from "@/features/statistiques/types/dashboard";

type ProjectStatusChartProps = {
  data: NamedCount[];
};

function statusToQuery(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("cours")) return "actif";
  if (value.includes("planif")) return "planifie";
  if (value.includes("termin")) return "termine";
  if (value.includes("suspend")) return "suspendu";
  if (value.includes("archiv")) return "archive";
  return encodeURIComponent(name.toLowerCase());
}

function openStatusAnalyse(router: ReturnType<typeof useRouter>, name: string) {
  const statut = statusToQuery(name);
  router.push(
    `/admin/analyse/projets?vue=statuts&statut=${statut}&sourceWidget=projets-statut`,
  );
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const router = useRouter();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const rows = data.filter((item) => item.value > 0);

  if (total <= 0 || rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-center text-[11px] text-[var(--admin-muted)]">
        Aucun statut projet disponible.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-1 sm:gap-2">
      <div className="hidden items-end justify-between gap-2 sm:flex">
        <p className="text-[10px] font-medium text-[var(--admin-muted)]">
          Total projets
        </p>
        <p className="font-display text-[20px] font-extrabold leading-none tabular-nums tracking-normal text-[var(--admin-text)]">
          {total}
        </p>
      </div>

      <ul className="min-w-0 space-y-1 text-[10px] leading-tight sm:space-y-1.5 sm:text-[11px]">
        {rows.map((item, index) => {
          const color =
            item.color ?? AFD_CHART_COLORS[index % AFD_CHART_COLORS.length];
          const percent = item.percent ?? Math.round((item.value / total) * 100);
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => openStatusAnalyse(router, item.name)}
                className="group w-full rounded px-1 py-0 text-left transition hover:bg-slate-50 sm:py-0.5"
              >
                <span className="mb-0.5 flex items-center justify-between gap-2 sm:mb-1">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="truncate font-medium text-[var(--admin-text)]">
                      {item.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-bold tabular-nums text-[var(--admin-text)]">
                    {item.value}
                  </span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full transition group-hover:brightness-95"
                    style={{
                      width: `${Math.max(4, Math.min(100, percent))}%`,
                      backgroundColor: color,
                    }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
