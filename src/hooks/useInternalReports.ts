import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import {
  fetchInternalReports,
  fetchInternalReport,
  validateReport,
  discardReport,
  convertReportToIncident,
} from '@/services/api/internalReportsService';
import { adaptApiReport } from '@/services/adapters/internalReportAdapter';
import { PUBLIC_REPORTS, getReportById } from '@/data/reports';
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
    return { reports: PUBLIC_REPORTS, loading: false, fromApi: false, error: null };
  }

  const reports: PublicReport[] = query.isSuccess && query.data.length > 0
    ? query.data
    : PUBLIC_REPORTS;

  return {
    reports,
    loading: query.isLoading,
    fromApi: query.isSuccess && query.data.length > 0,
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
    const mock = id ? getReportById(id) ?? null : null;
    return { report: mock, loading: false, fromApi: false, error: null };
  }

  const report: PublicReport | null = query.isSuccess
    ? query.data
    : (id ? getReportById(id) ?? null : null);

  return {
    report,
    loading: query.isLoading,
    fromApi: query.isSuccess,
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
