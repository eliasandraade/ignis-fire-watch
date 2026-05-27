import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/shared/MetricCard';
import { IncidentCard } from '@/components/gestor/IncidentCard';
import { getCriticalIncident, getActiveIncidents } from '@/data/incidents';
import { getPendingReports } from '@/data/reports';
import { TEAMS } from '@/data/operations';
import { ESG_DATA } from '@/data/esg';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function GestorDashboardPage() {
  const critical = getCriticalIncident();
  const active   = getActiveIncidents();
  const pending  = getPendingReports();
  const mobilized = TEAMS.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');

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
              ⚠ INCIDENTE CRÍTICO ATIVO — {critical.id}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 12, marginBottom: 28 }}>
        <MetricCard value={8}              label="Áreas Monitoradas" />
        <MetricCard value={active.length}  label="Incidentes Ativos"  accent="var(--risk-high)" />
        <MetricCard value={pending.length} label="Denúncias Pendentes" accent="var(--risk-med)" />
        <MetricCard value={mobilized.length} label="Equipes Mobilizadas" accent="var(--orbital)" />
        <MetricCard value={1}              label="Alertas Críticos"   accent="var(--risk-crit)" />
        <MetricCard value={18}             label="Tempo Médio Resposta" unit="min" />
      </div>

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
            <AreaChart data={ESG_DATA.weeklyIncidents}>
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
                Confiança: {critical.aurora.confidence}% — Resposta simulada
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
