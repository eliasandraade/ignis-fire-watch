import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchIncidents } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import {
  FALLBACK_INCIDENTS,
  getFallbackActiveIncidents,
  getFallbackCriticalIncident,
} from '@/data/fallback';
import type { Incident } from '@/types/domain';

export function useIncidents() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const page = await fetchIncidents(1, 50);
      return page.items.map(inc => adaptApiIncident(inc));
    },
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { incidents: FALLBACK_INCIDENTS, loading: false, fromApi: false, dataSource, error: null };
  }

  // API mode: never substitute mock incidents. A fake "critical incident"
  // on an API failure is a false alarm (the global banner reports the outage).
  const incidents: Incident[] = query.isSuccess ? query.data : [];
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    incidents,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
    error: query.isError ? query.error : null,
  };
}

export function useActiveIncidents() {
  const { incidents, loading, fromApi, dataSource, error } = useIncidents();
  const active = isApiEnabled()
    ? incidents.filter(i => !['extinto', 'encerrado'].includes(i.status))
    : getFallbackActiveIncidents();
  return { incidents: active, loading, fromApi, dataSource, error };
}

export function useCriticalIncident() {
  const { incidents, loading, fromApi, dataSource, error } = useIncidents();
  const critical = isApiEnabled()
    ? incidents.find(i => i.risk === 'critical' && !['extinto', 'encerrado'].includes(i.status)) ?? null
    : getFallbackCriticalIncident() ?? null;
  return { incident: critical, loading, fromApi, dataSource, error };
}
