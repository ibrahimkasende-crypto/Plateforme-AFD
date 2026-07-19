"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import { DarkChartTooltip } from "@/components/charts/chart-tooltip";
import { chartTheme } from "@/components/charts/chart-theme";
import type { BudgetComparisonPoint } from "@/features/statistiques/types/dashboard";

type BudgetComparisonChartProps = {
  data: BudgetComparisonPoint[];
};

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  const router = useRouter();

  const open = (mois?: string) => {
    const params = new URLSearchParams({
      vue: "depenses",
      sourceWidget: "budget-compare",
    });
    if (mois) params.set("mois", mois);
    router.push(`/admin/analyse/finances?${params.toString()}`);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        onClick={(state) => {
          const label =
            state && typeof state === "object" && "activeLabel" in state
              ? String(state.activeLabel ?? "")
              : "";
          if (label) open(label);
        }}
      >
        <CartesianGrid
          strokeDasharray={chartTheme.grid.strokeDasharray}
          stroke={chartTheme.grid.stroke}
        />
        <XAxis dataKey="label" tick={chartTheme.axis.tick} />
        <YAxis tick={chartTheme.axis.tick} />
        <Tooltip
          content={
            <DarkChartTooltip
              valueFormatter={(value) =>
                new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
          }
          cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar
          dataKey="planned"
          name="Prévu"
          fill={AFD_CHART_COLORS[6]}
          radius={[6, 6, 0, 0]}
          cursor="pointer"
          animationDuration={chartTheme.animationDuration}
          onClick={(entry) => {
            const payload =
              entry && typeof entry === "object" && "payload" in entry
                ? (entry.payload as { label?: string })
                : null;
            open(payload?.label);
          }}
        />
        <Bar
          dataKey="actual"
          name="Dépensé"
          fill={AFD_CHART_COLORS[0]}
          radius={[6, 6, 0, 0]}
          cursor="pointer"
          animationDuration={chartTheme.animationDuration}
          onClick={(entry) => {
            const payload =
              entry && typeof entry === "object" && "payload" in entry
                ? (entry.payload as { label?: string })
                : null;
            open(payload?.label);
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
