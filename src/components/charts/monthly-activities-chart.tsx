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
  const router = useRouter();

  const open = (type?: string, mois?: string) => {
    const params = new URLSearchParams({ sourceWidget: "activites-mois" });
    if (type) params.set("type", type);
    if (mois) params.set("mois", mois);
    router.push(`/admin/analyse/activites?${params.toString()}`);
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
          if (label) open(undefined, label);
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
          cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
        />
        <Legend
          wrapperStyle={{ cursor: "pointer", fontSize: 11 }}
          onClick={(entry) => {
            const name =
              entry && typeof entry === "object" && "value" in entry
                ? String(entry.value)
                : "";
            if (name) open(name.toLowerCase());
          }}
        />
        {STACK_KEYS.map((series, index, arr) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.label}
            stackId="activities"
            fill={series.color}
            radius={index === arr.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
            cursor="pointer"
            animationDuration={chartTheme.animationDuration}
            onClick={(entry) => {
              const payload =
                entry && typeof entry === "object" && "payload" in entry
                  ? (entry.payload as { label?: string })
                  : null;
              open(series.label.toLowerCase(), payload?.label);
            }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
