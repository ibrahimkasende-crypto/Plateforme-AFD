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

describe("payroll rounding (démo)", () => {
  it("arrondit les montants à 2 décimales", () => {
    const result = calculatePayroll({
      baseSalary: 1234.567,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    expect(Number.isInteger(result.brut * 100)).toBe(true);
    expect(Number.isInteger(result.net * 100)).toBe(true);
    expect(Number.isInteger(result.retenues * 100)).toBe(true);
  });
});
