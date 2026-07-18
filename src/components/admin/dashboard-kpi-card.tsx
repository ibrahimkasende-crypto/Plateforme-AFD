"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { KpiValue } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type DashboardKpiCardProps = {
  kpi: KpiValue;
  icon: LucideIcon;
  iconBgClassName?: string;
  href?: string;
};

export function DashboardKpiCard({
  kpi,
  icon: Icon,
  iconBgClassName = "bg-[var(--admin-blue)]",
  href,
}: DashboardKpiCardProps) {
  const variation = kpi.variationPct;
  const positive = variation !== null && variation >= 0;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white sm:size-12",
            iconBgClassName,
          )}
        >
          <Icon className="size-6" strokeWidth={2} aria-hidden />
        </div>
        {!kpi.available && kpi.tooltip ? (
          <span title={kpi.tooltip} className="text-[var(--admin-muted)]">
            <HelpCircle className="size-3.5" aria-hidden />
            <span className="sr-only">{kpi.tooltip}</span>
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-[12px] font-medium leading-tight text-[var(--admin-muted)]">
        {kpi.label}
      </p>
      <p className="mt-0.5 font-display text-[26px] font-extrabold leading-none tracking-tight text-[var(--admin-text)] sm:text-[28px]">
        {kpi.formatted}
      </p>

      {kpi.available && variation !== null ? (
        <p
          className={cn(
            "mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-bold",
            positive ? "text-[var(--admin-green)]" : "text-[var(--admin-red)]",
          )}
        >
          {positive ? (
            <ArrowUpRight className="size-3.5" aria-hidden />
          ) : (
            <ArrowDownRight className="size-3.5" aria-hidden />
          )}
          {positive ? "+" : "−"}
          {Math.abs(variation).toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          })}
          %
          <span className="ml-0.5 font-medium text-[var(--admin-muted)]">
            vs préc.
          </span>
        </p>
      ) : !kpi.available ? (
        <p className="mt-1.5 text-[11px] text-[var(--admin-muted)]" title={kpi.tooltip}>
          {kpi.tooltip ?? "Non disponible"}
        </p>
      ) : null}
    </>
  );

  const className =
    "admin-panel block h-full transition hover:border-[var(--admin-primary)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)]";

  if (href) {
    return (
      <Link href={href} className={className} aria-label={`${kpi.label}: ${kpi.formatted}`}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
