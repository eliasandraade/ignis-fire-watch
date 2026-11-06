import { useQuery } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import { fetchESGReports } from '@/services/api/esgService';
import { adaptApiESGReport } from '@/services/adapters/esgAdapter';
import type { ESGReport } from '@/types/domain';

export function useESGReports() {
  const query = useQuery({
    queryKey: ['esg-reports'],
    queryFn: async () => {
      const page = await fetchESGReports();
      return page.items.map(adaptApiESGReport);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const reports: ESGReport[] = query.isSuccess ? query.data : [];

  return {
    reports,
    latest: reports[0] ?? null,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, reports.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}
