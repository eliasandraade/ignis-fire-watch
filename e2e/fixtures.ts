import { test as base, expect, type Page, type APIRequestContext } from '@playwright/test';

export const API_URL = (process.env.IGNIS_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export type Role = 'admin' | 'gestor' | 'campo';

export function credentials(role: Role): { email: string; password: string } {
  const password = process.env[`IGNIS_E2E_PASSWORD_${role.toUpperCase()}`];
  if (!password) {
    throw new Error(
      `IGNIS_E2E_PASSWORD_${role.toUpperCase()} ausente: rode via "deploy/local/validate.sh e2e" ` +
        'no repositório da API (as senhas locais são geradas por instalação).',
    );
  }
  // Local stack: <role>.validacao@example.org. Railway staging uses its own
  // homologation accounts (IGNIS_E2E_EMAIL_<ROLE>).
  const email = process.env[`IGNIS_E2E_EMAIL_${role.toUpperCase()}`] ?? `${role}.validacao@example.org`;
  return { email, password };
}

// 1x1 transparent PNG: map tiles are the only external dependency we replace.
const BLANK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

interface Fixtures {
  consoleErrors: string[];
  api: APIRequestContext;
}

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, provide, testInfo) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    await page.route(/tile\.openstreetmap\.org/, route =>
      route.fulfill({ status: 200, contentType: 'image/png', body: BLANK_PNG }),
    );
    await provide(errors);
    // Tests that provoke failures declare it with the "expected-errors" annotation.
    if (!testInfo.annotations.some(a => a.type === 'expected-errors')) {
      expect(errors, 'erros no console do navegador').toEqual([]);
    }
  },
  api: async ({ playwright }, provide) => {
    const ctx = await playwright.request.newContext({ baseURL: API_URL });
    await provide(ctx);
    await ctx.dispose();
  },
});

export { expect };

/** Real form login (used once per run: the API allows 10 logins/min per IP). */
export async function loginThroughForm(page: Page, role: Role): Promise<void> {
  const { email, password } = credentials(role);
  await page.goto('/login');
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeEditable();
  await emailInput.fill(email);
  await page.locator('input[type="password"]').fill(password);
  await expect(emailInput).toHaveValue(email);
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ignis_token'))).not.toBeNull();
  await page.waitForURL(url => !url.pathname.startsWith('/login'));
}

const sessions = new Map<Role, { access_token: string; user: unknown }>();

/** Session from one API login per role per run, stored like the app stores it. */
export async function login(page: Page, role: Role): Promise<void> {
  let session = sessions.get(role);
  if (!session) {
    const ctx = await page.context().request;
    const { email, password } = credentials(role);
    const response = await ctx.post(`${API_URL}/api/v1/auth/login`, { data: { email, password } });
    expect(response.ok(), `login ${role}: HTTP ${response.status()}`).toBeTruthy();
    session = await response.json();
    sessions.set(role, session!);
  }
  await page.goto('/public');
  await page.evaluate(s => {
    localStorage.setItem('ignis_token', s.access_token);
    localStorage.setItem('ignis_user', JSON.stringify(s.user));
  }, session!);
}

export function apiToken(role: Role): string {
  const session = sessions.get(role);
  if (!session) throw new Error(`faça login como ${role} antes de pedir o token`);
  return session.access_token;
}
