import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the REAL local stack (ignis-orbital-api/deploy/local/validate.sh):
 * nginx-served build of this app → FastAPI → PostGIS with official IBGE data and
 * persisted INPE detections. Only external map tiles are replaced by a blank
 * image (see e2e/fixtures.ts) so the suite does not depend on OpenStreetMap.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.IGNIS_WEB_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Fortaleza',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@responsive/ },
  ],
});
