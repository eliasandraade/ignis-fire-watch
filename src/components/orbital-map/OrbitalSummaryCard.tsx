import { Link } from 'react-router-dom';
import { useDetectionStats } from '@/hooks/useOrbital';
import { SOURCE_STYLE, STATE_COLOR, STATE_LABEL, formatAge, periodWindow } from '@/lib/orbital';
import { useMemo } from 'react';

/** Compact card: persisted heat spots of the last 24 h and each source's state. */
export function OrbitalSummaryCard({ linkTo = '/gestor/map' }: { linkTo?: string }) {
  const filters = useMemo(() => periodWindow('24h'), []);
  const stats = useDetectionStats(filters);
  const sources = stats.data?.sources ?? [];
  return (
    <div data-testid="orbital-summary-card" style={{
      background: 'var(--bg-surface)', borderRadius: 8, padding: '14px 16px',
      border: '1px solid var(--bg-raised)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)' }}>🛰 Focos de calor (24 h)</span>
        <Link to={linkTo} style={{ fontSize: 11, color: 'var(--orbital)' }}>mapa →</Link>
      </div>
      {!stats.apiEnabled ? (
        <div style={{ fontSize: 12, color: 'var(--text-ghost)' }}>API desligada: sem dados orbitais reais.</div>
      ) : stats.isError ? (
        <div style={{ fontSize: 12, color: '#ef4444' }}>Falha ao consultar a API de focos.</div>
      ) : !stats.data ? (
        <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>Carregando…</div>
      ) : (
        <>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-hi)' }}>
            {stats.data.total}
          </div>
          {sources.map(s => (
            <div key={s.source} style={{ fontSize: 11, color: 'var(--text-lo)' }}>
              <span style={{ color: SOURCE_STYLE[s.source].color }}>●</span> {SOURCE_STYLE[s.source].short}:{' '}
              <span style={{ color: STATE_COLOR[s.state] }}>{STATE_LABEL[s.state]}</span>
              {s.last_success_at ? ` · ingestão ${formatAge(s.last_success_at)}` : ''}
              {s.origin === 'fixture' ? ' · amostra histórica' : ''}
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 2 }}>
            anomalias térmicas persistidas — não confirmam incêndio
          </div>
        </>
      )}
    </div>
  );
}
