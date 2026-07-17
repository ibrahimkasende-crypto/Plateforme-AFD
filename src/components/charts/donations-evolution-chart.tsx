"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import type { ChartTimedValue } from "@/components/charts/chart-colors";

type DonationsEvolutionChartProps = {
  data: ChartTimedValue[];
};

export function DonationsEvolutionChart({ data }: DonationsEvolutionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          name="Dons"
          stroke={AFD_CHART_COLORS[4]}
          fill={AFD_CHART_COLORS[4]}
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
