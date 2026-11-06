import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchWarRoom } from '@/services/api/warRoomService';
import { fetchIncidentTimeline } from '@/services/api/incidentsService';
import { fetchProtectedArea } from '@/services/api/protectedAreasService';
import { adaptWarRoomSummary } from '@/services/adapters/warRoomAdapter';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';
import type { Incident, ProtectedArea } from '@/types/domain';

export interface WarRoomState {
  incident: Incident | null;
  area: ProtectedArea | null;
  loading: boolean;
  fromApi: boolean;
  dataSource: DataSourceMeta;
  error: unknown;
}

export function useWarRoom(): WarRoomState {
  const summaryQuery = useQuery({
    queryKey: ['war-room'],
    queryFn: fetchWarRoom,
    staleTime: 30 * 1000,
    retry: 1,
    refetchInterval: 60 * 1000,
  });

  const criticalRaw = summaryQuery.data?.active_incidents.find(i => i.severity === 'critical');
  const criticalApiId = criticalRaw?.id;
  const criticalAreaId = criticalRaw?.protected_area_id;

  const timelineQuery = useQuery({
    queryKey: ['war-room-timeline', criticalApiId],
    queryFn: () => fetchIncidentTimeline(criticalApiId!),
    enabled: !!criticalApiId,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const areaQuery = useQuery({
    queryKey: ['war-room-area', criticalAreaId],
    queryFn: () => fetchProtectedArea(criticalAreaId!),
    enabled: !!criticalAreaId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (summaryQuery.isLoading || (criticalAreaId && areaQuery.isLoading)) {
    return {
      incident: null, area: null, loading: true, fromApi: false,
      dataSource: createDataSourceMeta(false, false, true), error: null,
    };
  }

  if (summaryQuery.isSuccess && summaryQuery.data) {
    let critical = adaptWarRoomSummary(summaryQuery.data).criticalIncident;

    if (critical && criticalRaw && timelineQuery.isSuccess) {
      critical = adaptApiIncident(criticalRaw, timelineQuery.data ?? []);
    }

    // Área só quando a própria API a devolveu; sem substitutos.
    const area: ProtectedArea | null =
      critical && areaQuery.isSuccess && areaQuery.data ? adaptProtectedArea(areaQuery.data) : null;

    return {
      incident: critical,
      area,
      loading: false,
      fromApi: true,
      dataSource: createDataSourceMeta(true, critical !== null),
      error: null,
    };
  }

  // Falha na API: nada é exibido no lugar do incidente.
  return {
    incident: null, area: null, loading: false, fromApi: false,
    dataSource: createDataSourceMeta(false, false), error: summaryQuery.error,
  };
}
