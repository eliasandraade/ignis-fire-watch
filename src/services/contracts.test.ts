/**
 * Frontend ↔ backend contract checks for the values the UI sends.
 * Backend enums: ignis-orbital-api/app/core/enums.py.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_REPORT_TYPES, OCCURRENCE_TO_API, buildApiReportBody } from '@/services/adapters/reportAdapter';
import { TEAM_STATUS_TO_API, adaptApiTeam } from '@/services/adapters/teamAdapter';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import type { ApiIncidentRead } from '@/services/api/incidentsService';

const BACKEND_TEAM_STATUS = ['available', 'mobilized', 'standby', 'returning', 'unavailable'];

describe('public report payload', () => {
  it('every occurrence type maps to a backend ReportType (no more 422)', () => {
    for (const apiType of Object.values(OCCURRENCE_TO_API)) {
      expect(API_REPORT_TYPES).toContain(apiType);
    }
  });

  it('keeps the citizen-selected type when the backend enum is coarser', () => {
    const body = buildApiReportBody('caca', 'Caçadores vistos na trilha norte', 'high', false, null, null, 'Ana');
    expect(body.type).toBe('wildlife_traffic');
    expect(body.description).toMatch(/^\[Tipo informado: Caça\]/);
  });

  it('anonymous report sends no name', () => {
    const body = buildApiReportBody('incendio', 'Fumaça intensa na encosta', 'critical', true, null, null, 'Ana');
    expect(body.reporter_name).toBeNull();
    expect(body.is_anonymous).toBe(true);
  });
});

describe('team status', () => {
  it('mobilization sends a valid backend TeamStatus', () => {
    expect(TEAM_STATUS_TO_API.mobilizado).toBe('mobilized');
    for (const v of Object.values(TEAM_STATUS_TO_API)) expect(BACKEND_TEAM_STATUS).toContain(v);
  });

  it('unknown status is not shown as available', () => {
    const team = adaptApiTeam({
      id: 't', name: 'T', type: 'firefighting', status: 'something-new',
      current_latitude: null, current_longitude: null, notes: null, created_at: '', updated_at: '',
    });
    expect(team.status).toBe('indisponivel');
  });
});

describe('incident telemetry', () => {
  it('missing weather stays missing instead of inventing 28°C / 50% / 10 km/h NE', () => {
    const inc = adaptApiIncident({
      id: 'i', code: 'IGN-1', title: 't', type: 'fire', severity: 'high', status: 'active',
      protected_area_id: null, latitude: null, longitude: null, location_wkt: null,
      source: 'sensor', confidence: 0.9, affected_hectares: null, wind_direction: null,
      wind_speed: null, humidity: null, temperature: null, detected_at: '2026-11-01T00:00:00Z',
      created_at: '2026-11-01T00:00:00Z', updated_at: '2026-11-01T00:00:00Z',
    } as ApiIncidentRead);
    expect(inc.temperature).toBeNull();
    expect(inc.humidity).toBeNull();
    expect(inc.windSpeed).toBeNull();
    expect(inc.windDirection).toBeNull();
  });
});

// --- API client: pagination and session expiry ------------------------------

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('apiFetch', () => {
  let storage: MemoryStorage;
  let events: string[];

  beforeEach(() => {
    storage = new MemoryStorage();
    events = [];
    const target = new EventTarget();
    target.addEventListener('ignis:session-expired', e => events.push(e.type));
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', target);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps paginated lists (teams/resources/missions/evidence)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, { items: [{ id: 'a' }], total: 1, page: 1, size: 100, pages: 1 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { apiFetchItems } = await import('@/services/api/client');
    await expect(apiFetchItems('/api/v1/teams')).resolves.toEqual([{ id: 'a' }]);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/v1\/teams\?size=100$/);
  });

  it('401 with a token clears the session and signals expiry', async () => {
    storage.setItem('ignis_token', 'expired');
    storage.setItem('ignis_user', '{}');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(401, { detail: 'Credenciais inválidas' })));
    const { apiFetch } = await import('@/services/api/client');
    await expect(apiFetch('/api/v1/incidents')).rejects.toMatchObject({ status: 401 });
    expect(storage.getItem('ignis_token')).toBeNull();
    expect(events).toEqual(['ignis:session-expired']);
  });

  it('401 on login (wrong password) does not trigger session expiry', async () => {
    storage.setItem('ignis_token', 'old');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(401, { detail: 'Credenciais inválidas' })));
    const { apiFetch } = await import('@/services/api/client');
    await expect(apiFetch('/api/v1/auth/login', { method: 'POST' })).rejects.toMatchObject({ status: 401 });
    expect(events).toEqual([]);
  });

  it('422 validation detail (list) does not become "[object Object]"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(422, { detail: [{ msg: 'x' }] })));
    const { apiFetch } = await import('@/services/api/client');
    await expect(apiFetch('/api/v1/reports')).rejects.toMatchObject({ message: 'Erro HTTP 422' });
  });
});
