import { apiFetch } from './client';
import type { ApiPage } from './types';

export interface ApiAuditLogRead {
  id: string;
  user_id: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
}

export interface ApiAdminStats {
  total_users: number;
  total_incidents: number;
  total_reports: number;
  total_protected_areas: number;
  active_incidents: number;
  pending_reports: number;
}

export interface ApiUserRead {
  id: string;
  name: string;
  email: string;
  role: string;
  team_id: string | null;
  created_at: string;
}

export function fetchAuditLogs(page = 1, size = 20): Promise<ApiPage<ApiAuditLogRead>> {
  return apiFetch(`/api/v1/admin/audit-logs?page=${page}&size=${size}`);
}

export function fetchAdminStats(): Promise<ApiAdminStats> {
  return apiFetch('/api/v1/admin/stats');
}

export function fetchAdminUsers(page = 1, size = 50): Promise<ApiPage<ApiUserRead>> {
  return apiFetch(`/api/v1/admin/users?page=${page}&size=${size}`);
}
