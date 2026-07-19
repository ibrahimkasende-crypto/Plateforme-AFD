import { describe, expect, it } from "vitest";
import {
  normalizeAmount,
  normalizeDate,
  normalizePercentage,
  normalizeProvince,
  normalizeReference,
} from "@/features/document-intelligence/utils/normalize";

describe("normalizeAmount", () => {
  it("parse 1.250,50 USD", () => {
    const r = normalizeAmount("1.250,50 USD");
    expect(r.amount).toBe(1250.5);
    expect(r.currency).toBe("USD");
    expect(r.ambiguous).toBe(false);
  });

  it("marque l’ambiguïté des séparateurs", () => {
    const r = normalizeAmount("1,250");
    expect(r.ambiguous).toBe(true);
    expect(r.interpretations.length).toBeGreaterThan(1);
  });
});

describe("normalizeDate", () => {
  it("parse 15/07/2026", () => {
    const r = normalizeDate("15/07/2026");
    expect(r.iso).toBe("2026-07-15");
    expect(r.ambiguous).toBe(false);
  });

  it("marque ambiguïté jour/mois", () => {
    const r = normalizeDate("01/02/2026");
    expect(r.ambiguous).toBe(true);
  });
});

describe("normalizeProvince", () => {
  it("normalise Haut Katanga", () => {
    expect(normalizeProvince("Haut Katanga")).toBe("Haut-Katanga");
  });
});

describe("normalizePercentage / reference", () => {
  it("pourcentage", () => {
    expect(normalizePercentage("12,5%").value).toBe(12.5);
  });
  it("référence", () => {
    expect(normalizeReference("afd 2026-01")).toBe("AFD2026-01");
  });
});
