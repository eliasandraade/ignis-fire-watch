import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchResources } from '@/services/api/resourcesService';
import { adaptApiResource } from '@/services/adapters/resourceAdapter';
import type { Resource } from '@/types/domain';

export function useResources(incidentId?: string) {
  const query = useQuery({
    queryKey: ['resources', incidentId ?? 'all'],
    queryFn: async () => {
      const data = await fetchResources(incidentId);
      return data.map(adaptApiResource);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const resources: Resource[] = query.isSuccess ? query.data : [];

  return {
    resources,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, resources.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
