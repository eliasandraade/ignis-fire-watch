import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createDataSourceMeta } from '@/services/dataSource';
import {
  fetchInternalReports,
  fetchInternalReport,
  validateReport,
  discardReport,
  convertReportToIncident,
} from '@/services/api/internalReportsService';
import { adaptApiReport } from '@/services/adapters/internalReportAdapter';
import type { PublicReport } from '@/types/domain';

export function useInternalReports() {
  const query = useQuery({
    queryKey: ['internal-reports'],
    queryFn: async () => {
      const page = await fetchInternalReports(1, 100);
      return page.items.map(adaptApiReport);
    },
    staleTime: 30 * 1000,
    retry: 1,
  });

  const reports: PublicReport[] = query.isSuccess ? query.data : [];

  return {
    reports,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, reports.length > 0, query.isLoading),
    error: query.isError ? query.error : null,
  };
}

export function useInternalReportDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: ['internal-report', id],
    queryFn: async () => adaptApiReport(await fetchInternalReport(id!)),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const report: PublicReport | null = query.isSuccess ? query.data : null;

  return {
    report,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource: createDataSourceMeta(query.isSuccess, report !== null, query.isLoading),
    error: query.isError ? query.error : null,
  };
}

export function useReportActions() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['internal-reports'] });
    qc.invalidateQueries({ queryKey: ['internal-report'] });
  };

  const validate = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => validateReport(id, notes),
    onSuccess: invalidate,
  });

  const discard = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => discardReport(id, notes),
    onSuccess: invalidate,
  });

  const convert = useMutation({
    mutationFn: (id: string) => convertReportToIncident(id),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['incidents'] });
      qc.invalidateQueries({ queryKey: ['war-room'] });
    },
  });

  return { validate, discard, convert };
}
