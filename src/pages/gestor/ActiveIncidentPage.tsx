import { useParams, Link } from 'react-router-dom';
import { useIncidentDetail } from '@/hooks/useIncidentDetail';
import { getAreaById } from '@/data/areas';
import { TEAMS } from '@/data/operations';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MetricCard } from '@/components/shared/MetricCard';
import { IncidentTimeline } from '@/components/gestor/IncidentTimeline';
import { WeatherBlock } from '@/components/gestor/WeatherBlock';
import { EvidenceGrid } from '@/components/gestor/EvidenceGrid';
import { Polygon, Circle } from 'react-leaflet';
import { getPolygonPositions } from '@/lib/geo';

export default function ActiveIncidentPage() {
  const { id } = useParams<{ id: string }>();
  const { incident, loading } = useIncidentDetail(id);
  const area = incident ? getAreaById(incident.areaId) : null;
  const teams = incident
    ? TEAMS.filter(t => incident.assignedTeams.includes(t.id))
    : [];

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)' }}>Carregando incidente...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)' }}>Incidente não encontrado.</p>
        <Link to="/gestor" style={{ color: 'var(--orbital)' }}>← Dashboard</Link>
      </div>
    );
  }

  const fireRadius = Math.sqrt((incident.affectedHectares || 1) * 10000 / Math.PI);
  const mapCenter: [number, number] = area?.center ?? [-4.5, -39.0];

  const TEAM_STATUS_COLOR: Record<string, string> = {
    disponivel:    'var(--risk-low)',
    mobilizado:    'var(--risk-high)',
    'em-transito': 'var(--orbital)',
    indisponivel:  'var(--text-ghost)',
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18,
                           fontWeight: 700, color: 'var(--text-hi)' }}>
              {incident.code ?? incident.id}
            </span>
            <RiskBadge risk={incident.risk} />
            <StatusBadge status={incident.status} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: 0, maxWidth: 600 }}>
            {incident.description}
          </p>
        </div>
        <Link to="/gestor/war-room" style={{
          padding: '10px 20px', background: 'var(--risk-crit)', color: 'white',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          ⚡ Abrir Central Tática
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Mini map */}
          <div style={{ height: 220, borderRadius: 8, overflow: 'hidden',
                        border: '1px solid var(--bg-raised)' }}>
            <OrbitalMap center={mapCenter} zoom={11} darkTiles>
              {area && (
                <Polygon
                  positions={getPolygonPositions(area.geometry)}
                  pathOptions={{ color: '#e74c3c', weight: 2, fillOpacity: 0.1 }}
                />
              )}
              <Circle
                center={mapCenter}
                radius={fireRadius}
                pathOptions={{ color: '#f39c12', weight: 2, fillOpacity: 0.15 }}
              />
            </OrbitalMap>
          </div>

          {!area && (
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface)',
                          borderRadius: 6, border: '1px solid var(--bg-raised)',
                          fontSize: 12, color: 'var(--text-ghost)' }}>
              Área não encontrada no sistema. ID: {incident.areaId}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <MetricCard value={incident.affectedHectares} unit="ha" label="Área Afetada"
                        accent="var(--risk-high)" />
            <MetricCard value={`${incident.confidence}%`} label="Confiança" />
            <MetricCard
              value={new Date(incident.detectedAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
              })}
              label="Detecção"
            />
          </div>

          <WeatherBlock
            temperature={incident.temperature}
            humidity={incident.humidity}
            windSpeed={incident.windSpeed}
            windDirection={incident.windDirection}
          />

          {/* Aurora widget */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orbital)',
                          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Aurora IA
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--risk-crit)',
                          marginBottom: 6 }}>
              {incident.aurora.priority}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-lo)', lineHeight: 1.5, margin: '0 0 8px' }}>
              {incident.aurora.recommendation}
            </p>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
              Confiança: {incident.aurora.confidence}% — Análise rule-based — protótipo demonstrativo
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Teams */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          marginBottom: 12 }}>
              Equipes ({teams.length})
            </div>
            {teams.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-ghost)', margin: 0 }}>
                Nenhuma equipe alocada.
              </p>
            ) : teams.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10,
                                       padding: '8px 0',
                                       borderBottom: '1px solid var(--bg-raised)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                              background: TEAM_STATUS_COLOR[t.status] ?? 'var(--text-ghost)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-hi)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
                    {t.type} · {t.members} membros · {t.location ?? '—'}
                  </div>
                </div>
                <StatusBadge status={t.status} size="sm" />
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          marginBottom: 12 }}>
              Timeline ({incident.events.length})
            </div>
            {incident.events.length > 0 ? (
              <IncidentTimeline events={incident.events} reverse />
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-ghost)', margin: 0 }}>
                Nenhum evento registrado.
              </p>
            )}
          </div>

          {/* Evidence */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          marginBottom: 12 }}>
              Evidências ({incident.evidence.length})
            </div>
            <EvidenceGrid evidence={incident.evidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
