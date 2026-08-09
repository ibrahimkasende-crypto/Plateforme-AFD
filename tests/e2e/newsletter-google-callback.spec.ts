import { expect, test } from "@playwright/test";

test.describe("Newsletter Google — callback", () => {
  test("retour google-success rouvre la fenêtre newsletter", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.clear();
        localStorage.removeItem("afd_newsletter_subscribed");
        localStorage.removeItem("afd_newsletter_dismissed_at");
      } catch {
        // ignore
      }
    });

    await page.goto("/?newsletter=google-success");
    await expect(page.getByText(/Suivez les actions de l’AFD|Adresse détectée|E-mail/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("callback sans code redirige en erreur newsletter", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(
      `${baseURL}/auth/callback?newsletter=1&next=${encodeURIComponent("/")}`,
      { maxRedirects: 0 },
    );
    expect([302, 307, 308]).toContain(res.status());
    const location = res.headers().location ?? "";
    expect(location).toMatch(/newsletter=error/);
  });

  test("refuse next externe", async ({ request, baseURL }) => {
    const res = await request.get(
      `${baseURL}/auth/callback?newsletter=1&next=${encodeURIComponent("https://evil.test")}`,
      { maxRedirects: 0 },
    );
    expect([302, 307, 308]).toContain(res.status());
    const location = res.headers().location ?? "";
    expect(location).not.toContain("evil.test");
  });
});
