import { useParams, Link } from 'react-router-dom';
import { getAreaById } from '@/data/areas';
import { getIncidentsByArea } from '@/data/incidents';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Polygon } from 'react-leaflet';
import { getPolygonPositions } from '@/lib/geo';
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
    }}>
      {getRiskLabel(risk)}
    </span>
  );
}

export default function GestorAreaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const area = id ? getAreaById(id) : undefined;

  if (!area) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)' }}>Área não encontrada.</p>
        <Link to="/gestor/map" style={{ color: 'var(--orbital)', textDecoration: 'none' }}>
          ← Mapa Orbital
        </Link>
      </div>
    );
  }

  const incidents = getIncidentsByArea(area.id);
  const riskColor = getRiskColor(area.risk);
  const polygonPositions = getPolygonPositions(area.geometry);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left column */}
      <div style={{
        width: '40%',
        overflowY: 'auto',
        padding: '24px',
        borderRight: '1px solid var(--bg-raised)',
        background: 'var(--bg-deep)',
      }}>
        {/* Back link */}
        <Link
          to="/gestor/map"
          style={{ color: 'var(--text-lo)', textDecoration: 'none', fontSize: 13, display: 'block', marginBottom: 16 }}
        >
          ← Mapa Orbital
        </Link>

        {/* Area name */}
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-hi)',
          margin: '0 0 8px 0',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
        }}>
          {area.name}
        </h1>

        {/* Type + State */}
        <div style={{ fontSize: 13, color: 'var(--text-lo)', marginBottom: 12 }}>
          {area.type} · {area.state}
        </div>

        {/* Risk badge */}
        <div style={{ marginBottom: 20 }}>
          <RiskPill risk={area.risk} />
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 16px',
          marginBottom: 20,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          padding: 16,
          border: '1px solid var(--bg-raised)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Hectares
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-hi)', fontFamily: 'JetBrains Mono, monospace' }}>
              {area.hectares.toLocaleString('pt-BR')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Confiança dos dados
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-hi)', fontFamily: 'JetBrains Mono, monospace' }}>
              {area.confidence}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Fonte
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
              {area.source}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Atualizado
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
              {new Date(area.lastUpdated).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Qualidade
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)', textTransform: 'capitalize' }}>
              {area.dataQuality}
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
          {area.description}
        </p>

        {/* Estimated data disclaimer */}
        {area.dataQuality === 'estimated' && (
          <div style={{
            borderLeft: '3px solid var(--risk-high)',
            paddingLeft: 12,
            fontSize: 12,
            color: 'var(--text-lo)',
            lineHeight: 1.5,
            background: `color-mix(in oklch, var(--risk-high) 8%, transparent)`,
            padding: '10px 12px',
            borderRadius: '0 6px 6px 0',
          }}>
            ⚠ Dados estimados/simulados — não representam base oficial.
          </div>
        )}
      </div>

      {/* Right column */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-void)',
      }}>
        {/* Map */}
        <div style={{ height: 220, flexShrink: 0, position: 'relative' }}>
          <OrbitalMap center={area.center} zoom={12} style={{ height: '100%' }}>
            <Polygon
              positions={polygonPositions}
              pathOptions={{ color: riskColor, fillOpacity: 0.18, weight: 2 }}
            />
          </OrbitalMap>
        </div>

        {/* Incidents panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-hi)',
            margin: '0 0 12px 0',
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
          }}>
            Ocorrências vinculadas
          </h2>

          {incidents.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-ghost)' }}>
              Nenhuma ocorrência registrada
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {incidents.map(incident => (
                <Link
                  key={incident.id}
                  to={`/gestor/incident/${incident.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--bg-raised)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      color: 'var(--text-lo)',
                      flexShrink: 0,
                    }}>
                      {incident.id}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-mid)', flex: 1, minWidth: 80 }}>
                      {incident.type.replace(/-/g, ' ')}
                    </span>
                    <StatusBadge status={incident.status} size="sm" />
                    <RiskPill risk={incident.risk} />
                    {incident.affectedHectares > 0 && (
                      <span style={{
                        fontSize: 11,
                        color: 'var(--text-ghost)',
                        fontFamily: 'JetBrains Mono, monospace',
                        flexShrink: 0,
                      }}>
                        {incident.affectedHectares} ha
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
