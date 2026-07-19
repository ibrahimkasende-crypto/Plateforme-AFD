import { describe, expect, it } from "vitest";
import {
  calculatePayroll,
  type LegalRule,
} from "@/features/payroll/engine/calculate";

/** Règles de démonstration — non validées légalement (migration 20260719_050). */
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

describe("calculatePayroll — démo", () => {
  it("calcule brut, retenues et net pour un salaire standard", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      transport: 50,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    expect(result.brut).toBe(1050);
    expect(result.retenues).toBeGreaterThan(0);
    expect(result.net).toBeLessThan(result.brut);
    expect(result.coutEmployeur).toBeGreaterThan(result.brut);
    expect(result.usedUnverifiedRules).toBe(true);
  });

  it("signale un salaire de base invalide", () => {
    const result = calculatePayroll({
      baseSalary: 0,
      rules: DEMO_RULES,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });
    expect(result.anomalies).toContain("Salaire de base manquant ou invalide.");
  });
});
