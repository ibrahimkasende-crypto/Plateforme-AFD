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
import type { ChartComparisonPoint } from "@/components/charts/chart-colors";

type IndicatorProgressChartProps = {
  data: ChartComparisonPoint[];
};

export function IndicatorProgressChart({ data }: IndicatorProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="planned"
          name="Prévu"
          fill={AFD_CHART_COLORS[6]}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="actual"
          name="Réalisé"
          fill={AFD_CHART_COLORS[2]}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
