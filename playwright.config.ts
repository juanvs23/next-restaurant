import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  globalSetup: "./e2e/global-setup",
  globalTeardown: "./e2e/global-teardown",
  timeout: 30000,

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60000,
    env: {
      MONGO_URI: "mongodb://localhost:27017/gericht_e2e",
      DB_NAME: "gericht_e2e",
      AUTH_SECRET: "e2e-test-secret-do-not-use-in-prod",
      AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
      TZ: "America/Caracas",
    },
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
