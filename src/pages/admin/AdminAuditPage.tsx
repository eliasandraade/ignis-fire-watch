import { useInlineToast } from '@/hooks/useInlineToast';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Info, RefreshCw } from 'lucide-react';
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
import { errorMessage } from '@/lib/apiErrors';
import { useAudit } from '@/hooks/useAdminCockpit';
import { exportAudit, type AuditEvent } from '@/services/api/adminCockpit';
import { formatDateTime, fortalezaInputToIso } from '@/lib/time';
import { ACTION_LABEL, actionLabel, actionTone, DENIAL_CAUSE } from '@/lib/adminLabels';
import { useQueryClient } from '@tanstack/react-query';

function EventDrawer({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  const meta = event.metadata_json ?? {};
  const result = typeof meta.result === 'string' ? meta.result : null;
  const cause = typeof meta.cause === 'string' ? meta.cause : null;
  return (
    <Drawer title={actionLabel(event.action)} subtitle={formatDateTime(event.created_at)} onClose={onClose}>
      <section>
        <h3 className="ig-section-title">Evento</h3>
        <dl className="ig-kv">
          <dt>Ação</dt><dd className="ig-mono">{event.action}</dd>
          <dt>Resultado</dt>
          <dd>
            {result === 'denied' ? <Pill tone="err">Recusada</Pill> : result === 'success' ? <Pill tone="ok">Concluída</Pill> : '—'}
            {cause && <div className="ig-sub">Motivo da recusa: {DENIAL_CAUSE[cause] ?? cause}</div>}
          </dd>
          <dt>Ator</dt><dd>{event.actor_name}{event.user_id && <div className="ig-sub ig-mono">{event.user_id}</div>}</dd>
          <dt>Alvo</dt><dd>{event.entity_type}<div className="ig-sub ig-mono">{event.entity_id ?? '—'}</div></dd>
          <dt>Quando</dt><dd>{formatDateTime(event.created_at)} (Fortaleza)</dd>
          <dt>Identificador</dt><dd className="ig-mono">{event.id}</dd>
        </dl>
      </section>
      <section>
        <h3 className="ig-section-title">Metadados permitidos</h3>
        <pre className="ig-code">{JSON.stringify(meta, null, 2)}</pre>
        <p className="ig-sub" style={{ marginTop: 8 }}>
          Chaves com aparência de segredo (senha, token, chave, hash) são omitidas pelo servidor.
        </p>
      </section>
    </Drawer>
  );
}

export default function AdminAuditPage() {
  const [params, setParams] = useSearchParams();
  const get = (k: string) => params.get(k) ?? '';
  const page = Math.max(1, Number(get('page') || 1) || 1);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [exporting, setExporting] = useState(false);
  const toast = useInlineToast();
  const client = useQueryClient();
  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };
  const filters = {
    action: get('action') || undefined,
    entity_type: get('entity') || undefined,
    actor: get('actor') || undefined,
    involving_user: get('user') || undefined,
    from: fortalezaInputToIso(get('from')),
    to: fortalezaInputToIso(get('to')),
  };
  const { data, error, isLoading, isFetching, refetch } = useAudit({ page, ...filters });
  const filtered = Object.values(filters).some(Boolean);

  const download = async () => {
    setExporting(true);
    try {
      const { rows } = await exportAudit(filters);
      toast.show({ tone: 'ok', text: `CSV exportado (${rows ?? 0} eventos). A exportação também foi registrada na auditoria.` });
      void client.invalidateQueries({ queryKey: ['admin', 'audit'] });
    } catch (err) {
      toast.show({ tone: 'err', text: errorMessage(err) });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="ig-page">
      <PageHeader
        title="Auditoria"
        description="Ações de pessoas no sistema: quem fez, sobre o quê, quando e com que resultado. Não inclui logs de infraestrutura."
        actions={
          <button type="button" className="ig-btn" onClick={() => void download()} disabled={exporting}>
            {exporting ? <Spinner /> : <Download size={15} />} Exportar CSV
          </button>
        }
      />
      <Panel flush>
        <div className="ig-toolbar">
          <Field label="Ação">
            <select className="ig-input" value={get('action')} onChange={e => update({ action: e.target.value || null, page: null })}>
              <option value="">Todas</option>
              {Object.entries(ACTION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Entidade">
            <select className="ig-input" value={get('entity')} onChange={e => update({ entity: e.target.value || null, page: null })}>
              <option value="">Todas</option>
              {['User', 'AuditLog', 'IngestionRound', 'Incident', 'PublicReport', 'Mission'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Ator">
            <input className="ig-input" placeholder="Nome de quem agiu" value={get('actor')} onChange={e => update({ actor: e.target.value || null, page: null })} />
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
        {get('user') && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--ig-line)' }}>
            <Callout icon={<Info size={16} />}>
              Mostrando eventos em que o usuário <span className="ig-mono">{get('user')}</span> é ator ou alvo.{' '}
              <button type="button" className="ig-btn ghost sm" onClick={() => update({ user: null, page: null })}>Remover filtro</button>
            </Callout>
          </div>
        )}
        {isLoading && <LoadingBlock rows={8} />}
        {error && !data && <ErrorState error={error} onRetry={() => void refetch()} />}
        {data && data.items.length === 0 && (
          <EmptyState title={filtered ? 'Nenhum evento com estes filtros' : 'Nenhum evento registrado'}>
            {filtered ? 'Ajuste os filtros.' : 'Logins e ações administrativas aparecem aqui.'}
          </EmptyState>
        )}
        {data && data.items.length > 0 && (
          <>
            <div className="ig-table-wrap">
              <table className="ig-table">
                <thead>
                  <tr><th>Quando</th><th>Ação</th><th>Ator</th><th className="ig-hide-sm">Alvo</th><th>Resultado</th></tr>
                </thead>
                <tbody>
                  {data.items.map(e => {
                    const result = (e.metadata_json ?? {}).result;
                    return (
                      <tr key={e.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(e.created_at)}</td>
                        <td>
                          <button type="button" className="ig-row-btn" onClick={() => setSelected(e)}>{actionLabel(e.action)}</button>
                          <div className="ig-sub ig-mono">{e.action}</div>
                        </td>
                        <td>{e.actor_name}</td>
                        <td className="ig-hide-sm">{e.entity_type}<div className="ig-sub ig-mono">{(e.entity_id ?? '').slice(0, 18)}</div></td>
                        <td>
                          {result === 'denied' || actionTone(e.action) === 'err'
                            ? <Pill tone="err">Recusada</Pill>
                            : result === 'success' ? <Pill tone="ok">Concluída</Pill> : <Pill tone="muted">Registrada</Pill>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pager page={data.page} pages={data.pages} total={data.total} noun="eventos" onPage={p => update({ page: String(p) })} />
          </>
        )}
      </Panel>
      {selected && <EventDrawer event={selected} onClose={() => setSelected(null)} />}
      {toast.node}
    </div>
  );
}
