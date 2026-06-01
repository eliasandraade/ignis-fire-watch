export interface ApiPage<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiProtectedAreaRead {
  id: string;
  name: string;
  category: string;
  state: string;
  municipality: string | null;
  area_ha: number | null;
  description: string | null;
  management_body: string | null;
  geometry_wkt: string | null;
  buffer_zone_wkt: string | null;
  center_lat: number | null;
  center_lng: number | null;
  is_active: boolean;
  source: string | null;
  data_quality: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiReportCreate {
  type: string;
  description: string;
  urgency: string;
  latitude: number | null;
  longitude: number | null;
  protected_area_id: string | null;
  reporter_name: string | null;
  contact: string | null;
  is_anonymous: boolean;
}

export interface ApiReportRead {
  id: string;
  protocol: string;
  type: string;
  urgency: string;
  status: string;
  is_anonymous: boolean;
  protected_area_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiReportStatusPublic {
  protocol: string;
  type: string;
  urgency: string;
  status: string;
  is_anonymous: boolean;
  protected_area_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiUserRead {
  id: string;
  name: string;
  email: string;
  role: string;
  team_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: ApiUserRead;
}

export interface ApiHealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

// ── External integrations ─────────────────────────────────────────────────

export type ExternalSourceStatus = 'live' | 'cached' | 'unavailable';
export type OrbitalSourceStatus =
  | 'live'
  | 'cached'
  | 'disabled_missing_api_key'
  | 'unavailable';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface ApiWeatherRiskFactor {
  name: string;
  impact: 'low' | 'moderate' | 'high';
  description: string;
}

export interface ApiWeatherRiskResponse {
  source: string;
  source_status: ExternalSourceStatus;
  latitude: number;
  longitude: number;
  temperature_c: number | null;
  relative_humidity: number | null;
  wind_speed_kmh: number | null;
  wind_direction: number | null;
  precipitation_mm: number | null;
  risk_level: RiskLevel;
  risk_score: number;
  factors: ApiWeatherRiskFactor[];
  recommendation: string;
  fetched_at: string;
  cache_ttl_minutes: number;
}

export interface ApiOrbitalAlert {
  id: string;
  type: 'heat_spot' | 'burn_confirmed' | 'deforestation' | 'anomaly';
  lat: number;
  lng: number;
  area_id: string | null;
  confidence: number;
  source: string;
  detected_at: string;
  fetched_at: string;
  converted_to_incident_id: string | null;
}

export interface ApiOrbitalAlertListResponse {
  items: ApiOrbitalAlert[];
  total: number;
  source_status: OrbitalSourceStatus;
  since: string | null;
  cached_at: string | null;
}

export interface ApiIngestResponse {
  status: 'ok' | 'partial' | 'disabled_missing_api_key' | 'error';
  message: string;
  records_fetched: number;
  records_inserted: number;
  records_skipped: number;
}

export interface ApiReverseGeocodingResponse {
  source: string;
  latitude: number;
  longitude: number;
  display_name: string | null;
  municipality: string | null;
  state: string | null;
  country: string | null;
  cached: boolean;
  fetched_at: string;
}
