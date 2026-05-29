import { apiFetch } from './client';
import type { ApiPage } from './types';

export interface ApiIncidentRead {
  id: string;
  code: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  protected_area_id: string | null;
  latitude: number | null;
  longitude: number | null;
  location_wkt: string | null;
  source: string;
  confidence: number;
  affected_hectares: number | null;
  wind_direction: string | null;
  wind_speed: number | null;
  humidity: number | null;
  temperature: number | null;
  detected_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiIncidentEventRead {
  id: string;
  incident_id: string;
  type: string;
  actor_id: string | null;
  actor_name: string;
  description: string;
  timestamp: string;
}

export interface ApiIncidentEventCreate {
  type: string;
  description: string;
  timestamp?: string;
}

export interface ApiIncidentStatusUpdate {
  status: string;
  reason?: string;
}

export function fetchIncidents(page = 1, size = 50): Promise<ApiPage<ApiIncidentRead>> {
  return apiFetch(`/api/v1/incidents?page=${page}&size=${size}`);
}

export function fetchIncident(id: string): Promise<ApiIncidentRead> {
  return apiFetch(`/api/v1/incidents/${id}`);
}

export function fetchCriticalIncidents(): Promise<ApiPage<ApiIncidentRead>> {
  return apiFetch('/api/v1/incidents/active/critical');
}

export function fetchIncidentTimeline(id: string): Promise<ApiIncidentEventRead[]> {
  return apiFetch(`/api/v1/incidents/${id}/timeline`);
}

export function addIncidentEvent(id: string, body: ApiIncidentEventCreate): Promise<ApiIncidentEventRead> {
  return apiFetch(`/api/v1/incidents/${id}/events`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function activateProtocol(id: string): Promise<ApiIncidentRead> {
  return apiFetch(`/api/v1/incidents/${id}/activate-protocol`, { method: 'POST' });
}

export function updateIncidentStatus(id: string, body: ApiIncidentStatusUpdate): Promise<ApiIncidentRead> {
  return apiFetch(`/api/v1/incidents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
