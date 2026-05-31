import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchProtectedArea } from '@/services/api/protectedAreasService';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';
import { getFallbackAreaById } from '@/data/fallback';
import type { ProtectedArea } from '@/types/domain';

export function useArea(id: string | undefined) {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['area', id],
    queryFn: async (): Promise<ProtectedArea> => {
      const raw = await fetchProtectedArea(id!);
      return adaptProtectedArea(raw);
    },
    enabled: apiEnabled && !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const area = id ? getFallbackAreaById(id) ?? null : null;
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { area, loading: false, fromApi: false, dataSource };
  }

  const area: ProtectedArea | null = query.isSuccess
    ? query.data
    : (id ? getFallbackAreaById(id) ?? null : null);
  const dataSource = createDataSourceMeta(query.isSuccess, area !== null);

  return {
    area,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
