"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";
import type { NamedCount } from "@/features/statistiques/types/dashboard";

type ProjectSectorChartProps = {
  data: NamedCount[];
};

export function ProjectSectorChart({ data }: ProjectSectorChartProps) {
  const router = useRouter();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 10, left: 0, bottom: 2 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: "#667085" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={108}
          tick={{ fontSize: 10, fill: "#667085" }}
        />
        <Tooltip />
        <Bar
          dataKey="value"
          name="Projets"
          radius={[0, 6, 6, 0]}
          cursor="pointer"
          onClick={(entry) => {
            const name =
              entry && typeof entry === "object" && "name" in entry
                ? String(entry.name)
                : null;
            if (!name) return;
            router.push(
              `/admin/projets?secteur=${encodeURIComponent(name)}`,
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? AFD_CHART_COLORS[index % AFD_CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
