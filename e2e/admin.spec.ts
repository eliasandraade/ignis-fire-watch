/**
 * Admin Cockpit journeys against the real stack. Every number on screen is
 * compared with an independent API call; user management runs end to end
 * (create → edit → role → deactivate → login refused) with a disposable
 * account (e2e.<timestamp>@example.org). Accounts are never deleted (there is
 * no physical deletion): the test account ends deactivated.
 */
import { test, expect, login, apiToken, credentials, API_URL } from './fixtures';

const stamp = Date.now();
const testUser = {
  name: `Pessoa E2E ${stamp}`,
  email: `e2e.${stamp}@example.org`,
  password: `e2e-provisoria-${stamp}`,
  newPassword: `e2e-definitiva-${stamp}`,
};
const REASON = 'Validação automatizada do Admin Cockpit';

const FORBIDDEN_TEXT = /FIAP|Global Solution|RM56\d{4}|Protótipo|dados demonstrativos|modo demonstrativo/i;

async function adminGet(api: import('@playwright/test').APIRequestContext, path: string) {
  const r = await api.get(path, { headers: { Authorization: `Bearer ${apiToken('admin')}` } });
  expect(r.ok(), `${path}: HTTP ${r.status()}`).toBeTruthy();
  return r.json();
}

test.describe.configure({ mode: 'serial' });

