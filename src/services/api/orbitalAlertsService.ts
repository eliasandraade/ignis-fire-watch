import { apiFetch } from './client';
import type { ApiIngestResponse, ApiOrbitalAlertListResponse } from './types';

export async function fetchOrbitalAlerts(): Promise<ApiOrbitalAlertListResponse> {
  return apiFetch<ApiOrbitalAlertListResponse>('/api/v1/orbital-alerts');
}

export async function triggerIngest(): Promise<ApiIngestResponse> {
  return apiFetch<ApiIngestResponse>('/api/v1/orbital-alerts/ingest', {
    method: 'POST',
  });
}
