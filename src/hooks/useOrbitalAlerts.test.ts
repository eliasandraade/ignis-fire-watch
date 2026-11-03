import { describe, expect, it } from 'vitest';
import {
  DEMO_ORBITAL_RESPONSE,
  UNAVAILABLE_ORBITAL_RESPONSE,
  orbitalStatusLabel,
  toOrbitalAlertsView,
} from '@/hooks/useOrbitalAlerts';
import type { ApiOrbitalAlert, ApiOrbitalAlertListResponse } from '@/services/api/types';

const realAlert: ApiOrbitalAlert = {
  id: 'a1', type: 'heat_spot', lat: -4.2, lng: -38.5, area_id: null, confidence: 60,
  source: 'NASA_FIRMS_VIIRS', detected_at: '2026-11-02T15:30:00Z',
  fetched_at: '2026-11-03T10:00:00Z', converted_to_incident_id: null, is_demo: false,
};

function response(over: Partial<ApiOrbitalAlertListResponse>): ApiOrbitalAlertListResponse {
  return {
    items: [], total: 0, source_status: 'live', since: null, cached_at: null, ...over,
  };
}

describe('toOrbitalAlertsView', () => {
  it('live NASA data is real and carries the fetch time', () => {
    const v = toOrbitalAlertsView(response({
      items: [realAlert], total: 1, data_origin: 'nasa_firms', fetched_at: realAlert.fetched_at,
    }));
    expect(v.isRealData).toBe(true);
    expect(v.total).toBe(1);
    expect(v.fetchedAt).toBe(realAlert.fetched_at);
    expect(orbitalStatusLabel(v)).toMatch(/NASA FIRMS VIIRS NRT · consultado em/);
  });

  it('demo response is never real data', () => {
    const v = toOrbitalAlertsView(DEMO_ORBITAL_RESPONSE);
    expect(v.isDemo).toBe(true);
    expect(v.isRealData).toBe(false);
    expect(v.fetchedAt).toBeNull();
    expect(DEMO_ORBITAL_RESPONSE.items.every(a => !a.source.startsWith('NASA'))).toBe(true);
    expect(orbitalStatusLabel(v)).toMatch(/demonstrativos/);
  });

  it('regression: demo items under status "live" (old API) are flagged as demo', () => {
    const v = toOrbitalAlertsView(response({
      items: [{ ...realAlert, id: 'demo-firms-001', is_demo: true }], total: 1,
    }));
    expect(v.isRealData).toBe(false);
    expect(v.isDemo).toBe(true);
  });

  it('API failure shows no detections and is not blamed on a missing key', () => {
    const v = toOrbitalAlertsView(UNAVAILABLE_ORBITAL_RESPONSE);
    expect(v.alerts).toHaveLength(0);
    expect(v.isUnavailable).toBe(true);
    expect(v.isKeyMissing).toBe(false);
    expect(orbitalStatusLabel(v)).toMatch(/indisponível/);
  });

  it('missing key shows no detections', () => {
    const v = toOrbitalAlertsView(response({ source_status: 'disabled_missing_api_key' }));
    expect(v.isKeyMissing).toBe(true);
    expect(v.isRealData).toBe(false);
    expect(v.total).toBe(0);
  });

  it('always carries the thermal-anomaly disclaimer', () => {
    expect(toOrbitalAlertsView(DEMO_ORBITAL_RESPONSE).disclaimer).toMatch(/não confirmam incêndio/);
  });
});
