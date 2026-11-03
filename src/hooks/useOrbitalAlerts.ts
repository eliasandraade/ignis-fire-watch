import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchOrbitalAlerts } from '@/services/api/orbitalAlertsService';
import type { ApiOrbitalAlert, ApiOrbitalAlertListResponse } from '@/services/api/types';

export const THERMAL_ANOMALY_DISCLAIMER =
  'Focos de calor são anomalias térmicas detectadas por satélite; não confirmam incêndio.';

// Demo-only alerts (VITE_USE_API=false). Flagged is_demo and never labelled as NASA data.
const DEMO_ALERTS: ApiOrbitalAlert[] = [
  {
    id: 'demo-firms-001', type: 'heat_spot', lat: -4.2, lng: -38.5, area_id: null,
    confidence: 75, source: 'DEMO', detected_at: '2026-05-31T10:00:00Z',
    fetched_at: '2026-05-31T12:00:00Z', converted_to_incident_id: null, is_demo: true,
  },
  {
    id: 'demo-firms-002', type: 'heat_spot', lat: -4.5, lng: -39.1, area_id: null,
    confidence: 45, source: 'DEMO', detected_at: '2026-05-31T09:30:00Z',
    fetched_at: '2026-05-31T12:00:00Z', converted_to_incident_id: null, is_demo: true,
  },
  {
    id: 'demo-firms-003', type: 'heat_spot', lat: -3.8, lng: -40.2, area_id: null,
    confidence: 85, source: 'DEMO', detected_at: '2026-05-30T22:00:00Z',
    fetched_at: '2026-05-31T06:00:00Z', converted_to_incident_id: null, is_demo: true,
  },
];

export const DEMO_ORBITAL_RESPONSE: ApiOrbitalAlertListResponse = {
  items: DEMO_ALERTS,
  total: DEMO_ALERTS.length,
  source_status: 'demo',
  data_origin: 'demo',
  persisted: false,
  since: null,
  cached_at: null,
  fetched_at: null,
  message: 'Modo demonstrativo: focos fictícios.',
};

export const UNAVAILABLE_ORBITAL_RESPONSE: ApiOrbitalAlertListResponse = {
  items: [],
  total: 0,
  source_status: 'unavailable',
  data_origin: 'none',
  persisted: false,
  since: null,
  cached_at: null,
  fetched_at: null,
  message: 'Não foi possível consultar a API de alertas orbitais.',
};

export interface OrbitalAlertsView {
  alerts: ApiOrbitalAlert[];
  total: number;
  sourceStatus: ApiOrbitalAlertListResponse['source_status'];
  /** Real NASA FIRMS data (live or cached). */
  isRealData: boolean;
  isDemo: boolean;
  isKeyMissing: boolean;
  isUnavailable: boolean;
  /** When NASA FIRMS was actually queried (null for demo / no data). */
  fetchedAt: string | null;
  message: string | null;
  disclaimer: string;
}

/** Pure mapping — kept separate so the honest-state rules are unit-tested. */
export function toOrbitalAlertsView(data: ApiOrbitalAlertListResponse): OrbitalAlertsView {
  const status = data.source_status;
  const isDemo =
    status === 'demo' || data.data_origin === 'demo' || data.items.some(a => a.is_demo);
  const isRealData = !isDemo && (status === 'live' || status === 'cached');
  return {
    // Defensive: an API version that still mixes demo items into real statuses
    // must not have them shown as detections.
    alerts: isRealData ? data.items.filter(a => !a.is_demo) : data.items,
    total: isRealData ? data.items.filter(a => !a.is_demo).length : data.total,
    sourceStatus: isDemo ? 'demo' : status,
    isRealData,
    isDemo,
    isKeyMissing: status === 'disabled_missing_api_key',
    isUnavailable: status === 'unavailable',
    fetchedAt: isRealData ? data.fetched_at ?? data.cached_at ?? null : null,
    message: data.message ?? null,
    disclaimer: data.disclaimer ?? THERMAL_ANOMALY_DISCLAIMER,
  };
}

export function useOrbitalAlerts() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['orbital-alerts'],
    queryFn: fetchOrbitalAlerts,
    enabled: apiEnabled,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  const data: ApiOrbitalAlertListResponse = !apiEnabled
    ? DEMO_ORBITAL_RESPONSE
    : query.isSuccess
      ? query.data
      : UNAVAILABLE_ORBITAL_RESPONSE;

  const view = toOrbitalAlertsView(data);
  return {
    ...view,
    loading: query.isLoading,
    /** @deprecated use isRealData */
    fromApi: view.isRealData,
  };
}

/** Short status text for cards. Never claims real-time data. */
export function orbitalStatusLabel(v: OrbitalAlertsView): string {
  if (v.isDemo) return 'Dados demonstrativos (fictícios)';
  if (v.isKeyMissing) return 'NASA FIRMS desativada (chave não configurada)';
  if (v.isUnavailable) return 'Fonte indisponível no momento';
  const when = v.fetchedAt ? new Date(v.fetchedAt).toLocaleString('pt-BR') : 'horário desconhecido';
  return `NASA FIRMS VIIRS NRT · consultado em ${when}`;
}
