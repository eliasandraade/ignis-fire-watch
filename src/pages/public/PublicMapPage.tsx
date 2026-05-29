import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { getPolygonPositions } from '@/lib/geo';
import { Polygon } from 'react-leaflet';
import type { ProtectedArea } from '@/types/domain';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';

export default function PublicMapPage() {
  const [selected, setSelected] = useState<ProtectedArea | null>(null);
  const { areas: PROTECTED_AREAS } = useProtectedAreas();

  return (
    <div style={{ height: 'calc(100vh - 52px)', display: 'flex', overflow: 'hidden' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
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
                fillOpacity: selected?.id === area.id ? 0.35 : 0.15,
                weight: selected?.id === area.id ? 3 : 2,
              }}
              eventHandlers={{ click: () => setSelected(area) }}
            />
          ))}
        </OrbitalMap>
      </div>

      {/* Side panel */}
      <div style={{
        width: 320, background: 'var(--bg-panel)', borderLeft: '1px solid var(--bg-raised)',
        overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)',
                     textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Áreas Protegidas
        </h2>
        <p style={{ fontSize: 11, color: 'var(--text-ghost)', margin: 0 }}>
          Clique em uma área no mapa para ver detalhes.
        </p>

        {selected ? (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-hi)',
                              marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                  {selected.type} · {selected.hectares.toLocaleString('pt-BR')} ha
                </div>
              </div>
              <RiskBadge risk={selected.risk} />
            </div>

            {/* dataQuality warning */}
            <div style={{ padding: '6px 10px', marginBottom: 10,
                          background: 'oklch(70% 0.18 45 / 10%)',
                          border: '1px solid oklch(70% 0.18 45 / 25%)',
                          borderRadius: 5, fontSize: 11,
                          color: 'oklch(80% 0.12 60)' }}>
              ⚠ Limites {selected.dataQuality === 'estimated' ? 'estimados' : 'simulados'} —
              dados demonstrativos
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-lo)', lineHeight: 1.5,
                        margin: '0 0 16px' }}>
              {selected.description}
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/public/report?areaId=${selected.id}`} style={{
                flex: 1, padding: '8px 0', textAlign: 'center',
                background: 'var(--orbital)', color: 'white', borderRadius: 6,
                textDecoration: 'none', fontSize: 12, fontWeight: 600,
              }}>
                Registrar Denúncia
              </Link>
              <button onClick={() => setSelected(null)} style={{
                padding: '8px 12px', background: 'var(--bg-raised)',
                color: 'var(--text-mid)', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              }}>
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROTECTED_AREAS.map(area => (
              <button
                key={area.id}
                onClick={() => setSelected(area)}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
                  borderRadius: 6, padding: '10px 12px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-hi)' }}>
                    {area.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
                    {area.type}
                  </div>
                </div>
                <RiskBadge risk={area.risk} size="sm" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
