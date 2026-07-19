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

describe("payroll tax rules (démo)", () => {
  it("applique la retenue fiscale sur base imposable après CNSS", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    const taxLine = result.lines.find((l) => l.code === "TAX_EE");
    expect(taxLine).toBeDefined();
    const cnssEe = 1000 * 0.035;
    const expectedTax = (1000 - cnssEe) * 0.1;
    expect(taxLine!.amount).toBeCloseTo(expectedTax, 2);
  });

  it("refuse les règles non vérifiées sans allowUnverifiedRules", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: false,
    });
    expect(
      result.anomalies.some((a) => a.includes("non vérifiée")),
    ).toBe(true);
  });
});
