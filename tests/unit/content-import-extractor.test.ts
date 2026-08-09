import { describe, expect, it } from "vitest";
import { extractContentFields } from "@/features/content-import/extractors/heuristic-extractor";

describe("content-import heuristic extractor", () => {
  it("extrait titre, province, budget et bénéficiaires d’un rapport projet", () => {
    const text = `
Rapport de projet
Titre : Projet d'appui à la scolarisation
Province : Kinshasa
Budget : 25000 USD
Bénéficiaires : 850
Description : Accompagnement des filles vulnérables à l'école.
Date de début : 01/02/2025
Date de fin : 31/12/2025
Statut : en cours
`;
    const fields = extractContentFields("projet", text);
    const map = Object.fromEntries(fields.map((f) => [f.key, f]));

    expect(map.titre?.value).toMatch(/scolarisation/i);
    expect(map.titre?.confidence).toBe("recognized");
    expect(map.province?.value).toMatch(/Kinshasa/i);
    expect(map.budget?.value).toBe("25000");
    expect(map.beneficiaires?.value).toBe("850");
    expect(map.date_debut?.value).toBe("2025-02-01");
    expect(map.date_fin?.value).toBe("2025-12-31");
  });
});
