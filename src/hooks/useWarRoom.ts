import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchWarRoom } from '@/services/api/warRoomService';
import { fetchIncidentTimeline } from '@/services/api/incidentsService';
import { adaptWarRoomSummary } from '@/services/adapters/warRoomAdapter';
import { adaptApiIncident } from '@/services/adapters/incidentAdapter';
import { getCriticalIncident } from '@/data/incidents';
import { getAreaById } from '@/data/areas';
import type { Incident } from '@/types/domain';
import type { ProtectedArea } from '@/types/domain';

export interface WarRoomState {
  incident: Incident | null;
  area: ProtectedArea | null;
  loading: boolean;
  fromApi: boolean;
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

  if (!apiEnabled) {
    const inc = getCriticalIncident() ?? null;
    const area = inc ? (getAreaById(inc.areaId) ?? null) : null;
    return { incident: inc, area, loading: false, fromApi: false };
  }

  if (summaryQuery.isLoading) {
    return { incident: null, area: null, loading: true, fromApi: false };
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

    const area = critical ? (getAreaById(critical.areaId) ?? null) : null;
    return { incident: critical, area, loading: false, fromApi: true };
  }

  // API failed — fall back to mock
  const inc = getCriticalIncident() ?? null;
  const area = inc ? (getAreaById(inc.areaId) ?? null) : null;
  return { incident: inc, area, loading: false, fromApi: false };
}
