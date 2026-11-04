import { ApiError } from '@/services/api/errors';

const FIELD_LABEL: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  role: 'Papel',
  reason: 'Motivo',
  confirm_password: 'Sua senha',
  temporary_password: 'Senha provisória',
  new_password: 'Nova senha',
  current_password: 'Senha atual',
  team_id: 'Equipe',
};

/** One-line message for a failed action, including FastAPI 422 validation lists. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = (error.body as { detail?: unknown } | null)?.detail;
    if (error.status === 422 && Array.isArray(detail)) {
      return detail
        .map(item => {
          const d = item as { loc?: unknown[]; msg?: string };
          const field = String(d.loc?.[d.loc.length - 1] ?? '');
          const msg = (d.msg ?? 'valor inválido').replace(/^Value error, /, '');
          return FIELD_LABEL[field] ? `${FIELD_LABEL[field]}: ${msg}` : msg;
        })
        .join(' ');
    }
    return describeError(error).detail;
  }
  return 'Erro inesperado. Tente novamente.';
}

/** Human message for an API failure; never invents a cause. */
export function describeError(error: unknown): { title: string; detail: string } {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return { title: 'Serviço temporariamente indisponível', detail: error.message };
    }
    if (error.status === 401) {
      return { title: 'Sessão encerrada', detail: 'Entre novamente para continuar.' };
    }
    if (error.status === 403) {
      return { title: 'Acesso negado', detail: error.message };
    }
    if (error.status === 404) {
      return { title: 'Não encontrado', detail: error.message };
    }
    if (error.status >= 500) {
      return {
        title: 'Serviço temporariamente indisponível',
        detail: `A API respondeu com erro ${error.status}. Tente novamente em instantes.`,
      };
    }
    return { title: 'Não foi possível concluir', detail: error.message };
  }
  return { title: 'Erro inesperado', detail: 'Tente novamente.' };
}
