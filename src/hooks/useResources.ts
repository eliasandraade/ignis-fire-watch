import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchResources } from '@/services/api/resourcesService';
import { adaptApiResource } from '@/services/adapters/resourceAdapter';
import { RESOURCES } from '@/data/operations';
import type { Resource } from '@/types/domain';

export function useResources(incidentId?: string) {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['resources', incidentId ?? 'all'],
    queryFn: async () => {
      const data = await fetchResources(incidentId);
      return data.map(adaptApiResource);
    },
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    return { resources: RESOURCES, loading: false, fromApi: false };
  }

  const resources: Resource[] = query.isSuccess && query.data.length > 0
    ? query.data
    : RESOURCES;

  return {
    resources,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
  };
}
