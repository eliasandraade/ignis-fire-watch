/**
 * Screenshots of the REAL local stack for docs/IGNIS/HUMAN-VALIDATION-RESULTS.md.
 * No interception except blank map tiles is NOT used here: tiles load from
 * OpenStreetMap so the screenshot shows the actual base map.
 *
 *   IGNIS_EVIDENCE_DIR=... IGNIS_E2E_PASSWORD_GESTOR=... node e2e/capture-evidence.mjs
 */
import { chromium, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const WEB = process.env.IGNIS_WEB_URL ?? 'http://localhost:8080';
const API = process.env.IGNIS_API_URL ?? 'http://localhost:8000';
const OUT = process.env.IGNIS_EVIDENCE_DIR ?? 'e2e-artifacts/evidence';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR', timezoneId: 'America/Fortaleza' });
const page = await desktop.newPage();
const shot = async (p, name) => {
  await p.waitForTimeout(2500); // tiles and canvas settle
  await p.screenshot({ path: join(OUT, `${name}.png`) });
  console.log('saved', name);
};

const sources = await (await fetch(`${API}/api/v1/orbital-alerts/sources`)).json();
const day = sources.map(s => s.latest_observation_at).filter(Boolean).sort().pop().slice(0, 10);

await page.goto(`${WEB}/public`);
await page.getByTestId('kpi-total').waitFor();
await shot(page, '01-portal-publico');

await page.goto(`${WEB}/public/map`);
await page.getByTestId('detection-count').waitFor();
await page.getByTestId('filter-period').selectOption('custom');
await page.getByTestId('filter-from').fill(day);
await page.getByTestId('filter-to').fill(day);
await page.waitForTimeout(1500);
await page.getByTestId('detection-item').first().click();
await shot(page, '02-mapa-publico-detalhe');

const login = await (await fetch(`${API}/api/v1/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'gestor.validacao@example.org', password: process.env.IGNIS_E2E_PASSWORD_GESTOR }),
})).json();
await page.evaluate(s => {
  localStorage.setItem('ignis_token', s.access_token);
  localStorage.setItem('ignis_user', JSON.stringify(s.user));
}, login);
await page.goto(`${WEB}/gestor`);
await page.getByTestId('kpi-total').waitFor();
await shot(page, '03-painel-gestor');

await page.goto(`${WEB}/gestor/map`);
await page.getByTestId('detection-count').waitFor();
const busiest = (await (await fetch(`${API}/api/v1/orbital-alerts/stats?from=${day}T00:00:00Z&to=${day}T23:59:59Z`)).json()).top_municipalities[0];
await page.getByTestId('filter-period').selectOption('custom');
await page.getByTestId('filter-from').fill(day);
await page.getByTestId('filter-to').fill(day);
await page.getByTestId('filter-municipality').selectOption(busiest.ibge_code);
await page.waitForTimeout(1500);
await page.getByTestId('detection-item').first().click();
await shot(page, '04-mapa-gestor-municipio-detalhe');

const mobile = await browser.newContext({ ...devices['Pixel 7'], locale: 'pt-BR', timezoneId: 'America/Fortaleza' });
const m = await mobile.newPage();
await m.goto(`${WEB}/public/map`);
await m.getByTestId('detection-count').waitFor();
await shot(m, '05-mapa-publico-mobile');
await m.getByTestId('orbital-map').scrollIntoViewIfNeeded();
await shot(m, '06-mapa-publico-mobile-mapa');

await browser.close();
