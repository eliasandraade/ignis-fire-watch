import { useSearchParams } from 'react-router-dom';
import { Info, RefreshCw } from 'lucide-react';
import {
  Callout,
  Drawer,
  EmptyState,
  ErrorState,
  Field,
  LoadingBlock,
  PageHeader,
  Pager,
  Panel,
  Pill,
  Spinner,
} from '@/components/admin/ui';
import { useRun, useRuns } from '@/hooks/useAdminCockpit';
import { formatDateTime, formatDuration, fortalezaInputToIso } from '@/lib/time';
import { RUN_STATUS, SOURCE_LABEL, TRIGGER_LABEL } from '@/lib/adminLabels';

function RunDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { data: run, error, isLoading, refetch } = useRun(id);
  return (
    <Drawer title="Execução de ingestão" subtitle={<span className="ig-mono">{id}</span>} onClose={onClose}>
      {isLoading && <LoadingBlock rows={6} />}
      {error && <ErrorState error={error} onRetry={() => void refetch()} />}
      {run && (
        <>
          <section>
            <h3 className="ig-section-title">Resumo</h3>
            <dl className="ig-kv">
              <dt>Fonte</dt><dd>{SOURCE_LABEL[run.source] ?? run.source}</dd>
              <dt>Produto</dt><dd className="ig-mono">{run.product}</dd>
              <dt>Situação</dt><dd><Pill tone={RUN_STATUS[run.status]?.tone ?? 'muted'}>{RUN_STATUS[run.status]?.label ?? run.status}</Pill></dd>
              <dt>Disparo</dt><dd>{TRIGGER_LABEL[run.trigger] ?? run.trigger}{run.triggered_by_user_id && <div className="ig-sub ig-mono">por {run.triggered_by_user_id}</div>}</dd>
              <dt>Início</dt><dd>{formatDateTime(run.started_at)}</dd>
              <dt>Fim</dt><dd>{formatDateTime(run.finished_at, 'Em andamento')}</dd>
              <dt>Duração</dt><dd>{formatDuration(run.started_at, run.finished_at)}</dd>
              <dt>Janela consultada</dt><dd>{formatDateTime(run.window_start)} → {formatDateTime(run.window_end)}</dd>
            </dl>
          </section>
          <section>
            <h3 className="ig-section-title">Contadores (o que foi gravado)</h3>
            <dl className="ig-kv">
              <dt>Lidos do provedor</dt><dd>{run.records_fetched}</dd>
              <dt>Válidos</dt><dd>{run.records_valid}</dd>
              <dt>Rejeitados</dt><dd>{run.records_rejected}</dd>
              <dt>Fora da área monitorada</dt><dd>{run.records_out_of_scope}</dd>
              <dt>Novos gravados</dt><dd>{run.records_inserted}</dd>
              <dt>Repetidos (já existiam)</dt><dd>{run.records_duplicate}</dd>
            </dl>
          </section>
          {(run.error_code || run.error_message) && (
            <section>
              <h3 className="ig-section-title">Erro</h3>
              <Callout tone="err">
                <span className="ig-mono">{run.error_code}</span>
                {run.error_message && <div>{run.error_message}</div>}
              </Callout>
            </section>
          )}
          <section>
            <h3 className="ig-section-title">Proveniência e parâmetros</h3>
            <pre className="ig-code">{JSON.stringify(run.params ?? {}, null, 2)}</pre>
          </section>
        </>
      )}
    </Drawer>
  );
}

