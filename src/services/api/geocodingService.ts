import { apiFetch } from './client';
import type { ApiReverseGeocodingResponse } from './types';

export async function fetchReverseGeocoding(
  lat: number,
  lng: number,
): Promise<ApiReverseGeocodingResponse> {
  return apiFetch<ApiReverseGeocodingResponse>(
    `/api/v1/geocoding/reverse?lat=${lat}&lng=${lng}`,
  );
}
