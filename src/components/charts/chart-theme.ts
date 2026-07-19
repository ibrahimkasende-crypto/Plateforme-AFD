import { AFD_CHART_COLORS } from "@/components/charts/chart-colors";

export const chartTheme = {
  colors: AFD_CHART_COLORS,
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  headingFontFamily: 'Manrope, Inter, sans-serif',
  axis: {
    tick: { fontSize: 11, fill: "#667085" },
    stroke: "#e2e8f0",
  },
  grid: {
    stroke: "#eef2f6",
    strokeDasharray: "3 3",
  },
  animationDuration: 360,
  borderRadius: 8,
  tooltip: {
    background: "#0f172a",
    border: "rgba(148, 163, 184, 0.35)",
    radius: 12,
    color: "#f8fafc",
  },
} as const;

export const echartsBaseOption = {
  color: [...AFD_CHART_COLORS],
  textStyle: {
    fontFamily: chartTheme.fontFamily,
    color: "#334155",
  },
  animationDuration: chartTheme.animationDuration,
  grid: {
    left: 48,
    right: 24,
    top: 40,
    bottom: 48,
    containLabel: true,
  },
  tooltip: {
    trigger: "axis" as const,
    backgroundColor: chartTheme.tooltip.background,
    borderColor: chartTheme.tooltip.border,
    borderWidth: 1,
    textStyle: { color: chartTheme.tooltip.color, fontSize: 12 },
    extraCssText: `border-radius:${chartTheme.tooltip.radius}px;box-shadow:0 12px 28px rgba(15,23,42,.45);`,
  },
};
