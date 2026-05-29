import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchESGReports } from '@/services/api/esgService';
import { adaptApiESGReport } from '@/services/adapters/esgAdapter';
import { ESG_DATA } from '@/data/esg';
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
    return { reports: [ESG_DATA], latest: ESG_DATA, loading: false, fromApi: false };
  }

  const reports: ESGReport[] = query.isSuccess && query.data.length > 0
    ? query.data
    : [ESG_DATA];

  const latest = reports[0] ?? ESG_DATA;

  return {
    reports,
    latest,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
  };
}
