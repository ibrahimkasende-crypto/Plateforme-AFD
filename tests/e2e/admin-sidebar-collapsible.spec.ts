import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Sidebar admin pliable", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop uniquement",
    );
    skipWithoutAdminCredentials();
  });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
  });

  test("sidebar ouverte puis réduite via le logo", async ({ page }) => {
    const sidebar = page.locator("[data-admin-sidebar]");
    await expect(sidebar).toHaveAttribute("data-collapsed", "false");

    await page
      .getByRole("button", { name: /réduire la barre latérale/i })
      .first()
      .click();

    await expect(sidebar).toHaveAttribute("data-collapsed", "true");
    await expect(
      page.locator("[data-admin-sidebar]").getByText("AFD ASBL"),
    ).toBeHidden();

    await expect(
      page.getByRole("link", { name: /voir le site public/i }),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /ouvrir la barre latérale/i })
      .first()
      .click();
    await expect(sidebar).toHaveAttribute("data-collapsed", "false");
  });

  test("photo institutionnelle absente", async ({ page }) => {
    const sidebar = page.locator("[data-admin-sidebar]");
    await expect(
      sidebar.getByText(/réinventer l'avenir/i),
    ).toHaveCount(0);
  });

  test("état mémorisé après reload", async ({ page }) => {
    await page
      .getByRole("button", { name: /réduire la barre latérale/i })
      .first()
      .click();
    await page.reload();
    await expect(page.locator("[data-admin-sidebar]")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
  });
});
