import { expect, test } from "@playwright/test";

test.describe("Favicon AFD", () => {
  test("sert favicon.ico et icon.png", async ({ request }) => {
    const ico = await request.get("/favicon.ico");
    expect(ico.ok()).toBeTruthy();
    const ct = ico.headers()["content-type"] ?? "";
    expect(ct.includes("icon") || ct.includes("image")).toBeTruthy();

    const png = await request.get("/icon.png");
    expect(png.ok()).toBeTruthy();
  });
});
