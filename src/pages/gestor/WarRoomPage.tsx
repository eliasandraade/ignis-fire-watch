import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Circle, Marker, Polygon } from 'react-leaflet';
import { motion, useReducedMotion } from 'framer-motion';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { IncidentTimeline } from '@/components/gestor/IncidentTimeline';
import { WeatherBlock } from '@/components/gestor/WeatherBlock';
import { OrbitalGrid, RadarSweep } from '@/components/orbital';
import { criticalPulseVariants, orbitalGlowVariants } from '@/lib/motion';
import { useWarRoom } from '@/hooks/useWarRoom';
import { useTeams } from '@/hooks/useTeams';
import { useResources } from '@/hooks/useResources';
import { DataSourceBadge } from '@/components/shared/DataSourceBadge';
import { PROTOCOL_INCENDIO } from '@/data/operations';
import { getPolygonPositions } from '@/lib/geo';
import { useToast } from '@/hooks/use-toast';
import { isApiEnabled } from '@/services/api/client';
import { activateProtocol } from '@/services/api/incidentsService';
import type { ProtocolStep } from '@/types/domain';

export default function WarRoomPage() {
  const { incident, area, loading, dataSource } = useWarRoom();
  const { teams } = useTeams();
  const { resources } = useResources();
  const apiEnabled = isApiEnabled();
  const reducedMotion = useReducedMotion();

  const mobilizedTeams = teams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');
  const deployedResources = resources.filter(r => r.status === 'mobilizado' || r.currentIncident);

  const [clock, setClock]           = useState(new Date());
  const [reinforced, setReinforced] = useState(false);
  const [steps, setSteps]           = useState<ProtocolStep[]>(PROTOCOL_INCENDIO.steps);
  const { toast } = useToast();

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleReinforce = async () => {
    if (apiEnabled && incident?.id) {
      try {
        await activateProtocol(incident.id);
        toast({ title: 'Protocolo ativado', description: `${incident.code ?? incident.id}` });
      } catch {
        toast({ title: 'Protocolo registrado localmente', description: 'API indisponível no momento.' });
      }
    } else {
      toast({ title: 'Protocolo reforçado', description: 'Ação registrada localmente — protótipo' });
    }
    setReinforced(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', background: 'var(--bg-void)',
                    flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 18, color: 'var(--text-mid)' }}>Carregando Central Tática...</div>
      </div>
    );
  }

  if (!incident || !area) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', background: 'var(--bg-void)',
                    flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 18, color: 'var(--text-mid)' }}>Nenhum incidente crítico ativo</div>
        <Link to="/gestor" style={{ color: 'var(--orbital)', textDecoration: 'none', fontSize: 14 }}>
          ← Dashboard
        </Link>
      </div>
    );
  }

  const polygonPositions = getPolygonPositions(area.geometry);
  const fireRadius = Math.sqrt((incident.affectedHectares || 1) * 10000 / Math.PI);

  const TEAM_DOT: Record<string, string> = {
    disponivel:    'var(--risk-low)',
    mobilizado:    'var(--risk-high)',
    'em-transito': 'var(--orbital)',
    indisponivel:  'var(--text-ghost)',
  };

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

        {/* Change 2: critical pulse on incident code */}
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
          {/* Change 5: blinking alert for critical telemetry metrics */}
          {[
            { label: 'T', value: `${incident.temperature}°C`, crit: incident.temperature > 35 },
            { label: 'UR', value: `${incident.humidity}%`,    crit: incident.humidity < 20 },
            { label: '💨', value: `${incident.windSpeed}km/h ${incident.windDirection}`, crit: false },
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
        {/* Change 3: position:relative + OrbitalGrid overlay */}
        <div style={{ background: 'var(--bg-deep)', borderRight: '1px solid var(--bg-raised)',
                      overflowY: 'auto', padding: 14, position: 'relative',
                      display: 'flex', flexDirection: 'column', gap: 14 }}>
          <OrbitalGrid style={{ position: 'absolute', inset: 0 }} type="dots" />

          <div>
            <RiskBadge risk={incident.risk} />
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-hi)',
                          margin: '6px 0 2px' }}>
              {area.name}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                          color: 'var(--text-ghost)' }}>
              {area.center[0].toFixed(4)}, {area.center[1].toFixed(4)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Área Afetada', value: `${incident.affectedHectares}ha` },
              { label: 'Confiança',    value: `${incident.confidence}%` },
              { label: 'Detecção',     value: new Date(incident.detectedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) },
              { label: 'Fonte',        value: incident.source.split('/')[0] },
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
            temperature={incident.temperature}
            humidity={incident.humidity}
            windSpeed={incident.windSpeed}
            windDirection={incident.windDirection}
          />

          {/* Change 1: RadarSweep between weather and teams */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', opacity: 0.7 }}>
            <RadarSweep size={72} color="#3b82f6" speed={8} />
          </div>

          {/* Equipes mobilizadas */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 6 }}>
              Equipes ({mobilizedTeams.length})
            </div>
            {mobilizedTeams.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
                Nenhuma equipe mobilizada.
              </div>
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
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 6 }}>
              Recursos ({deployedResources.length})
            </div>
            {deployedResources.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
                Nenhum recurso alocado.
              </div>
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
                  <div style={{ fontSize: 10, color: 'var(--text-ghost)' }}>{r.location}</div>
                </div>
              </div>
            ))}
          </div>

          {area.dataQuality !== 'official' && (
            <div style={{ padding: '8px 10px',
                          background: 'oklch(70% 0.18 45 / 10%)',
                          border: '1px solid oklch(70% 0.18 45 / 25%)',
                          borderRadius: 5, fontSize: 11,
                          color: 'oklch(80% 0.12 60)' }}>
              ⚠ Limites estimados — dados demonstrativos (FIAP GS 2026)
            </div>
          )}

          <button
            onClick={handleReinforce}
            disabled={reinforced}
            style={{
              width: '100%', padding: '10px 0', borderRadius: 6, border: 'none',
              background: reinforced ? 'var(--bg-raised)' : 'var(--risk-high)',
              color: reinforced ? 'var(--text-ghost)' : 'white',
              fontSize: 12, fontWeight: 700, cursor: reinforced ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {reinforced ? '✓ Protocolo Ativado' : 'Reforçar Protocolo de Resposta'}
          </button>
        </div>

        {/* ── Center: Map ── */}
        <div style={{ position: 'relative' }}>
          <OrbitalMap center={area.center} zoom={12} darkTiles zoomControl={false}>
            <Polygon
              positions={polygonPositions}
              pathOptions={{ color: '#e74c3c', weight: 2, dashArray: '6 4',
                             fillColor: '#e74c3c', fillOpacity: 0.08 }}
            />
            <Circle
              center={area.center}
              radius={fireRadius}
              pathOptions={{ color: '#f39c12', weight: 2,
                             fillColor: '#f39c12', fillOpacity: 0.15 }}
            />
            <Marker position={area.center} />
          </OrbitalMap>

          <div style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
            background: 'oklch(11% 0.022 240 / 88%)',
            border: '1px solid var(--bg-raised)', borderRadius: 6,
            padding: '8px 12px', fontSize: 11, color: 'var(--text-mid)',
            backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 2, background: '#e74c3c', borderRadius: 1 }} />
              Perímetro da área
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%',
                            background: 'rgba(243,156,18,0.4)',
                            border: '1px solid #f39c12' }} />
              Foco estimado ({incident.affectedHectares}ha)
            </div>
            <div style={{ marginTop: 4, color: 'var(--text-ghost)',
                          fontSize: 10, fontStyle: 'italic' }}>
              Dados demonstrativos
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ background: 'var(--bg-deep)', borderLeft: '1px solid var(--bg-raised)',
                      overflowY: 'auto', padding: 14,
                      display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Change 4: Aurora block wrapped in motion.div with orbital glow */}
          <motion.div
            animate={reducedMotion ? undefined : 'glow'}
            variants={reducedMotion ? undefined : orbitalGlowVariants}
            style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 14,
                     border: '1px solid var(--bg-raised)' }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--orbital)',
                          textTransform: 'uppercase', letterSpacing: '0.1em',
                          marginBottom: 6 }}>
              Aurora IA
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--risk-crit)' }}>
                {incident.aurora.priority}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-ghost)', fontFamily: 'monospace' }}>
                {incident.aurora.confidence}%
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-lo)', lineHeight: 1.5, margin: 0 }}>
              {incident.aurora.recommendation}
            </p>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-ghost)',
                          fontStyle: 'italic' }}>
              Análise rule-based — protótipo demonstrativo
            </div>
          </motion.div>

          {/* Timeline */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 10 }}>
              Timeline ({incident.events.length})
            </div>
            {incident.events.length > 0 ? (
              <IncidentTimeline events={incident.events} reverse />
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
                Nenhum evento registrado.
              </div>
            )}
          </div>

          {/* Protocol checklist */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 10 }}>
              Protocolo de Resposta
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {steps.map(step => (
                <div key={step.id}
                     onClick={() => toggleStep(step.id)}
                     style={{
                       display: 'flex', alignItems: 'flex-start', gap: 8,
                       padding: '8px 10px', borderRadius: 5, cursor: 'pointer',
                       background: step.completed ? 'color-mix(in oklch, var(--risk-low) 10%, transparent)' : 'var(--bg-surface)',
                       border: `1px solid ${step.completed ? 'color-mix(in oklch, var(--risk-low) 25%, transparent)' : 'var(--bg-raised)'}`,
                     }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                    background: step.completed ? 'var(--risk-low)' : 'var(--bg-raised)',
                    border: `1px solid ${step.completed ? 'var(--risk-low)' : 'var(--text-ghost)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: 'white',
                  }}>
                    {step.completed ? '✓' : ''}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: step.completed ? 600 : 400,
                                  color: step.completed ? 'var(--risk-low)' : 'var(--text-mid)' }}>
                      {step.title}
                    </div>
                    {step.completedBy && (
                      <div style={{ fontSize: 10, color: 'var(--text-ghost)' }}>
                        {step.completedBy}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
