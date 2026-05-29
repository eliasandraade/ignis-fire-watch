import { apiFetch } from './client';

export interface ApiMissionRead {
  id: string;
  incident_id: string;
  team_id: string | null;
  status: string;
  objective: string;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiMissionCreate {
  incident_id: string;
  team_id?: string | null;
  objective: string;
  notes?: string | null;
}

export interface ApiMissionStatusUpdate {
  status: string;
  notes?: string | null;
}

export function fetchMissions(incidentId?: string): Promise<ApiMissionRead[]> {
  const qs = incidentId ? `?incident_id=${incidentId}` : '';
  return apiFetch(`/api/v1/missions${qs}`);
}

export function fetchMission(id: string): Promise<ApiMissionRead> {
  return apiFetch(`/api/v1/missions/${id}`);
}

export function createMission(body: ApiMissionCreate): Promise<ApiMissionRead> {
  return apiFetch('/api/v1/missions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateMission(id: string, body: Partial<ApiMissionCreate>): Promise<ApiMissionRead> {
  return apiFetch(`/api/v1/missions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function updateMissionStatus(id: string, body: ApiMissionStatusUpdate): Promise<ApiMissionRead> {
  return apiFetch(`/api/v1/missions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
