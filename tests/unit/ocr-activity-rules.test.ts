import { describe, expect, it } from "vitest";
import { checkActivityConsistency } from "@/features/document-intelligence/rules/activity.rules";

describe("checkActivityConsistency", () => {
  it("détecte total incohérent", () => {
    const findings = checkActivityConsistency({
      femmes: 10,
      hommes: 5,
      filles: 3,
      garcons: 2,
      total: 30,
    });
    expect(findings.some((f) => f.code === "activity.total_mismatch")).toBe(true);
  });
});
