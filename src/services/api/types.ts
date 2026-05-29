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
