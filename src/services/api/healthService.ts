import { apiFetch } from './client';
import type { ApiHealthResponse } from './types';

export async function checkHealth(): Promise<ApiHealthResponse> {
  return apiFetch<ApiHealthResponse>('/health');
}

export async function checkReady(): Promise<{ status: string; database: string }> {
  return apiFetch('/ready');
}
