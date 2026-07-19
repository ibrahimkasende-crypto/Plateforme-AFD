import { describe, expect, it } from "vitest";
import { calculatePayroll, type LegalRule } from "@/features/payroll/engine/calculate";

const DEMO_RULES: LegalRule[] = [
  {
    code: "DEMO_CNSS_EE",
    rule_type: "social",
    rate: 0.035,
    formula: "brut * rate",
    statut_validation: "draft",
    effective_from: "2026-01-01",
    effective_to: null,
  },
  {
    code: "DEMO_TAX",
    rule_type: "tax",
    rate: 0.1,
    formula: "taxable * rate",
    statut_validation: "draft",
    effective_from: "2026-01-01",
    effective_to: null,
  },
  {
    code: "DEMO_CNSS_ER",
    rule_type: "employer",
    rate: 0.09,
    formula: "brut * rate",
    statut_validation: "draft",
    effective_from: "2026-01-01",
    effective_to: null,
  },
];

describe("payroll social contributions (démo)", () => {
  it("calcule cotisations employé et employeur", () => {
    const result = calculatePayroll({
      baseSalary: 2000,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    const ee = result.lines.find((l) => l.code === "CNSS_EE");
    const er = result.lines.find((l) => l.code === "CNSS_ER");
    expect(ee!.amount).toBeCloseTo(2000 * 0.035, 2);
    expect(er!.amount).toBeCloseTo(2000 * 0.09, 2);
  });
});
