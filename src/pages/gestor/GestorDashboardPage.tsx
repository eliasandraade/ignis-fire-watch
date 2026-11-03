import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { IncidentCard } from '@/components/gestor/IncidentCard';
import { SpaceMetricCard, MissionGlow } from '@/components/orbital';
import { staggerContainerVariants, orbitalGlowVariants } from '@/lib/motion';
import { useActiveIncidents, useCriticalIncident } from '@/hooks/useIncidents';
import { useInternalReports } from '@/hooks/useInternalReports';
import { useTeams } from '@/hooks/useTeams';
import { useESGReports } from '@/hooks/useESGReports';
import { useWeatherRisk } from '@/hooks/useWeatherRisk';
import { useOrbitalAlerts, orbitalStatusLabel } from '@/hooks/useOrbitalAlerts';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { DataSourceBadge } from '@/components/shared/DataSourceBadge';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function GestorDashboardPage() {
  const reducedMotion = useReducedMotion();
  const { incidents: active, dataSource } = useActiveIncidents();
  const { incident: critical } = useCriticalIncident();
  const { reports } = useInternalReports();
  const { teams } = useTeams();
  const { latest: esgData } = useESGReports();
  const { areas } = useProtectedAreas();

  const pending  = reports.filter(r => r.status === 'em-triagem');
  const mobilized = teams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');

  // Fixed reference point in Ceará (incidents have no lat/lng in the domain type yet).
  // The card states this explicitly; it is not the critical incident's location.
  const critLat = -4.005;
  const critLng = -39.46;
  const { weatherRisk, fromApi: weatherFromApi } = useWeatherRisk(critLat, critLng);
  const orbital = useOrbitalAlerts();
  const firmsAccent = orbital.isRealData ? '#22c55e' : orbital.isDemo ? '#60a5fa' : '#f59e0b';

  return (
    <div style={{ padding: 24 }}>
      {/* Critical incident banner */}
      {critical && (
        <div style={{
          marginBottom: 20, padding: '12px 20px',
          background: 'color-mix(in oklch, var(--risk-crit) 12%, transparent)',
          border: '1px solid color-mix(in oklch, var(--risk-crit) 35%, transparent)',
          borderRadius: 8, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--risk-crit)' }}>
              ⚠ INCIDENTE CRÍTICO ATIVO — {critical.code ?? critical.id}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-lo)', marginLeft: 12 }}>
              {critical.description.substring(0, 80)}...
            </span>
          </div>
          <Link to="/gestor/war-room" style={{
            padding: '7px 16px', background: 'var(--risk-crit)', color: 'white',
            borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            Central Tática →
          </Link>
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <DataSourceBadge status={dataSource.status} />
      </div>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 12, marginBottom: 28 }}
      >
        <SpaceMetricCard value={areas.length}    label="Áreas Cadastradas"   sublabel="áreas protegidas"    delay={0} />
        <SpaceMetricCard value={active.length}   label="Incidentes Ativos"   accent="var(--risk-high)" sublabel="registrados no IGNIS" delay={0.05} />
        <SpaceMetricCard value={pending.length}  label="Denúncias Pendentes" accent="var(--risk-med)"  sublabel="geointeligência"     delay={0.10} />
        <SpaceMetricCard value={mobilized.length} label="Equipes Mobilizadas" accent="var(--orbital)"  sublabel="resposta tática"     delay={0.15} />
        <SpaceMetricCard value={active.filter(i => i.risk === 'critical').length}
                          label="Alertas Críticos" accent="var(--risk-crit)"  sublabel="risco operacional"   delay={0.20} />
        <SpaceMetricCard value="n/d"           label="Tempo Médio Resposta" sublabel="não medido nesta versão" delay={0.25} />
      </motion.div>

      {/* Space Economy promo card */}
      <Link to="/gestor/economia-espacial" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
        <motion.div
          variants={reducedMotion ? {} : orbitalGlowVariants}
          animate={reducedMotion ? undefined : 'glow'}
          style={{
            background: 'oklch(60% 0.18 220 / 0.06)',
            border: '1px solid oklch(60% 0.18 220 / 0.25)',
            borderLeft: '3px solid var(--orbital)',
            borderRadius: 8,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'background 0.15s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <MissionGlow
            size={120}
            opacity={0.08}
            style={{ position: 'absolute', top: -40, right: -20, pointerEvents: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>🛰</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--orbital)', marginBottom: 2 }}>
                Economia Espacial
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                Da órbita à proteção ambiental — cadeia de valor, fontes orbitais e roadmap de integração.
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--orbital)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 16 }}>
            Ver página →
          </span>
        </motion.div>
      </Link>

      {/* Charts + Aurora */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px',
                    gap: 20, marginBottom: 28 }}>
        {/* Incidents chart */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                      border: '1px solid var(--bg-raised)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)',
                        marginBottom: 16 }}>
            Incidentes por Semana (Jan–Mai 2026)
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={esgData.weeklyIncidents}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="oklch(65% 0.17 220)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(65% 0.17 220)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="var(--text-ghost)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-ghost)" tick={{ fontSize: 11 }} width={24} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)',
                                border: '1px solid var(--bg-raised)', borderRadius: 6,
                                fontSize: 12 }}
              />
              <Area type="monotone" dataKey="count" stroke="oklch(65% 0.17 220)"
                    fill="url(#incGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Aurora insight */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                      border: '1px solid var(--bg-raised)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orbital)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginBottom: 12 }}>
            Aurora IA · Insight
          </div>
          {critical ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--risk-crit)',
                            marginBottom: 8 }}>
                {critical.aurora.priority}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-lo)', lineHeight: 1.5, margin: 0 }}>
                {critical.aurora.recommendation.substring(0, 200)}...
              </p>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-ghost)',
                            fontStyle: 'italic' }}>
                Confiança: {critical.aurora.confidence}% — Análise rule-based demonstrativa
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-ghost)' }}>
              Nenhum incidente crítico ativo.
            </p>
          )}
        </div>
      </div>

      {/* External integrations status row */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: 8 }}>
          Fontes Externas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {/* Open-Meteo */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 8, padding: '14px 16px',
            border: '1px solid var(--bg-raised)',
            borderLeft: `3px solid ${weatherFromApi ? '#22c55e' : 'var(--bg-raised)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)' }}>
                🌤 Risco Meteorológico
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                color: weatherFromApi ? '#22c55e' : 'var(--text-ghost)',
                background: weatherFromApi ? '#22c55e18' : 'var(--bg-raised)',
                border: `1px solid ${weatherFromApi ? '#22c55e33' : 'var(--bg-raised)'}`,
              }}>
                {weatherFromApi
                  ? weatherRisk.source_status === 'cached' ? 'cache' : 'Open-Meteo'
                  : 'indisponível'}
              </span>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
              color: { low: 'var(--risk-low)', moderate: 'var(--risk-med)',
                       high: 'var(--risk-high)', critical: 'var(--risk-crit)' }[weatherRisk.risk_level] ?? 'var(--text-hi)',
            }}>
              {weatherFromApi && weatherRisk.risk_score != null ? weatherRisk.risk_score : '—'}
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 4, color: 'var(--text-ghost)' }}>
                / 100
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-lo)' }}>
              {weatherRisk.temperature_c != null ? `${weatherRisk.temperature_c.toFixed(1)}°C` : '—'}{' · '}
              {weatherRisk.relative_humidity != null ? `${weatherRisk.relative_humidity.toFixed(0)}% UR` : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 2 }}>
              ponto fixo de referência (-4.005, -39.46)
              {weatherFromApi && weatherRisk.fetched_at
                ? ` · obtido em ${new Date(weatherRisk.fetched_at).toLocaleString('pt-BR')}`
                : ''}
            </div>
          </div>

          {/* NASA FIRMS */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 8, padding: '14px 16px',
            border: '1px solid var(--bg-raised)',
            borderLeft: `3px solid ${firmsAccent}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)' }}>
                🛰 Alertas Orbitais
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                color: firmsAccent,
                background: `${firmsAccent}18`,
                border: `1px solid ${firmsAccent}33`,
              }}>
                {orbital.isRealData ? 'NASA FIRMS' : orbital.isDemo ? 'demo' : 'sem dados'}
              </span>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
              color: orbital.isRealData ? 'var(--text-hi)' : firmsAccent,
            }}>
              {orbital.isRealData || orbital.isDemo ? orbital.total : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-lo)' }}>
              {orbitalStatusLabel(orbital)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 2 }}>
              anomalias térmicas — não confirmam incêndio
            </div>
          </div>

          {/* OSM/Nominatim */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 8, padding: '14px 16px',
            border: '1px solid var(--bg-raised)',
            borderLeft: '3px solid var(--bg-raised)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)' }}>
                📍 Geocodificação
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                color: 'var(--text-ghost)', background: 'var(--bg-raised)', border: '1px solid var(--bg-raised)',
              }}>
                OSM/Nominatim
              </span>
            </div>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: 'var(--text-mid)',
            }}>
              não usada nesta tela
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-lo)' }}>
              endpoint disponível no backend; status não verificado aqui
            </div>
          </div>
        </div>
      </div>

      {/* Incidents grid */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      marginBottom: 12 }}>
          Incidentes Ativos ({active.length})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {active.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
        </div>
      </div>
    </div>
  );
}
