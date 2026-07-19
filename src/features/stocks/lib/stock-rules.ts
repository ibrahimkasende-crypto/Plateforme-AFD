export type StockMouvementType =
  | "entree"
  | "sortie"
  | "transfert"
  | "retour"
  | "ajustement"
  | "reservation";

export function stockMovementSens(type: StockMouvementType): 1 | -1 {
  return type === "sortie" || type === "reservation" ? -1 : 1;
}

export function assertSufficientStock(available: number, qty: number): void {
  if (qty <= 0) throw new Error("Quantité invalide");
  if (available < qty) {
    throw new Error("Stock insuffisant — sortie refusée.");
  }
}
