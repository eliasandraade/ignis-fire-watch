import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchMissions } from '@/services/api/missionsService';
import { adaptApiMission } from '@/services/adapters/missionAdapter';
import { MISSIONS } from '@/data/operations';
import type { Mission } from '@/types/domain';

export function useMissions(incidentId?: string) {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['missions', incidentId ?? 'all'],
    queryFn: async () => {
      const data = await fetchMissions(incidentId);
      return data.map(adaptApiMission);
    },
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    return { missions: MISSIONS, loading: false, fromApi: false };
  }

  const missions: Mission[] = query.isSuccess && query.data.length > 0
    ? query.data
    : MISSIONS;

  return {
    missions,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
  };
}
