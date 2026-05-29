import { apiFetch } from './client';
import type { ApiPage } from './types';

export interface ApiESGReportRead {
  id: string;
  protected_area_id: string | null;
  period_start: string;
  period_end: string;
  monitored_area_ha: number;
  incidents_resolved: number;
  average_response_minutes: number;
  heat_spots_detected: number;
  vegetation_loss_estimated_ha: number;
  prevented_impact_estimate: number;
  ods: string[];
  created_at: string;
}

export interface ApiESGReportCreate {
  protected_area_id?: string | null;
  period_start: string;
  period_end: string;
  monitored_area_ha: number;
  incidents_resolved: number;
  average_response_minutes: number;
  heat_spots_detected: number;
  vegetation_loss_estimated_ha: number;
  prevented_impact_estimate: number;
  ods?: string[];
}

export function fetchESGReports(): Promise<ApiPage<ApiESGReportRead>> {
  return apiFetch('/api/v1/esg?page=1&size=20');
}

export function fetchESGReport(id: string): Promise<ApiESGReportRead> {
  return apiFetch(`/api/v1/esg/${id}`);
}

export function createESGReport(body: ApiESGReportCreate): Promise<ApiESGReportRead> {
  return apiFetch('/api/v1/esg', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
