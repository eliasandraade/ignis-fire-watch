import type { UserRole } from '@/types/domain';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
  active: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    name: 'Ana Lima',
    email: 'ana.lima@ignis.ce.gov.br',
    role: 'gestor',
    lastLogin: '2026-05-26T10:30:00Z',
    active: true,
  },
  {
    id: 'u2',
    name: 'Carlos Drummond',
    email: 'c.drummond@bombeiros.ce.gov.br',
    role: 'campo',
    lastLogin: '2026-05-26T09:15:00Z',
    active: true,
  },
  {
    id: 'u3',
    name: 'Maria Cecília',
    email: 'm.cecilia@semace.ce.gov.br',
    role: 'gestor',
    lastLogin: '2026-05-25T16:00:00Z',
    active: true,
  },
  {
    id: 'u4',
    name: 'Admin IGNIS',
    email: 'admin@ignis.ce.gov.br',
    role: 'admin',
    lastLogin: '2026-05-26T08:00:00Z',
    active: true,
  },
  {
    id: 'u5',
    name: 'João Público',
    email: '—',
    role: 'publico',
    lastLogin: '2026-05-24T11:00:00Z',
    active: false,
  },
];

export const AUDIT_LOG = [
  {
    id: 'a1',
    ts: '2026-05-26T10:45:00Z',
    user: 'Ana Lima',
    action: 'Validou denúncia RPT-1716724800000',
    entity: 'report',
  },
  {
    id: 'a2',
    ts: '2026-05-26T10:12:00Z',
    user: 'Sistema IGNIS',
    action: 'Incidente IGN-CE-2026-0041 elevado para CRÍTICO',
    entity: 'incident',
  },
  {
    id: 'a3',
    ts: '2026-05-26T09:55:00Z',
    user: 'Sistema IGNIS',
    action: 'Notificação enviada para SEMACE e IBAMA',
    entity: 'system',
  },
  {
    id: 'a4',
    ts: '2026-05-26T09:41:00Z',
    user: 'Ana Lima',
    action: 'Confirmação orbital registrada — confiança 87%',
    entity: 'incident',
  },
  {
    id: 'a5',
    ts: '2026-05-25T14:30:00Z',
    user: 'Admin IGNIS',
    action: 'Área RPPN Elias Andrade adicionada ao sistema',
    entity: 'area',
  },
];
