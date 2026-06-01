import { apiFetch } from './client';
import type { ApiWeatherRiskResponse } from './types';

export async function fetchWeatherRisk(
  lat: number,
  lng: number,
): Promise<ApiWeatherRiskResponse> {
  return apiFetch<ApiWeatherRiskResponse>(
    `/api/v1/environment/weather-risk?lat=${lat}&lng=${lng}`,
  );
}
