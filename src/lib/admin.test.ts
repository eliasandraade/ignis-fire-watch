import { describe, expect, it } from 'vitest';
import { formatDateTime, formatDuration, formatRelative, fortalezaInputToIso, parseApiDate } from './time';
import { allows, generatePassword, operationsOf } from './adminHelpers';
import { errorMessage, describeError } from './apiErrors';
import { adminCrumbs, crumbsFor, ADMIN_NAV, OPERATION_NAV } from './navigation';
import { homeForRole, ROLE_LABEL } from './roles';
import { actionLabel, actionTone } from './adminLabels';
import { ApiError } from '@/services/api/errors';
import { adaptApiUser, getRouteForRole } from '@/services/adapters/authAdapter';

describe('time (Fortaleza)', () => {
  it('shows UTC instants in Fortaleza time, also for naive UTC strings', () => {
    expect(formatDateTime('2026-11-04T15:30:00Z')).toBe('04/11/2026, 12:30');
    expect(formatDateTime('2026-11-04T15:30:00')).toBe('04/11/2026, 12:30');
    expect(formatDateTime(null, 'nunca')).toBe('nunca');
    expect(parseApiDate('not a date')).toBeNull();
  });

  it('relative and durations never invent values', () => {
    const now = Date.parse('2026-11-04T15:30:00Z');
    expect(formatRelative('2026-11-04T15:25:00Z', now)).toBe('há 5 min');
    expect(formatRelative('2026-11-04T12:30:00Z', now)).toBe('há 3 h');
    expect(formatRelative(null, now)).toBe('—');
    expect(formatDuration('2026-11-04T15:00:00Z', null)).toBe('—');
    expect(formatDuration('2026-11-04T15:00:00Z', '2026-11-04T15:00:02.500Z')).toBe('2,5 s');
  });

  it('converts a Fortaleza date-time input to UTC for the API filters', () => {
    expect(fortalezaInputToIso('2026-11-04T09:00')).toBe('2026-11-04T12:00:00.000Z');
    expect(fortalezaInputToIso('')).toBeUndefined();
  });
});

describe('permissions mirror', () => {
  it('follows the hierarchical levels of the API', () => {
    expect(allows('admin', 'gestor')).toBe(false);
    expect(allows('gestor', 'orgao')).toBe(true);
    expect(allows('campo', 'campo')).toBe(true);
    expect(allows('público', 'campo')).toBe(true);
    expect(allows('autenticado', 'publico')).toBe(true);
    expect(allows('admin', 'desconhecido')).toBe(false);
  });
});

describe('provisional password generator', () => {
  it('meets the API policy (length, variety) and is random', () => {
    const a = generatePassword();
    const b = generatePassword();
    expect(a).toHaveLength(16);
    expect(new Set(a).size).toBeGreaterThanOrEqual(5);
    expect(a).not.toBe(b);
  });
});

describe('OpenAPI explorer', () => {
  it('lists every operation with tag, auth and parameters', () => {
    const ops = operationsOf({
      paths: {
        '/a/{id}': {
          get: { tags: ['x'], summary: 'S', parameters: [{ name: 'id', in: 'path', required: true }], security: [{ b: [] }] },
          post: { requestBody: {} },
        },
      },
    });
    expect(ops).toHaveLength(2);
    expect(ops[0]).toMatchObject({ method: 'GET', path: '/a/{id}', tag: 'x', secured: true });
    expect(ops[1]).toMatchObject({ method: 'POST', tag: 'outros', hasBody: true, secured: false });
  });
});

describe('API errors', () => {
  it('turns FastAPI 422 lists into field messages', () => {
    const err = new ApiError(422, 'Erro HTTP 422', {
      detail: [{ loc: ['body', 'temporary_password'], msg: 'Value error, A senha deve ter pelo menos 12 caracteres.' }],
    });
    expect(errorMessage(err)).toBe('Senha provisória: A senha deve ter pelo menos 12 caracteres.');
  });

  it('explains unavailability without inventing a cause', () => {
    expect(describeError(new ApiError(0, 'sem rede')).title).toBe('Serviço temporariamente indisponível');
    expect(describeError(new ApiError(503, 'x')).title).toBe('Serviço temporariamente indisponível');
    expect(describeError(new ApiError(403, 'Somente administrador')).detail).toBe('Somente administrador');
    expect(errorMessage(new Error('x'))).toBe('Erro inesperado. Tente novamente.');
  });
});

describe('navigation', () => {
  it('groups the admin cockpit and has breadcrumbs for every page', () => {
    const paths = ADMIN_NAV.flatMap(g => g.items.map(i => i.to));
    expect(paths).toEqual(expect.arrayContaining(['/admin', '/admin/users', '/admin/permissions', '/admin/sources', '/admin/jobs', '/admin/api', '/admin/audit', '/admin/settings']));
    for (const path of paths.filter(p => p.startsWith('/admin/'))) {
      expect(adminCrumbs(path)).toHaveLength(2);
    }
    expect(crumbsFor('/gestor/reports/abc').map(c => c.label)).toEqual(['Operação', 'Denúncias', 'Validação']);
  });

  it('keeps unvalidated features out of the operational menu', () => {
    const labels = OPERATION_NAV.flatMap(g => g.items.map(i => i.label)).join(' ');
    expect(labels).not.toMatch(/Aurora|ESG|Economia|Ranking/);
  });
});

describe('roles and session routing', () => {
  it('sends each role to its area and a pending password change first', () => {
    expect(homeForRole('admin')).toBe('/admin');
    expect(homeForRole('campo')).toBe('/gestor/field');
    expect(homeForRole('publico')).toBe('/public');
    expect(getRouteForRole('gestor', true)).toBe('/conta/senha');
    expect(ROLE_LABEL.orgao).toBe('Órgão / analista');
  });

  it('reads must_change_password and never escalates an unknown role', () => {
    const base = { id: '1', name: 'n', email: 'e', team_id: null, is_active: true, created_at: '', updated_at: '' };
    expect(adaptApiUser({ ...base, role: 'superadmin' }).role).toBe('publico');
    expect(adaptApiUser({ ...base, role: 'gestor', must_change_password: true }).mustChangePassword).toBe(true);
  });
});

describe('audit labels', () => {
  it('labels known actions and flags denials', () => {
    expect(actionLabel('user.role_changed')).toBe('Papel alterado');
    expect(actionLabel('custom.action')).toBe('custom.action');
    expect(actionTone('user.deactivate.denied')).toBe('err');
  });
});
