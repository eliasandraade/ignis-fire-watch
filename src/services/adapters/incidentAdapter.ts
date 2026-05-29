import type { Incident, IncidentEvent, IncidentType, IncidentStatus, RiskLevel } from '@/types/domain';
import type { ApiIncidentRead, ApiIncidentEventRead } from '@/services/api/incidentsService';

const API_TYPE_MAP: Record<string, IncidentType> = {
  fire: 'incendio-florestal',
  deforestation: 'desmatamento',
  illegal_mining: 'caca-pesca',
  flood: 'erosao',
  pollution: 'contaminacao',
  other: 'desmatamento',
};

const API_STATUS_MAP: Record<string, IncidentStatus> = {
  detected: 'deteccao-orbital',
  monitoring: 'confirmacao-pendente',
  active: 'combate-ativo',
  contained: 'controle-parcial',
  resolved: 'extinto',
  protocol_activated: 'protocolo-ativado',
};

const AURORA_BY_SEVERITY: Record<string, { priority: string; recommendation: string; confidence: number }> = {
  critical: {
    priority: 'CRÍTICA — Ação imediata necessária',
    recommendation: 'Condições críticas detectadas. Acione imediatamente brigadas de resposta, estabeleça perímetro de segurança e solicite suporte aéreo de reconhecimento. Monitoramento a cada 30 minutos. — Análise rule-based demonstrativa.',
    confidence: 91,
  },
  high: {
    priority: 'ALTA — Verificação prioritária',
    recommendation: 'Situação de alto risco identificada. Envie equipe de campo para confirmação in loco e cruzamento com registros de licenciamento. Notifique órgãos competentes. — Análise rule-based demonstrativa.',
    confidence: 75,
  },
  medium: {
    priority: 'MÉDIA — Triagem recomendada',
    recommendation: 'Ocorrência requer confirmação. Verificação in loco recomendada com equipe de monitoramento disponível. — Análise rule-based demonstrativa.',
    confidence: 65,
  },
  low: {
    priority: 'BAIXA — Monitoramento',
    recommendation: 'Situação estável. Incluir no próximo ciclo de monitoramento de campo. — Análise rule-based demonstrativa.',
    confidence: 55,
  },
};

export function adaptApiEvent(e: ApiIncidentEventRead): IncidentEvent {
  const typeMap: Record<string, IncidentEvent['type']> = {
    detection: 'detection',
    confirmation: 'confirmation',
    mobilization: 'mobilization',
    update: 'update',
    alert: 'alert',
    resolution: 'resolution',
  };
  return {
    id: e.id,
    timestamp: e.timestamp,
    type: typeMap[e.type] ?? 'update',
    description: e.description,
    author: e.actor_name,
  };
}

export function adaptApiIncident(inc: ApiIncidentRead, events: ApiIncidentEventRead[] = []): Incident {
  const severity = inc.severity as RiskLevel;
  const aurora = AURORA_BY_SEVERITY[severity] ?? AURORA_BY_SEVERITY.medium;

  return {
    id: inc.id,
    code: inc.code,
    areaId: inc.protected_area_id ?? '',
    type: API_TYPE_MAP[inc.type] ?? 'desmatamento',
    status: API_STATUS_MAP[inc.status] ?? 'deteccao-orbital',
    risk: severity,
    detectedAt: inc.detected_at,
    updatedAt: inc.updated_at,
    affectedHectares: inc.affected_hectares ?? 0,
    confidence: Math.round((inc.confidence ?? 0) * 100),
    source: inc.source,
    description: inc.title,
    assignedTeams: [],
    events: events.map(adaptApiEvent),
    evidence: [],
    temperature: inc.temperature ?? 28,
    humidity: inc.humidity ?? 50,
    windSpeed: inc.wind_speed ?? 10,
    windDirection: inc.wind_direction ?? 'NE',
    aurora: {
      priority: aurora.priority,
      recommendation: aurora.recommendation,
      confidence: aurora.confidence,
    },
  };
}
