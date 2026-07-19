import { describe, expect, it } from "vitest";
import { ALLOWED_TARGET_TABLES } from "@/features/document-intelligence/config";
import { DOCUMENT_TYPE_OPTIONS } from "@/features/document-intelligence/schemas/document-types";

describe("mappings OCR", () => {
  it("restreint les tables cibles", () => {
    expect(ALLOWED_TARGET_TABLES).toContain("finances_depenses");
    expect(ALLOWED_TARGET_TABLES).not.toContain("auth.users");
  });

  it("couvre les familles de documents", () => {
    const values = DOCUMENT_TYPE_OPTIONS.map((o) => o.value);
    expect(values).toContain("rapport_financier");
    expect(values).toContain("inventaire");
    expect(values).toContain("rapport_activite");
  });
});
