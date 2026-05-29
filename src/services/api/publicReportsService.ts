import { apiFetch } from './client';
import type { ApiReportCreate, ApiReportRead, ApiReportStatusPublic } from './types';

export async function submitReport(body: ApiReportCreate): Promise<ApiReportRead> {
  return apiFetch<ApiReportRead>('/api/v1/reports', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function lookupReport(protocol: string): Promise<ApiReportStatusPublic> {
  const params = new URLSearchParams({ protocol });
  return apiFetch<ApiReportStatusPublic>(`/api/v1/reports/lookup?${params}`);
}
