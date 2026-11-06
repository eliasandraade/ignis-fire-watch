import type { UserProfile, UserRole } from '@/types/domain';
import type { ApiUserRead } from '@/services/api/types';
import { homeForRole } from '@/lib/roles';

// API role (campo, gestor, orgao, admin, publico) → frontend UserRole.
// The values are the same strings; validation keeps an unknown value from
// granting anything (it degrades to "publico").
const VALID_ROLES: UserRole[] = ['admin', 'gestor', 'campo', 'analista', 'orgao', 'publico'];

function toUserRole(raw: string): UserRole {
  return VALID_ROLES.includes(raw as UserRole) ? (raw as UserRole) : 'publico';
}

export function adaptApiUser(api: ApiUserRead): UserProfile {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    role: toUserRole(api.role),
    mustChangePassword: api.must_change_password === true,
  };
}

/** Landing route after login; a pending password change always comes first. */
export function getRouteForRole(role: UserRole, mustChangePassword = false): string {
  return mustChangePassword ? '/conta/senha' : homeForRole(role);
}
