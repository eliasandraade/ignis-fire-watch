import { useQuery } from '@tanstack/react-query';
import { isApiEnabled } from '@/services/api/client';
import { fetchWeatherRisk } from '@/services/api/environmentService';
import type { ApiWeatherRiskResponse, RiskLevel } from '@/services/api/types';

const FALLBACK_WEATHER_RISK: ApiWeatherRiskResponse = {
  source: 'Open-Meteo',
  source_status: 'unavailable',
  latitude: -4.005,
  longitude: -39.46,
  temperature_c: null,
  relative_humidity: null,
  wind_speed_kmh: null,
  wind_direction: null,
  precipitation_mm: null,
  risk_level: 'moderate' as RiskLevel,
  risk_score: 35,
  factors: [
    {
      name: 'Fonte externa indisponível',
      impact: 'low',
      description: 'Dados meteorológicos reais não disponíveis no momento.',
    },
  ],
  recommendation: 'Fonte meteorológica externa indisponível. Consulte a equipe de campo.',
  fetched_at: new Date().toISOString(),
  cache_ttl_minutes: 0,
};

export function useWeatherRisk(lat: number | undefined, lng: number | undefined) {
  const apiEnabled = isApiEnabled();
  const enabled = apiEnabled && lat != null && lng != null;

  const query = useQuery({
    queryKey: ['weather-risk', lat, lng],
    queryFn: () => fetchWeatherRisk(lat!, lng!),
    enabled,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const data: ApiWeatherRiskResponse = query.isSuccess
    ? query.data
    : { ...FALLBACK_WEATHER_RISK, latitude: lat ?? -4.005, longitude: lng ?? -39.46 };

  return {
    weatherRisk: data,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    isUnavailable: !query.isSuccess,
  };
}
