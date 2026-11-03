export type DataSourceMode = 'api' | 'fallback';

export type DataSourceStatus = 'api' | 'demo' | 'fallback' | 'mixed' | 'partial';

export interface DataSourceMeta {
  mode: DataSourceMode;
  status: DataSourceStatus;
  label: string;
  isApi: boolean;
  isFallback: boolean;
}

export function isApiMode(): boolean {
  return import.meta.env.VITE_USE_API === 'true';
}

export function getDataSourceLabel(status: DataSourceStatus): string {
  switch (status) {
    // "api" means the last request succeeded — not real-time, and the
    // backend database may itself hold demonstration (seed) records.
    case 'api':
      return 'Dados da API';
    case 'demo':
      return 'Dados demonstrativos';
    case 'fallback':
      return 'API indisponível — dados demonstrativos';
    case 'mixed':
      return 'Dados mistos';
    case 'partial':
      return 'Dados parciais';
  }
}

export function createDataSourceMeta(isApiSuccess: boolean, hasData: boolean): DataSourceMeta {
  if (!isApiMode()) {
    return {
      mode: 'fallback',
      status: 'demo',
      label: getDataSourceLabel('demo'),
      isApi: false,
      isFallback: true,
    };
  }
  if (isApiSuccess && hasData) {
    return {
      mode: 'api',
      status: 'api',
      label: getDataSourceLabel('api'),
      isApi: true,
      isFallback: false,
    };
  }
  if (isApiSuccess && !hasData) {
    return {
      mode: 'fallback',
      status: 'partial',
      label: getDataSourceLabel('partial'),
      isApi: false,
      isFallback: true,
    };
  }
  // API error / loading
  return {
    mode: 'fallback',
    status: 'fallback',
    label: getDataSourceLabel('fallback'),
    isApi: false,
    isFallback: true,
  };
}
