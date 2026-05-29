import { apiFetch } from './client';

export interface ApiEvidenceRead {
  id: string;
  incident_id: string | null;
  report_id: string | null;
  type: string;
  url: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_wkt: string | null;
  source: string | null;
  created_at: string;
}

export interface ApiEvidenceCreate {
  incident_id?: string | null;
  report_id?: string | null;
  type: string;
  url: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  source?: string | null;
}

export function fetchEvidence(incidentId?: string): Promise<ApiEvidenceRead[]> {
  const qs = incidentId ? `?incident_id=${incidentId}` : '';
  return apiFetch(`/api/v1/evidence${qs}`);
}

export function fetchEvidenceItem(id: string): Promise<ApiEvidenceRead> {
  return apiFetch(`/api/v1/evidence/${id}`);
}

export function createEvidence(body: ApiEvidenceCreate): Promise<ApiEvidenceRead> {
  return apiFetch('/api/v1/evidence', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
