import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CloudSun, MapPin } from 'lucide-react';
import { IncidentCard } from '@/components/gestor/IncidentCard';
import { SpaceMetricCard } from '@/components/orbital';
import { staggerContainerVariants } from '@/lib/motion';
import { useActiveIncidents, useCriticalIncident } from '@/hooks/useIncidents';
import { useInternalReports } from '@/hooks/useInternalReports';
import { useTeams } from '@/hooks/useTeams';
import { useWeatherRisk } from '@/hooks/useWeatherRisk';
import { OrbitalSummaryCard } from '@/components/orbital-map/OrbitalSummaryCard';
import { OrbitalDashboardSection } from '@/components/orbital-map/OrbitalDashboardSection';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { DataSourceBadge } from '@/components/shared/DataSourceBadge';
import { DataState } from '@/components/shared/DataState';

export default function GestorDashboardPage() {
  const { incidents: active, dataSource, fromApi: incidentsOk } = useActiveIncidents();
  const { incident: critical } = useCriticalIncident();
  const { reports, fromApi: reportsOk } = useInternalReports();
  const { teams, fromApi: teamsOk } = useTeams();
  const { areas, fromApi: areasOk } = useProtectedAreas();

  const pending  = reports.filter(r => r.status === 'em-triagem');
  const mobilized = teams.filter(t => t.status === 'mobilizado' || t.status === 'em-transito');
  // Sem resposta da API o indicador mostra "—", nunca um zero que pareça medido.
  const count = (ok: boolean, n: number) => (ok ? n : '—');

  // Ponto fixo de referência no Ceará (incidentes ainda não têm lat/lng no tipo de domínio).
  // O cartão diz isso explicitamente; não é a localização do incidente crítico.
  const refLat = -4.005;
  const refLng = -39.46;
  const { weatherRisk } = useWeatherRisk(refLat, refLng);

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
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--risk-crit)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} aria-hidden="true" />
              INCIDENTE CRÍTICO ATIVO — {critical.code ?? critical.id}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-lo)', marginLeft: 12 }}>
              {critical.description.length > 80 ? `${critical.description.substring(0, 80)}…` : critical.description}
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
        <SpaceMetricCard value={count(areasOk, areas.length)} label="Áreas Cadastradas"
                         sublabel={areasOk ? 'áreas protegidas' : 'indisponível'} delay={0} />
        <SpaceMetricCard value={count(incidentsOk, active.length)} label="Incidentes Ativos" accent="var(--risk-high)"
                         sublabel={incidentsOk ? 'registrados no IGNIS' : 'indisponível'} delay={0.05} />
        <SpaceMetricCard value={count(reportsOk, pending.length)} label="Denúncias Pendentes" accent="var(--risk-med)"
                         sublabel={reportsOk ? 'aguardando triagem' : 'indisponível'} delay={0.10} />
        <SpaceMetricCard value={count(teamsOk, mobilized.length)} label="Equipes Mobilizadas" accent="var(--orbital)"
                         sublabel={teamsOk ? 'em campo ou em trânsito' : 'indisponível'} delay={0.15} />
        <SpaceMetricCard value={count(incidentsOk, active.filter(i => i.risk === 'critical').length)}
                         label="Alertas Críticos" accent="var(--risk-crit)"
                         sublabel={incidentsOk ? 'incidentes críticos ativos' : 'indisponível'} delay={0.20} />
        <SpaceMetricCard value="—" label="Tempo Médio Resposta" sublabel="ainda não implementado" delay={0.25} />
      </motion.div>

      <OrbitalDashboardSection />

      {/* Aurora: texto fixo por severidade não é análise — não exibir como tal */}
      <div style={{ marginBottom: 28 }}>
        <DataState kind="not-implemented" title="Aurora IA · análise de incidentes ainda não implementada">
          Recomendações e índices de confiança só serão exibidos quando houver um modelo analítico
          real conectado à API.
        </DataState>
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
            borderLeft: `3px solid ${weatherRisk ? '#22c55e' : 'var(--bg-raised)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CloudSun size={13} aria-hidden="true" /> Condições meteorológicas
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                color: weatherRisk ? '#22c55e' : 'var(--text-ghost)',
                background: weatherRisk ? '#22c55e18' : 'var(--bg-raised)',
                border: `1px solid ${weatherRisk ? '#22c55e33' : 'var(--bg-raised)'}`,
              }}>
                {weatherRisk
                  ? weatherRisk.source_status === 'cached' ? 'cache' : 'Open-Meteo'
                  : 'indisponível'}
              </span>
            </div>
            {/* Measurements only: the API's risk index has no validated methodology yet. */}
            <div style={{
              fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-hi)',
            }}>
              {weatherRisk?.temperature_c != null ? `${weatherRisk.temperature_c.toFixed(1)}°C` : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-lo)' }}>
              {weatherRisk?.relative_humidity != null ? `${weatherRisk.relative_humidity.toFixed(0)}% UR` : '—'}{' · '}
              {weatherRisk?.wind_speed_kmh != null ? `vento ${weatherRisk.wind_speed_kmh.toFixed(0)} km/h` : 'vento —'}{' · '}
              {weatherRisk?.precipitation_mm != null ? `${weatherRisk.precipitation_mm.toFixed(1)} mm` : 'chuva —'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 2 }}>
              Índice de risco não exibido: metodologia ainda não validada.
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 2 }}>
              ponto fixo de referência ({refLat}, {refLng})
              {weatherRisk?.fetched_at
                ? ` · obtido em ${new Date(weatherRisk.fetched_at).toLocaleString('pt-BR')}`
                : ' · serviço temporariamente indisponível'}
            </div>
          </div>

          {/* Persisted heat spots (PostGIS) */}
          <OrbitalSummaryCard />

          {/* OSM/Nominatim */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 8, padding: '14px 16px',
            border: '1px solid var(--bg-raised)',
            borderLeft: '3px solid var(--bg-raised)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} aria-hidden="true" /> Geocodificação
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                color: 'var(--text-ghost)', background: 'var(--bg-raised)', border: '1px solid var(--bg-raised)',
              }}>
                OSM/Nominatim
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-mid)' }}>
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
          Incidentes Ativos{incidentsOk ? ` (${active.length})` : ''}
        </div>
        {dataSource.status === 'loading' ? (
          <DataState kind="loading" title="Carregando incidentes…" />
        ) : dataSource.status === 'error' ? (
          <DataState kind="error">
            Não foi possível consultar os incidentes na API. Nenhum incidente é exibido no lugar.
          </DataState>
        ) : active.length === 0 ? (
          <DataState kind="empty" title="Nenhum incidente ativo">
            Incidentes registrados no IGNIS (por conversão de denúncias ou cadastro da equipe)
            aparecem aqui enquanto não forem encerrados.
          </DataState>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {active.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
          </div>
        )}
      </div>
    </div>
  );
}
