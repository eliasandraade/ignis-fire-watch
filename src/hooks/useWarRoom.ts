import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchWarRoom } from '@/services/api/warRoomService';
import { fetchIncidentTimeline } from '@/services/api/incidentsService';
import { fetchProtectedArea } from '@/services/api/protectedAreasService';
import { adaptWarRoomSummary } from '@/services/adapters/warRoomAdapter';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';
import { getFallbackCriticalIncident, getFallbackAreaById } from '@/data/fallback';
import type { Incident, ProtectedArea } from '@/types/domain';

export interface WarRoomState {
  incident: Incident | null;
  area: ProtectedArea | null;
  loading: boolean;
  fromApi: boolean;
  dataSource: DataSourceMeta;
}

export function useWarRoom(): WarRoomState {
  const apiEnabled = isApiEnabled();

  const summaryQuery = useQuery({
    queryKey: ['war-room'],
    queryFn: fetchWarRoom,
    enabled: apiEnabled,
    staleTime: 30 * 1000,
    retry: 1,
    refetchInterval: 60 * 1000,
  });

  const criticalApiId = summaryQuery.data?.active_incidents.find(
    i => i.severity === 'critical',
  )?.id;

  const timelineQuery = useQuery({
    queryKey: ['war-room-timeline', criticalApiId],
    queryFn: () => fetchIncidentTimeline(criticalApiId!),
    enabled: apiEnabled && !!criticalApiId,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const criticalAreaId = summaryQuery.data?.active_incidents.find(
    i => i.severity === 'critical',
  )?.protected_area_id;

  const areaQuery = useQuery({
    queryKey: ['war-room-area', criticalAreaId],
    queryFn: () => fetchProtectedArea(criticalAreaId!),
    enabled: apiEnabled && !!criticalAreaId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const inc = getFallbackCriticalIncident() ?? null;
    const area = inc ? (getFallbackAreaById(inc.areaId) ?? null) : null;
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { incident: inc, area, loading: false, fromApi: false, dataSource };
  }

  if (summaryQuery.isLoading || (criticalAreaId && areaQuery.isLoading)) {
    const dataSource = createDataSourceMeta(false, false);
    return { incident: null, area: null, loading: true, fromApi: false, dataSource };
  }

  if (summaryQuery.isSuccess && summaryQuery.data) {
    const warRoom = adaptWarRoomSummary(summaryQuery.data);
    let critical = warRoom.criticalIncident;

    if (critical && timelineQuery.isSuccess) {
      const criticalRaw = summaryQuery.data.active_incidents.find(i => i.severity === 'critical');
      if (criticalRaw) {
        critical = adaptApiIncident(criticalRaw, timelineQuery.data ?? []);
      }
    }

    let area: ProtectedArea | null = null;
    if (critical) {
      if (areaQuery.isSuccess && areaQuery.data) {
        area = adaptProtectedArea(areaQuery.data);
      } else {
        area = getFallbackAreaById(critical.areaId) ?? null;
      }
    }

    const dataSource = createDataSourceMeta(true, critical !== null);
    return { incident: critical, area, loading: false, fromApi: true, dataSource };
  }

  // API failed — fall back to demo data
  const inc = getFallbackCriticalIncident() ?? null;
  const area = inc ? (getFallbackAreaById(inc.areaId) ?? null) : null;
  const dataSource = createDataSourceMeta(false, false);
  return { incident: inc, area, loading: false, fromApi: false, dataSource };
}
