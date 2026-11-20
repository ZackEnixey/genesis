import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // A few workers keep runs reliable on ordinary laptops (each one drives a real Chrome).
  workers: 3,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    // Uses the locally installed Chrome so no browser download is needed.
    channel: "chrome",
    locale: "en-US",
    timezoneId: "Europe/Belgrade",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
