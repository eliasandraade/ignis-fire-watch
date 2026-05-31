import { useQuery } from '@tanstack/react-query';
import { FALLBACK_AREAS } from '@/data/fallback';
import type { ProtectedArea } from '@/types/domain';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchProtectedAreas } from '@/services/api/protectedAreasService';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';

export function useProtectedAreas() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['protected-areas'],
    queryFn: async (): Promise<ProtectedArea[]> => {
      const page = await fetchProtectedAreas(1, 50, 'CE');
      return page.items.map(adaptProtectedArea);
    },
    enabled: apiEnabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { areas: FALLBACK_AREAS, loading: false, fromApi: false, dataSource, error: null };
  }

  const areas: ProtectedArea[] = query.isSuccess ? query.data : FALLBACK_AREAS;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    areas,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
    error: query.isError ? query.error : null,
  };
}
