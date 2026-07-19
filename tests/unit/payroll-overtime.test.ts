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
  {
    code: "DEMO_OT",
    rule_type: "overtime",
    rate: 1.5,
    formula: "hours * hourly * 1.5",
    statut_validation: "draft",
    effective_from: "2026-01-01",
    effective_to: null,
  },
];

describe("payroll overtime (démo)", () => {
  it("ajoute les heures sup au brut avec facteur 1.5", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      overtimeHours: 10,
      hourlyRate: 20,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    const otLine = result.lines.find((l) => l.code === "OVERTIME");
    expect(otLine!.amount).toBe(300);
    expect(result.brut).toBe(1300);
  });
});
