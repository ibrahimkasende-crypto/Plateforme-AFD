"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Download,
  FilePlus,
  FileSpreadsheet,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useDashboardFilters } from "@/features/statistiques/hooks/use-dashboard-filters";
import type {
  DashboardBundle,
  DashboardPeriod,
} from "@/features/statistiques/types/dashboard";
import {
  downloadDashboardCsv,
  printDashboardReport,
} from "@/features/statistiques/utils/export-dashboard-report";
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
  bundle: DashboardBundle;
  className?: string;
  compact?: boolean;
};

const selectClassName =
  "h-[38px] w-full rounded-lg border border-[var(--admin-border)] bg-white px-2.5 text-[12px] text-[var(--admin-text)] outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20";

export function AdminFilters({
  filterOptions,
  bundle,
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
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const updateMenuPosition = () => {
    const btn = exportBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!exportOpen) return;

    updateMenuPosition();

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        exportBtnRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setExportOpen(false);
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setExportOpen(false);
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [exportOpen]);

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

  const exportMenu =
    exportOpen && menuPos && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Options d'export du rapport"
            className="fixed z-[200] w-64 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-white py-1 shadow-xl"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--admin-text)] hover:bg-slate-50"
              onClick={() => {
                downloadDashboardCsv(bundle, filters);
                setExportOpen(false);
              }}
            >
              <FileSpreadsheet className="size-4 shrink-0 text-[var(--admin-primary)]" aria-hidden />
              <span>
                <span className="block font-medium">Télécharger CSV</span>
                <span className="block text-[11px] text-[var(--admin-muted)]">
                  Indicateurs, projets, budget
                </span>
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--admin-text)] hover:bg-slate-50"
              onClick={() => {
                printDashboardReport(bundle, filters);
                setExportOpen(false);
              }}
            >
              <Printer className="size-4 shrink-0 text-[var(--admin-primary)]" aria-hidden />
              <span>
                <span className="block font-medium">Imprimer / PDF</span>
                <span className="block text-[11px] text-[var(--admin-muted)]">
                  Ouvre l’aperçu d’impression
                </span>
              </span>
            </button>
            <Link
              href="/admin/rapports/nouveau"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--admin-text)] hover:bg-slate-50"
              onClick={() => setExportOpen(false)}
            >
              <FilePlus className="size-4 shrink-0 text-[var(--admin-primary)]" aria-hidden />
              <span>
                <span className="block font-medium">Rapport personnalisé</span>
                <span className="block text-[11px] text-[var(--admin-muted)]">
                  Créer un rapport enregistré
                </span>
              </span>
            </Link>
          </div>,
          document.body,
        )
      : null;

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

      <div className="relative ml-auto shrink-0">
        <button
          ref={exportBtnRef}
          type="button"
          onClick={() => {
            setExportOpen((open) => {
              const next = !open;
              if (next) {
                // position mise à jour dans l’effet ; pré-calcul immédiat
                requestAnimationFrame(updateMenuPosition);
              }
              return next;
            });
          }}
          className="inline-flex h-[38px] items-center gap-1.5 rounded-lg bg-[var(--admin-primary)] px-3 text-[12px] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)]"
          aria-expanded={exportOpen}
          aria-haspopup="menu"
          aria-controls={exportOpen ? menuId : undefined}
        >
          <Download className="size-4" aria-hidden />
          <span className="hidden sm:inline">Exporter le rapport</span>
          <span className="sm:hidden">Exporter</span>
          <ChevronDown className="size-3.5 opacity-80" aria-hidden />
        </button>
        {exportMenu}
      </div>
    </div>
  );
}
