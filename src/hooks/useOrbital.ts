import { useQuery } from '@tanstack/react-query';
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
 * Persisted orbital data. There is no substitute data: when a request fails,
 * callers get `isError=true` and must say so instead of drawing anything.
 */
const ONE_MINUTE = 60 * 1000;

export function useDetections(filters: DetectionFilters) {
  return useQuery({
    queryKey: ['orbital', 'detections', filters],
    queryFn: () => fetchDetections(filters),
    staleTime: ONE_MINUTE,
    retry: 1,
  });
}

export function useDetectionStats(filters: DetectionFilters) {
  return useQuery({
    queryKey: ['orbital', 'stats', filters],
    queryFn: () => fetchDetectionStats(filters),
    staleTime: ONE_MINUTE,
    retry: 1,
  });
}

export function useSources() {
  return useQuery({
    queryKey: ['orbital', 'sources'],
    queryFn: fetchSources,
    staleTime: ONE_MINUTE,
    refetchInterval: 5 * ONE_MINUTE,
    retry: 1,
  });
}

export function useMunicipalities(filters: Pick<DetectionFilters, 'from' | 'to' | 'source'>) {
  return useQuery({
    queryKey: ['orbital', 'municipalities', filters],
    queryFn: () => fetchMunicipalities(filters),
    staleTime: 5 * ONE_MINUTE,
    retry: 1,
  });
}

export function useJurisdictionGeoJSON(level: 'state' | 'municipality', enabled = true) {
  return useQuery({
    queryKey: ['orbital', 'geojson', level],
    queryFn: () => fetchJurisdictionGeoJSON(level),
    enabled,
    staleTime: 60 * ONE_MINUTE,
    retry: 1,
  });
}

export function useDetectionDetail(id: string | null) {
  return useQuery({
    queryKey: ['orbital', 'detection', id],
    queryFn: () => fetchDetection(id as string),
    enabled: !!id,
    staleTime: 10 * ONE_MINUTE,
    retry: 1,
  });
}
