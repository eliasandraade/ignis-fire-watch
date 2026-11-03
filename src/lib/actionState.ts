/**
 * Estados de uma ação operacional exibida na interface.
 *
 * Regra da Sprint 0: nenhuma ação pode informar que foi executada sem
 * execução efetiva e confirmação do backend. Ações sem integração real
 * ficam restritas ao modo demonstrativo ou desabilitadas.
 */
export type ActionState =
  | 'funcional'              // executa no backend e só confirma após resposta de sucesso
  | 'demonstrativo'          // simulação local explícita (VITE_USE_API=false)
  | 'indisponivel'           // depende de serviço fora do ar
  | 'nao-implementado'       // não existe execução real nesta versão
  | 'erro'                   // a última tentativa falhou
  | 'aguardando-confirmacao'; // requisição enviada, sem resposta ainda

export const ACTION_STATE_LABEL: Record<ActionState, string> = {
  funcional: 'Funcional',
  demonstrativo: 'Simulação — nada é enviado',
  indisponivel: 'Indisponível',
  'nao-implementado': 'Não implementado nesta versão',
  erro: 'Erro — não executado',
  'aguardando-confirmacao': 'Aguardando confirmação',
};

/**
 * Estado de uma ação que NÃO tem execução real no backend.
 * No modo demonstrativo pode ser simulada (com rótulo); no modo API fica
 * desabilitada, para não parecer uma operação real.
 */
export function unbackedActionState(apiMode: boolean): ActionState {
  return apiMode ? 'nao-implementado' : 'demonstrativo';
}

/** Estado de uma ação real a partir do ciclo de vida da requisição. */
export function mutationActionState(m: {
  isPending: boolean;
  isError: boolean;
}): ActionState {
  if (m.isPending) return 'aguardando-confirmacao';
  if (m.isError) return 'erro';
  return 'funcional';
}

export function isActionEnabled(state: ActionState): boolean {
  return state === 'funcional' || state === 'demonstrativo' || state === 'erro';
}
