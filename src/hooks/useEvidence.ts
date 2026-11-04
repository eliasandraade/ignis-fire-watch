import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvidence, createEvidence } from '@/services/api/evidenceService';
import type { ApiEvidenceCreate } from '@/services/api/evidenceService';
import { adaptApiEvidence } from '@/services/adapters/evidenceAdapter';
import type { Evidence } from '@/types/domain';

export function useEvidence(incidentId?: string) {
  const query = useQuery({
    queryKey: ['evidence', incidentId ?? 'all'],
    queryFn: async () => {
      const data = await fetchEvidence(incidentId);
      return data.map(adaptApiEvidence);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const evidence: Evidence[] = query.isSuccess ? query.data : [];

  return {
    evidence,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    error: query.isError ? query.error : null,
  };
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ApiEvidenceCreate) => createEvidence(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      if (data.incident_id) {
        queryClient.invalidateQueries({ queryKey: ['evidence', data.incident_id] });
      }
    },
  });
}
