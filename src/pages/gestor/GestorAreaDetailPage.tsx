import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useArea } from '@/hooks/useArea';
import { useIncidents } from '@/hooks/useIncidents';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataState } from '@/components/shared/DataState';
import { ApiError } from '@/services/api/errors';
import { Polygon } from 'react-leaflet';
import { getPolygonPositions } from '@/lib/geo';
import { INCIDENT_TYPE_LABEL, DATA_QUALITY_LABEL } from '@/lib/labels';
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
  const { area, loading: areaLoading, error: areaError } = useArea(id);
  const { incidents: allIncidents, dataSource: incidentsSource } = useIncidents();
  const incidents = allIncidents.filter(i => i.areaId === id);

  if (areaLoading) {
    return (
      <div style={{ padding: 32 }}>
        <DataState kind="loading" title="Carregando área…" />
      </div>
    );
  }

  if (!area) {
    return (
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!areaError || (areaError instanceof ApiError && areaError.status === 404) ? (
          <DataState kind="empty" title="Área não encontrada">
            Nenhuma área protegida com este identificador foi encontrada na API.
          </DataState>
        ) : (
          <DataState kind="error">
            Não foi possível consultar esta área na API. Tente novamente em instantes.
          </DataState>
        )}
        <Link to="/gestor/map" style={{ color: 'var(--orbital)', textDecoration: 'none' }}>
          ← Mapa Orbital
        </Link>
      </div>
    );
  }

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

        {/* Risk badge: o backend ainda não calcula risco por área */}
        <div style={{ marginBottom: 20 }}>
          {area.risk ? (
            <RiskPill risk={area.risk} />
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-ghost)' }}>Risco da área: ainda não calculado</span>
          )}
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
              {area.hectares != null ? area.hectares.toLocaleString('pt-BR') : '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Fonte
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
              {area.source ?? 'não informada'}
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
            <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
              {DATA_QUALITY_LABEL[area.dataQuality] ?? area.dataQuality}
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
          {area.description}
        </p>

        {/* Estimated data disclaimer */}
        {(area.dataQuality === 'estimated' || area.dataQuality === 'mock') && (
          <div style={{
            borderLeft: '3px solid var(--risk-high)',
            paddingLeft: 12,
            fontSize: 12,
            color: 'var(--text-lo)',
            lineHeight: 1.5,
            background: `color-mix(in oklch, var(--risk-high) 8%, transparent)`,
            padding: '10px 12px',
            borderRadius: '0 6px 6px 0',
            display: 'flex', gap: 6, alignItems: 'flex-start',
          }}>
            <AlertTriangle size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
            {area.dataQuality === 'mock'
              ? 'Registro marcado pela API como de teste — não representa uma área real.'
              : 'Dados marcados pela fonte como estimados — não representam base oficial.'}
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
        {area.center ? (
          <div style={{ height: 220, flexShrink: 0, position: 'relative' }}>
            <OrbitalMap center={area.center} zoom={12} style={{ height: '100%' }}>
              {area.geometry && (
                <Polygon
                  positions={getPolygonPositions(area.geometry)}
                  pathOptions={{ color: area.risk ? getRiskColor(area.risk) : 'var(--orbital)', fillOpacity: 0.18, weight: 2 }}
                />
              )}
            </OrbitalMap>
          </div>
        ) : (
          <div style={{ padding: '16px 24px 0' }}>
            <DataState kind="empty" compact title="Sem localização">
              A API não informa centro nem perímetro para esta área.
            </DataState>
          </div>
        )}
        {area.center && !area.geometry && (
          <div style={{ padding: '6px 24px 0', fontSize: 11, color: 'var(--text-ghost)' }}>
            Perímetro não cadastrado — o mapa mostra apenas o ponto central informado pela API.
          </div>
        )}

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

          {incidentsSource.status === 'loading' ? (
            <DataState kind="loading" compact title="Carregando ocorrências…" />
          ) : incidentsSource.status === 'error' ? (
            <DataState kind="error" compact>
              Não foi possível consultar as ocorrências na API.
            </DataState>
          ) : incidents.length === 0 ? (
            <DataState kind="empty" compact title="Nenhuma ocorrência vinculada">
              Incidentes registrados nesta área protegida aparecem aqui.
            </DataState>
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
                      {incident.code ?? incident.id}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-mid)', flex: 1, minWidth: 80 }}>
                      {INCIDENT_TYPE_LABEL[incident.type] ?? incident.type.replace(/-/g, ' ')}
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
