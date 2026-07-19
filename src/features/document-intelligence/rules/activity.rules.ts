import type { AnomalyLevel } from "@/features/document-intelligence/types";

export type ActivityRuleFinding = {
  code: string;
  level: AnomalyLevel;
  message: string;
  fieldNames: string[];
};

export function checkActivityConsistency(input: {
  femmes?: number | null;
  hommes?: number | null;
  filles?: number | null;
  garcons?: number | null;
  total?: number | null;
  hasProjet?: boolean;
}): ActivityRuleFinding[] {
  const findings: ActivityRuleFinding[] = [];
  const { femmes, hommes, filles, garcons, total, hasProjet } = input;

  const parts = [femmes, hommes, filles, garcons].filter(
    (v): v is number => v != null,
  );
  if (parts.length === 4 && total != null) {
    const sum = parts.reduce((a, b) => a + b, 0);
    if (sum !== total) {
      findings.push({
        code: "activity.total_mismatch",
        level: "critical",
        message: `Total bénéficiaires (${total}) ≠ femmes+hommes+filles+garçons (${sum}).`,
        fieldNames: ["femmes", "hommes", "filles", "garcons", "total"],
      });
    }
  }

  if (hasProjet === false) {
    findings.push({
      code: "activity.missing_project",
      level: "warning",
      message: "Activité sans projet associé.",
      fieldNames: ["projet_id"],
    });
  }

  if (total != null && total > 50000) {
    findings.push({
      code: "activity.abnormally_high",
      level: "warning",
      message:
        "Effectif anormalement élevé — à vérifier (information, non accusation).",
      fieldNames: ["total"],
    });
  }

  return findings;
}
