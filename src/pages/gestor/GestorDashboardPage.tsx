import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { IncidentCard } from '@/components/gestor/IncidentCard';
import { SpaceMetricCard, MissionGlow } from '@/components/orbital';
import { staggerContainerVariants, orbitalGlowVariants } from '@/lib/motion';
import { useActiveIncidents, useCriticalIncident } from '@/hooks/useIncidents';
import { useInternalReports } from '@/hooks/useInternalReports';
import { useTeams } from '@/hooks/useTeams';
import { useESGReports } from '@/hooks/useESGReports';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function GestorDashboardPage() {
  const reducedMotion = useReducedMotion();
  const { incidents: active } = useActiveIncidents();
  const { incident: critical } = useCriticalIncident();
  const { reports } = useInternalReports();
  const { teams } = useTeams();
  const { latest: esgData } = useESGReports();

  const pending  = reports.filter(r => r.status === 'em-triagem');
  const mobilized = teams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');

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
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 12, marginBottom: 28 }}
      >
        <SpaceMetricCard value={8}               label="Áreas Monitoradas"   sublabel="cobertura orbital"   delay={0} />
        <SpaceMetricCard value={active.length}   label="Incidentes Ativos"   accent="var(--risk-high)" sublabel="dados orbitais"     delay={0.05} />
        <SpaceMetricCard value={pending.length}  label="Denúncias Pendentes" accent="var(--risk-med)"  sublabel="geointeligência"     delay={0.10} />
        <SpaceMetricCard value={mobilized.length} label="Equipes Mobilizadas" accent="var(--orbital)"  sublabel="resposta tática"     delay={0.15} />
        <SpaceMetricCard value={active.filter(i => i.risk === 'critical').length}
                          label="Alertas Críticos" accent="var(--risk-crit)"  sublabel="risco operacional"   delay={0.20} />
        <SpaceMetricCard value={18}              label="Tempo Médio Resposta" unit="min"               sublabel="eficiência"          delay={0.25} />
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
