import type { Incident } from '@/types/domain';
import type { ApiWarRoomSummary } from '@/services/api/warRoomService';
import { adaptApiIncident } from './incidentAdapter';

export interface WarRoomData {
  criticalIncident: Incident | null;
  activeIncidents: Incident[];
  totalActive: number;
  bySeverity: Record<string, number>;
}

export function adaptWarRoomSummary(data: ApiWarRoomSummary): WarRoomData {
  const incidents = data.active_incidents.map(inc => {
    const events = data.latest_events.filter(e => e.incident_id === inc.id);
    return adaptApiIncident(inc, events);
  });

  const critical = incidents.find(i => i.risk === 'critical') ?? null;

  return {
    criticalIncident: critical,
    activeIncidents: incidents,
    totalActive: data.total_active,
    bySeverity: data.by_severity,
  };
}
