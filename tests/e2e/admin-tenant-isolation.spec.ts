import { expect, test } from "@playwright/test";

/**
 * Isolation multi-tenant — tests de contrat UI / documentation.
 * Les politiques RLS SQL sont couvertes côté `tests/rls` lorsque la migration est appliquée.
 */
test.describe("Isolation organisationnelle", () => {
  test("page abonnement accessible sans bloquer le pilote", async ({
    page,
  }) => {
    test.skip(
      !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
      "Credentials admin requis",
    );
    const { loginAsAdmin } = await import("./helpers/admin-auth");
    await loginAsAdmin(page);
    await page.goto("/admin/abonnement");
    await expect(page.locator("[data-subscription-panel]")).toBeVisible();
    await expect(page.getByText(/Pilote interne/i)).toBeVisible();
    await expect(page.getByText(/AFD/i).first()).toBeVisible();
  });

  test("contrat : membership requis documenté", async () => {
    // Garde-fou : la doc multi-tenant doit exister.
    const fs = await import("node:fs");
    const path = await import("node:path");
    const doc = path.join(
      process.cwd(),
      "docs/LISUNGI_MULTI_TENANT_ARCHITECTURE.md",
    );
    expect(fs.existsSync(doc)).toBeTruthy();
    const body = fs.readFileSync(doc, "utf8");
    expect(body).toMatch(/is_org_member/);
    expect(body).toMatch(/organization_id/);
  });
});
