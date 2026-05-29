import type { UserProfile, UserRole } from '@/types/domain';
import type { ApiUserRead } from '@/services/api/types';

// API role (campo, gestor, orgao, admin, publico) → frontend UserRole
// The values are already the same strings, but we validate to keep type safety
const VALID_ROLES: UserRole[] = ['admin', 'gestor', 'campo', 'analista', 'orgao', 'publico'];

function toUserRole(raw: string): UserRole {
  return VALID_ROLES.includes(raw as UserRole) ? (raw as UserRole) : 'publico';
}

// Map API role to the correct app route after login
const ROLE_ROUTE: Record<UserRole, string> = {
  admin:    '/admin',
  gestor:   '/gestor',
  orgao:    '/gestor',
  analista: '/gestor/aurora',
  campo:    '/gestor/field',
  publico:  '/public',
};

export function adaptApiUser(api: ApiUserRead): UserProfile {
  return {
    id:    api.id,
    name:  api.name,
    email: api.email,
    role:  toUserRole(api.role),
  };
}

export function getRouteForRole(role: UserRole): string {
  return ROLE_ROUTE[role] ?? '/public';
}
