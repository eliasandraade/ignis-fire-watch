import type { Protocol, FieldTeam, Resource, Mission } from '@/types/domain';

export const PROTOCOL_INCENDIO: Protocol = {
  id: 'prot-incendio-florestal',
  title: 'Protocolo de Resposta — Incêndio Florestal',
  steps: [
    {
      id: 's1',
      order: 1,
      title: 'Confirmação por imagem orbital',
      description: 'Cruzar fontes orbitais simuladas e registrar confiança. Protocolo demonstrativo.',
      completed: true,
      completedAt: '2026-05-26T09:41:00Z',
      completedBy: 'Ana Lima',
    },
    {
      id: 's2',
      order: 2,
      title: 'Notificação de autoridades',
      description: 'Acionar SEMACE, IBAMA e Defesa Civil estadual.',
      completed: true,
      completedAt: '2026-05-26T09:55:00Z',
      completedBy: 'Sistema IGNIS',
    },
    {
      id: 's3',
      order: 3,
      title: 'Mobilização de equipes de campo',
      description: 'Despachar brigada de incêndio e drone de reconhecimento.',
      completed: false,
    },
    {
      id: 's4',
      order: 4,
      title: 'Estabelecer perímetro de exclusão',
      description: 'Definir e sinalizar zona de segurança de 500m do foco.',
      completed: false,
    },
    {
      id: 's5',
      order: 5,
      title: 'Combate direto ao foco',
      description: 'Iniciar operação de combate com linha de contenção.',
      completed: false,
    },
    {
      id: 's6',
      order: 6,
      title: 'Relatório de situação (SITREP)',
      description: 'Emitir relatório consolidado para órgãos competentes.',
      completed: false,
    },
  ],
};

export const TEAMS: FieldTeam[] = [
  {
    id: 'BRG-CE-01',
    name: 'Brigada Florestal CE-01',
    type: 'Combate',
    status: 'mobilizado',
    members: 8,
    location: 'RPPN Elias Andrade',
    currentIncident: 'IGN-CE-2026-0041',
    contact: '+55 85 98765-0001',
  },
  {
    id: 'DRN-CE-02',
    name: 'Drone Monitoramento CE-02',
    type: 'Reconhecimento',
    status: 'mobilizado',
    members: 3,
    location: 'Sobrevoo ativo',
    currentIncident: 'IGN-CE-2026-0041',
    contact: '+55 85 98765-0002',
  },
  {
    id: 'VTR-CE-01',
    name: 'Viatura Apoio CE-01',
    type: 'Apoio Logístico',
    status: 'em-transito',
    members: 4,
    location: 'CE-025 km 34',
    currentIncident: 'IGN-CE-2026-0041',
    contact: '+55 85 98765-0003',
  },
  {
    id: 'BRG-CE-02',
    name: 'Brigada Florestal CE-02',
    type: 'Combate',
    status: 'disponivel',
    members: 10,
    location: 'Base Pecém',
    contact: '+55 85 98765-0004',
  },
];

export const RESOURCES: Resource[] = [
  {
    id: 'REC-001',
    name: 'Viatura 4x4 Comando',
    type: 'veiculo',
    status: 'mobilizado',
    location: 'RPPN Elias Andrade',
    currentIncident: 'IGN-CE-2026-0041',
  },
  {
    id: 'REC-002',
    name: 'Drone DJI Matrice 300',
    type: 'aeronave',
    status: 'mobilizado',
    location: 'Sobrevoo ativo',
    currentIncident: 'IGN-CE-2026-0041',
  },
  {
    id: 'REC-003',
    name: "Mangueiras e Canhão D'água",
    type: 'equipamento',
    status: 'em-transito',
    location: 'Em deslocamento',
  },
  {
    id: 'REC-004',
    name: 'Kit Primeiros Socorros',
    type: 'suprimento',
    status: 'disponivel',
    location: 'Base Fortaleza',
  },
];

export const MISSIONS: Mission[] = [
  {
    id: 'MSN-001',
    title: 'Combate direto — Setor Norte',
    type: 'Combate',
    status: 'ativa',
    incidentId: 'IGN-CE-2026-0041',
    teamId: 'BRG-CE-01',
    startedAt: '2026-05-26T10:12:00Z',
    objectives: [
      'Estabelecer linha de contenção norte',
      'Evitar propagação para zona de buffer',
      'Registrar evidências fotográficas',
    ],
    notes: 'Atenção ao vento NNE. Manter distância segura do flanco ativo.',
  },
  {
    id: 'MSN-002',
    title: 'Sobrevoo de reconhecimento — Perímetro',
    type: 'Reconhecimento',
    status: 'ativa',
    incidentId: 'IGN-CE-2026-0041',
    teamId: 'DRN-CE-02',
    startedAt: '2026-05-26T10:45:00Z',
    objectives: [
      'Mapear extensão do foco ativo',
      'Identificar pontos de acesso para brigada',
      'Monitorar direção de propagação',
    ],
    notes: 'Altitude mínima 80m. Evitar área de fumaça densa.',
  },
];
