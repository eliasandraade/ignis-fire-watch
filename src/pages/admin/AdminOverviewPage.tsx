import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Database,
  Flame,
  Info,
  MapPinned,
  Server,
  Timer,
  Users,
} from 'lucide-react';
import {
  Callout,
  EmptyState,
  ErrorState,
  LoadingBlock,
  PageHeader,
  Panel,
  Pill,
  Stat,
} from '@/components/admin/ui';
import { useOverview } from '@/hooks/useAdminCockpit';
import type { Overview } from '@/services/api/adminCockpit';
import { formatDateTime, formatDuration, formatRelative } from '@/lib/time';
import { actionLabel, actionTone, RUN_STATUS, SOURCE_LABEL, SOURCE_STATE, TRIGGER_LABEL } from '@/lib/adminLabels';
import { ROLE_LABEL } from '@/lib/roles';

const WORKER: Record<Overview['worker']['state'], { label: string; tone: 'ok' | 'warn' | 'muted' }> = {
  recent_runs: { label: 'Execuções agendadas recentes', tone: 'ok' },
  no_recent_runs: { label: 'Sem execuções agendadas recentes', tone: 'warn' },
  no_evidence: { label: 'Nenhuma execução agendada registrada', tone: 'muted' },
};

function History30({ days }: { days: Overview['ingestion']['history_30d'] }) {
  if (days.length === 0) {
    return (
      <EmptyState title="Sem execuções nos últimos 30 dias">
        O histórico aparece aqui assim que o worker ou um administrador executar uma ingestão.
      </EmptyState>
    );
  }
  const max = Math.max(...days.map(d => d.ok + d.failed + d.running), 1);
  return (
    <div>
      <div className="ig-bars" role="img" aria-label="Execuções por dia nos últimos 30 dias, concluídas e com falha">
        {days.map(d => (
          <div key={d.day} title={`${d.day}: ${d.ok} concluídas, ${d.failed} com falha`}>
            <span style={{ height: `${(d.ok / max) * 100}%`, background: 'var(--ig-ok)', borderRadius: 2 }} />
            <span style={{ height: `${(d.failed / max) * 100}%`, background: 'var(--ig-err)', borderRadius: 2 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-ghost)', marginTop: 8 }}>
        <span>{days[0].day.split('-').reverse().join('/')}</span>
        <span style={{ display: 'flex', gap: 12 }}>
          <span><span style={{ color: 'var(--ig-ok)' }}>■</span> concluídas</span>
          <span><span style={{ color: 'var(--ig-err)' }}>■</span> com falha</span>
        </span>
        <span>{days[days.length - 1].day.split('-').reverse().join('/')}</span>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data, error, isLoading, refetch, dataUpdatedAt } = useOverview();

  return (
    <div className="ig-page">
      <PageHeader
        title="Painel administrativo"
        description="Estado observado agora e histórico registrado no banco. Nenhum número desta tela é estimado."
        actions={
          data && (
            <span className="ig-panel-note" style={{ alignSelf: 'center' }}>
              Atualizado {formatRelative(new Date(dataUpdatedAt).toISOString())} · renova a cada minuto
            </span>
          )
        }
      />
      {isLoading && <Panel><LoadingBlock rows={6} /></Panel>}
      {error && !data && <Panel><ErrorState error={error} onRetry={() => void refetch()} /></Panel>}
      {data && (
        <div className="ig-stack">
          <div className="ig-grid ig-grid-4">
            <Stat
              icon={<Server size={14} />}
              label="API"
              value={<Pill tone="ok">Respondendo</Pill>}
              foot={`Versão ${data.api.version} · ${data.api.environment}`}
            />
            <Stat
              icon={<Database size={14} />}
              label="Banco de dados"
              value={
                data.database.status === 'connected'
                  ? <Pill tone="ok">Conectado</Pill>
                  : <Pill tone="err">Inacessível</Pill>
              }
              foot={
                data.database.latency_ms !== null
                  ? `Consulta de verificação: ${data.database.latency_ms.toLocaleString('pt-BR')} ms (medida agora)`
                  : 'Latência não medida: o banco não respondeu'
              }
            />
            <Stat
              icon={<Activity size={14} />}
              label="Worker de ingestão"
              value={<Pill tone={WORKER[data.worker.state].tone}>{WORKER[data.worker.state].label}</Pill>}
              foot={
                data.worker.last_scheduled_run_at
                  ? `Última agendada ${formatRelative(data.worker.last_scheduled_run_at)} · ${data.worker.scheduled_runs_last_24h} em 24 h`
                  : 'Evidência indireta: execuções agendadas registradas'
              }
            />
            <Stat
              icon={<AlertTriangle size={14} />}
              label="Falhas de ingestão (7 dias)"
              value={data.ingestion.failures_last_7d.toLocaleString('pt-BR')}
              tone={data.ingestion.failures_last_7d > 0 ? 'warn' : undefined}
              foot="Execuções parciais, indisponíveis ou com erro"
            />
          </div>

          <div className="ig-grid ig-grid-4">
            <Stat
              icon={<Flame size={14} />}
              label="Focos persistidos"
              value={data.data.detections_total.toLocaleString('pt-BR')}
              foot={`${data.data.detections_last_24h.toLocaleString('pt-BR')} observados nas últimas 24 h`}
            />
            <Stat
              icon={<MapPinned size={14} />}
              label="Municípios monitorados"
              value={data.data.municipalities_monitored.toLocaleString('pt-BR')}
              foot={`${data.data.municipalities_with_detections_7d} com focos nos últimos 7 dias`}
            />
            <Stat
              icon={<Timer size={14} />}
              label="Última gravação de focos"
              value={<span style={{ fontSize: 18 }}>{formatRelative(data.data.last_ingested_at)}</span>}
              foot={formatDateTime(data.data.last_ingested_at, 'Nenhum foco gravado')}
            />
            <Stat
              icon={<Users size={14} />}
              label="Usuários ativos"
              value={data.users.active.toLocaleString('pt-BR')}
              foot={`${data.users.inactive} inativos · ${data.users.must_change_password} com troca de senha pendente`}
            />
          </div>

          <div className="ig-grid ig-grid-2">
            <Panel
              title="Fontes de dados"
              note="Último sucesso por fonte"
              actions={<Link to="/admin/sources" className="ig-btn sm">Detalhes</Link>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.sources.map(s => {
                  const state = SOURCE_STATE[s.state] ?? { label: s.state, tone: 'muted' as const };
                  return (
                    <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{SOURCE_LABEL[s.source] ?? s.label}</div>
                        <div className="ig-sub">
                          Último sucesso: {formatDateTime(s.last_success_at, 'nunca')}
                        </div>
                      </div>
                      <Pill tone={state.tone}>{state.label}</Pill>
                    </div>
                  );
                })}
              </div>
            </Panel>
            <Panel title="Histórico de ingestão" note="Execuções por dia, últimos 30 dias (UTC)">
              <History30 days={data.ingestion.history_30d} />
            </Panel>
          </div>

          <div className="ig-grid ig-grid-2">
            <Panel
              title="Últimas execuções"
              flush
              actions={<Link to="/admin/jobs" className="ig-btn sm">Ver todas</Link>}
            >
              {data.ingestion.recent_runs.length === 0 ? (
                <EmptyState title="Nenhuma execução registrada">
                  As execuções do worker e as manuais aparecem aqui.
                </EmptyState>
              ) : (
                <div className="ig-table-wrap">
                  <table className="ig-table">
                    <thead>
                      <tr><th>Fonte / produto</th><th>Início</th><th>Duração</th><th>Situação</th></tr>
                    </thead>
                    <tbody>
                      {data.ingestion.recent_runs.map(r => (
                        <tr key={r.id}>
                          <td>
                            {SOURCE_LABEL[r.source] ?? r.source}
                            <div className="ig-sub ig-mono">{r.product} · {TRIGGER_LABEL[r.trigger]}</div>
                          </td>
                          <td>{formatDateTime(r.started_at)}</td>
                          <td>{formatDuration(r.started_at, r.finished_at)}</td>
                          <td><Pill tone={RUN_STATUS[r.status]?.tone ?? 'muted'}>{RUN_STATUS[r.status]?.label ?? r.status}</Pill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
            <Panel
              title="Eventos administrativos recentes"
              actions={<Link to="/admin/audit" className="ig-btn sm">Auditoria</Link>}
            >
              {data.recent_audit.length === 0 ? (
                <EmptyState title="Nenhum evento registrado" />
              ) : (
                <ul className="ig-timeline">
                  {data.recent_audit.map(e => (
                    <li key={e.id}>
                      <span className="ig-dot" style={{ background: `var(--ig-${actionTone(e.action) === 'err' ? 'err' : actionTone(e.action) === 'warn' ? 'warn' : 'info'})` }} />
                      <div>
                        <div><strong>{actionLabel(e.action)}</strong> · {e.actor_name}</div>
                        <div className="ig-sub">{formatDateTime(e.created_at)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <div className="ig-grid ig-grid-2">
            <Panel title="Usuários por papel">
              <dl className="ig-kv">
                {Object.entries(data.users.by_role).map(([role, n]) => (
                  <div key={role} style={{ display: 'contents' }}>
                    <dt>{ROLE_LABEL[role] ?? role}</dt>
                    <dd>{n.active} ativos{n.inactive ? ` · ${n.inactive} inativos` : ''}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title="Métricas não disponíveis" icon={<Info size={15} />}>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-lo)', lineHeight: 1.5 }}>
                Estas medidas não são coletadas nesta versão e por isso não aparecem como números:
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                {data.unavailable_metrics.map(m => <li key={m}>{m}</li>)}
              </ul>
              <div style={{ marginTop: 12 }}>
                <Callout>{data.worker.note}</Callout>
              </div>
            </Panel>
          </div>
          <p className="ig-panel-note">
            Instante da API: {formatDateTime(data.generated_at)} (horário de Fortaleza). {data.api.note}
          </p>
        </div>
      )}
    </div>
  );
}
