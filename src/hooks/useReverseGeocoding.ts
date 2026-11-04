import { useQuery } from '@tanstack/react-query';
import { fetchReverseGeocoding } from '@/services/api/geocodingService';
import type { ApiReverseGeocodingResponse } from '@/services/api/types';

export function useReverseGeocoding(lat: number | undefined, lng: number | undefined) {
  const query = useQuery({
    queryKey: ['reverse-geocoding', lat, lng],
    queryFn: () => fetchReverseGeocoding(lat!, lng!),
    enabled: lat != null && lng != null,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const data: ApiReverseGeocodingResponse | null = query.isSuccess ? query.data : null;

  return {
    geocoding: data,
    displayName: data?.display_name ?? null,
    municipality: data?.municipality ?? null,
    state: data?.state ?? null,
    cached: data?.cached ?? false,
    loading: query.isLoading,
    fromApi: query.isSuccess,
  };
}
