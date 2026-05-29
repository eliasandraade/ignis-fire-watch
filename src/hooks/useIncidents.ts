import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchIncidents } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { INCIDENTS, getActiveIncidents, getCriticalIncident } from '@/data/incidents';
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
    return { incidents: INCIDENTS, loading: false, fromApi: false, error: null };
  }

  const incidents: Incident[] = query.isSuccess && query.data.length > 0
    ? query.data
    : INCIDENTS;

  return {
    incidents,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
    error: query.isError ? query.error : null,
  };
}

export function useActiveIncidents() {
  const { incidents, loading, fromApi, error } = useIncidents();
  const active = fromApi
    ? incidents.filter(i => !['extinto', 'encerrado'].includes(i.status))
    : getActiveIncidents();
  return { incidents: active, loading, fromApi, error };
}

export function useCriticalIncident() {
  const { incidents, loading, fromApi, error } = useIncidents();
  const critical = fromApi
    ? incidents.find(i => i.risk === 'critical' && !['extinto', 'encerrado'].includes(i.status)) ?? null
    : getCriticalIncident() ?? null;
  return { incident: critical, loading, fromApi, error };
}
