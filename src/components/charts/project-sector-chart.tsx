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
import { ChartTooltipShell } from "@/components/charts/chart-tooltip";
import type { NamedCount } from "@/features/statistiques/types/dashboard";
import { slugify } from "@/lib/slugify";

type ProjectSectorChartProps = {
  data: NamedCount[];
};

type TipProps = {
  active?: boolean;
  payload?: Array<{ payload: NamedCount }>;
};

function SectorTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <ChartTooltipShell>
      <p className="font-semibold text-white">{row.name}</p>
      <p className="mt-0.5 text-slate-300">
        {row.value} projet{row.value > 1 ? "s" : ""}
        {typeof row.percent === "number" ? ` · ${row.percent} %` : ""}
      </p>
    </ChartTooltipShell>
  );
}

export function ProjectSectorChart({ data }: ProjectSectorChartProps) {
  const router = useRouter();

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 10, left: 0, bottom: 2 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#667085" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={118}
          tick={{ fontSize: 9.5, fill: "#667085" }}
        />
        <Tooltip content={<SectorTooltip />} />
        <Bar
          dataKey="value"
          name="Projets"
          radius={[0, 6, 6, 0]}
          cursor="pointer"
          onClick={(entry) => {
            const payload =
              entry && typeof entry === "object" && "payload" in entry
                ? (entry.payload as NamedCount)
                : null;
            const name = payload?.name;
            if (!name) return;
            const slug = slugify(name);
            router.push(
              `/admin/analyse/secteurs/${encodeURIComponent(slug)}?sourceWidget=projets-secteur`,
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
