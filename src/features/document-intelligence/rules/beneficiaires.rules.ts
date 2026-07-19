import type { AnomalyLevel } from "@/features/document-intelligence/types";

export type BeneficiairesRuleFinding = {
  code: string;
  level: AnomalyLevel;
  message: string;
  fieldNames: string[];
};

export function checkBeneficiairesConsistency(input: {
  total?: number | null;
  categoriesSum?: number | null;
  periodDuplicate?: boolean;
}): BeneficiairesRuleFinding[] {
  const findings: BeneficiairesRuleFinding[] = [];

  if (
    input.total != null &&
    input.categoriesSum != null &&
    input.categoriesSum > input.total
  ) {
    findings.push({
      code: "beneficiaires.category_over_total",
      level: "high",
      message: "Somme des catégories supérieure au total.",
      fieldNames: ["categories", "total"],
    });
  }

  if (input.periodDuplicate) {
    findings.push({
      code: "beneficiaires.period_duplicate",
      level: "warning",
      message: "Période déjà couverte par un rapport approuvé.",
      fieldNames: ["periode_debut", "periode_fin"],
    });
  }

  return findings;
}
