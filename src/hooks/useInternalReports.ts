import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { createDataSourceMeta, type DataSourceMeta } from '@/services/dataSource';
import {
  fetchInternalReports,
  fetchInternalReport,
  validateReport,
  discardReport,
  convertReportToIncident,
} from '@/services/api/internalReportsService';
import { adaptApiReport } from '@/services/adapters/internalReportAdapter';
import { FALLBACK_REPORTS } from '@/data/fallback';
import { getReportById } from '@/data/reports';
import type { PublicReport } from '@/types/domain';

export function useInternalReports() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['internal-reports'],
    queryFn: async () => {
      const page = await fetchInternalReports(1, 100);
      return page.items.map(adaptApiReport);
    },
    enabled: apiEnabled,
    staleTime: 30 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { reports: FALLBACK_REPORTS, loading: false, fromApi: false, dataSource, error: null };
  }

  const reports: PublicReport[] = query.isSuccess ? query.data : FALLBACK_REPORTS;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    reports,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
    error: query.isError ? query.error : null,
  };
}

export function useInternalReportDetail(id: string | undefined) {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['internal-report', id],
    queryFn: async () => adaptApiReport(await fetchInternalReport(id!)),
    enabled: apiEnabled && !!id,
    staleTime: 30 * 1000,
    retry: 1,
  });

  if (!apiEnabled) {
    const report = id ? getReportById(id) ?? null : null;
    const dataSource: DataSourceMeta = createDataSourceMeta(false, false);
    return { report, loading: false, fromApi: false, dataSource, error: null };
  }

  const report: PublicReport | null = query.isSuccess
    ? query.data
    : (id ? getReportById(id) ?? null : null);
  const dataSource = createDataSourceMeta(query.isSuccess, report !== null);

  return {
    report,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
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
