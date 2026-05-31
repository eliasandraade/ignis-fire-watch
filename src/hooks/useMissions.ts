import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchMissions } from '@/services/api/missionsService';
import { adaptApiMission } from '@/services/adapters/missionAdapter';
import { FALLBACK_MISSIONS } from '@/data/fallback';
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
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { missions: FALLBACK_MISSIONS, loading: false, fromApi: false, dataSource };
  }

  const missions: Mission[] = query.isSuccess ? query.data : FALLBACK_MISSIONS;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    missions,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
