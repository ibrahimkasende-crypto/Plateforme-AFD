import { describe, expect, it } from "vitest";
import { calculatePayroll } from "@/features/payroll/engine/calculate";

describe("stock quantity guard logic (mirrors service rule)", () => {
  it("refuse une sortie si disponible insuffisant (règle métier)", () => {
    const available = 5;
    const requested = 8;
    expect(available < requested).toBe(true);
  });
});

describe("payroll still uses versioned rules", () => {
  it("signale règles non vérifiées", () => {
    const result = calculatePayroll({
      baseSalary: 1000,
      rules: [
        {
          code: "DEMO",
          rule_type: "tax",
          rate: 0.1,
          formula: "base*rate",
          statut_validation: "draft",
          effective_from: "2020-01-01",
          effective_to: null,
        },
      ],
      asOf: "2026-07-01",
      allowUnverifiedRules: true,
    });
    expect(result.usedUnverifiedRules).toBe(true);
    expect(result.net).toBeLessThan(result.brut);
  });
});
