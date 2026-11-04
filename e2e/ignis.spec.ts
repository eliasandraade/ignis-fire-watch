/**
 * Human-validation journeys against the real stack (see playwright.config.ts).
 * Every number on screen is compared with an independent call to the same API,
 * which reads PostGIS. Request interception is used only where the scenario is
 * a failure (API down) — never to fake data shown as integrated.
 */
import { test, expect, login, loginThroughForm, apiToken, API_URL } from './fixtures';

/**
 * The data window of this stack: the UTC day of the newest persisted observation.
 * Tests select it in the UI, so they never depend on today's date (a historical
 * fixture keeps working) and never silently skip.
 */
async function dataDay(api: import('@playwright/test').APIRequestContext): Promise<string> {
  const sources = await (await api.get('/api/v1/orbital-alerts/sources')).json();
  const latest = sources
    .map((s: { latest_observation_at: string | null }) => s.latest_observation_at)
    .filter(Boolean)
    .sort()
    .pop();
  expect(latest, 'nenhum foco persistido: rode validate.sh up/ingest').toBeTruthy();
  return (latest as string).slice(0, 10);
}

async function selectDataWindow(page: import('@playwright/test').Page, day: string) {
  await expect(page.getByTestId('detection-count')).toBeVisible();
  const done = page.waitForResponse(
    r => r.url().includes('/api/v1/orbital-alerts?') && r.url().includes(`from=${day}`) && r.ok(),
  );
  await page.getByTestId('filter-period').selectOption('custom');
  await page.getByTestId('filter-from').fill(day);
  await page.getByTestId('filter-to').fill(day);
  return (await done).json();
}

async function stats(api: import('@playwright/test').APIRequestContext, query: string) {
  const r = await api.get(`/api/v1/orbital-alerts/stats?${query}`);
  expect(r.ok()).toBeTruthy();
  return r.json();
}

test.describe('1. inicialização e dados persistidos', () => {
  test('API pronta, malha oficial e focos no banco', async ({ api }) => {
    expect((await (await api.get('/ready')).json()).database).toBe('connected');
    const munis = await (await api.get('/api/v1/jurisdictions/municipalities')).json();
    expect(munis.total).toBe(184);
    expect(munis.dataset.version).toBe('2025');
    const sources = await (await api.get('/api/v1/orbital-alerts/sources')).json();
    const inpe = sources.find((s: { source: string }) => s.source === 'INPE_QUEIMADAS');
    expect(inpe.last_success_at, 'rode a ingestão (validate.sh up/ingest)').not.toBeNull();
  });

  test('a aplicação abre o portal público @responsive', async ({ page, consoleErrors }) => {
    await page.goto('/public');
    await expect(page.getByRole('heading', { name: 'IGNIS Orbital' })).toBeVisible();
    await expect(page.getByTestId('orbital-dashboard')).toBeVisible();
    void consoleErrors;
  });
});

test.describe('2-3. login e painel com dados reais', () => {
  test('admin entra pelo formulário e o painel mostra os totais da API', async ({ page, api, consoleErrors }) => {
    await loginThroughForm(page, 'admin');
    // The dashboard section uses the 7-day window (the summary card asks for 24 h).
    const statsResponse = page.waitForResponse(r => {
      if (!r.url().includes('/api/v1/orbital-alerts/stats') || !r.ok()) return false;
      const q = new URL(r.url()).searchParams;
      return new Date(q.get('to') ?? '').getTime() - new Date(q.get('from') ?? '').getTime() === 7 * 864e5;
    });
    await page.goto('/gestor');
    const response = await statsResponse;
    const shown = await response.json();
    const query = new URL(response.url()).search.slice(1);
    const independent = await stats(api, query);
    expect(shown.total).toBe(independent.total);
    await expect(page.getByTestId('kpi-total')).toHaveText(independent.total.toLocaleString('pt-BR'));
    await expect(page.getByTestId('kpi-municipalities')).toContainText(String(independent.municipalities_with_detections));
    await expect(page.getByTestId('dashboard-source-NASA_FIRMS')).toBeVisible();
    void consoleErrors;
  });
});

