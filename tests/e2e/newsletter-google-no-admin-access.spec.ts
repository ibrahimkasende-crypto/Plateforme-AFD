import { expect, test } from "@playwright/test";

test.describe("Newsletter Google — pas d’accès admin", () => {
  test("visiteur non authentifié refusé sur /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/connexion/);
  });

  test("callback newsletter ne redirige pas vers /admin par défaut", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(
      `${baseURL}/auth/callback?newsletter=1`,
      { maxRedirects: 0 },
    );
    const location = res.headers().location ?? "";
    expect(location).not.toMatch(/\/admin(\?|$)/);
    expect(location).toMatch(/newsletter=/);
  });
});
