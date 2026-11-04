import { useQuery } from '@tanstack/react-query';
import type { ProtectedArea } from '@/types/domain';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchProtectedAreas } from '@/services/api/protectedAreasService';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';

export function useProtectedAreas() {
  const query = useQuery({
    queryKey: ['protected-areas'],
    queryFn: async (): Promise<ProtectedArea[]> => {
      const page = await fetchProtectedAreas(1, 50, 'CE');
      return page.items.map(adaptProtectedArea);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const areas: ProtectedArea[] = query.isSuccess ? query.data : [];

  return {
    areas,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, areas.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
