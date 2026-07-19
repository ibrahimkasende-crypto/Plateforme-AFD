"use client";

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
import { DarkChartTooltip } from "@/components/charts/chart-tooltip";
import type { ProvinceBeneficiaries } from "@/features/statistiques/types/dashboard";

type BeneficiariesByProvinceChartProps = {
  data: ProvinceBeneficiaries[];
  description?: string;
};

export function BeneficiariesByProvinceChart({
  data,
  description,
}: BeneficiariesByProvinceChartProps) {
  return (
    <div className="h-full w-full">
      {description ? (
        <p className="mb-2 text-xs text-slate-500">{description}</p>
      ) : null}
      <ResponsiveContainer width="100%" height={description ? "92%" : "100%"}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Tooltip
            content={<DarkChartTooltip />}
            cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
          />
          <Bar dataKey="value" name="Bénéficiaires" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={AFD_CHART_COLORS[index % AFD_CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
