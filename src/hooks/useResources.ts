import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchResources } from '@/services/api/resourcesService';
import { adaptApiResource } from '@/services/adapters/resourceAdapter';
import { FALLBACK_RESOURCES } from '@/data/fallback';
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
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { resources: FALLBACK_RESOURCES, loading: false, fromApi: false, dataSource };
  }

  const resources: Resource[] = query.isSuccess ? query.data : FALLBACK_RESOURCES;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    resources,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
