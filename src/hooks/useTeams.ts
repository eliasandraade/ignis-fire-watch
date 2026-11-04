import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchTeams } from '@/services/api/teamsService';
import { adaptApiTeam } from '@/services/adapters/teamAdapter';
import type { FieldTeam } from '@/types/domain';

export function useTeams() {
  const query = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const data = await fetchTeams();
      return data.map(adaptApiTeam);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const teams: FieldTeam[] = query.isSuccess ? query.data : [];

  return {
    teams,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, teams.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
