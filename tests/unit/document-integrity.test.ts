import { describe, expect, it } from "vitest";
import { sha256Hex } from "@/features/document-intelligence/utils/hash";
import { integrityLabel } from "@/features/document-intelligence/utils/integrity-labels";
import { assessPdfIntegrity } from "@/features/document-intelligence/services/document-integrity.service";

describe("sha256Hex", () => {
  it("est déterministe", () => {
    const a = sha256Hex(Buffer.from("afd"));
    const b = sha256Hex(Buffer.from("afd"));
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });
});

describe("integrity labels", () => {
  it("n’utilise jamais « authentique »", () => {
    const label = integrityLabel("cryptographically_verified");
    expect(label.toLowerCase()).not.toContain("authentique");
  });
});

describe("assessPdfIntegrity", () => {
  it("signale unsigned pour PDF sans /Sig", async () => {
    const pdf = Buffer.from("%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF");
    const r = await assessPdfIntegrity(pdf, "application/pdf");
    expect(r.integrityStatus).toBe("unsigned");
  });
});
