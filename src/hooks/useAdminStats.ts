import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats, fetchAuditLogs, fetchAdminUsers } from '@/services/api/adminService';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useAuditLogs(page = 1) {
  return useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => fetchAuditLogs(page),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetchAdminUsers(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
