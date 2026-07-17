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
import type { MonthlyActivityPoint } from "@/features/statistiques/types/dashboard";

type MonthlyActivitiesChartProps = {
  data: MonthlyActivityPoint[];
};

const STACK_KEYS = [
  { key: "formations" as const, label: "Formations", color: AFD_CHART_COLORS[0] },
  {
    key: "sensibilisations" as const,
    label: "Sensibilisations",
    color: AFD_CHART_COLORS[1],
  },
  {
    key: "distributions" as const,
    label: "Distributions",
    color: AFD_CHART_COLORS[3],
  },
  { key: "reunions" as const, label: "Réunions", color: AFD_CHART_COLORS[4] },
  { key: "missions" as const, label: "Missions", color: AFD_CHART_COLORS[5] },
  { key: "autres" as const, label: "Autres", color: AFD_CHART_COLORS[6] },
];

export function MonthlyActivitiesChart({ data }: MonthlyActivitiesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip />
        <Legend />
        {STACK_KEYS.map((series) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.label}
            stackId="activities"
            fill={series.color}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
