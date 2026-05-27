import { Link } from 'react-router-dom';
import { getAreasSortedByRisk } from '@/data/areas';
import type { RiskLevel } from '@/types/domain';

function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'critical': return 'var(--risk-crit)';
    case 'high':     return 'var(--risk-high)';
    case 'medium':   return 'var(--risk-med)';
    case 'low':      return 'var(--risk-low)';
  }
}

function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'critical': return 'CRÍTICO';
    case 'high':     return 'ALTO';
    case 'medium':   return 'MÉDIO';
    case 'low':      return 'BAIXO';
  }
}

function RiskPill({ risk }: { risk: RiskLevel }) {
  const color = getRiskColor(risk);
  return (
    <span style={{
      background: `color-mix(in oklch, ${color} 15%, transparent)`,
      color,
      border: `1px solid color-mix(in oklch, ${color} 40%, transparent)`,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {getRiskLabel(risk)}
    </span>
  );
}

export default function RiskRankingPage() {
  const areas = getAreasSortedByRisk();

  return (
    <div style={{
      padding: 24,
      background: 'var(--bg-deep)',
      minHeight: '100%',
      fontFamily: 'Space Grotesk, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-hi)',
          margin: '0 0 4px 0',
        }}>
          Ranking de Risco
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-ghost)', margin: '0 0 8px 0' }}>
          Áreas protegidas ordenadas por nível de risco · Dados estimados
        </p>
        <span style={{ fontSize: 12, color: 'var(--text-lo)' }}>
          {areas.length} áreas monitoradas
        </span>
      </div>

      {/* List */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 8,
        border: '1px solid var(--bg-raised)',
        overflow: 'hidden',
      }}>
        {areas.map((area, index) => (
          <Link
            key={area.id}
            to={`/gestor/area/${area.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 20px',
              borderBottom: index < areas.length - 1 ? '1px solid var(--bg-raised)' : 'none',
              background: 'var(--bg-surface)',
            }}>
              {/* Rank number */}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13,
                color: 'var(--text-ghost)',
                width: 36,
                flexShrink: 0,
              }}>
                #{index + 1}
              </span>

              {/* Risk indicator bar */}
              <div style={{
                width: 4,
                height: 36,
                borderRadius: 2,
                background: getRiskColor(area.risk),
                flexShrink: 0,
              }} />

              {/* Area info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, minWidth: 0 }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-hi)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {area.name}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-lo)' }}>
                  {area.type} · {area.hectares.toLocaleString('pt-BR')} ha
                </span>
              </div>

              {/* Risk badge */}
              <RiskPill risk={area.risk} />

              {/* Confidence */}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                color: 'var(--text-mid)',
                width: 50,
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {area.confidence}%
              </span>

              {/* Chevron */}
              <span style={{ color: 'var(--text-ghost)', fontSize: 18, flexShrink: 0 }}>
                ›
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
