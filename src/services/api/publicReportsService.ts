import { apiFetch } from './client';
import { isApiError } from './errors';
import type { ApiReportCreate, ApiReportRead, ApiReportStatusPublic } from './types';

export interface ReportIntake {
  accepting: boolean;
  message: string | null;
}

/** Whether this installation receives public reports (closed in staging/production by default). */
export async function getReportIntake(): Promise<ReportIntake> {
  return apiFetch<ReportIntake>('/api/v1/reports/intake');
}

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

/**
 * Lookup that distinguishes "protocol does not exist" (404 → null) from a real
 * failure (network/5xx → throws). A 404 is an answer, not an outage.
 */
export async function lookupReportOrNull(protocol: string): Promise<ApiReportStatusPublic | null> {
  try {
    return await lookupReport(protocol);
  } catch (err) {
    if (isApiError(err) && err.status === 404) return null;
    throw err;
  }
}
