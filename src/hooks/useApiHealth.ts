import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { checkHealth } from '@/services/api/healthService';

export type ApiStatus = 'online' | 'offline' | 'unknown';

export function useApiHealth() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['api-health'],
    queryFn:  checkHealth,
    enabled:  apiEnabled,
    staleTime: 60_000,
    retry: 0,
    refetchInterval: 2 * 60 * 1000,
  });

  if (!apiEnabled) {
    return { status: 'unknown' as ApiStatus, version: null };
  }

  const status: ApiStatus =
    query.isSuccess ? 'online' :
    query.isError   ? 'offline' :
    'unknown';

  return {
    status,
    version: query.data?.version ?? null,
  };
}
