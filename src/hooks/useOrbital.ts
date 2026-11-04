import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import {
  fetchDetection,
  fetchDetections,
  fetchDetectionStats,
  fetchJurisdictionGeoJSON,
  fetchMunicipalities,
  fetchSources,
} from '@/services/api/orbitalService';
import type { DetectionFilters } from '@/services/api/orbitalTypes';

/**
 * Persisted orbital data. There is no demonstration fallback: without the API
 * (VITE_USE_API=false) or when a request fails, callers get `apiEnabled=false`
 * or `isError=true` and must say so instead of drawing anything.
 */
const ONE_MINUTE = 60 * 1000;

export function useDetections(filters: DetectionFilters) {
  const apiEnabled = isApiEnabled();
  const query = useQuery({
    queryKey: ['orbital', 'detections', filters],
    queryFn: () => fetchDetections(filters),
    enabled: apiEnabled,
    staleTime: ONE_MINUTE,
    retry: 1,
  });
  return { ...query, apiEnabled };
}

export function useDetectionStats(filters: DetectionFilters) {
  const apiEnabled = isApiEnabled();
  const query = useQuery({
    queryKey: ['orbital', 'stats', filters],
    queryFn: () => fetchDetectionStats(filters),
    enabled: apiEnabled,
    staleTime: ONE_MINUTE,
    retry: 1,
  });
  return { ...query, apiEnabled };
}

export function useSources() {
  const apiEnabled = isApiEnabled();
  const query = useQuery({
    queryKey: ['orbital', 'sources'],
    queryFn: fetchSources,
    enabled: apiEnabled,
    staleTime: ONE_MINUTE,
    refetchInterval: 5 * ONE_MINUTE,
    retry: 1,
  });
  return { ...query, apiEnabled };
}

export function useMunicipalities(filters: Pick<DetectionFilters, 'from' | 'to' | 'source'>) {
  const apiEnabled = isApiEnabled();
  const query = useQuery({
    queryKey: ['orbital', 'municipalities', filters],
    queryFn: () => fetchMunicipalities(filters),
    enabled: apiEnabled,
    staleTime: 5 * ONE_MINUTE,
    retry: 1,
  });
  return { ...query, apiEnabled };
}

export function useJurisdictionGeoJSON(level: 'state' | 'municipality', enabled = true) {
  const apiEnabled = isApiEnabled();
  const query = useQuery({
    queryKey: ['orbital', 'geojson', level],
    queryFn: () => fetchJurisdictionGeoJSON(level),
    enabled: apiEnabled && enabled,
    staleTime: 60 * ONE_MINUTE,
    retry: 1,
  });
  return { ...query, apiEnabled };
}

export function useDetectionDetail(id: string | null) {
  const apiEnabled = isApiEnabled();
  return useQuery({
    queryKey: ['orbital', 'detection', id],
    queryFn: () => fetchDetection(id as string),
    enabled: apiEnabled && !!id,
    staleTime: 10 * ONE_MINUTE,
    retry: 1,
  });
}
