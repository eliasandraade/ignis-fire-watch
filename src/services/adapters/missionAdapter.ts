import type { Mission } from '@/types/domain';
import type { ApiMissionRead } from '@/services/api/missionsService';

const API_STATUS_MAP: Record<string, Mission['status']> = {
  pending: 'ativa',
  active: 'ativa',
  completed: 'concluida',
  cancelled: 'cancelada',
};

export function adaptApiMission(m: ApiMissionRead): Mission {
  return {
    id: m.id,
    title: m.objective,
    type: 'campo',
    status: API_STATUS_MAP[m.status] ?? 'ativa',
    incidentId: m.incident_id,
    teamId: m.team_id ?? '',
    startedAt: m.started_at ?? m.created_at,
    objectives: [m.objective],
    notes: m.notes ?? '',
  };
}
