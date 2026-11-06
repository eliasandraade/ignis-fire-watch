import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/services/api/healthService';

export type ApiStatus = 'online' | 'offline' | 'unknown';

export function useApiHealth() {
  const query = useQuery({
    queryKey: ['api-health'],
    queryFn:  checkHealth,
    staleTime: 60_000,
    retry: 0,
    refetchInterval: 2 * 60 * 1000,
  });

  const status: ApiStatus =
    query.isSuccess ? 'online' :
    query.isError   ? 'offline' :
    'unknown';

  return {
    status,
    version: query.data?.version ?? null,
  };
}
