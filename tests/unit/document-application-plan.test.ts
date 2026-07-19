import { describe, expect, it } from "vitest";
import { runConsistencyEngine } from "@/features/document-intelligence/rules/engine";

describe("document application safeguards", () => {
  it("produit des anomalies avant toute application", () => {
    const findings = runConsistencyEngine({
      moduleCible: "finances",
      fields: [
        {
          name: "budget_prevu",
          rawValue: "1000",
          type: "currency",
          confidence: 0.9,
          source: "ocr",
        },
        {
          name: "depenses",
          rawValue: "400",
          type: "currency",
          confidence: 0.9,
          source: "ocr",
        },
        {
          name: "solde",
          rawValue: "100",
          type: "currency",
          confidence: 0.9,
          source: "ocr",
        },
      ],
    });
    expect(findings.length).toBeGreaterThan(0);
  });
});
