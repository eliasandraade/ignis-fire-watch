import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchIncident, fetchIncidentTimeline } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import type { Incident } from '@/types/domain';

export function useIncidentDetail(id: string | undefined) {
  const incidentQuery = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const timelineQuery = useQuery({
    queryKey: ['incident-timeline', id],
    queryFn: () => fetchIncidentTimeline(id!),
    enabled: !!id && incidentQuery.isSuccess,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const incident: Incident | null = incidentQuery.isSuccess
    ? adaptApiIncident(incidentQuery.data, timelineQuery.data ?? [])
    : null;

  return {
    incident,
    loading: incidentQuery.isLoading,
    fromApi: incidentQuery.isSuccess,
    dataSource: createDataSourceMeta(incidentQuery.isSuccess, incident !== null, incidentQuery.isLoading),
    error: incidentQuery.isError ? incidentQuery.error : null,
  };
}
