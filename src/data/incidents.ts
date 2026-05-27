import type { Incident } from '@/types/domain';

export const INCIDENTS: Incident[] = [
  {
    id: 'IGN-CE-2026-0041',
    areaId: 'rppn-elias-andrade',
    type: 'incendio-florestal',
    status: 'protocolo-ativado',
    risk: 'critical',
    detectedAt: '2026-05-26T09:30:00Z',
    updatedAt: '2026-05-26T11:00:00Z',
    affectedHectares: 42,
    confidence: 87,
    source: 'INPE/MODIS (simulado)',
    description: 'Foco de incêndio ativo detectado por sensoriamento remoto orbital simulado. Vento nordeste favorece propagação em direção à zona de buffer da RPPN.',
    assignedTeams: ['BRG-CE-01', 'DRN-CE-02', 'VTR-CE-01'],
    temperature: 36,
    humidity: 18,
    windSpeed: 22,
    windDirection: 'NNE',
    aurora: {
      priority: 'CRÍTICA — Ação imediata necessária',
      recommendation: 'Condições meteorológicas críticas (T: 36°C, UR: 18%, Vento: 22km/h NNE). Risco de propagação para zona de buffer em menos de 2h. Recomendo: (1) acionar reforço de brigada CE-02, (2) estabelecer aceiro de contenção no setor sul, (3) solicitar avaliação aérea a cada 30min. Confiança da análise: 91% — dados demonstrativos.',
      confidence: 91,
    },
    events: [
      {
        id: 'ev1',
        timestamp: '2026-05-26T09:30:00Z',
        type: 'detection',
        description: 'Detecção orbital simulada — satélite MODIS/INPE identificou anomalia térmica.',
        author: 'Sistema IGNIS',
      },
      {
        id: 'ev2',
        timestamp: '2026-05-26T09:41:00Z',
        type: 'confirmation',
        description: 'Confirmação por cruzamento de fontes orbitais simuladas. Confiança: 87%.',
        author: 'Ana Lima',
      },
      {
        id: 'ev3',
        timestamp: '2026-05-26T09:55:00Z',
        type: 'alert',
        description: 'Notificação enviada para SEMACE, IBAMA e Defesa Civil estadual.',
        author: 'Sistema IGNIS',
      },
      {
        id: 'ev4',
        timestamp: '2026-05-26T10:12:00Z',
        type: 'mobilization',
        description: 'Brigada BRG-CE-01 mobilizada. 8 combatentes deslocados para o local.',
        author: 'Ana Lima',
      },
      {
        id: 'ev5',
        timestamp: '2026-05-26T10:45:00Z',
        type: 'mobilization',
        description: 'Drone DRN-CE-02 iniciou sobrevoo de reconhecimento. Altitude 120m.',
        author: 'Carlos Drummond',
      },
      {
        id: 'ev6',
        timestamp: '2026-05-26T11:00:00Z',
        type: 'update',
        description: 'Área afetada estimada em 42ha. Propagação em direção NNE confirmada.',
        author: 'Sistema IGNIS',
      },
    ],
    evidence: [
      {
        id: 'evi1',
        type: 'satellite',
        url: 'https://picsum.photos/seed/ignis1/400/300',
        caption: 'Imagem orbital simulada — MODIS 26/05/2026 09:30 UTC',
        source: 'INPE/MODIS (simulado)',
        timestamp: '2026-05-26T09:30:00Z',
      },
      {
        id: 'evi2',
        type: 'field-photo',
        url: 'https://picsum.photos/seed/ignis2/400/300',
        caption: 'Sobrevoo DRN-CE-02 — Frente de fogo setor norte',
        source: 'Equipe DRN-CE-02',
        timestamp: '2026-05-26T10:50:00Z',
      },
    ],
  },
  {
    id: 'IGN-CE-2026-0038',
    areaId: 'esec-pecem',
    type: 'desmatamento',
    status: 'deteccao-orbital',
    risk: 'high',
    detectedAt: '2026-05-24T14:15:00Z',
    updatedAt: '2026-05-25T08:00:00Z',
    affectedHectares: 8,
    confidence: 74,
    source: 'Sentinel-2 (simulado)',
    description: 'Supressão de vegetação nativa detectada por análise de índice NDVI simulado.',
    assignedTeams: [],
    temperature: 32,
    humidity: 28,
    windSpeed: 15,
    windDirection: 'SE',
    aurora: {
      priority: 'ALTA — Verificação necessária',
      recommendation: 'Possível desmatamento ilegal em área de restinga protegida. Recomendo verificação in loco e cruzamento com registros de licenciamento ambiental. Dados demonstrativos.',
      confidence: 74,
    },
    events: [
      {
        id: 'ev1',
        timestamp: '2026-05-24T14:15:00Z',
        type: 'detection',
        description: 'Análise NDVI simulada indicou redução de 8ha de cobertura vegetal.',
        author: 'Sistema IGNIS',
      },
    ],
    evidence: [],
  },
  {
    id: 'IGN-CE-2026-0033',
    areaId: 'flona-araripe',
    type: 'caca-pesca',
    status: 'confirmacao-pendente',
    risk: 'medium',
    detectedAt: '2026-05-22T07:45:00Z',
    updatedAt: '2026-05-22T10:30:00Z',
    affectedHectares: 0,
    confidence: 61,
    source: 'Denúncia pública #RPT-1716362700000',
    description: 'Relato de atividade de caça ilegal no setor sul da FLONA Araripe-Apodi.',
    assignedTeams: [],
    temperature: 29,
    humidity: 35,
    windSpeed: 8,
    windDirection: 'E',
    aurora: {
      priority: 'MÉDIA — Triagem recomendada',
      recommendation: 'Denúncia requer confirmação por equipe de campo. Verificar registros históricos de ocorrências no setor sul da FLONA. Dados demonstrativos.',
      confidence: 61,
    },
    events: [
      {
        id: 'ev1',
        timestamp: '2026-05-22T07:45:00Z',
        type: 'detection',
        description: 'Denúncia recebida via portal público. Em processo de triagem.',
        author: 'Sistema IGNIS',
      },
    ],
    evidence: [],
  },
];

export function getIncidentById(id: string): Incident | undefined {
  return INCIDENTS.find(i => i.id === id);
}

export function getIncidentsByArea(areaId: string): Incident[] {
  return INCIDENTS.filter(i => i.areaId === areaId);
}

export function getActiveIncidents(): Incident[] {
  return INCIDENTS.filter(i => i.status !== 'encerrado' && i.status !== 'extinto');
}

export function getCriticalIncident(): Incident | undefined {
  return INCIDENTS.find(i => i.risk === 'critical' && i.status !== 'encerrado');
}
