export type ImpactStatFormat = "number" | "percent" | "plus-de";

const FORMAT_BY_KEY: Record<string, ImpactStatFormat> = {
  femmesAccompagnees: "percent",
  activitesRealisees: "plus-de",
};

export function getImpactStatFormat(key: string): ImpactStatFormat {
  return FORMAT_BY_KEY[key] ?? "number";
}

export function formatImpactStatValue(
  key: string,
  value: number,
): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(value);
  const format = getImpactStatFormat(key);

  switch (format) {
    case "percent":
      return `${formatted}\u00a0%`;
    case "plus-de":
      return `Plus de ${formatted}`;
    default:
      return formatted;
  }
}
