"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#1a5c45", "#2d7a5a", "#d4af37", "#0f3d2e", "#7c9a8e", "#c45c26"];

export type NamedValue = { name: string; value: number };
export type TimedValue = { label: string; value: number };
export type ComparisonPoint = { label: string; planned: number; actual: number };
export type DualSeriesPoint = { label: string; a: number; b?: number };

export function BeneficiaryEvolutionChart({ data }: { data: TimedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1a5c45"
          fill="#1a5c45"
          fillOpacity={0.2}
          name="Bénéficiaires"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProjectStatusChart({ data }: { data: NamedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProjectSectorChart({ data }: { data: NamedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#2d7a5a" name="Projets" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BeneficiariesByProvinceChart({ data }: { data: NamedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#0f3d2e" name="Bénéficiaires" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyActivitiesChart({ data }: { data: TimedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#d4af37" name="Activités" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BudgetComparisonChart({ data }: { data: ComparisonPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned" fill="#7c9a8e" name="Prévu" radius={[6, 6, 0, 0]} />
        <Bar dataKey="actual" fill="#1a5c45" name="Dépensé" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function NewsletterGrowthChart({ data }: { data: TimedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2d7a5a"
          strokeWidth={2}
          name="Abonnés"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DonationsEvolutionChart({ data }: { data: TimedValue[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#c45c26"
          fill="#c45c26"
          fillOpacity={0.2}
          name="Dons"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function IndicatorProgressChart({ data }: { data: ComparisonPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned" fill="#94a3b8" name="Prévu" radius={[6, 6, 0, 0]} />
        <Bar dataKey="actual" fill="#1a5c45" name="Réalisé" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
