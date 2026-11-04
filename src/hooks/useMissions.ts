import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchMissions } from '@/services/api/missionsService';
import { adaptApiMission } from '@/services/adapters/missionAdapter';
import type { Mission } from '@/types/domain';

export function useMissions(incidentId?: string) {
  const query = useQuery({
    queryKey: ['missions', incidentId ?? 'all'],
    queryFn: async () => {
      const data = await fetchMissions(incidentId);
      return data.map(adaptApiMission);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const missions: Mission[] = query.isSuccess ? query.data : [];

  return {
    missions,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, missions.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
