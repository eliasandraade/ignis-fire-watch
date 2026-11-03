import type { FieldTeam, TeamStatus } from '@/types/domain';
import type { ApiFieldTeamRead } from '@/services/api/teamsService';

// Backend TeamStatus: available | mobilized | standby | returning | unavailable
const API_STATUS_MAP: Record<string, TeamStatus> = {
  available: 'disponivel',
  mobilized: 'mobilizado',
  returning: 'em-transito',
  standby: 'indisponivel',
  unavailable: 'indisponivel',
};

// Frontend TeamStatus -> backend TeamStatus (PATCH /teams/{id})
export const TEAM_STATUS_TO_API: Record<TeamStatus, string> = {
  disponivel: 'available',
  mobilizado: 'mobilized',
  'em-transito': 'returning',
  indisponivel: 'unavailable',
};

export function adaptApiTeam(t: ApiFieldTeamRead): FieldTeam {
  return {
    id: t.id,
    name: t.name,
    type: t.type,
    // Unknown status must not look like an available team.
    status: API_STATUS_MAP[t.status] ?? 'indisponivel',
    members: 0,
    location: t.notes ?? undefined,
    contact: '',
  };
}
