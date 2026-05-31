import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import { fetchESGReports } from '@/services/api/esgService';
import { adaptApiESGReport } from '@/services/adapters/esgAdapter';
import { FALLBACK_ESG_DATA } from '@/data/fallback';
import type { ESGReport } from '@/types/domain';

export function useESGReports() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['esg-reports'],
    queryFn: async () => {
      const page = await fetchESGReports();
      return page.items.map(adaptApiESGReport);
    },
    enabled: apiEnabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { reports: [FALLBACK_ESG_DATA], latest: FALLBACK_ESG_DATA, loading: false, fromApi: false, dataSource };
  }

  const reports: ESGReport[] = query.isSuccess ? query.data : [FALLBACK_ESG_DATA];
  const latest = reports[0] ?? FALLBACK_ESG_DATA;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    reports,
    latest,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
