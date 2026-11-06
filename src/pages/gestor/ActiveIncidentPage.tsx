import { useParams, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useIncidentDetail } from '@/hooks/useIncidentDetail';
import { useTeams } from '@/hooks/useTeams';
import { useEvidence } from '@/hooks/useEvidence';
import { useArea } from '@/hooks/useArea';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MetricCard } from '@/components/shared/MetricCard';
import { DataState } from '@/components/shared/DataState';
import { IncidentTimeline } from '@/components/gestor/IncidentTimeline';
import { WeatherBlock } from '@/components/gestor/WeatherBlock';
import { EvidenceGrid } from '@/components/gestor/EvidenceGrid';
import { ApiError } from '@/services/api/errors';
import { Polygon } from 'react-leaflet';
import { getPolygonPositions } from '@/lib/geo';

const TEAM_STATUS_COLOR: Record<string, string> = {
  disponivel:    'var(--risk-low)',
  mobilizado:    'var(--risk-high)',
  'em-transito': 'var(--orbital)',
  indisponivel:  'var(--text-ghost)',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-mid)',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
};

const PANEL: React.CSSProperties = {
  background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
  border: '1px solid var(--bg-raised)',
};

export default function ActiveIncidentPage() {
  const { id } = useParams<{ id: string }>();
  const { incident, loading, error } = useIncidentDetail(id);
  const { teams: allTeams, dataSource: teamsSource } = useTeams();
  const { evidence, loading: evidenceLoading, error: evidenceError } = useEvidence(id);
  const { area, loading: areaLoading, error: areaError } = useArea(incident?.areaId || undefined);
  const teams = allTeams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <DataState kind="loading" title="Carregando incidente…" />
      </div>
    );
  }

  if (!incident) {
    const notFound = !error || (error instanceof ApiError && error.status === 404);
    return (
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notFound ? (
          <DataState kind="empty" title="Incidente não encontrado">
            Nenhum incidente com este identificador foi encontrado na API.
          </DataState>
        ) : (
          <DataState kind="error">
            Não foi possível consultar este incidente na API. Tente novamente em instantes.
          </DataState>
        )}
        <Link to="/gestor" style={{ color: 'var(--orbital)', fontSize: 13 }}>← Dashboard</Link>
      </div>
    );
  }

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
          whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Zap size={14} aria-hidden="true" /> Abrir Central Tática
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Mini map: só com a geometria real da área (nenhuma posição estimada) */}
          {area?.center ? (
            <div style={{ height: 220, borderRadius: 8, overflow: 'hidden',
                          border: '1px solid var(--bg-raised)' }}>
              <OrbitalMap center={area.center} zoom={11} darkTiles>
                {area.geometry && (
                  <Polygon
                    positions={getPolygonPositions(area.geometry)}
                    pathOptions={{ color: '#e74c3c', weight: 2, fillOpacity: 0.1 }}
                  />
                )}
              </OrbitalMap>
            </div>
          ) : area ? (
            <DataState kind="empty" title="Área sem localização">
              A área {area.name} não tem centro nem perímetro cadastrados na API.
            </DataState>
          ) : !incident.areaId ? (
            <DataState kind="empty" title="Sem área vinculada">
              Este incidente não está vinculado a uma área protegida cadastrada; o mapa não é exibido.
            </DataState>
          ) : areaLoading ? (
            <DataState kind="loading" title="Carregando área…" />
          ) : areaError ? (
            <DataState kind="error">
              Não foi possível consultar a área vinculada ({incident.areaId}).
            </DataState>
          ) : (
            <DataState kind="empty" title="Área não encontrada">
              A área vinculada ({incident.areaId}) não foi encontrada na API.
            </DataState>
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

          <DataState kind="not-implemented" title="Aurora IA · análise do incidente ainda não implementada">
            Prioridade, recomendação e confiança automáticas só serão exibidas quando houver um modelo
            analítico real conectado à API.
          </DataState>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Teams */}
          <div style={PANEL}>
            <div style={SECTION_TITLE}>
              Equipes mobilizadas{teamsSource.status === 'ok' || teamsSource.status === 'empty' ? ` (${teams.length})` : ''}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-ghost)', margin: '-6px 0 10px' }}>
              Todas as equipes em campo — o vínculo equipe/incidente ainda não é registrado pela API.
            </p>
            {teamsSource.status === 'loading' ? (
              <DataState kind="loading" compact title="Carregando equipes…" />
            ) : teamsSource.status === 'error' ? (
              <DataState kind="error" compact>Não foi possível consultar as equipes.</DataState>
            ) : teams.length === 0 ? (
              <DataState kind="empty" compact title="Nenhuma equipe mobilizada">
                Equipes com status mobilizado ou em trânsito aparecem aqui.
              </DataState>
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
                    {t.type}{t.location ? ` · ${t.location}` : ''}
                  </div>
                </div>
                <StatusBadge status={t.status} size="sm" />
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={PANEL}>
            <div style={SECTION_TITLE}>Linha do tempo ({incident.events.length})</div>
            {incident.events.length > 0 ? (
              <IncidentTimeline events={incident.events} reverse />
            ) : (
              <DataState kind="empty" compact title="Nenhum evento registrado">
                Detecção, confirmação, mobilização e atualizações do incidente aparecem aqui.
              </DataState>
            )}
          </div>

          {/* Evidence */}
          <div style={PANEL}>
            <div style={SECTION_TITLE}>Evidências{evidenceError ? '' : ` (${evidence.length})`}</div>
            {evidenceLoading ? (
              <DataState kind="loading" compact title="Carregando evidências…" />
            ) : evidenceError ? (
              <DataState kind="error" compact>Não foi possível consultar as evidências.</DataState>
            ) : (
              <EvidenceGrid evidence={evidence} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
