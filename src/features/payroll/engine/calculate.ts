/**
 * Moteur de paie — formules génériques.
 * Les taux viennent exclusivement des règles versionnées (DB), jamais des composants UI.
 */

export type PayrollComponentLine = {
  code: string;
  kind: "earning" | "deduction" | "employer_charge";
  amount: number;
  baseAmount?: number;
  rate?: number;
  formulaUsed: string;
  ruleCode?: string;
};

export type LegalRule = {
  code: string;
  rule_type: string;
  rate: number | null;
  formula: string | null;
  statut_validation: string;
  effective_from: string;
  effective_to: string | null;
};

export type CalculatePayrollInput = {
  baseSalary: number;
  transport?: number;
  overtimeHours?: number;
  hourlyRate?: number;
  advances?: number;
  loans?: number;
  absencesAmount?: number;
  rules: LegalRule[];
  asOf: string; // ISO date
  allowUnverifiedRules?: boolean; // démo uniquement
};

export type CalculatePayrollResult = {
  brut: number;
  retenues: number;
  net: number;
  coutEmployeur: number;
  lines: PayrollComponentLine[];
  anomalies: string[];
  usedUnverifiedRules: boolean;
};

function activeRules(rules: LegalRule[], asOf: string): LegalRule[] {
  return rules.filter((r) => {
    if (r.effective_from > asOf) return false;
    if (r.effective_to && r.effective_to < asOf) return false;
    return true;
  });
}

export function calculatePayroll(
  input: CalculatePayrollInput,
): CalculatePayrollResult {
  const anomalies: string[] = [];
  const lines: PayrollComponentLine[] = [];
  let usedUnverifiedRules = false;

  if (input.baseSalary <= 0) {
    anomalies.push("Salaire de base manquant ou invalide.");
  }

  const transport = input.transport ?? 0;
  const otHours = input.overtimeHours ?? 0;
  const hourly = input.hourlyRate ?? 0;
  const otRule = activeRules(input.rules, input.asOf).find(
    (r) => r.rule_type === "overtime",
  );
  const otFactor = otRule?.rate ?? 1.5;
  if (otRule && otRule.statut_validation !== "verified") {
    usedUnverifiedRules = true;
  }
  const overtime = otHours * hourly * otFactor;

  const brut = input.baseSalary + transport + overtime;

  lines.push({
    code: "BASE",
    kind: "earning",
    amount: input.baseSalary,
    formulaUsed: "base",
  });
  if (transport > 0) {
    lines.push({
      code: "TRANSPORT",
      kind: "earning",
      amount: transport,
      formulaUsed: "fixed",
    });
  }
  if (overtime > 0) {
    lines.push({
      code: "OVERTIME",
      kind: "earning",
      amount: round2(overtime),
      baseAmount: otHours * hourly,
      rate: otFactor,
      formulaUsed: "hours * hourly_rate * factor",
      ruleCode: otRule?.code,
    });
  }

  const socialEe = pickRule(input.rules, input.asOf, "social", "DEMO_CNSS_EE");
  const tax = pickRule(input.rules, input.asOf, "tax", "DEMO_TAX");
  const socialEr = pickRule(input.rules, input.asOf, "employer", "DEMO_CNSS_ER");

  for (const rule of [socialEe, tax, socialEr]) {
    if (rule && rule.statut_validation !== "verified") {
      usedUnverifiedRules = true;
      if (!input.allowUnverifiedRules) {
        anomalies.push(
          `Règle ${rule.code} non vérifiée — calcul démo uniquement.`,
        );
      }
    }
  }

  if (!socialEe || !tax) {
    anomalies.push("Règle fiscale ou sociale absente pour la période.");
  }

  const cnssEe = brut * (socialEe?.rate ?? 0);
  const taxable = brut - cnssEe;
  const taxAmount = taxable * (tax?.rate ?? 0);
  const advances = input.advances ?? 0;
  const loans = input.loans ?? 0;
  const absences = input.absencesAmount ?? 0;

  const retenues = cnssEe + taxAmount + advances + loans + absences;
  const net = brut - retenues;
  const cnssEr = brut * (socialEr?.rate ?? 0);
  const coutEmployeur = brut + cnssEr;

  lines.push({
    code: "CNSS_EE",
    kind: "deduction",
    amount: round2(cnssEe),
    baseAmount: brut,
    rate: socialEe?.rate ?? 0,
    formulaUsed: socialEe?.formula || "brut * rate",
    ruleCode: socialEe?.code,
  });
  lines.push({
    code: "TAX_EE",
    kind: "deduction",
    amount: round2(taxAmount),
    baseAmount: taxable,
    rate: tax?.rate ?? 0,
    formulaUsed: tax?.formula || "taxable * rate",
    ruleCode: tax?.code,
  });
  if (advances > 0) {
    lines.push({
      code: "ADVANCE",
      kind: "deduction",
      amount: advances,
      formulaUsed: "advance",
    });
  }
  if (loans > 0) {
    lines.push({
      code: "LOAN",
      kind: "deduction",
      amount: loans,
      formulaUsed: "loan",
    });
  }
  if (absences > 0) {
    lines.push({
      code: "ABSENCE",
      kind: "deduction",
      amount: absences,
      formulaUsed: "absence",
    });
  }
  lines.push({
    code: "CNSS_ER",
    kind: "employer_charge",
    amount: round2(cnssEr),
    baseAmount: brut,
    rate: socialEr?.rate ?? 0,
    formulaUsed: socialEr?.formula || "brut * rate",
    ruleCode: socialEr?.code,
  });

  if (net < 0) anomalies.push("Salaire net négatif.");
  if (retenues > brut) anomalies.push("Retenues supérieures au brut.");

  return {
    brut: round2(brut),
    retenues: round2(retenues),
    net: round2(net),
    coutEmployeur: round2(coutEmployeur),
    lines,
    anomalies,
    usedUnverifiedRules,
  };
}

function pickRule(
  rules: LegalRule[],
  asOf: string,
  type: string,
  preferredCode?: string,
): LegalRule | undefined {
  const list = activeRules(rules, asOf).filter((r) => r.rule_type === type);
  if (preferredCode) {
    const preferred = list.find((r) => r.code === preferredCode);
    if (preferred) return preferred;
  }
  return list[0];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
