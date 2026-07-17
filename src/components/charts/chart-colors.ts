export const AFD_CHART_COLORS = [
  "#0877d1",
  "#2563eb",
  "#0d254e",
  "#16a34a",
  "#f97316",
  "#7c3aed",
  "#94a3b8",
] as const;

export type ChartTimedValue = { label: string; value: number };
export type ChartNamedValue = { name: string; value: number; color?: string };
export type ChartComparisonPoint = {
  label: string;
  planned: number;
  actual: number;
};
