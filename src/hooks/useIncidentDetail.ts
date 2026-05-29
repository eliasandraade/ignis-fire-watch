import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchIncident, fetchIncidentTimeline } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { getIncidentById } from '@/data/incidents';
import type { Incident } from '@/types/domain';

export function useIncidentDetail(id: string | undefined) {
  const apiEnabled = isApiEnabled();

  const incidentQuery = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id!),
    enabled: apiEnabled && !!id,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const timelineQuery = useQuery({
    queryKey: ['incident-timeline', id],
    queryFn: () => fetchIncidentTimeline(id!),
    enabled: apiEnabled && !!id && incidentQuery.isSuccess,
    staleTime: 30 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const mock = id ? getIncidentById(id) ?? null : null;
    return { incident: mock, loading: false, fromApi: false, error: null };
  }

  const incident: Incident | null = incidentQuery.isSuccess
    ? adaptApiIncident(incidentQuery.data, timelineQuery.data ?? [])
    : (id ? getIncidentById(id) ?? null : null);

  return {
    incident,
    loading: incidentQuery.isLoading,
    fromApi: incidentQuery.isSuccess,
    error: incidentQuery.isError ? incidentQuery.error : null,
  };
}
