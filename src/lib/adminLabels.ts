import type { Tone } from '@/components/admin/ui';

export const SOURCE_STATE: Record<string, { label: string; tone: Tone; hint: string }> = {
  live: { label: 'Operando', tone: 'ok', hint: 'Última ingestão bem-sucedida dentro do prazo de atualização.' },
  stale: { label: 'Desatualizada', tone: 'warn', hint: 'Sem ingestão bem-sucedida dentro do prazo de atualização.' },
  degraded: { label: 'Degradada', tone: 'warn', hint: 'Parte dos produtos falhou na última execução.' },
  unavailable: { label: 'Indisponível', tone: 'err', hint: 'A última tentativa não obteve dados do provedor.' },
  disabled: { label: 'Desativada', tone: 'muted', hint: 'Desligada pela configuração do ambiente.' },
  never_ingested: { label: 'Sem ingestão', tone: 'muted', hint: 'Nenhuma execução registrada para esta fonte.' },
};

export const RUN_STATUS: Record<string, { label: string; tone: Tone }> = {
  running: { label: 'Em execução', tone: 'info' },
  ok: { label: 'Concluída', tone: 'ok' },
  partial: { label: 'Parcial', tone: 'warn' },
  unavailable: { label: 'Indisponível', tone: 'err' },
  disabled: { label: 'Desativada', tone: 'muted' },
  error: { label: 'Erro', tone: 'err' },
};

export const TRIGGER_LABEL: Record<string, string> = {
  schedule: 'Agendada',
  manual: 'Manual',
};

export const SOURCE_LABEL: Record<string, string> = {
  NASA_FIRMS: 'NASA FIRMS',
  INPE_QUEIMADAS: 'INPE Queimadas',
};

/** Audit action ids → natural language. Unknown actions are shown as recorded. */
export const ACTION_LABEL: Record<string, string> = {
  'user.login': 'Login',
  'user.created': 'Usuário criado',
  'user.profile_updated': 'Perfil editado',
  'user.role_changed': 'Papel alterado',
  'user.activated': 'Conta reativada',
  'user.deactivated': 'Conta desativada',
  'user.password_reset': 'Senha redefinida pelo administrador',
  'user.password_changed': 'Senha trocada pelo usuário',
  'user.role_change.denied': 'Alteração de papel recusada',
  'user.deactivate.denied': 'Desativação recusada',
  'user.activate.denied': 'Reativação recusada',
  'user.password_reset.denied': 'Redefinição de senha recusada',
  'audit.exported': 'Auditoria exportada',
  'orbital_ingest.requested': 'Ingestão manual solicitada',
  'jurisdictions.imported': 'Malha municipal importada',
  'user.local_validation_account': 'Conta de validação local preparada',
  'user.bootstrap_admin_created': 'Administrador inicial criado',
  'user.demo_credentials_revoked': 'Credenciais demonstrativas revogadas',
  'area.created': 'Área protegida criada',
  'area.updated': 'Área protegida editada',
  'area.deleted': 'Área protegida removida',
  'incident.created': 'Incidente criado',
  'incident.status_changed': 'Situação do incidente alterada',
  'incident.protocol_activated': 'Protocolo de incidente acionado',
  'mission.created': 'Missão criada',
  'mission.updated': 'Missão editada',
  'mission.status_changed': 'Situação da missão alterada',
  'report.submitted': 'Denúncia recebida',
  'report.validated': 'Denúncia validada',
  'report.discarded': 'Denúncia descartada',
  'report.status_updated': 'Situação da denúncia alterada',
  'report.converted_to_incident': 'Denúncia convertida em incidente',
  'evidence.submitted': 'Evidência anexada',
  'team.created': 'Equipe criada',
  'team.updated': 'Equipe editada',
  'resource.created': 'Recurso criado',
  'resource.updated': 'Recurso editado',
  'esg.report_created': 'Relatório ESG criado',
};

export const DENIAL_CAUSE: Record<string, string> = {
  self: 'ação sobre a própria conta',
  last_admin: 'último administrador ativo',
  step_up_failed: 'senha de confirmação incorreta',
};

export function actionLabel(action: string): string {
  return ACTION_LABEL[action] ?? action;
}

export function actionTone(action: string): Tone {
  if (action.endsWith('.denied')) return 'err';
  if (action.includes('deactivat') || action.includes('reset')) return 'warn';
  return 'info';
}
