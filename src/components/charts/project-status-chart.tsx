"use client";

import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import type { NamedCount } from "@/features/statistiques/types/dashboard";

type ProjectStatusChartProps = {
  data: NamedCount[];
};

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={2}
          label={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? AFD_CHART_COLORS[index % AFD_CHART_COLORS.length]}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
              const { cx, cy } = viewBox;
              return (
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={cx} y={(cy ?? 0) - 4} fill="#0f172a" fontSize={24} fontWeight={600}>
                    {total}
                  </tspan>
                  <tspan x={cx} y={(cy ?? 0) + 16} fill="#64748b" fontSize={12}>
                    projets
                  </tspan>
                </text>
              );
            }}
            position="center"
          />
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
