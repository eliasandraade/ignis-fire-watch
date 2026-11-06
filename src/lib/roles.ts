import type { UserRole } from '@/types/domain';

/** Natural pt-BR names for the backend roles (labels only; the API enforces access). */
export const ROLE_LABEL: Record<string, string> = {
  publico: 'Público (cadastrado)',
  campo: 'Equipe de campo',
  gestor: 'Gestor',
  orgao: 'Órgão / analista',
  analista: 'Órgão / analista',
  admin: 'Administrador',
};

export const ASSIGNABLE_ROLES = ['campo', 'gestor', 'orgao', 'admin', 'publico'] as const;

/** Where each role lands after login. */
export function homeForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'gestor':
    case 'orgao':
    case 'analista':
      return '/gestor';
    case 'campo':
      return '/gestor/field';
    default:
      return '/public';
  }
}
