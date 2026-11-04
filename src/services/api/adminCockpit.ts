/**
 * Admin cockpit API (/api/v1/admin/*). Every call needs an admin token; the
 * backend enforces it, the UI only mirrors it.
 */
import { apiDownload, apiFetch } from './client';
import type { ApiPage } from './types';

export type Role = 'publico' | 'campo' | 'gestor' | 'orgao' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  team_id: string | null;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  row_version: number;
}

export interface AuditEvent {
  id: string;
  user_id: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
}

export interface IngestionRun {
  id: string;
  source: string;
  product: string;
  trigger: 'schedule' | 'manual';
  status: 'running' | 'ok' | 'partial' | 'unavailable' | 'disabled' | 'error';
  started_at: string;
  finished_at: string | null;
  window_start: string | null;
  window_end: string | null;
  records_fetched: number;
  records_valid: number;
  records_rejected: number;
  records_out_of_scope: number;
  records_inserted: number;
  records_duplicate: number;
  error_code: string | null;
  error_message: string | null;
  triggered_by_user_id: string | null;
  params: Record<string, unknown>;
}

export type SourceState = 'live' | 'stale' | 'degraded' | 'unavailable' | 'disabled' | 'never_ingested';

export interface ProductStatus {
  product: string;
  state: SourceState;
  last_attempt_at: string | null;
  last_attempt_status: string | null;
  last_error_code: string | null;
  last_success_at: string | null;
  running: boolean;
  origin: 'live' | 'fixture' | null;
  last_run?: IngestionRun | null;
}

export interface SourceStatus {
  source: string;
  label: string;
  state: SourceState;
  message: string;
  last_success_at: string | null;
  latest_observation_at: string | null;
  stale_after_minutes: number;
  origin: 'live' | 'fixture' | null;
  products: ProductStatus[];
  configuration?: {
    configured: boolean;
    detail: string;
    homologated: boolean;
    homologation_note: string;
  };
}

export interface Overview {
  generated_at: string;
  api: { status: string; version: string; environment: string; process_started_at: string; note: string };
  database: {
    status: 'connected' | 'unreachable';
    latency_ms: number | null;
    measured_at: string;
    postgres_version?: string;
    postgis_version?: string;
  };
  worker: {
    state: 'recent_runs' | 'no_recent_runs' | 'no_evidence';
    last_scheduled_run_at: string | null;
    last_scheduled_status: string | null;
    scheduled_runs_last_24h: number;
    note: string;
  };
  data: {
    detections_total: number;
    detections_last_24h: number;
    municipalities_monitored: number;
    municipalities_with_detections_7d: number;
    last_ingested_at: string | null;
  };
  ingestion: {
    failures_last_7d: number;
    history_30d: { day: string; ok: number; failed: number; running: number }[];
    recent_runs: IngestionRun[];
  };
  sources: SourceStatus[];
  users: {
    active: number;
    inactive: number;
    must_change_password: number;
    by_role: Record<string, { active: number; inactive: number }>;
  };
  recent_audit: AuditEvent[];
  unavailable_metrics: string[];
}

export interface SourcesView {
  sources: SourceStatus[];
  reference_data: {
    source: string;
    product: string;
    state: 'loaded' | 'missing';
    dataset: Record<string, unknown> | null;
    detail: string;
  }[];
}

export interface PermissionsView {
  model: string;
  note: string;
  roles: { role: Role; label: string; level: number; description: string }[];
  endpoints: { method: string; path: string; tag: string; summary: string; access: string }[];
}

export interface SettingsView {
  managed_by: string;
  application: Record<string, unknown>;
  data_sources: Record<string, unknown>;
  security: Record<string, unknown>;
}

const qs = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
};

export const fetchOverview = () => apiFetch<Overview>('/api/v1/admin/overview');
export const fetchSources = () => apiFetch<SourcesView>('/api/v1/admin/sources');
export const fetchPermissions = () => apiFetch<PermissionsView>('/api/v1/admin/permissions');
export const fetchSettings = () => apiFetch<SettingsView>('/api/v1/admin/settings');
export const fetchProtectedOpenApi = () =>
  apiFetch<Record<string, unknown>>('/api/v1/admin/openapi.json');

export interface RunFilters {
  page: number;
  size?: number;
  source?: string;
  status?: string;
  trigger?: string;
  from?: string;
  to?: string;
}
export const fetchRuns = (f: RunFilters) =>
  apiFetch<ApiPage<IngestionRun>>(`/api/v1/admin/ingestion-runs${qs({ size: 20, ...f })}`);
export const fetchRun = (id: string) =>
  apiFetch<IngestionRun>(`/api/v1/admin/ingestion-runs/${encodeURIComponent(id)}`);

/** Manual ingestion through the existing, audited endpoint (202; concurrent runs are refused). */
export interface IngestAccepted {
  status: 'accepted' | 'nothing_started';
  round_id: string;
  message: string;
  runs: { run_id: string | null; source: string; product: string; status: 'running' | 'skipped_active' }[];
}
export const triggerIngestion = (sources?: ('firms' | 'inpe')[]) =>
  apiFetch<IngestAccepted>('/api/v1/orbital-alerts/ingest', {
    method: 'POST',
    body: JSON.stringify(sources ? { sources } : {}),
  });

export interface UserFilters {
  page: number;
  size?: number;
  q?: string;
  role?: string;
  status?: string;
}
export const fetchUsers = (f: UserFilters) =>
  apiFetch<ApiPage<AdminUser>>(`/api/v1/admin/users${qs({ size: 20, ...f })}`);
export const fetchUser = (id: string) => apiFetch<AdminUser>(`/api/v1/admin/users/${id}`);
export const fetchUserHistory = (id: string, page = 1) =>
  apiFetch<ApiPage<AuditEvent>>(`/api/v1/admin/users/${id}/audit${qs({ page, size: 10 })}`);

export interface CreateUserBody {
  name: string;
  email: string;
  role: Role;
  team_id?: string | null;
  temporary_password: string;
  reason?: string;
}
export const createUser = (body: CreateUserBody) =>
  apiFetch<AdminUser>('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(body) });

export interface ProfileBody {
  expected_version: number;
  name?: string;
  email?: string;
  team_id?: string | null;
}
export const updateProfile = (id: string, body: ProfileBody) =>
  apiFetch<AdminUser>(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export interface GuardedBody {
  expected_version: number;
  confirm_password: string;
  reason: string;
}
const post = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const changeRole = (id: string, body: GuardedBody & { role: Role }) =>
  post<AdminUser>(`/api/v1/admin/users/${id}/role`, body);
export const setActive = (id: string, active: boolean, body: GuardedBody) =>
  post<AdminUser>(`/api/v1/admin/users/${id}/${active ? 'activate' : 'deactivate'}`, body);
export const resetPassword = (id: string, body: GuardedBody & { temporary_password: string }) =>
  post<AdminUser>(`/api/v1/admin/users/${id}/reset-password`, body);

export interface AuditFilters {
  page: number;
  size?: number;
  action?: string;
  entity_type?: string;
  actor?: string;
  involving_user?: string;
  from?: string;
  to?: string;
}
export const fetchAudit = (f: AuditFilters) =>
  apiFetch<ApiPage<AuditEvent>>(`/api/v1/admin/audit-logs${qs({ size: 25, ...f })}`);

export const exportAudit = (f: Omit<AuditFilters, 'page' | 'size'>) =>
  apiDownload(`/api/v1/admin/audit-logs/export${qs(f)}`);

export const fetchTeams = () =>
  apiFetch<ApiPage<{ id: string; name: string }>>('/api/v1/teams?size=100');
