"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FilePlus, Printer } from "lucide-react";
import { useDashboardFilters } from "@/features/statistiques/hooks/use-dashboard-filters";
import type {
  DashboardBundle,
  DashboardPeriod,
  DashboardSummary,
} from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "quarter", label: "Trimestre en cours" },
  { value: "year", label: "Année en cours" },
];

type AdminFiltersProps = {
  filterOptions: DashboardBundle["filterOptions"];
  summary: DashboardSummary;
  className?: string;
};

function buildCsv(summary: DashboardSummary): string {
  const rows = [
    ["Indicateur", "Valeur", "Variation (%)"],
    ...Object.values(summary.kpis).map((kpi) => [
      kpi.label,
      kpi.formatted,
      kpi.variationPct?.toString() ?? "",
    ]),
  ];
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
}

function downloadCsv(summary: DashboardSummary) {
  const blob = new Blob([buildCsv(summary)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "tableau-de-bord-afd.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

const selectClassName =
  "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20";

export function AdminFilters({
  filterOptions,
  summary,
  className,
}: AdminFiltersProps) {
  const { filters, setPeriod, setProgramme, setProvince, setProject } =
    useDashboardFilters();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-center",
        className,
      )}
    >
      <label className="flex min-w-[180px] flex-col gap-1 text-xs text-slate-500">
        Période
        <select
          className={selectClassName}
          value={filters.period}
          onChange={(event) => setPeriod(event.target.value as DashboardPeriod)}
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-xs text-slate-500">
        Programme
        <select
          className={selectClassName}
          value={filters.programmeId ?? ""}
          onChange={(event) =>
            setProgramme(event.target.value || null)
          }
        >
          <option value="">Tous les programmes</option>
          {filterOptions.programmes.map((programme) => (
            <option key={programme.id} value={programme.id}>
              {programme.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-xs text-slate-500">
        Province
        <select
          className={selectClassName}
          value={filters.province ?? ""}
          onChange={(event) => setProvince(event.target.value || null)}
        >
          <option value="">Toutes les provinces</option>
          {filterOptions.provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-xs text-slate-500">
        Projet
        <select
          className={selectClassName}
          value={filters.projectId ?? ""}
          onChange={(event) => setProject(event.target.value || null)}
        >
          <option value="">Tous les projets</option>
          {filterOptions.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>

      <div ref={exportRef} className="relative lg:ml-auto">
        <button
          type="button"
          onClick={() => setExportOpen((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          aria-expanded={exportOpen}
          aria-haspopup="menu"
        >
          <Download className="size-4" aria-hidden />
          Exporter
          <ChevronDown className="size-4 text-slate-400" aria-hidden />
        </button>
        {exportOpen ? (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                window.print();
                setExportOpen(false);
              }}
            >
              <Printer className="size-4" aria-hidden />
              Impression
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                downloadCsv(summary);
                setExportOpen(false);
              }}
            >
              <Download className="size-4" aria-hidden />
              Télécharger CSV
            </button>
            <Link
              href="/admin/rapports/nouveau"
              role="menuitem"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setExportOpen(false)}
            >
              <FilePlus className="size-4" aria-hidden />
              Nouveau rapport
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
