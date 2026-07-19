import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
    // Chrome système si Chromium Playwright absente (ex. PLAYWRIGHT_CHANNEL=chrome)
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL as "chrome" | "msedge" }
      : {}),
  },
  webServer: {
    command: "npm run start -- --port 3010 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3010",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-320",
      use: { viewport: { width: 320, height: 568 } },
    },
    {
      name: "mobile-375",
      use: { viewport: { width: 375, height: 812 } },
    },
    {
      name: "mobile-390",
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: "mobile-430",
      use: { viewport: { width: 430, height: 932 } },
    },
    {
      name: "tablet-768",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop-1440",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-1536",
      use: { viewport: { width: 1536, height: 1024 } },
    },
  ],
});
