import { apiFetch } from './client';
import type { ApiPage, ApiReportRead } from './types';

export function fetchInternalReports(page = 1, size = 50): Promise<ApiPage<ApiReportRead>> {
  return apiFetch(`/api/v1/reports?page=${page}&size=${size}`);
}

export function fetchInternalReport(id: string): Promise<ApiReportRead> {
  return apiFetch(`/api/v1/reports/${id}`);
}

export function validateReport(id: string, notes?: string): Promise<ApiReportRead> {
  const query = notes ? `?validation_notes=${encodeURIComponent(notes)}` : '';
  return apiFetch(`/api/v1/reports/${id}/validate${query}`, { method: 'PATCH' });
}

export function discardReport(id: string, notes?: string): Promise<ApiReportRead> {
  const query = notes ? `?validation_notes=${encodeURIComponent(notes)}` : '';
  return apiFetch(`/api/v1/reports/${id}/discard${query}`, { method: 'PATCH' });
}

export function convertReportToIncident(id: string): Promise<unknown> {
  return apiFetch(`/api/v1/reports/${id}/convert-to-incident`, { method: 'POST' });
}
