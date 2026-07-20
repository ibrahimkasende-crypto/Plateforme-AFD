"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
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
  const displayValue =
    kpi.available && kpi.value !== null
      ? kpi.formatted
      : kpi.formatted && kpi.formatted !== "—"
        ? kpi.formatted
        : "0";

  const content = (
    <div className="flex h-full min-h-0 items-center gap-1.5 sm:gap-2.5" data-kpi-card>
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white sm:size-9",
          iconBgClassName,
        )}
      >
        <Icon className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium leading-tight text-[var(--admin-muted)] sm:text-[11px]">
          {kpi.label}
        </p>
        <p className="admin-kpi-value font-display text-[14px] font-extrabold leading-none tracking-tight text-[var(--admin-text)] sm:text-[22px]">
          {displayValue}
        </p>
        {kpi.available && variation !== null ? (
          <p
            className={cn(
              "mt-0.5 inline-flex items-center gap-0.5 text-[9px] font-bold sm:text-[10px]",
              positive ? "text-[var(--admin-green)]" : "text-[var(--admin-red)]",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3" aria-hidden />
            )}
            {positive ? "+" : "−"}
            {Math.abs(variation).toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            })}
            %
          </p>
        ) : null}
      </div>
    </div>
  );

  const className =
    "admin-panel block h-full !py-1.5 sm:!py-2 transition hover:border-[var(--admin-primary)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)]";

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-label={`${kpi.label}: ${displayValue}`}
      >
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
