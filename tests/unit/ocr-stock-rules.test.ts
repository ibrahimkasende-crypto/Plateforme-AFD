import { describe, expect, it } from "vitest";
import { checkStockConsistency } from "@/features/document-intelligence/rules/stock.rules";

describe("checkStockConsistency", () => {
  it("détecte écart théorique", () => {
    const findings = checkStockConsistency({
      stockInitial: 100,
      entrees: 20,
      sorties: 10,
      stockTheorique: 50,
    });
    expect(findings.some((f) => f.code === "stock.theorique_mismatch")).toBe(true);
  });
});
