import { apiFetch } from './client';

export interface ApiAuroraAnalyzeRequest {
  incident_severity: string;
  incident_type: string;
  area_hectares?: number | null;
  wind_speed?: number | null;
  humidity?: number | null;
}

export interface ApiAuroraAnalyzeResponse {
  risk_level: string;
  recommended_actions: string[];
  priority_score: number;
  alerts: string[];
}

export interface ApiAuroraChatRequest {
  message: string;
  context?: string | null;
}

export interface ApiAuroraChatResponse {
  response: string;
  confidence: number;
  suggested_actions: string[];
}

export function analyzeIncident(body: ApiAuroraAnalyzeRequest): Promise<ApiAuroraAnalyzeResponse> {
  return apiFetch('/api/v1/aurora/analyze', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function chatWithAurora(body: ApiAuroraChatRequest): Promise<ApiAuroraChatResponse> {
  return apiFetch('/api/v1/aurora/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
