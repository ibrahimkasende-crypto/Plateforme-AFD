import "server-only";

export type DepenseStatut =
  | "brouillon"
  | "soumise"
  | "approuvee"
  | "rejetee"
  | "payee"
  | "annulee"
  | "enregistree";

const TRANSITIONS: Record<DepenseStatut, DepenseStatut[]> = {
  brouillon: ["soumise", "annulee"],
  soumise: ["approuvee", "rejetee", "annulee"],
  approuvee: ["payee", "annulee"],
  rejetee: ["brouillon", "annulee"],
  payee: [],
  annulee: [],
  enregistree: ["soumise", "approuvee", "annulee"],
};

export function canTransitionDepense(from: DepenseStatut, to: DepenseStatut): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function sumAmounts(rows: Array<{ amount: number | string | null }>): number {
  return rows.reduce((acc, row) => acc + Number(row.amount ?? 0), 0);
}

export function availableBudget(
  planned: number,
  spentApproved: number,
): number {
  return Number(planned) - Number(spentApproved);
}
