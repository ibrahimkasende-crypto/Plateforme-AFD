"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Styles Recharts pour un tooltip sombre à coins arrondis. */
export const DARK_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.35)",
    borderRadius: 12,
    padding: "8px 12px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.45)",
    color: "#f8fafc",
  },
  labelStyle: {
    color: "#f8fafc",
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 4,
  },
  itemStyle: {
    color: "#e2e8f0",
    fontSize: 11,
    padding: "1px 0",
  },
  cursor: { fill: "rgba(15, 23, 42, 0.06)" },
} as const;

type ChartTooltipShellProps = {
  children: ReactNode;
  className?: string;
};

/** Conteneur commun pour tooltips custom (contenu React). */
export function ChartTooltipShell({
  children,
  className,
}: ChartTooltipShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-600/60 bg-slate-900 px-3 py-2 text-[11px] text-slate-100 shadow-[0_12px_28px_rgba(15,23,42,0.45)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PayloadItem = {
  name?: string | number;
  value?: string | number | Array<string | number>;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

type DarkChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: PayloadItem[];
  valueFormatter?: (value: number, name: string) => string;
};

function formatDefault(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** Tooltip générique sombre pour les graphiques Recharts. */
export function DarkChartTooltip({
  active,
  label,
  payload,
  valueFormatter,
}: DarkChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <ChartTooltipShell>
      {label != null && String(label) !== "" ? (
        <p className="mb-1.5 font-semibold text-white">{label}</p>
      ) : null}
      <ul className="space-y-1">
        {payload.map((item, index) => {
          const name = String(item.name ?? item.dataKey ?? "");
          const raw = Array.isArray(item.value) ? item.value[0] : item.value;
          const num = Number(raw);
          const display =
            valueFormatter && Number.isFinite(num)
              ? valueFormatter(num, name)
              : Number.isFinite(num)
                ? formatDefault(num)
                : String(raw ?? "—");

          return (
            <li
              key={`${name}-${index}`}
              className="flex items-center gap-2 text-slate-200"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? "#94a3b8" }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-slate-300">
                {name}
              </span>
              <span className="shrink-0 font-semibold text-white">{display}</span>
            </li>
          );
        })}
      </ul>
    </ChartTooltipShell>
  );
}
