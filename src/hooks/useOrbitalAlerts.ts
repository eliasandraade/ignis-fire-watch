import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchOrbitalAlerts } from '@/services/api/orbitalAlertsService';
import type { ApiOrbitalAlert, ApiOrbitalAlertListResponse } from '@/services/api/types';

const FALLBACK_ALERTS: ApiOrbitalAlert[] = [
  {
    id: 'demo-firms-001',
    type: 'heat_spot',
    lat: -4.2,
    lng: -38.5,
    area_id: null,
    confidence: 75,
    source: 'NASA_FIRMS_VIIRS',
    detected_at: '2026-05-31T10:00:00Z',
    fetched_at: '2026-05-31T12:00:00Z',
    converted_to_incident_id: null,
  },
  {
    id: 'demo-firms-002',
    type: 'heat_spot',
    lat: -4.5,
    lng: -39.1,
    area_id: null,
    confidence: 45,
    source: 'NASA_FIRMS_MODIS',
    detected_at: '2026-05-31T09:30:00Z',
    fetched_at: '2026-05-31T12:00:00Z',
    converted_to_incident_id: null,
  },
  {
    id: 'demo-firms-003',
    type: 'heat_spot',
    lat: -3.8,
    lng: -40.2,
    area_id: null,
    confidence: 85,
    source: 'NASA_FIRMS_VIIRS',
    detected_at: '2026-05-30T22:00:00Z',
    fetched_at: '2026-05-31T06:00:00Z',
    converted_to_incident_id: null,
  },
];

const FALLBACK_RESPONSE: ApiOrbitalAlertListResponse = {
  items: FALLBACK_ALERTS,
  total: FALLBACK_ALERTS.length,
  source_status: 'disabled_missing_api_key',
  since: null,
  cached_at: new Date().toISOString(),
};

export function useOrbitalAlerts() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['orbital-alerts'],
    queryFn: fetchOrbitalAlerts,
    enabled: apiEnabled,
    staleTime: 3 * 60 * 60 * 1000,
    retry: 1,
  });

  const data: ApiOrbitalAlertListResponse = query.isSuccess ? query.data : FALLBACK_RESPONSE;

  const isKeyMissing = data.source_status === 'disabled_missing_api_key';

  return {
    alerts: data.items,
    total: data.total,
    sourceStatus: data.source_status,
    isKeyMissing,
    loading: query.isLoading,
    fromApi: query.isSuccess && data.source_status !== 'disabled_missing_api_key',
  };
}
