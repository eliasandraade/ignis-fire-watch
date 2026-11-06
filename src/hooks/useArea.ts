import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchProtectedArea } from '@/services/api/protectedAreasService';
import { adaptProtectedArea } from '@/services/adapters/protectedAreaAdapter';
import type { ProtectedArea } from '@/types/domain';

export function useArea(id: string | undefined) {
  const query = useQuery({
    queryKey: ['area', id],
    queryFn: async (): Promise<ProtectedArea> => {
      const raw = await fetchProtectedArea(id!);
      return adaptProtectedArea(raw);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const area: ProtectedArea | null = query.isSuccess ? query.data : null;

  return {
    area,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, area !== null, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
