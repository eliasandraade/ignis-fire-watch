import type { ESGReport } from '@/types/domain';
import type { ApiESGReportRead } from '@/services/api/esgService';

export function adaptApiESGReport(r: ApiESGReportRead): ESGReport {
  const start = new Date(r.period_start);
  const end = new Date(r.period_end);
  const periodLabel = `${start.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })} – ${end.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;

  return {
    period: periodLabel,
    areasMonitored: Math.round(r.monitored_area_ha / 1000),
    incidentsDetected: r.heat_spots_detected,
    incidentsPrevented: r.incidents_resolved,
    hectaresProtected: r.monitored_area_ha,
    responseTimeAvg: Math.round(r.average_response_minutes),
    weeklyIncidents: [],
    monthlyFoci: [],
  };
}
