import type { PublicReport, OccurrenceType, ReportStatus, RiskLevel } from '@/types/domain';
import type { ApiReportRead } from '@/services/api/types';

const API_TYPE_TO_OCCURRENCE: Record<string, OccurrenceType> = {
  fire: 'incendio',
  deforestation: 'desmatamento',
  illegal_mining: 'mineracao',
  flood: 'outro',
  pollution: 'contaminacao-agua',
  invasive_species: 'especie-invasora',
  wildlife_traffic: 'caca',
  other: 'outro',
};

const API_STATUS_TO_FRONTEND: Record<string, ReportStatus> = {
  pending: 'em-triagem',
  validated: 'validada',
  discarded: 'descartada',
  converted: 'convertida-incidente',
};

export function adaptApiReport(r: ApiReportRead): PublicReport {
  return {
    id: r.id,
    occurrenceType: API_TYPE_TO_OCCURRENCE[r.type] ?? 'outro',
    areaId: r.protected_area_id ?? undefined,
    description: r.description,
    urgency: (r.urgency as RiskLevel) ?? 'medium',
    status: API_STATUS_TO_FRONTEND[r.status] ?? 'em-triagem',
    submittedAt: r.created_at,
    isAnonymous: r.is_anonymous,
    reporterName: r.reporter_name ?? undefined,
    reporterContact: r.contact ?? undefined,
    evidence: r.evidence_urls ?? [],
    linkedIncidentId: r.linked_incident_id ?? undefined,
    notes: r.validation_notes ?? undefined,
  };
}
