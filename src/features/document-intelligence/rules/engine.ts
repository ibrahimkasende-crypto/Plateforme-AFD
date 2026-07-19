import { checkActivityConsistency } from "@/features/document-intelligence/rules/activity.rules";
import { checkBeneficiairesConsistency } from "@/features/document-intelligence/rules/beneficiaires.rules";
import { checkFinanceConsistency } from "@/features/document-intelligence/rules/finance.rules";
import { checkStockConsistency } from "@/features/document-intelligence/rules/stock.rules";
import type { AnomalyLevel, ExtractedField } from "@/features/document-intelligence/types";
import { normalizeAmount } from "@/features/document-intelligence/utils/normalize";

export type EngineFinding = {
  code: string;
  level: AnomalyLevel;
  message: string;
  fieldNames: string[];
  category: string;
};

function fieldMap(fields: ExtractedField[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const f of fields) {
    map[f.name.toLowerCase()] = f.correctedValue ?? f.rawValue;
  }
  return map;
}

function asNum(v: string | undefined): number | null {
  if (!v) return null;
  const n = normalizeAmount(v).amount;
  return Number.isNaN(n) ? Number(v) || null : n;
}

export function runConsistencyEngine(input: {
  moduleCible: string | null | undefined;
  fields: ExtractedField[];
  tableLineAmounts?: number[];
  periodDuplicate?: boolean;
  hasProjet?: boolean;
}): EngineFinding[] {
  const m = fieldMap(input.fields);
  const findings: EngineFinding[] = [];

  const finance = checkFinanceConsistency({
    budgetPrevu: m.budget_prevu ?? m["budget prévu"],
    depenses: m.depenses ?? m.dépenses,
    solde: m.solde,
    totalDeclare: m.montant_total ?? m.total,
    lineAmounts: input.tableLineAmounts,
    percentage: m.pourcentage,
  }).map((f) => ({ ...f, category: "finance" }));

  const stock = checkStockConsistency({
    stockInitial: asNum(m.stock_initial),
    entrees: asNum(m.entrees ?? m.entrées),
    sorties: asNum(m.sorties),
    stockTheorique: asNum(m.stock_theorique),
    stockPhysique: asNum(m.stock_physique),
  }).map((f) => ({ ...f, category: "stock" }));

  const activity = checkActivityConsistency({
    femmes: asNum(m.femmes),
    hommes: asNum(m.hommes),
    filles: asNum(m.filles),
    garcons: asNum(m.garcons ?? m.garçons),
    total: asNum(m.total),
    hasProjet: input.hasProjet,
  }).map((f) => ({ ...f, category: "activite" }));

  const benef = checkBeneficiairesConsistency({
    total: asNum(m.total),
    categoriesSum: asNum(m.categories_sum),
    periodDuplicate: input.periodDuplicate,
  }).map((f) => ({ ...f, category: "beneficiaires" }));

  findings.push(...finance, ...stock, ...activity, ...benef);

  const targetModule = input.moduleCible ?? "";
  if (
    targetModule.includes("finance") ||
    targetModule.includes("depenses") ||
    targetModule.includes("budget")
  ) {
    return findings.filter((f) => f.category === "finance" || f.level === "critical");
  }
  if (targetModule.includes("stock") || targetModule.includes("logistique")) {
    return findings.filter((f) => f.category === "stock" || f.level === "critical");
  }
  if (targetModule.includes("beneficiaires")) {
    return findings.filter((f) => f.category === "beneficiaires" || f.level === "critical");
  }
  if (targetModule.includes("activ")) {
    return findings.filter((f) => f.category === "activite" || f.level === "critical");
  }

  return findings;
}
