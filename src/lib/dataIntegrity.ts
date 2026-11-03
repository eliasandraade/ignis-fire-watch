/**
 * Mensagem da faixa global de integridade de dados.
 *
 * O IGNIS é um protótipo: mesmo com a API ativa, o banco pode conter registros
 * de demonstração (seed) e algumas telas usam dados demonstrativos quando uma
 * consulta falha. A faixa deixa isso explícito em todas as rotas.
 */
export type IntegrityLevel = 'demo' | 'degraded' | 'prototype';

export interface IntegrityNotice {
  level: IntegrityLevel;
  message: string;
}

export function integrityNotice(apiMode: boolean, failedQueries: number): IntegrityNotice {
  if (!apiMode) {
    return {
      level: 'demo',
      message:
        'MODO DEMONSTRATIVO — todos os dados são fictícios e nenhuma ação é enviada a órgãos reais.',
    };
  }
  if (failedQueries > 0) {
    return {
      level: 'degraded',
      message:
        `API indisponível em ${failedQueries} ${failedQueries === 1 ? 'consulta' : 'consultas'}: ` +
        'parte das informações exibidas é demonstrativa ou está ausente. Não use para decisão operacional.',
    };
  }
  return {
    level: 'prototype',
    message:
      'PROTÓTIPO NÃO OPERACIONAL — dados da API podem ser de demonstração. Sem integração com Bombeiros ou Defesa Civil.',
  };
}
