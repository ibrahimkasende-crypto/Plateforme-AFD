import type { AnomalyLevel } from "@/features/document-intelligence/types";
import { normalizeAmount } from "@/features/document-intelligence/utils/normalize";

export type RuleFinding = {
  code: string;
  level: AnomalyLevel;
  message: string;
  fieldNames: string[];
};

function num(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number") return raw;
  const n = normalizeAmount(String(raw)).amount;
  return Number.isNaN(n) ? null : n;
}

export function checkFinanceConsistency(input: {
  budgetPrevu?: string | number | null;
  depenses?: string | number | null;
  solde?: string | number | null;
  lineAmounts?: Array<string | number>;
  totalDeclare?: string | number | null;
  percentage?: string | number | null;
}): RuleFinding[] {
  const findings: RuleFinding[] = [];
  const budget = num(input.budgetPrevu);
  const depenses = num(input.depenses);
  const solde = num(input.solde);
  const total = num(input.totalDeclare);

  if (budget != null && depenses != null && depenses > budget) {
    findings.push({
      code: "finance.budget_overflow",
      level: "high",
      message: "Les dépenses dépassent le budget prévu.",
      fieldNames: ["budget_prevu", "depenses"],
    });
  }

  if (budget != null && depenses != null && solde != null) {
    const expected = Math.round((budget - depenses) * 100) / 100;
    if (Math.abs(expected - solde) > 0.05) {
      findings.push({
        code: "finance.solde_incorrect",
        level: "critical",
        message: `Solde incorrect (attendu ${expected}, trouvé ${solde}).`,
        fieldNames: ["budget_prevu", "depenses", "solde"],
      });
    }
  }

  if (input.lineAmounts?.length && total != null) {
    const sum = input.lineAmounts.reduce<number>((acc, v) => {
      const n = num(v);
      return acc + (n ?? 0);
    }, 0);
    if (Math.abs(sum - total) > 0.05) {
      findings.push({
        code: "finance.lines_total_mismatch",
        level: "critical",
        message: `Somme des lignes (${sum}) différente du total déclaré (${total}).`,
        fieldNames: ["lignes", "montant_total"],
      });
    }
  }

  const pct = num(input.percentage);
  if (pct != null && pct > 100) {
    findings.push({
      code: "finance.percentage_over_100",
      level: "warning",
      message: "Pourcentage supérieur à 100.",
      fieldNames: ["pourcentage"],
    });
  }

  if (depenses != null && depenses < 0) {
    findings.push({
      code: "finance.negative_amount",
      level: "high",
      message: "Montant de dépense négatif impossible.",
      fieldNames: ["depenses"],
    });
  }

  return findings;
}
