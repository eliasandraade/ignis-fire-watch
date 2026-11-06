import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api/adminCockpit';

// Admin data is never retried silently into stale success: one retry, then the
// screen shows the real error state.
const base = { retry: 1, refetchOnWindowFocus: false } as const;

export const useOverview = () =>
  useQuery({ queryKey: ['admin', 'overview'], queryFn: api.fetchOverview, ...base, refetchInterval: 60_000 });

export const useSources = () =>
  useQuery({ queryKey: ['admin', 'sources'], queryFn: api.fetchSources, ...base, refetchInterval: 60_000 });

export const usePermissions = () =>
  useQuery({ queryKey: ['admin', 'permissions'], queryFn: api.fetchPermissions, ...base, staleTime: 300_000 });

export const useAdminSettings = () =>
  useQuery({ queryKey: ['admin', 'settings'], queryFn: api.fetchSettings, ...base, staleTime: 300_000 });

export const useProtectedOpenApi = () =>
  useQuery({ queryKey: ['admin', 'openapi'], queryFn: api.fetchProtectedOpenApi, ...base, staleTime: 300_000 });

export const useRuns = (filters: api.RunFilters) =>
  useQuery({
    queryKey: ['admin', 'runs', filters],
    queryFn: () => api.fetchRuns(filters),
    ...base,
    placeholderData: keepPreviousData,
  });

export const useRun = (id: string | null) =>
  useQuery({
    queryKey: ['admin', 'run', id],
    queryFn: () => api.fetchRun(id as string),
    enabled: !!id,
    ...base,
    // A running execution is followed until it ends.
    refetchInterval: q => (q.state.data?.status === 'running' ? 5_000 : false),
  });

export const useUsers = (filters: api.UserFilters) =>
  useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => api.fetchUsers(filters),
    ...base,
    placeholderData: keepPreviousData,
  });

export const useAdminUser = (id: string | null) =>
  useQuery({ queryKey: ['admin', 'user', id], queryFn: () => api.fetchUser(id as string), enabled: !!id, ...base });

export const useUserHistory = (id: string | null) =>
  useQuery({
    queryKey: ['admin', 'user-history', id],
    queryFn: () => api.fetchUserHistory(id as string),
    enabled: !!id,
    ...base,
  });

export const useAudit = (filters: api.AuditFilters) =>
  useQuery({
    queryKey: ['admin', 'audit', filters],
    queryFn: () => api.fetchAudit(filters),
    ...base,
    placeholderData: keepPreviousData,
  });

export const useTeamsForAdmin = () =>
  useQuery({ queryKey: ['admin', 'teams'], queryFn: api.fetchTeams, ...base, staleTime: 300_000 });

/** Any user mutation refreshes lists, the edited user, its history and the overview. */
export function useUserMutation<TArgs>(fn: (args: TArgs) => Promise<api.AdminUser>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: user => {
      client.setQueryData(['admin', 'user', user.id], user);
      void client.invalidateQueries({ queryKey: ['admin', 'users'] });
      void client.invalidateQueries({ queryKey: ['admin', 'user-history', user.id] });
      void client.invalidateQueries({ queryKey: ['admin', 'overview'] });
      void client.invalidateQueries({ queryKey: ['admin', 'audit'] });
    },
  });
}
