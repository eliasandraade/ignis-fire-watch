import { apiFetch } from './client';

export interface ApiFieldTeamRead {
  id: string;
  name: string;
  type: string;
  status: string;
  current_latitude: number | null;
  current_longitude: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiFieldTeamUpdate {
  name?: string;
  type?: string;
  status?: string;
  current_latitude?: number | null;
  current_longitude?: number | null;
  notes?: string | null;
}

export function fetchTeams(): Promise<ApiFieldTeamRead[]> {
  return apiFetch('/api/v1/teams');
}

export function fetchTeam(id: string): Promise<ApiFieldTeamRead> {
  return apiFetch(`/api/v1/teams/${id}`);
}

export function updateTeam(id: string, body: ApiFieldTeamUpdate): Promise<ApiFieldTeamRead> {
  return apiFetch(`/api/v1/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
