import type { PublicReport, OccurrenceType, ReportStatus, RiskLevel } from '@/types/domain';
import type { ApiReportCreate, ApiReportRead, ApiReportStatusPublic } from '@/services/api/types';

// Frontend occurrenceType → backend ReportType
// (fire | deforestation | illegal_mining | flood | pollution | invasive_species |
//  wildlife_traffic | other). Five of these values used to be invalid and the
// public submission failed with HTTP 422.
export const OCCURRENCE_TO_API: Record<OccurrenceType, string> = {
  incendio:           'fire',
  queimada:           'fire',
  desmatamento:       'deforestation',
  caca:               'wildlife_traffic',
  'pesca-ilegal':     'wildlife_traffic',
  mineracao:          'illegal_mining',
  'despejo-residuos': 'pollution',
  'especie-invasora': 'invasive_species',
  'contaminacao-agua':'pollution',
  outro:              'other',
};

export const API_REPORT_TYPES = [
  'fire', 'deforestation', 'illegal_mining', 'flood', 'pollution',
  'invasive_species', 'wildlife_traffic', 'other',
] as const;

// Types that lose detail when mapped to the backend enum: keep the citizen's
// choice in the description so triage still sees it.
const OCCURRENCE_DETAIL: Partial<Record<OccurrenceType, string>> = {
  queimada: 'Queimada',
  caca: 'Caça',
  'pesca-ilegal': 'Pesca ilegal',
  'despejo-residuos': 'Despejo de resíduos',
  'contaminacao-agua': 'Contaminação de água',
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
    description:        OCCURRENCE_DETAIL[occurrenceType]
      ? `[Tipo informado: ${OCCURRENCE_DETAIL[occurrenceType]}] ${description}`
      : description,
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
