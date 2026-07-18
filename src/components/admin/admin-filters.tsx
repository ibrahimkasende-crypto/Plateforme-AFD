"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FilePlus, Printer, RotateCcw } from "lucide-react";
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
  { value: "quarter", label: "Trimestre" },
  { value: "year", label: "Année" },
  { value: "custom", label: "Personnalisée" },
];

type AdminFiltersProps = {
  filterOptions: DashboardBundle["filterOptions"];
  summary: DashboardSummary;
  className?: string;
  compact?: boolean;
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
  "h-[38px] w-full rounded-lg border border-[var(--admin-border)] bg-white px-2.5 text-[12px] text-[var(--admin-text)] outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20";

export function AdminFilters({
  filterOptions,
  summary,
  className,
  compact = false,
}: AdminFiltersProps) {
  const {
    filters,
    setPeriod,
    setProgramme,
    setProvince,
    setProject,
    updateParams,
  } = useDashboardFilters();
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

  const resetFilters = () => {
    updateParams({
      period: "year",
      programme: null,
      province: null,
      project: null,
      from: null,
      to: null,
    });
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 items-center gap-2",
        compact
          ? "rounded-[var(--admin-card-radius)] border border-[var(--admin-border)] bg-white px-2"
          : "flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap",
        className,
      )}
    >
      <label className="flex min-w-0 flex-[1.1] flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
        <span className="sr-only">Période</span>
        <select
          className={selectClassName}
          value={filters.period}
          onChange={(event) => setPeriod(event.target.value as DashboardPeriod)}
          aria-label="Période"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {filters.period === "custom" ? (
        <>
          <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
            <span className="sr-only">Du</span>
            <input
              type="date"
              className={selectClassName}
              value={filters.from ?? ""}
              onChange={(event) =>
                updateParams({ from: event.target.value || null, period: "custom" })
              }
              aria-label="Date de début"
            />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
            <span className="sr-only">Au</span>
            <input
              type="date"
              className={selectClassName}
              value={filters.to ?? ""}
              onChange={(event) =>
                updateParams({ to: event.target.value || null, period: "custom" })
              }
              aria-label="Date de fin"
            />
          </label>
        </>
      ) : null}

      <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
        <span className="sr-only">Programme</span>
        <select
          className={selectClassName}
          value={filters.programmeId ?? ""}
          onChange={(event) => setProgramme(event.target.value || null)}
          aria-label="Programme"
        >
          <option value="">Tous les programmes</option>
          {filterOptions.programmes.map((programme) => (
            <option key={programme.id} value={programme.id}>
              {programme.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
        <span className="sr-only">Province</span>
        <select
          className={selectClassName}
          value={filters.province ?? ""}
          onChange={(event) => setProvince(event.target.value || null)}
          aria-label="Province"
        >
          <option value="">Toutes les provinces</option>
          {filterOptions.provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-[var(--admin-muted)]">
        <span className="sr-only">Projet</span>
        <select
          className={selectClassName}
          value={filters.projectId ?? ""}
          onChange={(event) => setProject(event.target.value || null)}
          aria-label="Projet"
        >
          <option value="">Tous les projets</option>
          {filterOptions.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="inline-flex h-[38px] shrink-0 items-center gap-1 rounded-lg border border-[var(--admin-border)] px-2.5 text-[11px] font-medium text-[var(--admin-muted)] hover:bg-slate-50"
        aria-label="Réinitialiser les filtres"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        <span className="hidden xl:inline">Réinitialiser</span>
      </button>

      <div ref={exportRef} className="relative ml-auto shrink-0">
        <button
          type="button"
          onClick={() => setExportOpen((value) => !value)}
          className="inline-flex h-[38px] items-center gap-1.5 rounded-lg bg-[var(--admin-primary)] px-3 text-[12px] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)]"
          aria-expanded={exportOpen}
          aria-haspopup="menu"
        >
          <Download className="size-4" aria-hidden />
          <span className="hidden sm:inline">Exporter le rapport</span>
          <span className="sm:hidden">Exporter</span>
          <ChevronDown className="size-3.5 opacity-80" aria-hidden />
        </button>
        {exportOpen ? (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-1.5 w-56 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--admin-text)] hover:bg-slate-50"
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
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--admin-text)] hover:bg-slate-50"
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
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--admin-text)] hover:bg-slate-50"
              onClick={() => setExportOpen(false)}
            >
              <FilePlus className="size-4" aria-hidden />
              Rapport personnalisé
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
