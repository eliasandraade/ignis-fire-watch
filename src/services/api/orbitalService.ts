import { apiFetch } from './client';
import type {
  DetectionDetail,
  DetectionFilters,
  DetectionPage,
  DetectionStats,
  IngestAccepted,
  JurisdictionCollection,
  MunicipalityList,
  SourceStatus,
} from './orbitalTypes';

/** Map size: the API caps one page at 5000; `truncated` says when there is more. */
export const MAP_PAGE_SIZE = 5000;

export function filterQuery(f: DetectionFilters): string {
  const params = new URLSearchParams({ from: f.from, to: f.to });
  if (f.source) params.set('source', f.source);
  if (f.satellite) params.set('satellite', f.satellite);
  if (f.jurisdiction) params.set('jurisdiction', f.jurisdiction);
  return params.toString();
}

export function fetchDetections(f: DetectionFilters, size = MAP_PAGE_SIZE): Promise<DetectionPage> {
  return apiFetch<DetectionPage>(`/api/v1/orbital-alerts?${filterQuery(f)}&size=${size}`);
}

export function fetchDetection(id: string): Promise<DetectionDetail> {
  return apiFetch<DetectionDetail>(`/api/v1/orbital-alerts/${encodeURIComponent(id)}`);
}

export function fetchDetectionStats(f: DetectionFilters): Promise<DetectionStats> {
  return apiFetch<DetectionStats>(`/api/v1/orbital-alerts/stats?${filterQuery(f)}`);
}

export function fetchSources(): Promise<SourceStatus[]> {
  return apiFetch<SourceStatus[]>('/api/v1/orbital-alerts/sources');
}

export function fetchMunicipalities(f: Pick<DetectionFilters, 'from' | 'to' | 'source'>): Promise<MunicipalityList> {
  const params = new URLSearchParams({ from: f.from, to: f.to });
  if (f.source) params.set('source', f.source);
  return apiFetch<MunicipalityList>(`/api/v1/jurisdictions/municipalities?${params}`);
}

export function fetchJurisdictionGeoJSON(level: 'state' | 'municipality'): Promise<JurisdictionCollection> {
  return apiFetch<JurisdictionCollection>(`/api/v1/jurisdictions/geojson?level=${level}`);
}

/** Admin only. The 202 answer lists the runs created; it never states a result. */
export function triggerIngest(sources?: ('firms' | 'inpe')[]): Promise<IngestAccepted> {
  return apiFetch<IngestAccepted>('/api/v1/orbital-alerts/ingest', {
    method: 'POST',
    body: JSON.stringify(sources ? { sources } : {}),
  });
}
