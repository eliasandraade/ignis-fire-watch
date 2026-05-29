import type { FieldTeam, TeamStatus } from '@/types/domain';
import type { ApiFieldTeamRead } from '@/services/api/teamsService';

const API_STATUS_MAP: Record<string, TeamStatus> = {
  available: 'disponivel',
  mobilized: 'mobilizado',
  in_transit: 'em-transito',
  unavailable: 'indisponivel',
};

export function adaptApiTeam(t: ApiFieldTeamRead): FieldTeam {
  return {
    id: t.id,
    name: t.name,
    type: t.type,
    status: API_STATUS_MAP[t.status] ?? 'disponivel',
    members: 0,
    location: t.notes ?? undefined,
    contact: '',
  };
}
