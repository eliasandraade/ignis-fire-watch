import { apiFetch } from './client';
import type { ApiPage, ApiProtectedAreaRead } from './types';

export async function fetchProtectedAreas(
  page = 1,
  size = 50,
  state = 'CE',
): Promise<ApiPage<ApiProtectedAreaRead>> {
  const params = new URLSearchParams({ page: String(page), size: String(size), state });
  return apiFetch(`/api/v1/protected-areas?${params}`);
}

export async function fetchProtectedArea(id: string): Promise<ApiProtectedAreaRead> {
  return apiFetch(`/api/v1/protected-areas/${id}`);
}
