import "server-only";

export type BeneficiaireAgregatRow = {
  periode: string;
  province?: string;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
};

export function parseBeneficiairesCsv(content: string): {
  rows: BeneficiaireAgregatRow[];
  duplicates: string[];
  errors: string[];
} {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return { rows: [], duplicates: [], errors: ["Fichier vide"] };
  }

  const header = lines[0].toLowerCase();
  const hasHeader =
    header.includes("periode") || header.includes("période") || header.includes("province");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: BeneficiaireAgregatRow[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const cols = dataLines[i].split(/[;,]/).map((c) => c.trim());
    if (cols.length < 2) {
      errors.push(`Ligne ${i + 1}: colonnes insuffisantes`);
      continue;
    }
    const periode = cols[0];
    const province = cols[1] || undefined;
    const femmes = Number(cols[2] ?? 0);
    const hommes = Number(cols[3] ?? 0);
    const enfants = Number(cols[4] ?? 0);
    const jeunes = Number(cols[5] ?? 0);
    if (!periode || Number.isNaN(femmes + hommes + enfants + jeunes)) {
      errors.push(`Ligne ${i + 1}: valeurs invalides`);
      continue;
    }
    const key = `${periode}|${province ?? ""}`;
    if (seen.has(key)) {
      duplicates.push(key);
      continue;
    }
    seen.add(key);
    rows.push({ periode, province, femmes, hommes, enfants, jeunes });
  }

  return { rows, duplicates, errors };
}
