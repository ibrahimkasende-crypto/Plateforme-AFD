import { describe, expect, it } from "vitest";
import { calculatePayroll, type LegalRule } from "@/features/payroll/engine/calculate";

describe("payroll anomalies (démo)", () => {
  it("détecte un net négatif", () => {
    const rules: LegalRule[] = [
      {
        code: "DEMO_CNSS_EE",
        rule_type: "social",
        rate: 0.035,
        formula: null,
        statut_validation: "draft",
        effective_from: "2026-01-01",
        effective_to: null,
      },
      {
        code: "DEMO_TAX",
        rule_type: "tax",
        rate: 0.1,
        formula: null,
        statut_validation: "draft",
        effective_from: "2026-01-01",
        effective_to: null,
      },
      {
        code: "DEMO_CNSS_ER",
        rule_type: "employer",
        rate: 0.09,
        formula: null,
        statut_validation: "draft",
        effective_from: "2026-01-01",
        effective_to: null,
      },
    ];

    const result = calculatePayroll({
      baseSalary: 100,
      advances: 500,
      rules,
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });

    expect(result.anomalies).toContain("Salaire net négatif.");
    expect(result.anomalies).toContain("Retenues supérieures au brut.");
  });

  it("signale l'absence de règles fiscales/sociales", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      rules: [],
      asOf: "2026-06-15",
      allowUnverifiedRules: true,
    });
    expect(result.anomalies).toContain(
      "Règle fiscale ou sociale absente pour la période.",
    );
  });
});
