"use client";

import { ArrowDownRight, ArrowUpRight, HelpCircle, type LucideIcon } from "lucide-react";
import type { KpiValue } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type DashboardKpiCardProps = {
  kpi: KpiValue;
  icon: LucideIcon;
  iconClassName?: string;
};

export function DashboardKpiCard({
  kpi,
  icon: Icon,
  iconClassName,
}: DashboardKpiCardProps) {
  const variation = kpi.variationPct;
  const positive = variation !== null && variation >= 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full bg-[#0877d1]/10 text-[#0877d1]",
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
        {!kpi.available && kpi.tooltip ? (
          <span title={kpi.tooltip} className="text-slate-400">
            <HelpCircle className="size-4" aria-hidden />
            <span className="sr-only">{kpi.tooltip}</span>
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-slate-600">{kpi.label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
        {kpi.formatted}
      </p>

      {kpi.available && variation !== null ? (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-sm font-medium",
            positive ? "text-[#16a34a]" : "text-red-600",
          )}
        >
          {positive ? (
            <ArrowUpRight className="size-4" aria-hidden />
          ) : (
            <ArrowDownRight className="size-4" aria-hidden />
          )}
          {Math.abs(variation).toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          })}
          %
          <span className="font-normal text-slate-500">vs période préc.</span>
        </p>
      ) : !kpi.available ? (
        <p className="mt-2 text-xs text-slate-500" title={kpi.tooltip}>
          {kpi.tooltip ?? "Non disponible"}
        </p>
      ) : null}
    </article>
  );
}
