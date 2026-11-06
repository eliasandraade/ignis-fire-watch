/**
 * Mensagem da faixa global de integridade de dados.
 *
 * A faixa só aparece quando alguma consulta à API falhou: as informações
 * afetadas não são exibidas (nada é substituído por dados fictícios).
 */
export type IntegrityLevel = 'degraded';

export interface IntegrityNotice {
  level: IntegrityLevel;
  message: string;
}

export function integrityNotice(failedQueries: number): IntegrityNotice | null {
  if (failedQueries <= 0) return null;
  return {
    level: 'degraded',
    message:
      `Serviço temporariamente indisponível em ${failedQueries} ` +
      `${failedQueries === 1 ? 'consulta' : 'consultas'}: as informações afetadas não estão sendo exibidas.`,
  };
}
