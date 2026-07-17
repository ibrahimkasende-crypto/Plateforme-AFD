import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { SecondaryStat } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type DashboardBottomStatsProps = {
  stats: SecondaryStat[];
  className?: string;
};

export function DashboardBottomStats({
  stats,
  className,
}: DashboardBottomStatsProps) {
  if (stats.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
        Aucune statistique secondaire disponible.
      </p>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {stats.map((stat) => {
        const variation = stat.variationPct;
        const positive = variation !== null && variation !== undefined && variation >= 0;

        return (
          <Link
            key={stat.id}
            href={stat.href}
            className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-slate-200 hover:bg-white"
          >
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-slate-900">
              {stat.formatted}
            </p>
            {stat.available && variation !== null && variation !== undefined ? (
              <p
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-xs font-medium",
                  positive ? "text-[#16a34a]" : "text-red-600",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-3.5" aria-hidden />
                ) : (
                  <ArrowDownRight className="size-3.5" aria-hidden />
                )}
                {Math.abs(variation).toLocaleString("fr-FR", {
                  maximumFractionDigits: 1,
                })}
                %
              </p>
            ) : !stat.available ? (
              <p className="mt-1 text-xs text-slate-500">Non disponible</p>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
