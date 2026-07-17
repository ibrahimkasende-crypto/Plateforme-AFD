"use client";

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
import type { BudgetComparisonPoint } from "@/features/statistiques/types/dashboard";

type BudgetComparisonChartProps = {
  data: BudgetComparisonPoint[];
};

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat("fr-FR").format(Number(value)),
            String(name),
          ]}
        />
        <Legend />
        <Bar
          dataKey="planned"
          name="Prévu"
          fill={AFD_CHART_COLORS[6]}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="actual"
          name="Dépensé"
          fill={AFD_CHART_COLORS[0]}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
