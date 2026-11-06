/**
 * Screenshots of the Admin Cockpit on the REAL local stack, for
 * docs/IGNIS/ADMIN-COCKPIT.md. Read-only: nothing is created or changed.
 *
 *   IGNIS_EVIDENCE_DIR=... IGNIS_E2E_PASSWORD_ADMIN=... IGNIS_E2E_PASSWORD_GESTOR=... \
 *     node e2e/capture-admin-evidence.mjs
 */
import { chromium, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const WEB = process.env.IGNIS_WEB_URL ?? 'http://localhost:8080';
const API = process.env.IGNIS_API_URL ?? 'http://localhost:8000';
const OUT = process.env.IGNIS_EVIDENCE_DIR ?? 'e2e-artifacts/admin-evidence';
mkdirSync(OUT, { recursive: true });

async function session(role) {
  const password = process.env[`IGNIS_E2E_PASSWORD_${role.toUpperCase()}`];
  if (!password) throw new Error(`IGNIS_E2E_PASSWORD_${role.toUpperCase()} ausente`);
  const r = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env[`IGNIS_E2E_EMAIL_${role.toUpperCase()}`] ?? `${role}.validacao@example.org`,
      password,
    }),
  });
  if (!r.ok) throw new Error(`login ${role}: HTTP ${r.status}`);
  return r.json();
}

async function open(context, s) {
  const page = await context.newPage();
  await page.goto(`${WEB}/public`);
  await page.evaluate(v => {
    localStorage.setItem('ignis_token', v.access_token);
    localStorage.setItem('ignis_user', JSON.stringify(v.user));
  }, s);
  return page;
}

const shot = async (page, name, full = false) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full });
  console.log('saved', name);
};

const browser = await chromium.launch();
const options = { viewport: { width: 1440, height: 900 }, locale: 'pt-BR', timezoneId: 'America/Fortaleza' };
const admin = await session('admin');
const desktop = await browser.newContext(options);
const page = await open(desktop, admin);

await page.goto(`${WEB}/admin`);
await page.getByText('Focos persistidos').waitFor();
await shot(page, '01-cockpit-painel', true);

await page.goto(`${WEB}/admin/users`);
await page.getByRole('heading', { name: 'Usuários' }).waitFor();
await shot(page, '02-usuarios-lista');
await page.goto(`${WEB}/admin/users?user=${admin.user.id}`);
await page.getByText(/Esta é a sua conta/).waitFor();
await shot(page, '03-usuario-propria-conta-protegida');
await page.goto(`${WEB}/admin/users`);
await page.getByRole('button', { name: 'Novo usuário' }).click();
await page.getByRole('dialog', { name: 'Novo usuário' }).waitFor();
await shot(page, '04-usuario-novo-formulario');

await page.goto(`${WEB}/admin/permissions`);
await page.getByText('Endpoints por papel').waitFor();
await shot(page, '05-permissoes-matriz');

await page.goto(`${WEB}/admin/sources`);
await page.getByText('Fontes de dados').first().waitFor();
await shot(page, '06-fontes', true);

await page.goto(`${WEB}/admin/jobs`);
await page.getByRole('heading', { name: 'Execuções' }).waitFor();
await shot(page, '07-execucoes');
const first = page.locator('.ig-table .ig-row-btn').first();
if (await first.count()) {
  await first.click();
  await page.getByText('Contadores (o que foi gravado)').waitFor();
  await shot(page, '08-execucao-detalhe');
}

await page.goto(`${WEB}/admin/api`);
await page.getByText(/operações/).first().waitFor();
await page.getByRole('button', { name: 'Executar', exact: true }).click();
await page.getByText('HTTP 200').first().waitFor();
await shot(page, '09-api-diagnostico');

await page.goto(`${WEB}/admin/audit`);
await page.getByRole('heading', { name: 'Auditoria' }).waitFor();
await shot(page, '10-auditoria');
const event = page.locator('.ig-table .ig-row-btn').first();
if (await event.count()) {
  await event.click();
  await page.getByText('Metadados permitidos').waitFor();
  await shot(page, '11-auditoria-evento');
}

await page.goto(`${WEB}/admin/settings`);
await page.getByText('Gerenciado pelo ambiente').waitFor();
await shot(page, '12-configuracao', true);

await page.goto(`${WEB}/gestor`);
await page.waitForTimeout(1500);
await shot(page, '13-operacao-navegacao-admin');

const gestorContext = await browser.newContext(options);
const gestorPage = await open(gestorContext, await session('gestor'));
await gestorPage.goto(`${WEB}/admin`);
await gestorPage.getByText('Acesso não permitido').waitFor();
await shot(gestorPage, '14-gestor-negado');

const mobile = await browser.newContext({ ...devices['Pixel 7'], locale: 'pt-BR', timezoneId: 'America/Fortaleza' });
const m = await open(mobile, admin);
await m.goto(`${WEB}/admin`);
await m.getByText('Focos persistidos').waitFor();
await shot(m, '15-cockpit-mobile');
await m.getByRole('button', { name: 'Abrir menu' }).click();
await shot(m, '16-cockpit-mobile-menu');

await browser.close();
