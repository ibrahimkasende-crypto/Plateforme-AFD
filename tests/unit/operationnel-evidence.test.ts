import { describe, expect, it } from "vitest";
import { OPERATIONNEL_MODULES } from "@/config/operationnel-evidence";

describe("registre preuves opérationnel", () => {
  it("chaque module opérationnel a routes, tables, migrations, tests RLS et E2E", () => {
    expect(OPERATIONNEL_MODULES.length).toBeGreaterThanOrEqual(5);
    for (const mod of OPERATIONNEL_MODULES) {
      expect(mod.statut).toBe("operationnel");
      expect(mod.routes.length).toBeGreaterThan(0);
      expect(mod.tables.length).toBeGreaterThan(0);
      expect(mod.migrations.length).toBeGreaterThan(0);
      expect(mod.services.length).toBeGreaterThan(0);
      expect(mod.testsRls.length).toBeGreaterThan(0);
      expect(mod.testsE2e.length).toBeGreaterThan(0);
      expect(mod.docs.length).toBeGreaterThan(0);
    }
  });
});