test.describe('Admin Cockpit', () => {
  test('cockpit mostra métricas reais iguais à API e nenhuma métrica inventada', async ({ page, api, consoleErrors }) => {
    await login(page, 'admin');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Painel administrativo' })).toBeVisible();
    const overview = await adminGet(api, '/api/v1/admin/overview');
    const detections = page.locator('.ig-stat', { hasText: 'Focos persistidos' });
    await expect(detections.locator('.ig-stat-value')).toHaveText(overview.data.detections_total.toLocaleString('pt-BR'));
    const municipalities = page.locator('.ig-stat', { hasText: 'Municípios monitorados' });
    await expect(municipalities.locator('.ig-stat-value')).toHaveText(String(overview.data.municipalities_monitored));
    await expect(page.getByText('Métricas não disponíveis')).toBeVisible();
    await expect(page.getByText(/CPU, memória e tráfego/)).toBeVisible();
    await expect(page.locator('body')).not.toContainText(FORBIDDEN_TEXT);
    void consoleErrors;
  });

  test('fontes e execuções refletem ingestion_runs', async ({ page, api, consoleErrors }) => {
    await login(page, 'admin');
    const sources = await adminGet(api, '/api/v1/admin/sources');
    await page.goto('/admin/sources');
    const firms = sources.sources.find((s: { source: string }) => s.source === 'NASA_FIRMS');
    const firmsPanel = page.locator('.ig-panel', { hasText: 'NASA FIRMS' }).first();
    await expect(firmsPanel).toBeVisible();
    if (!firms.configuration.configured) {
      // Without a key NASA is never presented as operating.
      await expect(firmsPanel.getByText('Não configurada', { exact: true }).first()).toBeVisible();
      await expect(firmsPanel.getByText('Operando', { exact: true })).toHaveCount(0);
    }
    const runs = await adminGet(api, '/api/v1/admin/ingestion-runs?size=20');
    await page.goto('/admin/jobs');
    await expect(page.getByText(`${runs.total.toLocaleString('pt-BR')} execuções`)).toBeVisible();
    void consoleErrors;
  });

  test('criar, editar, mudar papel e desativar um usuário; login recusado depois', async ({ page, api, browser, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: 'login recusado da conta desativada' });
    await login(page, 'admin');
    const adminPassword = credentials('admin').password;
    await page.goto('/admin/users');
    await page.getByRole('button', { name: 'Novo usuário' }).click();
    const dialog = page.getByRole('dialog', { name: 'Novo usuário' });
    await dialog.getByLabel('Nome completo').fill(testUser.name);
    await dialog.getByLabel('E-mail').fill(testUser.email);
    await dialog.getByLabel('Papel').selectOption('campo');
    await dialog.locator('input[autocomplete="new-password"]').fill(testUser.password);
    await dialog.getByLabel('Motivo (opcional)').fill(REASON);
    await dialog.getByRole('button', { name: 'Criar usuário' }).click();
    await expect(page.getByText(`Usuário ${testUser.name} criado`)).toBeVisible();

    // The drawer opens on the new account: pending password change, no last login.
    const drawer = page.getByRole('dialog', { name: testUser.name });
    await expect(drawer.getByText('Troca de senha pendente')).toBeVisible();
    await expect(drawer.getByText('Sem registro')).toBeVisible();

    // First access through the real form: forced password change.
    const other = await browser.newContext();
    const userPage = await other.newPage();
    await userPage.goto('/login');
    await userPage.locator('input[type="email"]').fill(testUser.email);
    await userPage.locator('input[type="password"]').fill(testUser.password);
    await userPage.locator('button[type="submit"]').click();
    await userPage.waitForURL('**/conta/senha');
    await userPage.getByLabel('Senha provisória').fill(testUser.password);
    await userPage.getByLabel('Nova senha', { exact: true }).fill(testUser.newPassword);
    await userPage.getByLabel('Confirme a nova senha').fill(testUser.newPassword);
    await userPage.getByRole('button', { name: 'Salvar nova senha' }).click();
    await userPage.waitForURL('**/gestor/field');
    const userToken = await userPage.evaluate(() => localStorage.getItem('ignis_token'));

    // Edit the name (optimistic locking: the drawer sends the version it read).
    await page.reload();
    await drawer.getByLabel('Nome', { exact: true }).fill(`${testUser.name} Editado`);
    await drawer.getByRole('button', { name: 'Salvar alterações' }).click();
    await expect(page.getByText(`Dados de ${testUser.name} Editado atualizados.`)).toBeVisible();
    const edited = page.getByRole('dialog', { name: `${testUser.name} Editado` });

    // Role change with step-up: wrong password first, then the right one.
    await edited.getByRole('button', { name: 'Alterar papel' }).click();
    let action = page.getByRole('dialog', { name: /Alterar papel/ });
    await action.getByLabel('Novo papel').selectOption('gestor');
    await action.getByLabel('Motivo').fill(REASON);
    await action.getByLabel('Sua senha').fill('senha-incorreta-123');
    await action.getByRole('button', { name: 'Alterar papel' }).click();
    await expect(action.getByText('Senha de confirmação incorreta')).toBeVisible();
    await action.getByLabel('Sua senha').fill(adminPassword);
    await action.getByRole('button', { name: 'Alterar papel' }).click();
    await expect(page.getByText(/Alterar papel: concluído/)).toBeVisible();
    await expect(edited.getByText('Gestor', { exact: true })).toBeVisible();

    // The role change ended the user's session.
    const me = await api.get('/api/v1/auth/me', { headers: { Authorization: `Bearer ${userToken}` } });
    expect(me.status()).toBe(401);

    // Deactivate.
    await edited.getByRole('button', { name: 'Desativar' }).click();
    action = page.getByRole('dialog', { name: /Desativar conta/ });
    await action.getByLabel('Motivo').fill(REASON);
    await action.getByLabel('Sua senha').fill(adminPassword);
    await action.getByRole('button', { name: 'Desativar' }).click();
    await expect(page.getByText(/Desativar conta: concluído/)).toBeVisible();
    await expect(edited.getByText('Inativo', { exact: true })).toBeVisible();

    // A deactivated account cannot log in (same answer as a wrong password).
    await userPage.goto('/login');
    await userPage.locator('input[type="email"]').fill(testUser.email);
    await userPage.locator('input[type="password"]').fill(testUser.newPassword);
    await userPage.locator('button[type="submit"]').click();
    await expect(userPage.getByText('E-mail ou senha incorretos, ou conta sem acesso.')).toBeVisible();
    await other.close();

    // History shows every step with reason.
    await expect(edited.getByText('Usuário criado')).toBeVisible();
    await expect(edited.getByText('Papel alterado')).toBeVisible();
    await expect(edited.getByText('Conta desativada')).toBeVisible();
    await expect(edited.getByText('Alteração de papel recusada')).toBeVisible();
    void consoleErrors;
  });

  test('o administrador não remove o próprio acesso (último administrador protegido)', async ({ page, api, consoleErrors }) => {
    await login(page, 'admin');
    const me = await (await api.get('/api/v1/auth/me', { headers: { Authorization: `Bearer ${apiToken('admin')}` } })).json();
    await page.goto(`/admin/users?user=${me.id}`);
    const drawer = page.getByRole('dialog', { name: me.name });
    await expect(drawer.getByText(/Esta é a sua conta/)).toBeVisible();
    await expect(drawer.getByRole('button', { name: 'Desativar' })).toBeDisabled();
    await expect(drawer.getByRole('button', { name: 'Alterar papel' })).toBeDisabled();
    // The block is enforced by the API, not by the disabled buttons.
    const user = await adminGet(api, `/api/v1/admin/users/${me.id}`);
    const r = await api.post(`/api/v1/admin/users/${me.id}/deactivate`, {
      headers: { Authorization: `Bearer ${apiToken('admin')}` },
      data: { expected_version: user.row_version, confirm_password: credentials('admin').password, reason: REASON },
    });
    expect(r.status()).toBe(409);
    const after = await adminGet(api, `/api/v1/admin/users/${me.id}`);
    expect(after.is_active).toBe(true);
    void consoleErrors;
  });

  test('auditoria registra as ações com ator, alvo e motivo', async ({ page, api, consoleErrors }) => {
    await login(page, 'admin');
    const events = await adminGet(api, `/api/v1/admin/audit-logs?action=user.created&size=100`);
    const created = events.items.find((e: { metadata_json: { reason?: string } }) => e.metadata_json?.reason === REASON);
    expect(created, 'evento de criação do usuário de teste').toBeTruthy();
    await page.goto('/admin/audit?action=user.created');
    await expect(page.getByText(`${events.total.toLocaleString('pt-BR')} eventos`)).toBeVisible();
    await page.getByRole('button', { name: 'Usuário criado' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Usuário criado' }).getByText('Metadados permitidos')).toBeVisible();
    const json = JSON.stringify(events);
    expect(json).not.toContain(testUser.password);
    expect(json).not.toContain('password_hash');
    void consoleErrors;
  });

  test('documentação da API autorizada, sem token na URL', async ({ page, api, consoleErrors }) => {
    await login(page, 'admin');
    const urls: string[] = [];
    page.on('request', r => urls.push(r.url()));
    await page.goto('/admin/api');
    const spec = await adminGet(api, '/api/v1/admin/openapi.json');
    const operations = Object.values(spec.paths as Record<string, object>).reduce((n, item) => n + Object.keys(item).length, 0);
    await expect(page.getByText(`${operations} operações`)).toBeVisible();
    await page.getByRole('button', { name: 'Executar', exact: true }).click();
    const health = page.locator('.ig-panel', { hasText: 'Liveness' });
    await expect(health.getByText('HTTP 200')).toBeVisible();
    expect(urls.filter(u => /token=|access_token|Bearer/i.test(u))).toEqual([]);
    void consoleErrors;
  });

  for (const role of ['gestor', 'campo'] as const) {
    test(`${role} não acessa o cockpit nem os endpoints administrativos`, async ({ page, api, consoleErrors }) => {
      await login(page, role);
      await page.goto('/admin/users');
      await expect(page.getByText('Acesso não permitido')).toBeVisible();
      for (const path of ['/api/v1/admin/overview', '/api/v1/admin/users', '/api/v1/admin/openapi.json', '/api/v1/admin/audit-logs']) {
        const r = await api.get(path, { headers: { Authorization: `Bearer ${apiToken(role)}` } });
        expect(r.status(), path).toBe(403);
      }
      void consoleErrors;
    });
  }

  test('modo API: nenhuma tela operacional exibe dados fictícios ou textos acadêmicos', async ({ page, consoleErrors }) => {
    await login(page, 'admin');
    for (const path of ['/gestor', '/gestor/reports', '/gestor/mobilization', '/admin/settings', '/admin/permissions', '/public']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body'), path).not.toContainText(FORBIDDEN_TEXT);
    }
    // Removed routes are not reachable.
    for (const path of ['/gestor/aurora', '/gestor/esg', '/gestor/economia-espacial', '/gestor/ranking']) {
      await page.goto(path);
      await expect(page.getByText('Página não encontrada')).toBeVisible();
    }
    void consoleErrors;
    void API_URL;
  });
});
