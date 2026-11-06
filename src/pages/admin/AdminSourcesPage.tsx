import { useInlineToast } from '@/hooks/useInlineToast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Layers, Play, Satellite } from 'lucide-react';
import {
  Callout,
  Dialog,
  ErrorState,
  LoadingBlock,
  PageHeader,
  Panel,
  Pill,
  Spinner,
} from '@/components/admin/ui';
import { errorMessage } from '@/lib/apiErrors';
import { useSources } from '@/hooks/useAdminCockpit';
import { triggerIngestion, type IngestAccepted, type SourceStatus } from '@/services/api/adminCockpit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDateTime, formatDuration, formatRelative } from '@/lib/time';
import { RUN_STATUS, SOURCE_LABEL, SOURCE_STATE, TRIGGER_LABEL } from '@/lib/adminLabels';

const KEY_OF: Record<string, 'firms' | 'inpe'> = { NASA_FIRMS: 'firms', INPE_QUEIMADAS: 'inpe' };

function TriggerDialog({ source, onClose }: { source: SourceStatus; onClose: () => void }) {
  const client = useQueryClient();
  const toast = useInlineToast();
  const [result, setResult] = useState<IngestAccepted | null>(null);
  const mutation = useMutation({
    mutationFn: () => triggerIngestion([KEY_OF[source.source]]),
    onSuccess: data => {
      setResult(data);
      void client.invalidateQueries({ queryKey: ['admin'] });
    },
  });
  const notConfigured = source.configuration && !source.configuration.configured;
  return (
    <Dialog
      title={`Executar ingestão — ${SOURCE_LABEL[source.source] ?? source.label}`}
      description="Inicia uma rodada usando o mesmo mecanismo do worker. A solicitação fica na auditoria; uma execução já em andamento para o mesmo produto não é duplicada."
      onClose={onClose}
      footer={
        result ? (
          <>
            <Link to="/admin/jobs" className="ig-btn">Acompanhar em Execuções</Link>
            <button type="button" className="ig-btn primary" onClick={onClose}>Fechar</button>
          </>
        ) : (
          <>
            <button type="button" className="ig-btn ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="ig-btn primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending ? <Spinner /> : <Play size={14} />} Executar agora
            </button>
          </>
        )
      }
    >
      {notConfigured && (
        <Callout tone="warn">
          Esta fonte não está configurada neste ambiente: a execução será registrada como “desativada”,
          sem requisições ao provedor. {source.configuration?.detail}
        </Callout>
      )}
      {mutation.error && <Callout tone="err">{errorMessage(mutation.error)}</Callout>}
      {result && (
        <Callout tone={result.status === 'accepted' ? 'ok' : 'warn'}>
          {result.message}
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {result.runs.map(r => (
              <li key={`${r.source}-${r.product}`}>
                <span className="ig-mono">{r.product}</span>:{' '}
                {r.status === 'running' ? 'iniciada (resultado em Execuções)' : 'já havia uma execução ativa'}
              </li>
            ))}
          </ul>
        </Callout>
      )}
      {toast.node}
    </Dialog>
  );
}

