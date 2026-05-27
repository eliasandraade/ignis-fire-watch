/**
 * Human-readable labels for domain enum values.
 * Central reference — import from here, not inline.
 */

export const OCCURRENCE_LABEL: Record<string, string> = {
  'incendio':          'Incêndio',
  'queimada':          'Queimada',
  'desmatamento':      'Desmatamento',
  'caca':              'Caça Ilegal',
  'pesca-ilegal':      'Pesca Ilegal',
  'caca-pesca':        'Caça / Pesca Ilegal',
  'mineracao':         'Mineração',
  'despejo-residuos':  'Resíduos',
  'especie-invasora':  'Espécie Invasora',
  'contaminacao-agua': 'Contaminação',
  'outro':             'Outro',
};

export const INCIDENT_TYPE_LABEL: Record<string, string> = {
  'incendio-florestal': 'Incêndio Florestal',
  'queimada':           'Queimada',
  'desmatamento':       'Desmatamento',
  'caca-pesca':         'Caça / Pesca Ilegal',
  'mineracao-ilegal':   'Mineração Ilegal',
  'contaminacao':       'Contaminação',
  'outro':              'Outro',
};

export const DATA_QUALITY_LABEL: Record<string, string> = {
  'official':  'Oficial',
  'estimated': 'Estimado',
  'mock':      'Simulado',
};

export const INCIDENT_STATUS_LABEL: Record<string, string> = {
  'deteccao-orbital':     'Detecção Orbital',
  'confirmacao-pendente': 'Confirmação Pendente',
  'protocolo-ativado':    'Protocolo Ativado',
  'equipes-mobilizadas':  'Equipes Mobilizadas',
  'combate-ativo':        'Combate Ativo',
  'controle-parcial':     'Controle Parcial',
  'extinto':              'Extinto',
  'encerrado':            'Encerrado',
};
