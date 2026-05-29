import { useQuery } from '@tanstack/react-query';
import { PROTECTED_AREAS } from '@/data/areas';
import type { ProtectedArea } from '@/types/domain';
import { isApiEnabled } from '@/services/api/client';
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
    return { areas: PROTECTED_AREAS, loading: false, fromApi: false, error: null };
  }

  const areas: ProtectedArea[] =
    query.isSuccess && query.data.length > 0 ? query.data : PROTECTED_AREAS;

  return {
    areas,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
    error:   query.isError ? query.error : null,
  };
}
