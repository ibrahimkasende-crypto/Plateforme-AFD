"use client";

import { useRouter } from "next/navigation";
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
import { DarkChartTooltip } from "@/components/charts/chart-tooltip";
import { chartTheme } from "@/components/charts/chart-theme";
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

function segmentFromName(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("femme")) return "femmes";
  if (value.includes("homme")) return "hommes";
  if (value.includes("enfant")) return "enfants";
  if (value.includes("jeune")) return "jeunes";
  return "total";
}

export function BeneficiaryEvolutionChart({
  data,
  accessibleSummary,
}: BeneficiaryEvolutionChartProps) {
  const router = useRouter();

  const open = (segment: string, mois?: string) => {
    const params = new URLSearchParams({
      segment,
      sourceWidget: "evolution-beneficiaires",
    });
    if (mois) params.set("mois", mois);
    router.push(`/admin/analyse/beneficiaires?${params.toString()}`);
  };

  return (
    <div className="h-full w-full">
      {accessibleSummary ? (
        <p className="sr-only">{accessibleSummary}</p>
      ) : null}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => {
            const label =
              state && typeof state === "object" && "activeLabel" in state
                ? String(state.activeLabel ?? "")
                : "";
            if (label) open("total", label);
          }}
        >
          <CartesianGrid
            strokeDasharray={chartTheme.grid.strokeDasharray}
            stroke={chartTheme.grid.stroke}
          />
          <XAxis dataKey="label" tick={chartTheme.axis.tick} />
          <YAxis tick={chartTheme.axis.tick} />
          <Tooltip
            content={<DarkChartTooltip />}
            cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
          />
          <Legend
            wrapperStyle={{ cursor: "pointer", fontSize: 11 }}
            onClick={(entry) => {
              const name =
                entry && typeof entry === "object" && "value" in entry
                  ? String(entry.value)
                  : "";
              if (name) open(segmentFromName(name));
            }}
          />
          {SERIES.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                onClick: (_event, payload) => {
                  const point = payload as { payload?: { label?: string } };
                  open(series.key, point.payload?.label);
                },
              }}
              animationDuration={chartTheme.animationDuration}
              style={{ cursor: "pointer" }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
