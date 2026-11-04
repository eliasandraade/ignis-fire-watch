import { ApiError } from './errors';
import type { ApiPage } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
export const API_BASE_URL = API_URL;

export const SESSION_EXPIRED_EVENT = 'ignis:session-expired';

/**
 * A 401 on an authenticated request means the token is invalid, expired or
 * revoked (role change, deactivation, password reset). Clear it and notify the
 * app so the guards send the user back to the login screen.
 */
export function handleUnauthorized(path: string, hadToken: boolean): boolean {
  if (!hadToken || path.startsWith('/api/v1/auth/login')) return false;
  localStorage.removeItem('ignis_token');
  localStorage.removeItem('ignis_user');
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  return true;
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
    if (response.status === 401 && handleUnauthorized(path, !!token)) {
      throw new ApiError(401, 'Sessão expirada. Entre novamente.', body);
    }
    const rawDetail = (body as { detail?: unknown } | null)?.detail;
    // FastAPI 422 returns detail as a list of objects; only show plain strings.
    const detail = typeof rawDetail === 'string' ? rawDetail : undefined;
    throw new ApiError(response.status, detail ?? `Erro HTTP ${response.status}`, body);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/**
 * Fetch a paginated list endpoint and return its items.
 * The backend wraps every list in `Page{items,total,page,size,pages}`;
 * treating that object as an array made teams/resources/missions/evidence
 * always fall back to mock data.
 */
export async function apiFetchItems<T>(path: string, size = 100): Promise<T[]> {
  const sep = path.includes('?') ? '&' : '?';
  const page = await apiFetch<ApiPage<T>>(`${path}${sep}size=${size}`);
  return page.items;
}

/**
 * Authenticated file download (e.g. CSV export). The token travels in the
 * Authorization header, never in the URL; the browser saves the blob.
 */
export async function apiDownload(path: string): Promise<{ filename: string; rows: number | null }> {
  const token = localStorage.getItem('ignis_token');
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique sua conexão.');
  }
  if (!response.ok) {
    if (response.status === 401) handleUnauthorized(path, !!token);
    let detail: string | undefined;
    try {
      const body = (await response.json()) as { detail?: unknown };
      detail = typeof body.detail === 'string' ? body.detail : undefined;
    } catch {
      detail = undefined;
    }
    throw new ApiError(response.status, detail ?? `Erro HTTP ${response.status}`);
  }
  const disposition = response.headers.get('Content-Disposition') ?? '';
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? 'ignis-export.csv';
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  const text = await blob.text();
  return { filename, rows: Math.max(0, text.split(/\r?\n/).filter(Boolean).length - 1) };
}
