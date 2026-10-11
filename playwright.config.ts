import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://playwright.dev",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      // Headed only: opens Chromium maximized (viewport follows the real window size).
      // Run: npx playwright test --project=chromium-maximized --headed
      name: "chromium-maximized",
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined, // not allowed together with viewport: null
        launchOptions: { args: ["--start-maximized"] },
      },
    },
  ],
});
