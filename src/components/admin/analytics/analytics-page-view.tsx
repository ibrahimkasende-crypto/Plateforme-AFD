"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { ChartEmptyState } from "@/components/charts/chart-empty-state";
import { EChartsReact } from "@/components/charts/echarts-react";
import { buildDashboardReturnHref } from "@/features/admin-analytics/utils/analytics-search-params";
import type { AnalyticsPageData } from "@/features/admin-analytics/types/admin-analytics";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";

type AnalyticsPageViewProps = {
  data: AnalyticsPageData;
};

function downloadCsv(data: AnalyticsPageData) {
  const lines = [
    ["Indicateur", data.primaryKpi.label, data.primaryKpi.formatted],
    [],
    ["Série", "Valeur"],
    ...data.series.map((row) => [row.label, String(row.value)]),
    [],
    ["Tableau", "Statut", "Localisation", "Valeur", "Lien"],
    ...data.table.map((row) => [
      row.title,
      row.status ?? "",
      row.location ?? "",
      row.value?.toString() ?? "",
      row.href,
    ]),
  ];
  const csv =
    "\uFEFF" +
    lines
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"),
      )
      .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = data.exportFilename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsPageView({ data }: AnalyticsPageViewProps) {
  const [showTable, setShowTable] = useState(true);
  const backHref = buildDashboardReturnHref(data.context);

  const option = useMemo(
    () => ({
      title: {
        text: data.title,
        left: 0,
        textStyle: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
      },
      legend: { top: 0, right: 0 },
      dataZoom: data.series.length > 8 ? [{ type: "inside" }, { type: "slider" }] : [],
      xAxis: {
        type: "category" as const,
        data: data.series.map((p) => p.label),
        axisLabel: { color: "#667085", fontSize: 11 },
      },
      yAxis: {
        type: "value" as const,
        axisLabel: { color: "#667085", fontSize: 11 },
        splitLine: { lineStyle: { color: "#eef2f6" } },
      },
      series: [
        {
          name: data.primaryKpi.label,
          type: "line" as const,
          smooth: true,
          symbolSize: 8,
          areaStyle: { opacity: 0.12 },
          itemStyle: { color: AFD_CHART_COLORS[0] },
          data: data.series.map((p) => p.value),
        },
        ...(data.series.some((p) => p.secondary != null)
          ? [
              {
                name: "Comparaison",
                type: "bar" as const,
                itemStyle: { color: AFD_CHART_COLORS[6], borderRadius: [6, 6, 0, 0] },
                data: data.series.map((p) => p.secondary ?? 0),
              },
            ]
          : []),
      ],
    }),
    [data],
  );

  return (
    <main className="space-y-5 p-4 md:p-6" data-analytics-page>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Retour au tableau de bord
          </Link>
          <h1 className="font-display text-2xl font-extrabold text-[var(--admin-text)]">
            {data.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--admin-muted)]">
            {data.description}
          </p>
          {data.context.sourceWidget ? (
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Source : {data.context.sourceWidget}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => downloadCsv(data)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm font-medium"
          >
            <Download className="size-4" aria-hidden />
            Exporter
          </button>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="inline-flex h-10 items-center rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm font-medium"
          >
            {showTable ? "Masquer le tableau" : "Afficher le tableau"}
          </button>
          {data.createHref ? (
            <Link
              href={data.createHref}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--admin-primary)] px-3 text-sm font-semibold text-white"
            >
              <Plus className="size-4" aria-hidden />
              Ajouter
            </Link>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-[var(--admin-border)] bg-white p-4 md:col-span-1">
          <p className="text-xs font-medium text-[var(--admin-muted)]">
            {data.primaryKpi.label}
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold text-[var(--admin-text)]">
            {data.primaryKpi.formatted}
          </p>
          {data.primaryKpi.variationPct != null ? (
            <p className="mt-1 text-xs font-semibold text-[var(--admin-green)]">
              {data.primaryKpi.variationPct} %
            </p>
          ) : null}
        </article>
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-3 md:col-span-3">
          {data.series.length === 0 ? (
            <ChartEmptyState />
          ) : (
            <div className="h-[320px]">
              <EChartsReact
                option={option}
                ariaLabel={`Graphique ${data.title}`}
              />
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { title: "Par province", rows: data.byProvince },
          { title: "Par secteur", rows: data.bySector },
          { title: "Par statut", rows: data.byStatus },
        ].map((block) => (
          <article
            key={block.title}
            className="rounded-2xl border border-[var(--admin-border)] bg-white p-4"
          >
            <h2 className="font-display text-sm font-bold">{block.title}</h2>
            {block.rows.length === 0 ? (
              <p className="mt-3 text-xs text-[var(--admin-muted)]">Aucune donnée</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {block.rows.slice(0, 8).map((row) => (
                  <li
                    key={row.name}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate text-[var(--admin-text)]">
                      {row.name}
                    </span>
                    <span className="font-display font-bold">
                      {row.value}
                      {typeof row.percent === "number" ? (
                        <span className="ml-1 text-xs font-medium text-[var(--admin-muted)]">
                          {row.percent}%
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      {showTable ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white">
          <div className="border-b border-[var(--admin-border)] px-4 py-3">
            <h2 className="font-display text-sm font-bold">Tableau détaillé</h2>
            <p className="sr-only">
              Vue tabulaire alternative au graphique pour l’accessibilité.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[var(--admin-muted)]">
                <tr>
                  <th className="px-4 py-2 font-medium">Libellé</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 font-medium">Localisation</th>
                  <th className="px-4 py-2 font-medium">Valeur</th>
                  <th className="px-4 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {data.table.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-[var(--admin-muted)]"
                    >
                      Aucune ligne pour cette sélection.
                    </td>
                  </tr>
                ) : (
                  data.table.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 font-medium">{row.title}</td>
                      <td className="px-4 py-2.5">{row.status ?? "—"}</td>
                      <td className="px-4 py-2.5">{row.location ?? "—"}</td>
                      <td className="px-4 py-2.5">{row.value ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          href={row.href}
                          className="font-semibold text-[var(--admin-primary)] hover:underline"
                        >
                          Ouvrir
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}
