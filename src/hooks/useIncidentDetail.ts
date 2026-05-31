import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchIncident, fetchIncidentTimeline } from '@/services/api/incidentsService';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { getFallbackIncidentById } from '@/data/fallback';
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
    const incident = id ? getFallbackIncidentById(id) ?? null : null;
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { incident, loading: false, fromApi: false, dataSource, error: null };
  }

  const incident: Incident | null = incidentQuery.isSuccess
    ? adaptApiIncident(incidentQuery.data, timelineQuery.data ?? [])
    : (id ? getFallbackIncidentById(id) ?? null : null);
  const dataSource = createDataSourceMeta(incidentQuery.isSuccess, incident !== null);

  return {
    incident,
    loading: incidentQuery.isLoading,
    fromApi: incidentQuery.isSuccess,
    dataSource,
    error: incidentQuery.isError ? incidentQuery.error : null,
  };
}
