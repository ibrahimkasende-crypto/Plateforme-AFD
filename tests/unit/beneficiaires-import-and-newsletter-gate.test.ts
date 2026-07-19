import { describe, expect, it } from "vitest";
import { parseBeneficiairesCsv } from "@/features/beneficiaires/lib/import-csv";
import { isEmailProviderConfigured } from "@/features/newsletter/providers/resolve-provider";

describe("parseBeneficiairesCsv", () => {
  it("parse un CSV avec en-tête et détecte les doublons", () => {
    const csv = [
      "periode;province;femmes;hommes;enfants;jeunes",
      "2026-01-01;Kinshasa;10;5;2;1",
      "2026-01-01;Kinshasa;1;1;0;0",
      "2026-02-01;Goma;3;2;1;0",
    ].join("\n");
    const result = parseBeneficiairesCsv(csv);
    expect(result.rows).toHaveLength(2);
    expect(result.duplicates).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });
});

describe("newsletter provider gate", () => {
  it("signale non configuré sans variables d’environnement", () => {
    expect(isEmailProviderConfigured()).toBe(false);
  });
});
