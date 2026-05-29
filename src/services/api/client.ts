import { ApiError } from './errors';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export function isApiEnabled(): boolean {
  return import.meta.env.VITE_USE_API === 'true';
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ignis_token');

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (networkErr) {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique sua conexão.');
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    const detail = (body as { detail?: string } | null)?.detail;
    throw new ApiError(response.status, detail ?? `Erro HTTP ${response.status}`, body);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