export default function AdminSourcesPage() {
  const { data, error, isLoading, refetch } = useSources();
  const [trigger, setTrigger] = useState<SourceStatus | null>(null);

  return (
    <div className="ig-page">
      <PageHeader
        title="Fontes de dados"
        description="Integrações reais do IGNIS: estado, configuração (sem segredos), última execução e proveniência. Os estados vêm das execuções registradas."
      />
      {isLoading && <Panel><LoadingBlock rows={6} /></Panel>}
      {error && <Panel><ErrorState error={error} onRetry={() => void refetch()} /></Panel>}
      {data && (
        <div className="ig-stack">
          {data.sources.map(source => {
            const state = SOURCE_STATE[source.state] ?? { label: source.state, tone: 'muted' as const, hint: '' };
            const config = source.configuration;
            return (
              <Panel
                key={source.source}
                icon={<Satellite size={16} />}
                title={SOURCE_LABEL[source.source] ?? source.label}
                note={state.hint}
                actions={
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Pill tone={state.tone}>{state.label}</Pill>
                    <button type="button" className="ig-btn sm" onClick={() => setTrigger(source)}>
                      <Play size={14} /> Executar
                    </button>
                  </div>
                }
              >
                <div className="ig-grid ig-grid-2">
                  <dl className="ig-kv">
                    <dt>Configuração</dt>
                    <dd>
                      {config?.configured ? (
                        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><CheckCircle2 size={14} color="var(--ig-ok)" /> Configurada</span>
                      ) : (
                        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><CircleAlert size={14} color="var(--ig-warn)" /> Não configurada</span>
                      )}
                      <div className="ig-sub">{config?.detail}</div>
                    </dd>
                    <dt>Homologação</dt>
                    <dd>
                      {config?.homologated ? <Pill tone="ok">Homologada</Pill> : <Pill tone="warn">Não homologada</Pill>}
                      <div className="ig-sub">{config?.homologation_note}</div>
                    </dd>
                    <dt>Situação informada</dt>
                    <dd>{source.message}</dd>
                  </dl>
                  <dl className="ig-kv">
                    <dt>Último sucesso</dt>
                    <dd>{formatDateTime(source.last_success_at, 'Nunca')}{source.last_success_at && ` (${formatRelative(source.last_success_at)})`}</dd>
                    <dt>Observação mais recente</dt>
                    <dd>{formatDateTime(source.latest_observation_at, 'Nenhum foco gravado')}</dd>
                    <dt>Prazo de atualização</dt>
                    <dd>{source.stale_after_minutes} min</dd>
                    <dt>Origem dos dados</dt>
                    <dd>{source.origin === 'fixture' ? 'Amostra pública histórica (fixture)' : source.origin === 'live' ? 'Coleta ao vivo' : '—'}</dd>
                  </dl>
                </div>
                <div className="ig-table-wrap" style={{ marginTop: 16, border: '1px solid var(--ig-line)', borderRadius: 8 }}>
                  <table className="ig-table">
                    <thead>
                      <tr><th>Produto</th><th>Estado</th><th>Última execução</th><th>Registros</th><th>Erro (sanitizado)</th></tr>
                    </thead>
                    <tbody>
                      {source.products.map(p => {
                        const ps = SOURCE_STATE[p.state] ?? { label: p.state, tone: 'muted' as const };
                        const run = p.last_run;
                        return (
                          <tr key={p.product}>
                            <td className="ig-mono">{p.product}{p.running && <div className="ig-sub">em execução</div>}</td>
                            <td><Pill tone={ps.tone}>{ps.label}</Pill></td>
                            <td>
                              {run ? (
                                <>
                                  <Pill tone={RUN_STATUS[run.status]?.tone ?? 'muted'}>{RUN_STATUS[run.status]?.label ?? run.status}</Pill>
                                  <div className="ig-sub">{formatDateTime(run.started_at)} · {TRIGGER_LABEL[run.trigger]} · {formatDuration(run.started_at, run.finished_at)}</div>
                                </>
                              ) : <span className="ig-sub">Nenhuma</span>}
                            </td>
                            <td>
                              {run ? (
                                <span className="ig-sub">
                                  {run.records_fetched} lidos · {run.records_inserted} novos · {run.records_duplicate} repetidos · {run.records_rejected} rejeitados
                                </span>
                              ) : '—'}
                            </td>
                            <td className="ig-mono">{p.last_error_code ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            );
          })}
          {data.reference_data.map(ref => (
            <Panel key={ref.source} icon={<Layers size={16} />} title={`${ref.source} — ${ref.product}`} note="Dado de referência (não é ingerido periodicamente)"
              actions={ref.state === 'loaded' ? <Pill tone="ok">Carregada</Pill> : <Pill tone="err">Ausente</Pill>}>
              <dl className="ig-kv">
                {ref.dataset && Object.entries(ref.dataset).map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}>
                    <dt>{({ version: 'Versão', reference_date: 'Data de referência', content_sha256: 'SHA-256', source: 'Fonte', product: 'Produto' } as Record<string, string>)[k] ?? k}</dt>
                    <dd className={k === 'content_sha256' ? 'ig-mono' : undefined}>{String(v)}</dd>
                  </div>
                ))}
                <dt>Carga</dt><dd>{ref.detail}</dd>
              </dl>
            </Panel>
          ))}
        </div>
      )}
      {trigger && <TriggerDialog source={trigger} onClose={() => setTrigger(null)} />}
    </div>
  );
}
