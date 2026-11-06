import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchIncidents } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import type { Incident } from '@/types/domain';

const CLOSED_STATUSES = ['extinto', 'encerrado'];

export function useIncidents() {
  const query = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const page = await fetchIncidents(1, 50);
      return page.items.map(inc => adaptApiIncident(inc));
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  // Nunca substituir por ocorrências fictícias: um "incidente crítico" inventado
  // em uma falha de API é um alarme falso.
  const incidents: Incident[] = query.isSuccess ? query.data : [];

  return {
    incidents,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, incidents.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}

export function useActiveIncidents() {
  const { incidents, loading, fromApi, dataSource, error } = useIncidents();
  const active = incidents.filter(i => !CLOSED_STATUSES.includes(i.status));
  return { incidents: active, loading, fromApi, dataSource, error };
}

export function useCriticalIncident() {
  const { incidents, loading, fromApi, dataSource, error } = useIncidents();
  const critical =
    incidents.find(i => i.risk === 'critical' && !CLOSED_STATUSES.includes(i.status)) ?? null;
  return { incident: critical, loading, fromApi, dataSource, error };
}