test.describe('4-8. mapa operacional', () => {
  test('mapa carrega contorno oficial, focos e contagem igual à API', async ({ page, api, consoleErrors }) => {
    await login(page, 'gestor');
    const listing = page.waitForResponse(r => r.url().includes('/api/v1/orbital-alerts?') && r.ok());
    await page.goto('/gestor/map');
    const body = await (await listing).json();
    await expect(page.getByTestId('detection-count')).toHaveAttribute('data-count', String(body.total));
    // State outline + municipal boundaries are SVG paths; detections draw on canvas.
    await expect(page.locator('[data-testid="orbital-map"] path.leaflet-interactive, [data-testid="orbital-map"] svg path').first()).toBeAttached();
    await expect(page.locator('[data-testid="orbital-map"] canvas').first()).toBeAttached();
    const independent = await (await api.get(`/api/v1/orbital-alerts?${new URL((await listing).url()).search.slice(1)}`)).json();
    expect(independent.total).toBe(body.total);
    void consoleErrors;
  });

  test('lista e detalhe mostram a coordenada persistida e a proveniência', async ({ page, api, consoleErrors }) => {
    await login(page, 'gestor');
    await page.goto('/gestor/map');
    const page1 = await selectDataWindow(page, await dataDay(api));
    const first = page1.items[0];
    expect(first, 'há focos no dia mais recente').toBeTruthy();
    const db = await (await api.get(`/api/v1/orbital-alerts/${first.id}`)).json();
    await page.getByTestId('detection-item').first().click();
    const detail = page.getByTestId('detection-detail');
    await expect(detail).toContainText(db.jurisdiction.name);
    await expect(detail).toContainText(db.satellite);
    await expect(detail).toContainText(`${Math.abs(db.lat).toFixed(5)}°`);
    await expect(detail).toContainText(`${Math.abs(db.lng).toFixed(5)}°`);
    await expect(detail).toContainText('Não é incêndio confirmado');
    await expect(detail).toContainText('Ingerido em');
    void consoleErrors;
  });

  test('filtro por município bate com a API', async ({ page, api, consoleErrors }) => {
    await login(page, 'gestor');
    await page.goto('/gestor/map');
    const day = await dataDay(api);
    const windowPage = await selectDataWindow(page, day);
    const next = new Date(`${day}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const statsResponse = await stats(
      api,
      `from=${encodeURIComponent(`${day}T00:00:00.000Z`)}&to=${encodeURIComponent(next.toISOString())}`,
    );
    expect(statsResponse.total).toBe(windowPage.total);
    const busiest = statsResponse.top_municipalities[0];
    expect(busiest, 'há município com focos no dia').toBeTruthy();
    const filtered = page.waitForResponse(r => r.url().includes(`jurisdiction=${busiest.ibge_code}`) && r.ok());
    await page.getByTestId('filter-municipality').selectOption(busiest.ibge_code);
    const body = await (await filtered).json();
    expect(body.total).toBe(busiest.count);
    expect(body.items.every((d: { jurisdiction: { ibge_code: string } }) => d.jurisdiction.ibge_code === busiest.ibge_code)).toBe(true);
    await expect(page.getByTestId('detection-count')).toHaveAttribute('data-count', String(body.total));
    void consoleErrors;
  });

  test('filtro por período e estado vazio honesto', async ({ page, consoleErrors }) => {
    await login(page, 'gestor');
    await page.goto('/gestor/map');
    await expect(page.getByTestId('detection-count')).toBeVisible();
    const spanOf = (url: string) => {
      const q = new URL(url).searchParams;
      return new Date(q.get('to') ?? '').getTime() - new Date(q.get('from') ?? '').getTime();
    };
    const day = page.waitForResponse(
      r => r.url().includes('/api/v1/orbital-alerts?') && r.ok() && spanOf(r.url()) === 24 * 3600 * 1000,
    );
    await page.getByTestId('filter-period').selectOption('24h');
    const body = await (await day).json();
    const span = new Date(body.filters.observed_to).getTime() - new Date(body.filters.observed_from).getTime();
    expect(span).toBe(24 * 3600 * 1000);
    await expect(page.getByTestId('detection-count')).toHaveAttribute('data-count', String(body.total));

    await page.getByTestId('filter-period').selectOption('custom');
    const empty = page.waitForResponse(
      r => r.url().includes('/api/v1/orbital-alerts?') && r.url().includes('from=2025-01-01') && r.ok(),
    );
    await page.getByTestId('filter-from').fill('2025-01-01');
    await page.getByTestId('filter-to').fill('2025-01-02');
    expect((await (await empty).json()).total).toBe(0);
    await expect(page.getByTestId('empty-state')).toBeVisible();
    void consoleErrors;
  });

  test('fonte sem chave aparece desabilitada, nunca como operacional', async ({ page, api, consoleErrors }) => {
    const sources = await (await api.get('/api/v1/orbital-alerts/sources')).json();
    const firms = sources.find((s: { source: string }) => s.source === 'NASA_FIRMS');
    await page.goto('/public/map');
    await expect(page.getByTestId('source-status-NASA_FIRMS')).toHaveAttribute('data-state', firms.state);
    if (firms.state === 'disabled') {
      await expect(page.getByTestId('source-status-NASA_FIRMS')).toContainText('Desabilitada');
    }
    void consoleErrors;
  });
});

test.describe('9-10. falhas', () => {
  test('API fora do ar: erro explícito, nenhum foco desenhado', async ({ page, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: 'API derrubada de propósito' });
    await page.route(`${API_URL}/api/v1/orbital-alerts**`, route => route.abort('connectionrefused'));
    await page.goto('/public/map');
    await expect(page.getByTestId('detections-error')).toBeVisible();
    await expect(page.getByTestId('detection-item')).toHaveCount(0);
    await expect(page.getByTestId('detection-count')).toHaveCount(0);
    void consoleErrors;
  });

  test('painel em falha não mostra números', async ({ page, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: 'API derrubada de propósito' });
    await page.route(`${API_URL}/api/v1/orbital-alerts/stats**`, route => route.fulfill({ status: 503, body: '{}' }));
    await page.goto('/public');
    await expect(page.getByTestId('dashboard-error')).toBeVisible();
    await expect(page.getByTestId('kpi-total')).toHaveCount(0);
    void consoleErrors;
  });
});

test.describe('12. portal público sanitizado', () => {
  test('mapa público sem login, sem dados internos @responsive', async ({ page, api, consoleErrors }) => {
    const internal: string[] = [];
    page.on('request', r => {
      if (/\/api\/v1\/(incidents|reports|teams|users|missions|evidence|audit)/.test(r.url())) internal.push(r.url());
    });
    await page.goto('/public/map');
    await expect(page.getByTestId('orbital-map')).toBeVisible();
    await expect(page.getByTestId('map-legend')).toContainText('não a gravidade');
    await expect(page.getByRole('note').filter({ hasText: 'não confirma incêndio' })).toBeVisible();
    await page.goto('/public');
    await expect(page.getByRole('note').filter({ hasText: 'não são incêndios confirmados' })).toBeVisible();
    await expect(page.getByText('Incêndio confirmado', { exact: true })).toBeVisible();
    expect(internal, 'portal público consultou endpoint interno').toEqual([]);
    await page.goto('/public/map');
    await selectDataWindow(page, await dataDay(api));
    await page.getByTestId('detection-item').first().click();
    await expect(page.getByTestId('detection-detail')).toContainText('Observado em');
    await expect(page.getByTestId('detection-detail')).not.toContainText('Execução de ingestão');
    void consoleErrors;
  });
});

test.describe('13-14. sessão e autorização', () => {
  test('logout encerra a sessão', async ({ page, consoleErrors }) => {
    await login(page, 'gestor');
    await page.goto('/gestor');
    await page.getByTestId('logout').click();
    await page.waitForURL('**/login');
    expect(await page.evaluate(() => localStorage.getItem('ignis_token'))).toBeNull();
    await page.goto('/gestor');
    await page.waitForURL('**/login');
    void consoleErrors;
  });

  test('token expirado/ inválido volta ao login', async ({ page, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: '401 esperado do /auth/me' });
    await login(page, 'gestor');
    await page.evaluate(() => localStorage.setItem('ignis_token', 'token.invalido.expirado'));
    await page.goto('/gestor');
    await page.waitForURL('**/login');
    void consoleErrors;
  });

  test('perfil não-admin não acessa a área administrativa', async ({ page, api, consoleErrors }) => {
    await login(page, 'gestor');
    await page.goto('/admin');
    await expect(page.getByText('Acesso não permitido')).toBeVisible();
    const token = apiToken('gestor');
    const r = await api.get('/api/v1/orbital-alerts/ingestion-runs', { headers: { Authorization: `Bearer ${token}` } });
    expect(r.status()).toBe(403);
    void consoleErrors;
  });

  test('campo é redirecionado para a operação de campo', async ({ page, consoleErrors }) => {
    await login(page, 'campo');
    await page.goto('/gestor');
    await page.waitForURL('**/gestor/field');
    void consoleErrors;
  });
});

test.describe('15. nenhuma ação sem backend afirma sucesso', () => {
  test('denúncia com API indisponível NÃO é dada como enviada', async ({ page, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: 'API derrubada de propósito' });
    // Intake answers "open" (as in a local stack) so the form renders; the submit itself fails.
    await page.route(`${API_URL}/api/v1/reports**`, route =>
      route.request().url().includes('/api/v1/reports/intake')
        ? route.fulfill({ json: { accepting: true, message: null } })
        : route.abort('connectionrefused'),
    );
    await page.goto('/public/report');
    await page.locator('select').first().selectOption({ index: 1 });
    await page.locator('textarea').first().fill('Fumaça vista próximo à estrada, teste automatizado de validação.');
    await page.locator('#anon').check();
    await page.locator('#decl').check();
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/NÃO foi enviada/)).toBeVisible();
    await expect(page).toHaveURL(/\/public\/report$/);
    void consoleErrors;
  });

  test('recebimento de denúncias fechado: aviso, sem formulário de dados pessoais', async ({ page, consoleErrors }) => {
    const intake = await (await page.request.get(`${API_URL}/api/v1/reports/intake`)).json();
    if (intake.accepting) {
      // Local stack (APP_ENV=development) accepts reports; simulate the operational default.
      await page.route(`${API_URL}/api/v1/reports/intake`, route =>
        route.fulfill({ json: { accepting: false, message: 'O recebimento de denúncias está desativado nesta instalação.' } }),
      );
    }
    await page.goto('/public/report');
    await expect(page.getByRole('status').filter({ hasText: 'desativado nesta instalação' })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('textarea')).toHaveCount(0);
    void consoleErrors;
  });

  test('sem confirmação do recebimento, o formulário não aparece (falha fechada)', async ({ page, consoleErrors }) => {
    test.info().annotations.push({ type: 'expected-errors', description: 'API derrubada de propósito' });
    await page.route(`${API_URL}/api/v1/reports/intake`, route => route.abort('connectionrefused'));
    await page.goto('/public/report');
    await expect(page.getByRole('status').filter({ hasText: 'Não foi possível confirmar' })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    void consoleErrors;
  });
});
