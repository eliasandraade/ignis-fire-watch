import type { Resource, ResourceType, TeamStatus } from '@/types/domain';
import type { ApiResourceRead } from '@/services/api/resourcesService';

const API_TYPE_MAP: Record<string, ResourceType> = {
  vehicle: 'veiculo',
  aircraft: 'aeronave',
  equipment: 'equipamento',
  supply: 'suprimento',
};

const API_STATUS_MAP: Record<string, TeamStatus> = {
  available: 'disponivel',
  in_use: 'mobilizado',
  maintenance: 'indisponivel',
  unavailable: 'indisponivel',
};

export function adaptApiResource(r: ApiResourceRead): Resource {
  return {
    id: r.id,
    name: r.name,
    type: API_TYPE_MAP[r.type] ?? 'equipamento',
    status: API_STATUS_MAP[r.status] ?? 'disponivel',
    location: r.location ?? 'N/D',
    currentIncident: r.assigned_incident_id ?? undefined,
  };
}
