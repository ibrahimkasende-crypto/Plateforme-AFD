import type { ProvinceIntensity } from "@/features/intervention-zones/types/intervention-zone";

export function computeIntensity(projectCount: number): ProvinceIntensity {
  if (projectCount <= 0) return "none";
  if (projectCount === 1) return "low";
  if (projectCount <= 3) return "medium";
  return "high";
}

export function intensityFill(intensity: ProvinceIntensity): string {
  switch (intensity) {
    case "high":
      return "#0565b4";
    case "medium":
      return "#0877d1";
    case "low":
      return "#3ba3e6";
    default:
      /* Provinces hors couverture AFD — neutre, peu saturé */
      return "#edf1f5";
  }
}

export function intensityStroke(
  intensity: ProvinceIntensity,
  selected: boolean,
  hovered: boolean,
): string {
  if (selected) return "#031b3c";
  if (hovered && intensity !== "none") return "#e99308";
  if (hovered) return "#062653";
  if (intensity === "none") return "#b7c5d4";
  return "#ffffff";
}
