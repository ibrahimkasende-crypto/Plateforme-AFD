import { expect, test } from "@playwright/test";

test.describe("Navigation mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  test("ouvre et ferme le menu drawer", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const trigger = page.getByTestId("mobile-menu-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click({ force: true });
    const panel = page.getByTestId("mobile-menu-panel");
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole("link", { name: "Accueil", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("CTA Soutenir visible dans le header mobile", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: /Soutenir/i }).first(),
    ).toBeVisible();
  });
});
