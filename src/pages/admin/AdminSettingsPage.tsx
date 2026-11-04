import { Info } from 'lucide-react';
import { Callout, ErrorState, LoadingBlock, PageHeader, Panel, Pill } from '@/components/admin/ui';
import { useAdminSettings } from '@/hooks/useAdminCockpit';

const LABELS: Record<string, string> = {
  name: 'Produto',
  vendor: 'Fornecedor',
  version: 'Versão da API',
  environment: 'Ambiente',
  build_commit: 'Commit do build',
  api_docs_public: 'Documentação pública (/docs)',
  nasa_firms_configured: 'NASA FIRMS configurada',
  inpe_queimadas_enabled: 'INPE Queimadas habilitada',
  stale_after_minutes: 'Fonte desatualizada após (min)',
  ingest_window_hours: 'Janela de ingestão (h)',
  ingest_round_timeout_seconds: 'Tempo máximo da rodada (s)',
  reference_dataset: 'Malha de referência',
  jwt_expiration_minutes: 'Validade da sessão (min)',
  password_min_length: 'Senha: tamanho mínimo',
  rate_limit_enabled: 'Limite de requisições',
  rate_limit_scope: 'Escopo do limite',
  trust_proxy_headers: 'Confia em cabeçalhos do proxy',
  client_ip_header: 'Cabeçalho de IP do cliente',
  cors_origins: 'Origens CORS permitidas',
};

function render(value: unknown) {
  if (value === null || value === undefined) return <span className="ig-sub">não informado</span>;
  if (typeof value === 'boolean') return value ? <Pill tone="ok">Sim</Pill> : <Pill tone="muted">Não</Pill>;
  if (Array.isArray(value)) return <span className="ig-mono">{value.join(', ') || '—'}</span>;
  if (typeof value === 'object') {
    return (
      <span className="ig-mono">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
      </span>
    );
  }
  return String(value);
}

function Section({ title, values }: { title: string; values: Record<string, unknown> }) {
  return (
    <Panel title={title}>
      <dl className="ig-kv">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} style={{ display: 'contents' }}>
            <dt>{LABELS[key] ?? key}</dt>
            <dd>{render(value)}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export default function AdminSettingsPage() {
  const { data, error, isLoading, refetch } = useAdminSettings();
  return (
    <div className="ig-page">
      <PageHeader
        title="Configuração"
        description="Configuração efetiva desta instância, sem segredos. Somente leitura."
      />
      {isLoading && <Panel><LoadingBlock rows={8} /></Panel>}
      {error && <Panel><ErrorState error={error} onRetry={() => void refetch()} /></Panel>}
      {data && (
        <div className="ig-stack">
          <Callout icon={<Info size={16} />}>
            Gerenciado pelo ambiente: {data.managed_by} Chaves de API, senhas e a URL do banco nunca são
            exibidas. Para mudar um valor, altere a variável do serviço na plataforma de hospedagem por um
            processo revisado.
          </Callout>
          <Section title="Aplicação e build" values={data.application} />
          <Section title="Fontes de dados e atualização" values={data.data_sources} />
          <Section title="Segurança e sessão" values={data.security} />
          <p className="ig-panel-note">
            Interface: build do frontend {import.meta.env.VITE_BUILD_SHA ? <span className="ig-mono">{String(import.meta.env.VITE_BUILD_SHA).slice(0, 12)}</span> : 'sem identificação de commit'} · horários exibidos no fuso de Fortaleza (UTC−3).
          </p>
        </div>
      )}
    </div>
  );
}
