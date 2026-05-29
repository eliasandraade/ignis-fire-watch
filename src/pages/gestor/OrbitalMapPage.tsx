import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Polygon, Circle, Marker } from 'react-leaflet';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { PROTECTED_AREAS } from '@/data/areas';
import { getActiveIncidents } from '@/data/incidents';
import { TEAMS } from '@/data/operations';
import { getPolygonPositions } from '@/lib/geo';
import type { ProtectedArea } from '@/types/domain';

type LayerKey = 'areas' | 'incidents' | 'teams' | 'buffer' | 'reports';

const LAYER_META: Record<LayerKey, string> = {
  areas:     'Áreas Protegidas',
  incidents: 'Incidentes Ativos',
  teams:     'Equipes de Campo',
  buffer:    'Zonas de Buffer',
  reports:   'Denúncias',
};

export default function OrbitalMapPage() {
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    areas:     true,
    incidents: true,
    teams:     false,
    buffer:    false,
    reports:   false,
  });
  const [selected, setSelected] = useState<ProtectedArea | null>(null);

  const toggleLayer = (key: LayerKey) =>
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const activeIncidents = getActiveIncidents();

  const polygonData = useMemo(
    () => PROTECTED_AREAS.map(area => ({
      area,
      positions: getPolygonPositions(area.geometry),
    })),
    []
  );

  const handleSelectArea = useCallback(
    (area: ProtectedArea) => setSelected(area),
    []
  );

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Layer controls */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 1000,
        background: 'oklch(11% 0.022 240 / 90%)',
        border: '1px solid var(--bg-raised)', borderRadius: 8,
        padding: '10px 14px', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-ghost)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 4 }}>
          Camadas
        </div>
        {(Object.keys(LAYER_META) as LayerKey[]).map(key => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8,
                                    cursor: 'pointer', fontSize: 13,
                                    color: layers[key] ? 'var(--text-hi)' : 'var(--text-ghost)' }}>
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={() => toggleLayer(key)}
              style={{ accentColor: 'var(--orbital)', width: 14, height: 14 }}
            />
            {LAYER_META[key]}
            {(key === 'buffer' || key === 'reports') && (
              <span style={{ fontSize: 10, color: 'var(--text-ghost)',
                             fontStyle: 'italic' }}>(em breve)</span>
            )}
          </label>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <OrbitalMap center={[-4.5, -39.0]} zoom={7} darkTiles>
          {/* Areas layer */}
          {layers.areas && polygonData.map(({ area, positions }) => (
            <Polygon
              key={area.id}
              positions={positions}
              pathOptions={{
                color: area.risk === 'critical' ? 'var(--risk-crit)'
                     : area.risk === 'high'     ? 'var(--risk-high)'
                     : area.risk === 'medium'   ? 'var(--risk-med)'
                     : 'var(--risk-low)',
                fillOpacity: selected?.id === area.id ? 0.3 : 0.12,
                weight: selected?.id === area.id ? 3 : 1.5,
              }}
              eventHandlers={{ click: () => handleSelectArea(area) }}
            />
          ))}

          {/* Incidents layer */}
          {layers.incidents && activeIncidents.map(inc => {
            const area = PROTECTED_AREAS.find(a => a.id === inc.areaId);
            if (!area) return null;
            const radius = Math.sqrt(inc.affectedHectares * 10000 / Math.PI);
            return (
              <Circle
                key={inc.id}
                center={area.center}
                radius={radius}
                pathOptions={{
                  color: '#f39c12', fillColor: '#f39c12', fillOpacity: 0.2, weight: 2,
                }}
              />
            );
          })}

          {/* Teams layer */}
          {layers.teams && TEAMS.filter(t => t.status === 'mobilizado' || t.status === 'em-transito').map(t => {
            // Use critical area center as approximate team location
            const area = PROTECTED_AREAS.find(a => a.risk === 'critical');
            if (!area) return null;
            // Offset slightly for each team
            const idx = TEAMS.indexOf(t);
            const offset: [number, number] = [area.center[0] + idx * 0.01, area.center[1] + idx * 0.01];
            return <Marker key={t.id} position={offset} />;
          })}
        </OrbitalMap>
      </div>

      {/* Area detail panel */}
      {selected && (
        <div style={{
          width: 300, background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--bg-raised)', overflowY: 'auto', padding: 20,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-hi)',
                            marginBottom: 4 }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                {selected.type} · {selected.hectares.toLocaleString('pt-BR')} ha
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-ghost)',
                       cursor: 'pointer', fontSize: 18, padding: 0 }}
            >
              ×
            </button>
          </div>

          <RiskBadge risk={selected.risk} />

          {/* dataQuality warning */}
          <div style={{ padding: '8px 10px',
                        background: 'oklch(70% 0.18 45 / 10%)',
                        border: '1px solid oklch(70% 0.18 45 / 25%)',
                        borderRadius: 5, fontSize: 11, color: 'oklch(80% 0.12 60)' }}>
            ⚠ Dados {selected.dataQuality === 'estimated' ? 'estimados' : 'simulados'} —
            protótipo demonstrativo
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-lo)', lineHeight: 1.5, margin: 0 }}>
            {selected.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase' }}>
                Confiança
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-hi)',
                            fontFamily: 'monospace' }}>
                {selected.confidence}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase' }}>
                Qualidade
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-hi)' }}>
                {selected.dataQuality}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to={`/gestor/area/${selected.id}`} style={{
              padding: '9px 0', textAlign: 'center',
              background: 'var(--orbital)', color: 'white', borderRadius: 6,
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>
              Ver Detalhe da Área
            </Link>
            <Link to="/gestor/war-room" style={{
              padding: '9px 0', textAlign: 'center',
              background: 'color-mix(in oklch, var(--risk-crit) 15%, transparent)',
              color: 'var(--risk-crit)', borderRadius: 6, textDecoration: 'none',
              fontSize: 13, fontWeight: 600,
              border: '1px solid color-mix(in oklch, var(--risk-crit) 30%, transparent)',
            }}>
              Abrir Central Tática
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
