import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDetectionStats } from '@/hooks/useOrbital';
import {
  PERIODS,
  SOURCE_STYLE,
  STATE_COLOR,
  STATE_LABEL,
  THERMAL_ANOMALY_DISCLAIMER,
  emptyMessage,
  formatAge,
  formatInstant,
  periodWindow,
} from '@/lib/orbital';
import type { OrbitalSource } from '@/services/api/orbitalTypes';

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--bg-raised)',
};
const KPI_LABEL: React.CSSProperties = { fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.08em' };
const KPI_VALUE: React.CSSProperties = { fontSize: 24, fontWeight: 800, color: 'var(--text-hi)', fontFamily: 'JetBrains Mono, monospace' };

/** Dashboard block computed only from persisted detections (GET /orbital-alerts/stats). */
export function OrbitalDashboardSection({ mapLink = '/gestor/map' }: { mapLink?: string }) {
  const [period, setPeriod] = useState<'24h' | '48h' | '7d' | '30d'>('7d');
  const filters = useMemo(() => periodWindow(period), [period]);
  const stats = useDetectionStats(filters);
  const data = stats.data;

  return (
    <section aria-label="Monitoramento orbital" data-testid="orbital-dashboard" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Monitoramento orbital — dados persistidos
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select aria-label="Período do painel" data-testid="dashboard-period" value={period}
                  onChange={e => setPeriod(e.target.value as typeof period)}
                  style={{ background: 'var(--bg-panel)', color: 'var(--text-hi)', border: '1px solid var(--bg-raised)', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
            {PERIODS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <Link to={mapLink} style={{ fontSize: 12, color: 'var(--orbital)', fontWeight: 600 }}>Abrir mapa →</Link>
        </div>
      </div>

      {stats.isError ? (
        <div role="alert" data-testid="dashboard-error" style={{ ...CARD, color: '#ef4444' }}>
          Falha ao consultar a API de indicadores orbitais. Nenhum valor é exibido no lugar.
        </div>
      ) : !data ? (
        <div style={CARD}>Carregando indicadores…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 10 }}>
            <div style={CARD}>
              <div style={KPI_LABEL}>Focos no período</div>
              <div style={KPI_VALUE} data-testid="kpi-total">{data.total.toLocaleString('pt-BR')}</div>
            </div>
            <div style={CARD}>
              <div style={KPI_LABEL}>Municípios com focos</div>
              <div style={KPI_VALUE} data-testid="kpi-municipalities">{data.municipalities_with_detections}<span style={{ fontSize: 12, color: 'var(--text-ghost)' }}> / 184</span></div>
            </div>
            <div style={CARD}>
              <div style={KPI_LABEL}>Por fonte</div>
              {(['NASA_FIRMS', 'INPE_QUEIMADAS'] as OrbitalSource[]).map(s => (
                <div key={s} style={{ fontSize: 13, color: 'var(--text-hi)' }}>
                  <span style={{ color: SOURCE_STYLE[s].color }}>●</span> {SOURCE_STYLE[s].short}:{' '}
                  <strong data-testid={`kpi-source-${s}`}>{data.by_source.find(b => b.key === s)?.count ?? 0}</strong>
                </div>
              ))}
            </div>
            <div style={CARD}>
              <div style={KPI_LABEL}>Última ingestão gravada</div>
              <div style={{ fontSize: 12, color: 'var(--text-hi)', marginTop: 4 }}>
                {data.last_ingested_at ? `${formatInstant(data.last_ingested_at)} (${formatAge(data.last_ingested_at)})` : 'nenhuma no período'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            <div style={CARD}>
              <div style={{ ...KPI_LABEL, marginBottom: 6 }}>Focos por dia de observação (UTC)</div>
              {data.total === 0 ? (
                <div data-testid="dashboard-empty" style={{ fontSize: 12, color: 'var(--text-lo)' }}>{emptyMessage(data.sources)}</div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={data.by_day}>
                    <XAxis dataKey="day" stroke="var(--text-ghost)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="var(--text-ghost)" tick={{ fontSize: 10 }} width={30} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)', fontSize: 12 }} />
                    <Area type="monotone" dataKey="count" name="focos" stroke="#38bdf8" fill="#38bdf833" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={CARD}>
              <div style={{ ...KPI_LABEL, marginBottom: 6 }}>Municípios com mais focos</div>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-hi)' }} data-testid="top-municipalities">
                {data.top_municipalities.map(m => <li key={m.ibge_code}>{m.name} — {m.count}</li>)}
              </ol>
              {data.top_municipalities.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-ghost)' }}>—</div>}
            </div>
            <div style={CARD}>
              <div style={{ ...KPI_LABEL, marginBottom: 6 }}>Situação das fontes</div>
              {data.sources.map(s => (
                <div key={s.source} data-testid={`dashboard-source-${s.source}`} data-state={s.state} style={{ fontSize: 12, color: 'var(--text-hi)', marginBottom: 4 }}>
                  {s.label}: <strong style={{ color: STATE_COLOR[s.state] }}>{STATE_LABEL[s.state]}</strong>
                  <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
                    ingestão {formatAge(s.last_success_at)} · observação mais recente {formatInstant(s.latest_observation_at)}
                    {s.origin === 'fixture' ? ' · amostra histórica (fixture)' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-ghost)', margin: '8px 0 0' }}>{THERMAL_ANOMALY_DISCLAIMER}</p>
        </>
      )}
    </section>
  );
}
