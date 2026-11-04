/**
 * Estado da origem de um conjunto de dados exibido na interface.
 *
 * A aplicação só exibe dados reais da API. Nenhum estado aqui representa
 * dados substitutos: quando a consulta falha ou não traz registros, a tela
 * diz isso em vez de mostrar qualquer outra coisa.
 */
export type DataSourceStatus = 'loading' | 'ok' | 'empty' | 'error';

export interface DataSourceMeta {
  status: DataSourceStatus;
  label: string;
}

export function getDataSourceLabel(status: DataSourceStatus): string {
  switch (status) {
    case 'loading':
      return 'Carregando';
    // "ok" significa que a última consulta à API teve sucesso — não é tempo real.
    case 'ok':
      return 'Dados da API';
    case 'empty':
      return 'Sem registros';
    case 'error':
      return 'Serviço temporariamente indisponível';
  }
}

/**
 * @param isSuccess  a consulta à API terminou com sucesso
 * @param hasData    a resposta trouxe ao menos um registro
 * @param isLoading  a consulta ainda está em andamento
 */
export function createDataSourceMeta(
  isSuccess: boolean,
  hasData: boolean,
  isLoading = false,
): DataSourceMeta {
  const status: DataSourceStatus = isLoading
    ? 'loading'
    : isSuccess
      ? (hasData ? 'ok' : 'empty')
      : 'error';
  return { status, label: getDataSourceLabel(status) };
}
