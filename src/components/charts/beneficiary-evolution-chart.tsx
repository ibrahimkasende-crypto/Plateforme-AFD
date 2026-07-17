"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import type { BeneficiaryEvolutionPoint } from "@/features/statistiques/types/dashboard";

type BeneficiaryEvolutionChartProps = {
  data: BeneficiaryEvolutionPoint[];
  accessibleSummary?: string;
};

const SERIES = [
  { key: "femmes" as const, label: "Femmes", color: AFD_CHART_COLORS[0] },
  { key: "hommes" as const, label: "Hommes", color: AFD_CHART_COLORS[1] },
  { key: "enfants" as const, label: "Enfants", color: AFD_CHART_COLORS[3] },
  { key: "jeunes" as const, label: "Jeunes", color: AFD_CHART_COLORS[5] },
];

export function BeneficiaryEvolutionChart({
  data,
  accessibleSummary,
}: BeneficiaryEvolutionChartProps) {
  return (
    <div className="h-full w-full">
      {accessibleSummary ? (
        <p className="sr-only">{accessibleSummary}</p>
      ) : null}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Legend />
          {SERIES.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
