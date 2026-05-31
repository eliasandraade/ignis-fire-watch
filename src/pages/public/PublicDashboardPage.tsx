import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/shared/MetricCard';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Polygon } from 'react-leaflet';
import { getPolygonPositions } from '@/lib/geo';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { useActiveIncidents } from '@/hooks/useIncidents';

export default function PublicDashboardPage() {
  const { areas: PROTECTED_AREAS } = useProtectedAreas();
  const { incidents: activeIncidents } = useActiveIncidents();

  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        padding: '64px 48px 48px',
        background: 'linear-gradient(180deg, oklch(12% 0.025 240) 0%, var(--bg-void) 100%)',
        borderBottom: '1px solid var(--bg-raised)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'var(--orbital)', fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        marginBottom: 16 }}>
            Plataforma de Monitoramento Ambiental
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-hi)',
                       letterSpacing: '-0.03em', margin: '0 0 12px',
                       lineHeight: 1.1 }}>
            IGNIS Orbital
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-lo)', margin: '0 0 24px',
                      lineHeight: 1.6, maxWidth: 560 }}>
            Monitoramento inteligente de áreas protegidas do Ceará com dados orbitais simulados.
            Detectamos, notificamos e coordenamos a resposta a ameaças ambientais.
          </p>
          <div style={{ padding: '10px 16px', background: 'oklch(12% 0.025 240)',
                        border: '1px solid var(--bg-raised)', borderRadius: 6,
                        fontSize: 12, color: 'var(--text-ghost)', marginBottom: 24,
                        display: 'inline-block' }}>
            ⚠ Dados demonstrativos baseados em lógica de monitoramento orbital e ambiental.
            Protótipo FIAP GS 2026 — não representa sistema operacional real.
          </div>
          <div>
            <Link to="/public/report" style={{
              display: 'inline-block', padding: '12px 28px', background: 'var(--orbital)',
              color: 'white', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 700, marginRight: 12,
            }}>
              Registrar Denúncia
            </Link>
            <Link to="/public/map" style={{
              display: 'inline-block', padding: '12px 24px',
              border: '1px solid var(--bg-raised)', color: 'var(--text-mid)',
              borderRadius: 8, textDecoration: 'none', fontSize: 14,
            }}>
              Ver Mapa
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
                      marginBottom: 48 }}>
          <MetricCard value={8}  label="Áreas Monitoradas" unit="áreas" />
          <MetricCard value={activeIncidents.length} label="Incidentes Ativos"
                      accent="var(--risk-high)" />
          <MetricCard value="Crítico" label="Nível de Alerta Atual"
                      accent="var(--risk-crit)" />
          <MetricCard value={18} label="Tempo Médio de Resposta" unit="min" />
        </div>

        {/* Active alerts */}
        {activeIncidents.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
                         textTransform: 'uppercase', letterSpacing: '0.08em',
                         marginBottom: 12 }}>
              Alertas Ativos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeIncidents.map(inc => (
                <div key={inc.id} style={{
                  padding: '12px 16px', background: 'var(--bg-surface)',
                  border: '1px solid var(--bg-raised)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <RiskBadge risk={inc.risk} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-hi)' }}>
                        {inc.id}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                        {inc.description.substring(0, 80)}...
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-ghost)', whiteSpace: 'nowrap' }}>
                    {new Date(inc.detectedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
                       textTransform: 'uppercase', letterSpacing: '0.08em',
                       marginBottom: 12 }}>
            Mapa de Áreas Protegidas
          </h2>
          <div style={{ height: 380, borderRadius: 10, overflow: 'hidden',
                        border: '1px solid var(--bg-raised)' }}>
            <OrbitalMap center={[-4.5, -39.0]} zoom={7} darkTiles={false}>
              {PROTECTED_AREAS.map(area => (
                <Polygon
                  key={area.id}
                  positions={getPolygonPositions(area.geometry)}
                  pathOptions={{
                    color: area.risk === 'critical' ? '#e74c3c'
                         : area.risk === 'high'     ? '#f39c12'
                         : area.risk === 'medium'   ? '#f1c40f'
                         : '#27ae60',
                    fillOpacity: 0.2,
                    weight: 2,
                  }}
                />
              ))}
            </OrbitalMap>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center', padding: '40px 24px',
          background: 'var(--bg-surface)', borderRadius: 10,
          border: '1px solid var(--bg-raised)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-hi)',
                       margin: '0 0 8px' }}>
            Avistou algo suspeito?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-lo)', margin: '0 0 20px' }}>
            Qualquer cidadão pode registrar uma denúncia ambiental.
            Sua observação pode salvar uma área protegida.
          </p>
          <Link to="/public/report" style={{
            display: 'inline-block', padding: '12px 32px', background: 'var(--orbital)',
            color: 'white', borderRadius: 8, textDecoration: 'none',
            fontSize: 14, fontWeight: 700,
          }}>
            Registrar Denúncia
          </Link>
        </div>
      </div>
    </div>
  );
}
