import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchTeams } from '@/services/api/teamsService';
import { adaptApiTeam } from '@/services/adapters/teamAdapter';
import { TEAMS } from '@/data/operations';
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
    return { teams: TEAMS, loading: false, fromApi: false };
  }

  const teams: FieldTeam[] = query.isSuccess && query.data.length > 0
    ? query.data
    : TEAMS;

  return {
    teams,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
  };
}
