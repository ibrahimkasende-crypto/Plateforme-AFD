import { describe, expect, it } from "vitest";
import {
  assertSufficientStock,
  stockMovementSens,
} from "@/features/stocks/lib/stock-rules";
import {
  canTransitionDemande,
  canTransitionMission,
} from "@/features/logistique/lib/transitions";

describe("stockMovementSens", () => {
  it("marque sorties et réservations en négatif", () => {
    expect(stockMovementSens("sortie")).toBe(-1);
    expect(stockMovementSens("reservation")).toBe(-1);
    expect(stockMovementSens("entree")).toBe(1);
    expect(stockMovementSens("retour")).toBe(1);
  });
});

describe("assertSufficientStock", () => {
  it("refuse une quantité trop élevée", () => {
    expect(() => assertSufficientStock(2, 3)).toThrow(/insuffisant/i);
  });
  it("accepte une quantité disponible", () => {
    expect(() => assertSufficientStock(5, 3)).not.toThrow();
  });
});

describe("logistique transitions", () => {
  it("autorise soumis → approuve et refuse recu → annule", () => {
    expect(canTransitionDemande("soumis", "approuve")).toBe(true);
    expect(canTransitionDemande("recu", "annule")).toBe(false);
  });
  it("autorise planifiee → en_cours", () => {
    expect(canTransitionMission("planifiee", "en_cours")).toBe(true);
    expect(canTransitionMission("terminee", "en_cours")).toBe(false);
  });
});
