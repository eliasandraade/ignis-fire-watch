import { apiFetch } from './client';
import type { ApiIncidentRead, ApiIncidentEventRead } from './incidentsService';

export interface ApiWarRoomSummary {
  active_incidents: ApiIncidentRead[];
  total_active: number;
  by_severity: Record<string, number>;
  latest_events: ApiIncidentEventRead[];
}

export function fetchWarRoom(): Promise<ApiWarRoomSummary> {
  return apiFetch('/api/v1/war-room');
}

export function fetchWarRoomIncident(incidentId: string): Promise<ApiIncidentRead> {
  return apiFetch(`/api/v1/war-room/${incidentId}`);
}
