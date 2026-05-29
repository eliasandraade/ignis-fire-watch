import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchAdminStats, fetchAuditLogs, fetchAdminUsers } from '@/services/api/adminService';

export function useAdminStats() {
  const apiEnabled = isApiEnabled();

  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    enabled: apiEnabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useAuditLogs(page = 1) {
  const apiEnabled = isApiEnabled();

  return useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => fetchAuditLogs(page),
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useAdminUsers() {
  const apiEnabled = isApiEnabled();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetchAdminUsers(),
    enabled: apiEnabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
