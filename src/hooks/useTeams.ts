import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchTeams } from '@/services/api/teamsService';
import { adaptApiTeam } from '@/services/adapters/teamAdapter';
import { FALLBACK_TEAMS } from '@/data/fallback';
import type { FieldTeam } from '@/types/domain';

export function useTeams() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const data = await fetchTeams();
      return data.map(adaptApiTeam);
    },
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { teams: FALLBACK_TEAMS, loading: false, fromApi: false, dataSource };
  }

  const teams: FieldTeam[] = query.isSuccess ? query.data : FALLBACK_TEAMS;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    teams,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
