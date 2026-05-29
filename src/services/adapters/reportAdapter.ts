import type { PublicReport, OccurrenceType, ReportStatus, RiskLevel } from '@/types/domain';
import type { ApiReportCreate, ApiReportRead, ApiReportStatusPublic } from '@/services/api/types';

// Frontend occurrenceType → API type
const OCCURRENCE_TO_API: Record<OccurrenceType, string> = {
  incendio:           'fire',
  queimada:           'fire',
  desmatamento:       'deforestation',
  caca:               'hunting',
  'pesca-ilegal':     'fishing',
  mineracao:          'mining',
  'despejo-residuos': 'dumping',
  'especie-invasora': 'invasive_species',
  'contaminacao-agua':'water_contamination',
  outro:              'other',
};

// API status → frontend ReportStatus
const API_STATUS_MAP: Record<string, ReportStatus> = {
  pending:   'em-triagem',
  validated: 'validada',
  discarded: 'descartada',
  converted: 'convertida-incidente',
};

export function buildApiReportBody(
  occurrenceType: OccurrenceType,
  description: string,
  urgency: RiskLevel,
  isAnonymous: boolean,
  coords: { lat: number; lng: number } | null,
  areaId: string | null,
  reporterName: string | null,
): ApiReportCreate {
  return {
    type:               OCCURRENCE_TO_API[occurrenceType] ?? 'other',
    description,
    urgency,
    latitude:           coords?.lat ?? null,
    longitude:          coords?.lng ?? null,
    protected_area_id:  areaId || null,
    reporter_name:      isAnonymous ? null : (reporterName?.trim() || null),
    contact:            null,
    is_anonymous:       isAnonymous,
  };
}

export function adaptApiReportStatus(
  api: ApiReportStatusPublic,
): Pick<PublicReport, 'id' | 'status' | 'submittedAt' | 'urgency' | 'isAnonymous'> {
  return {
    id:          api.protocol,
    status:      API_STATUS_MAP[api.status] ?? 'em-triagem',
    submittedAt: api.created_at,
    urgency:     api.urgency as RiskLevel,
    isAnonymous: api.is_anonymous,
  };
}

export function adaptApiReportRead(
  api: ApiReportRead,
): Pick<PublicReport, 'id' | 'status' | 'submittedAt' | 'urgency' | 'isAnonymous'> {
  return {
    id:          api.protocol,
    status:      API_STATUS_MAP[api.status] ?? 'em-triagem',
    submittedAt: api.created_at,
    urgency:     api.urgency as RiskLevel,
    isAnonymous: api.is_anonymous,
  };
}