export default function AdminJobsPage() {
  const [params, setParams] = useSearchParams();
  const get = (k: string) => params.get(k) ?? '';
  const page = Math.max(1, Number(get('page') || 1) || 1);
  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };
  const filters = {
    page,
    source: get('source') || undefined,
    status: get('status') || undefined,
    trigger: get('trigger') || undefined,
    from: fortalezaInputToIso(get('from')),
    to: fortalezaInputToIso(get('to')),
  };
  const { data, error, isLoading, isFetching, refetch } = useRuns(filters);
  const filtered = Boolean(filters.source || filters.status || filters.trigger || filters.from || filters.to);

  return (
    <div className="ig-page">
      <PageHeader
        title="Execuções"
        description="Histórico de ingestão registrado em ingestion_runs, agendado (worker) ou manual."
      />
      <div style={{ marginBottom: 16 }}>
        <Callout icon={<Info size={16} />}>
          Esta tela mostra execuções registradas no banco. Ela não controla nem observa o processo do worker
          no Railway: um worker parado aparece como ausência de execuções agendadas recentes.
        </Callout>
      </div>
      <Panel flush>
        <div className="ig-toolbar">
          <Field label="Fonte">
            <select className="ig-input" value={get('source')} onChange={e => update({ source: e.target.value || null, page: null })}>
              <option value="">Todas</option>
              <option value="INPE_QUEIMADAS">INPE Queimadas</option>
              <option value="NASA_FIRMS">NASA FIRMS</option>
            </select>
          </Field>
          <Field label="Situação">
            <select className="ig-input" value={get('status')} onChange={e => update({ status: e.target.value || null, page: null })}>
              <option value="">Todas</option>
              {Object.entries(RUN_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="Disparo">
            <select className="ig-input" value={get('trigger')} onChange={e => update({ trigger: e.target.value || null, page: null })}>
              <option value="">Todos</option>
              <option value="schedule">Agendada</option>
              <option value="manual">Manual</option>
            </select>
          </Field>
          <Field label="De (Fortaleza)">
            <input className="ig-input" type="datetime-local" value={get('from')} onChange={e => update({ from: e.target.value || null, page: null })} />
          </Field>
          <Field label="Até (Fortaleza)">
            <input className="ig-input" type="datetime-local" value={get('to')} onChange={e => update({ to: e.target.value || null, page: null })} />
          </Field>
          <button type="button" className="ig-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => void refetch()}>
            {isFetching ? <Spinner /> : <RefreshCw size={14} />} Atualizar
          </button>
        </div>
        {isLoading && <LoadingBlock rows={6} />}
        {error && !data && <ErrorState error={error} onRetry={() => void refetch()} />}
        {data && data.items.length === 0 && (
          <EmptyState title={filtered ? 'Nenhuma execução com estes filtros' : 'Nenhuma execução registrada'}>
            {filtered ? 'Ajuste os filtros.' : 'As execuções aparecem quando o worker roda ou um administrador dispara uma ingestão em Fontes de dados.'}
          </EmptyState>
        )}
        {data && data.items.length > 0 && (
          <>
            <div className="ig-table-wrap">
              <table className="ig-table">
                <thead>
                  <tr><th>Fonte / produto</th><th>Disparo</th><th>Início</th><th>Duração</th><th>Situação</th><th className="ig-hide-sm">Novos / lidos</th></tr>
                </thead>
                <tbody>
                  {data.items.map(r => (
                    <tr key={r.id}>
                      <td>
                        <button type="button" className="ig-row-btn" onClick={() => update({ run: r.id })}>
                          {SOURCE_LABEL[r.source] ?? r.source}
                        </button>
                        <div className="ig-sub ig-mono">{r.product}</div>
                      </td>
                      <td>{TRIGGER_LABEL[r.trigger] ?? r.trigger}</td>
                      <td>{formatDateTime(r.started_at)}</td>
                      <td>{formatDuration(r.started_at, r.finished_at)}</td>
                      <td>
                        <Pill tone={RUN_STATUS[r.status]?.tone ?? 'muted'}>{RUN_STATUS[r.status]?.label ?? r.status}</Pill>
                        {r.error_code && <div className="ig-sub ig-mono">{r.error_code}</div>}
                      </td>
                      <td className="ig-hide-sm">{r.records_inserted} / {r.records_fetched}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={data.page} pages={data.pages} total={data.total} noun="execuções" onPage={p => update({ page: String(p) })} />
          </>
        )}
      </Panel>
      {get('run') && <RunDrawer id={get('run')} onClose={() => update({ run: null })} />}
    </div>
  );
}
