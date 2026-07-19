import { describe, expect, it } from "vitest";
import { checkFinanceConsistency } from "@/features/document-intelligence/rules/finance.rules";

describe("checkFinanceConsistency", () => {
  it("détecte un solde incorrect", () => {
    const findings = checkFinanceConsistency({
      budgetPrevu: "1000",
      depenses: "400",
      solde: "700",
    });
    expect(findings.some((f) => f.code === "finance.solde_incorrect")).toBe(true);
  });

  it("détecte somme lignes ≠ total", () => {
    const findings = checkFinanceConsistency({
      lineAmounts: [100, 200],
      totalDeclare: 250,
    });
    expect(findings.some((f) => f.code === "finance.lines_total_mismatch")).toBe(
      true,
    );
  });
});
