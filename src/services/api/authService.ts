import { apiFetch } from './client';
import type { ApiTokenResponse, ApiUserRead } from './types';

export async function login(email: string, password: string): Promise<ApiTokenResponse> {
  return apiFetch<ApiTokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function saveSession(token: ApiTokenResponse): void {
  localStorage.setItem('ignis_token', token.access_token);
  localStorage.setItem('ignis_user', JSON.stringify(token.user));
}

export function clearSession(): void {
  localStorage.removeItem('ignis_token');
  localStorage.removeItem('ignis_user');
}

export function getSavedUser(): ApiUserRead | null {
  try {
    const raw = localStorage.getItem('ignis_user');
    return raw ? (JSON.parse(raw) as ApiUserRead) : null;
  } catch {
    return null;
  }
}
