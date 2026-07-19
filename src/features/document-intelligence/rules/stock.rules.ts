import type { AnomalyLevel } from "@/features/document-intelligence/types";

export type StockRuleFinding = {
  code: string;
  level: AnomalyLevel;
  message: string;
  fieldNames: string[];
};

export function checkStockConsistency(input: {
  stockInitial?: number | null;
  entrees?: number | null;
  sorties?: number | null;
  stockTheorique?: number | null;
  stockPhysique?: number | null;
}): StockRuleFinding[] {
  const findings: StockRuleFinding[] = [];
  const {
    stockInitial,
    entrees,
    sorties,
    stockTheorique,
    stockPhysique,
  } = input;

  if (
    stockInitial != null &&
    entrees != null &&
    sorties != null &&
    stockTheorique != null
  ) {
    const expected = stockInitial + entrees - sorties;
    if (Math.abs(expected - stockTheorique) > 0.001) {
      findings.push({
        code: "stock.theorique_mismatch",
        level: "critical",
        message: `Stock théorique incorrect (attendu ${expected}).`,
        fieldNames: [
          "stock_initial",
          "entrees",
          "sorties",
          "stock_theorique",
        ],
      });
    }
  }

  if (
    stockTheorique != null &&
    stockPhysique != null &&
    Math.abs(stockTheorique - stockPhysique) > 0.001
  ) {
    findings.push({
      code: "stock.ecart_inventaire",
      level: "high",
      message: "Écart entre stock théorique et stock physique.",
      fieldNames: ["stock_theorique", "stock_physique"],
    });
  }

  if (
    stockInitial != null &&
    sorties != null &&
    entrees != null &&
    sorties > stockInitial + entrees
  ) {
    findings.push({
      code: "stock.sortie_excessive",
      level: "critical",
      message: "Sorties supérieures au stock disponible.",
      fieldNames: ["sorties", "stock_initial", "entrees"],
    });
  }

  return findings;
}
