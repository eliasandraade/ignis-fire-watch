import { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Polygon } from 'react-leaflet';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CloudRain } from 'lucide-react';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { IncidentTimeline } from '@/components/gestor/IncidentTimeline';
import { WeatherBlock } from '@/components/gestor/WeatherBlock';
import { OrbitalGrid, RadarSweep } from '@/components/orbital';
import { criticalPulseVariants } from '@/lib/motion';
import { useWarRoom } from '@/hooks/useWarRoom';
import { useTeams } from '@/hooks/useTeams';
import { useResources } from '@/hooks/useResources';
import { useWeatherRisk } from '@/hooks/useWeatherRisk';
import { OrbitalSummaryCard } from '@/components/orbital-map/OrbitalSummaryCard';
import { protocolReducer, protocolButtonView } from '@/lib/protocolActivation';
import { DataSourceBadge } from '@/components/shared/DataSourceBadge';
import { DataState } from '@/components/shared/DataState';
import { getPolygonPositions } from '@/lib/geo';
import { useToast } from '@/hooks/use-toast';
import { activateProtocol } from '@/services/api/incidentsService';

const TEAM_DOT: Record<string, string> = {
  disponivel:    'var(--risk-low)',
  mobilizado:    'var(--risk-high)',
  'em-transito': 'var(--orbital)',
  indisponivel:  'var(--text-ghost)',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 6,
};

