import { useQuery } from '@tanstack/react-query';
import { fetchWeatherRisk } from '@/services/api/environmentService';
import type { ApiWeatherRiskResponse } from '@/services/api/types';

/**
 * Risco meteorológico para um ponto. Sem coordenadas ou sem resposta da API,
 * `weatherRisk` é null: a tela mostra "—" em vez de qualquer valor estimado.
 */
export function useWeatherRisk(lat: number | undefined, lng: number | undefined) {
  const query = useQuery({
    queryKey: ['weather-risk', lat, lng],
    queryFn: () => fetchWeatherRisk(lat!, lng!),
    enabled: lat != null && lng != null,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const data: ApiWeatherRiskResponse | null = query.isSuccess ? query.data : null;

  return {
    weatherRisk: data,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    isUnavailable: !query.isSuccess,
    error: query.isError ? query.error : null,
  };
}
