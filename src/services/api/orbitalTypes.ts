/**
 * Contract of the persisted orbital data (backend Sprint 1.3, app/orbital/read_schemas.py).
 * Everything here comes from PostGIS: no response is built from a live call to NASA/INPE.
 */

export type OrbitalSource = 'NASA_FIRMS' | 'INPE_QUEIMADAS';

/** live: recent successful ingestion · stale: old · degraded: some products failing ·
 *  unavailable: last attempt failed · disabled: not configured · never_ingested: no run yet. */
export type SourceState =
  | 'live'
  | 'stale'
  | 'degraded'
  | 'unavailable'
  | 'disabled'
  | 'never_ingested';

export interface JurisdictionRef {
  ibge_code: string;
  name: string;
}

export interface Detection {
  id: string;
  source: OrbitalSource;
  product: string;
  satellite: string;
  instrument: string;
  observed_at: string;
  ingested_at: string;
  lat: number;
  lng: number;
  jurisdiction: JurisdictionRef;
  /** VIIRS class; null for other sensors. */
  confidence: 'low' | 'nominal' | 'high' | null;
  /** MODIS percentage 0-100; null for other sensors. */
  confidence_pct: number | null;
  frp_mw: number | null;
  brightness_k: number | null;
  brightness_channel: 'VIIRS_I4' | 'MODIS_21_22' | null;
  daynight: 'D' | 'N' | null;
  provider_record_id: string | null;
  ingestion_run_id: string;
  persisted: true;
}

export interface DetectionDetail extends Detection {
  raw: Record<string, unknown>;
}

export interface ProductStatus {
  product: string;
  state: SourceState;
  last_attempt_at: string | null;
  last_attempt_status: string | null;
  last_error_code: string | null;
  last_success_at: string | null;
  running: boolean;
  origin: 'live' | 'fixture' | null;
}

export interface SourceStatus {
  source: OrbitalSource;
  label: string;
  state: SourceState;
  message: string;
  last_success_at: string | null;
  latest_observation_at: string | null;
  stale_after_minutes: number;
  origin: 'live' | 'fixture' | null;
  products: ProductStatus[];
}

export interface AppliedFilters {
  observed_from: string;
  observed_to: string;
  source: OrbitalSource | null;
  satellite: string | null;
  jurisdiction: string | null;
  bbox: number[] | null;
}

export interface DetectionPage {
  items: Detection[];
  total: number;
  page: number;
  size: number;
  pages: number;
  truncated: boolean;
  filters: AppliedFilters;
  sources: SourceStatus[];
  persisted: true;
  data_origin: 'postgis';
  disclaimer: string;
}

export interface CountBucket {
  key: string;
  count: number;
}

export interface DetectionStats {
  filters: AppliedFilters;
  total: number;
  municipalities_with_detections: number;
  by_source: CountBucket[];
  by_satellite: CountBucket[];
  by_day: { day: string; count: number }[];
  top_municipalities: { ibge_code: string; name: string; count: number }[];
  first_observed_at: string | null;
  last_observed_at: string | null;
  last_ingested_at: string | null;
  sources: SourceStatus[];
  disclaimer: string;
}

export interface DatasetRef {
  source: string;
  product: string;
  version: string;
  reference_date: string;
  content_sha256: string;
}

export interface MunicipalityList {
  items: { ibge_code: string; name: string; official_area_km2: number; detections: number }[];
  total: number;
  dataset: DatasetRef;
  filters: AppliedFilters;
}

export interface JurisdictionFeature {
  type: 'Feature';
  id: string;
  properties: { ibge_code: string; name: string; level: string; official_area_km2: number };
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export interface JurisdictionCollection {
  type: 'FeatureCollection';
  features: JurisdictionFeature[];
  dataset: DatasetRef;
  simplification_tolerance_deg: number;
}

export interface DetectionFilters {
  from: string;
  to: string;
  source?: OrbitalSource;
  satellite?: string;
  jurisdiction?: string;
}

export interface IngestAccepted {
  status: 'accepted' | 'nothing_started';
  round_id: string;
  message: string;
  runs: { run_id: string | null; source: string; product: string; status: 'running' | 'skipped_active' }[];
}
