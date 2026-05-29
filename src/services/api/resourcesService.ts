import { apiFetch } from './client';

export interface ApiResourceRead {
  id: string;
  name: string;
  type: string;
  status: string;
  quantity: number;
  location: string | null;
  assigned_incident_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResourceUpdate {
  name?: string;
  type?: string;
  status?: string;
  quantity?: number;
  location?: string | null;
  assigned_incident_id?: string | null;
}

export function fetchResources(incidentId?: string): Promise<ApiResourceRead[]> {
  const qs = incidentId ? `?incident_id=${incidentId}` : '';
  return apiFetch(`/api/v1/resources${qs}`);
}

export function fetchResource(id: string): Promise<ApiResourceRead> {
  return apiFetch(`/api/v1/resources/${id}`);
}

export function updateResource(id: string, body: ApiResourceUpdate): Promise<ApiResourceRead> {
  return apiFetch(`/api/v1/resources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
