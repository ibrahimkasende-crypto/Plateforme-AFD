"use client";

import { useRouter } from "next/navigation";
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
import { DarkChartTooltip } from "@/components/charts/chart-tooltip";
import type { NamedCount } from "@/features/statistiques/types/dashboard";

type ProjectStatusChartProps = {
  data: NamedCount[];
};

function statusToQuery(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("cours")) return "actif";
  if (value.includes("planif")) return "planifie";
  if (value.includes("termin")) return "termine";
  if (value.includes("suspend")) return "suspendu";
  if (value.includes("archiv")) return "archive";
  return encodeURIComponent(name.toLowerCase());
}

function openStatusAnalyse(router: ReturnType<typeof useRouter>, name: string) {
  const statut = statusToQuery(name);
  router.push(
    `/admin/analyse/projets?vue=statuts&statut=${statut}&sourceWidget=projets-statut`,
  );
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const router = useRouter();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="48%"
          outerRadius="72%"
          paddingAngle={2}
          label={false}
          style={{ cursor: "pointer" }}
          onClick={(entry) => {
            const name =
              entry && typeof entry === "object" && "name" in entry
                ? String(entry.name)
                : null;
            if (!name) return;
            openStatusAnalyse(router, name);
          }}
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
                  <tspan
                    x={cx}
                    y={(cy ?? 0) - 2}
                    fill="var(--admin-text)"
                    fontSize={20}
                    fontWeight={800}
                    fontFamily="var(--font-heading), Manrope, sans-serif"
                  >
                    {total}
                  </tspan>
                  <tspan
                    x={cx}
                    y={(cy ?? 0) + 14}
                    fill="var(--admin-muted)"
                    fontSize={11}
                  >
                    Projets
                  </tspan>
                </text>
              );
            }}
            position="center"
          />
        </Pie>
        <Tooltip content={<DarkChartTooltip />} />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          wrapperStyle={{ fontSize: 11, paddingLeft: 4, cursor: "pointer" }}
          onClick={(entry) => {
            const name =
              entry && typeof entry === "object" && "value" in entry
                ? String(entry.value)
                : null;
            if (!name) return;
            openStatusAnalyse(router, name);
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