function FullscreenState({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '100vh', background: 'var(--bg-void)', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
        <Link to="/gestor" style={{ color: 'var(--orbital)', textDecoration: 'none', fontSize: 14 }}>
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function WarRoomPage() {
  const { incident, area, loading, dataSource } = useWarRoom();
  const { teams, dataSource: teamsSource } = useTeams();
  const { resources, dataSource: resourcesSource } = useResources();
  const reducedMotion = useReducedMotion();

  const mobilizedTeams = teams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');
  const deployedResources = resources.filter(r => r.status === 'mobilizado' || r.currentIncident);

  const { weatherRisk } = useWeatherRisk(area?.center?.[0], area?.center?.[1]);

  const [clock, setClock] = useState(new Date());
  // Protocol activation: confirmed only after the backend answers. Availability
  // is derived from the current data (see protocolButtonView), so a war-room
  // query that recovers re-enables the action without a remount.
  const [protocolPhase, dispatchProtocol] = useReducer(protocolReducer, 'idle');
  const protocolView = protocolButtonView(protocolPhase, {
    incidentFromApi: dataSource.status === 'ok',
    hasIncident: !!incident?.id,
  });
  useEffect(() => {
    dispatchProtocol({ type: 'incident-changed' });
  }, [incident?.id]);
  const { toast } = useToast();

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleActivate = async () => {
    if (protocolView.disabled || !incident?.id) {
      toast({ title: 'Não executado', description: 'Incidente não carregado da API.' });
      return;
    }
    const ok = window.confirm(
      `Registrar ativação de protocolo no IGNIS para ${incident.code ?? incident.id}?\n\n` +
      'Isto altera o status do incidente e gera trilha de auditoria. ' +
      'Nenhum órgão externo é notificado.',
    );
    if (!ok) return;
    dispatchProtocol({ type: 'submit' });
    try {
      await activateProtocol(incident.id);
      dispatchProtocol({ type: 'success' });
      toast({
        title: 'Ativação registrada no IGNIS',
        description: `${incident.code ?? incident.id} — nenhum órgão externo foi notificado.`,
      });
    } catch {
      // Nunca informar sucesso em caso de falha.
      dispatchProtocol({ type: 'failure' });
      toast({
        title: 'Falha — protocolo NÃO foi registrado',
        description: 'A API não confirmou a operação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <FullscreenState>
        <DataState kind="loading" title="Carregando Central Tática…" />
      </FullscreenState>
    );
  }

  if (dataSource.status === 'error') {
    return (
      <FullscreenState>
        <DataState kind="error">
          Não foi possível consultar a situação operacional na API. Nenhum incidente é exibido no lugar.
        </DataState>
      </FullscreenState>
    );
  }

  if (!incident) {
    return (
      <FullscreenState>
        <DataState kind="empty" title="Nenhum incidente crítico ativo">
          A Central Tática abre automaticamente o incidente de severidade crítica em andamento,
          com área, equipes, recursos e linha do tempo.
        </DataState>
      </FullscreenState>
    );
  }

  return (
    <div className="ignis-fullscreen">
      {/* ── Command bar ── */}
      <div style={{
        height: 'var(--bar-h)', background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--bg-raised)',
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px',
        flexShrink: 0,
      }}>
        <Link to="/gestor" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--orbital)',
                         letterSpacing: '-0.02em' }}>IGNIS</span>
        </Link>
        <span style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.12em',
                       textTransform: 'uppercase' }}>
          Central Tática Ambiental
        </span>
        <div style={{ width: 1, height: 20, background: 'var(--bg-raised)', margin: '0 4px' }} />

        {incident.risk === 'critical' && !reducedMotion ? (
          <motion.span
            animate="pulse"
            variants={criticalPulseVariants}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-hi)',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid var(--risk-crit)',
            }}
          >
            {incident.code ?? incident.id}
          </motion.span>
        ) : (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                         fontWeight: 700, color: 'var(--text-hi)' }}>
            {incident.code ?? incident.id}
          </span>
        )}
        <StatusBadge status={incident.status} size="sm" />
        <DataSourceBadge status={dataSource.status} style={{ marginLeft: 4 }} />

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
          {[
            { label: 'T', value: incident.temperature == null ? '—' : `${incident.temperature}°C`, crit: incident.temperature != null && incident.temperature > 35 },
            { label: 'UR', value: incident.humidity == null ? '—' : `${incident.humidity}%`, crit: incident.humidity != null && incident.humidity < 20 },
            { label: 'Vento', value: incident.windSpeed == null ? '—' : `${incident.windSpeed}km/h ${incident.windDirection ?? ''}`, crit: false },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>{m.label}</div>
              {m.crit && !reducedMotion ? (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                           color: 'var(--risk-crit)' }}
                >
                  {m.value}
                </motion.div>
              ) : (
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                              color: m.crit ? 'var(--risk-crit)' : 'var(--text-hi)' }}>
                  {m.value}
                </div>
              )}
            </div>
          ))}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
                        fontWeight: 700, color: 'var(--orbital)', minWidth: 72,
                        textAlign: 'right' }}>
            {clock.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <Link to={`/gestor/incident/${incident.id}`} style={{
            fontSize: 12, color: 'var(--orbital)', textDecoration: 'none',
            border: '1px solid var(--orbital)', borderRadius: 4, padding: '3px 8px',
          }}>
            Incidente
          </Link>
        </div>
      </div>

      {/* ── 3-col body ── */}
      <div style={{ flex: 1, display: 'grid',
                    gridTemplateColumns: 'var(--sidebar-w) 1fr 270px',
                    overflow: 'hidden' }}>

        {/* ── Left panel ── */}
        <div style={{ background: 'var(--bg-deep)', borderRight: '1px solid var(--bg-raised)',
                      overflowY: 'auto', padding: 14, position: 'relative',
                      display: 'flex', flexDirection: 'column', gap: 14 }}>
          <OrbitalGrid style={{ position: 'absolute', inset: 0 }} type="dots" />

          <div>
            <RiskBadge risk={incident.risk} />
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-hi)',
                          margin: '6px 0 2px' }}>
              {area?.name ?? 'Área não vinculada'}
            </div>
            {area?.center && (
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            color: 'var(--text-ghost)' }}>
                {area.center[0].toFixed(4)}, {area.center[1].toFixed(4)}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Área Afetada', value: `${incident.affectedHectares}ha` },
              { label: 'Confiança',    value: `${incident.confidence}%` },
              { label: 'Detecção',     value: new Date(incident.detectedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) },
              { label: 'Fonte',        value: incident.source ? incident.source.split('/')[0] : '—' },
            ].map(m => (
              <div key={m.label} style={{ background: 'var(--bg-surface)', borderRadius: 5,
                                          padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: 'var(--text-ghost)',
                              textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-hi)',
                              fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <WeatherBlock
            temperature={weatherRisk?.temperature_c ?? incident.temperature}
            humidity={weatherRisk?.relative_humidity ?? incident.humidity}
            windSpeed={
              weatherRisk?.wind_speed_kmh != null
                ? Math.round(weatherRisk.wind_speed_kmh)
                : incident.windSpeed
            }
            windDirection={incident.windDirection}
          />

          {/* Risco meteorológico — Open-Meteo */}
          <div style={{
            background: 'var(--bg-raised)',
            borderRadius: 6,
            padding: '10px 12px',
            borderLeft: '3px solid var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Condições meteorológicas
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600,
                color: weatherRisk ? '#22c55e' : 'var(--text-ghost)',
                padding: '1px 6px', borderRadius: 3,
                background: weatherRisk ? '#22c55e18' : 'var(--bg-surface)',
                border: `1px solid ${weatherRisk ? '#22c55e33' : 'var(--bg-surface)'}`,
              }}>
                {weatherRisk
                  ? weatherRisk.source_status === 'cached' ? 'cache' : 'Open-Meteo'
                  : area?.center ? 'fonte indisponível' : 'sem localização'}
              </span>
            </div>
            {/* Measurements only: the API's risk index has no validated methodology yet. */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                color: weatherRisk ? 'var(--text-hi)' : 'var(--text-ghost)',
              }}>
                {weatherRisk?.temperature_c != null ? `${weatherRisk.temperature_c.toFixed(1)}°C` : '—'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-lo)' }}>
                {weatherRisk?.relative_humidity != null ? `${weatherRisk.relative_humidity.toFixed(0)}% UR` : 'sem dados'}
                {weatherRisk?.wind_speed_kmh != null ? ` · vento ${weatherRisk.wind_speed_kmh.toFixed(0)} km/h` : ''}
              </span>
            </div>
            {weatherRisk?.precipitation_mm != null && weatherRisk.precipitation_mm > 0 && (
              <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 3,
                            display: 'flex', alignItems: 'center', gap: 4 }}>
                <CloudRain size={11} aria-hidden="true" />
                {weatherRisk.precipitation_mm.toFixed(1)} mm recentes
              </div>
            )}
          </div>

          {/* Persisted heat spots (PostGIS) */}
          <OrbitalSummaryCard />

          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', opacity: 0.7 }}>
            <RadarSweep size={72} color="#3b82f6" speed={8} />
          </div>

          {/* Equipes mobilizadas */}
          <div>
            <div style={SECTION_LABEL}>
              Equipes mobilizadas{teamsSource.status === 'ok' || teamsSource.status === 'empty' ? ` (${mobilizedTeams.length})` : ''}
            </div>
            {teamsSource.status === 'loading' ? (
              <DataState kind="loading" compact title="Carregando equipes…" />
            ) : teamsSource.status === 'error' ? (
              <DataState kind="error" compact>Não foi possível consultar as equipes.</DataState>
            ) : mobilizedTeams.length === 0 ? (
              <DataState kind="empty" compact title="Nenhuma equipe mobilizada" />
            ) : mobilizedTeams.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 7,
                                       padding: '5px 0',
                                       borderBottom: '1px solid var(--bg-raised)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                              background: TEAM_DOT[t.status] ?? 'var(--text-ghost)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-hi)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-ghost)' }}>{t.type}</div>
                </div>
                <StatusBadge status={t.status} size="sm" />
              </div>
            ))}
          </div>

          {/* Recursos implantados */}
          <div>
            <div style={SECTION_LABEL}>
              Recursos alocados{resourcesSource.status === 'ok' || resourcesSource.status === 'empty' ? ` (${deployedResources.length})` : ''}
            </div>
            {resourcesSource.status === 'loading' ? (
              <DataState kind="loading" compact title="Carregando recursos…" />
            ) : resourcesSource.status === 'error' ? (
              <DataState kind="error" compact>Não foi possível consultar os recursos.</DataState>
            ) : deployedResources.length === 0 ? (
              <DataState kind="empty" compact title="Nenhum recurso alocado" />
            ) : deployedResources.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 7,
                                       padding: '5px 0',
                                       borderBottom: '1px solid var(--bg-raised)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                              background: TEAM_DOT[r.status] ?? 'var(--text-ghost)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-hi)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-ghost)' }}>{r.location || '—'}</div>
                </div>
              </div>
            ))}
          </div>

          {area && ['estimated', 'mock', 'low', 'unknown'].includes(area.dataQuality) && (
            <div style={{ padding: '8px 10px',
                          background: 'oklch(70% 0.18 45 / 10%)',
                          border: '1px solid oklch(70% 0.18 45 / 25%)',
                          borderRadius: 5, fontSize: 11,
                          color: 'oklch(80% 0.12 60)',
                          display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <AlertTriangle size={12} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
              {area.dataQuality === 'mock'
                ? 'Área marcada pela API como registro de teste.'
                : 'Qualidade dos dados da área: baixa, estimada ou não informada pela fonte.'}
            </div>
          )}

          <div>
            <button
              onClick={handleActivate}
              disabled={protocolView.disabled}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 6, border: 'none',
                background: protocolView.disabled ? 'var(--bg-raised)' : 'var(--risk-high)',
                color: protocolView.disabled ? 'var(--text-ghost)' : 'white',
                fontSize: 12, fontWeight: 700, cursor: protocolView.disabled ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {protocolView.label}
            </button>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 4, lineHeight: 1.4 }}>
              Registra status e auditoria no IGNIS. Nenhum órgão externo é notificado.
            </div>
          </div>
        </div>

        {/* ── Center: Map ── */}
        <div style={{ position: 'relative' }}>
          {area?.center ? (
            <>
              <OrbitalMap center={area.center} zoom={12} darkTiles zoomControl={false}>
                {area.geometry && (
                  <Polygon
                    positions={getPolygonPositions(area.geometry)}
                    pathOptions={{ color: '#e74c3c', weight: 2, dashArray: '6 4',
                                   fillColor: '#e74c3c', fillOpacity: 0.08 }}
                  />
                )}
              </OrbitalMap>

              <div style={{
                position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
                background: 'oklch(11% 0.022 240 / 88%)',
                border: '1px solid var(--bg-raised)', borderRadius: 6,
                padding: '8px 12px', fontSize: 11, color: 'var(--text-mid)',
                backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                {area.geometry ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 2, background: '#e74c3c', borderRadius: 1 }} />
                    Perímetro da área protegida
                  </div>
                ) : (
                  <div>Perímetro da área não cadastrado.</div>
                )}
                <div style={{ color: 'var(--text-ghost)', fontSize: 10 }}>
                  A posição do foco não é informada pela API; nenhum ponto é estimado.
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 24 }}>
              <DataState kind="empty" title="Mapa indisponível">
                O incidente não está vinculado a uma área protegida com localização cadastrada.
              </DataState>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{ background: 'var(--bg-deep)', borderLeft: '1px solid var(--bg-raised)',
                      overflowY: 'auto', padding: 14,
                      display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DataState kind="not-implemented" compact title="Aurora IA · análise ainda não implementada">
            Recomendações automáticas só serão exibidas com um modelo analítico real conectado à API.
          </DataState>

          {/* Timeline */}
          <div>
            <div style={{ ...SECTION_LABEL, fontSize: 11, marginBottom: 10 }}>
              Linha do tempo ({incident.events.length})
            </div>
            {incident.events.length > 0 ? (
              <IncidentTimeline events={incident.events} reverse />
            ) : (
              <DataState kind="empty" compact title="Nenhum evento registrado" />
            )}
          </div>

          {/* Protocolo operacional: não existe conteúdo configurado — nada é inventado */}
          <div>
            <div style={{ ...SECTION_LABEL, fontSize: 11, marginBottom: 10 }}>
              Protocolo de resposta
            </div>
            <DataState kind="not-configured" compact title="Protocolo operacional não configurado">
              Nenhum protocolo de resposta foi cadastrado para esta operação. O checklist de etapas
              será exibido quando um protocolo for configurado e servido pela API.
            </DataState>
          </div>
        </div>
      </div>
    </div>
  );
}
