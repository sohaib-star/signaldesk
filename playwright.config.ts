import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const isCI = Boolean(process.env.CI);

/**
 * End-to-end tests run against a production server (`next start`), so run
 * `npm run build` first. Async Server Components are covered here rather than
 * in Vitest, which cannot render them.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  // All projects use Chromium; viewports match the QA matrix.
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}/today`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
