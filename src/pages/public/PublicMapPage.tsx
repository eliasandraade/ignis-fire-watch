import { OrbitalExplorer } from '@/components/orbital-map/OrbitalExplorer';

/**
 * Public map: only public satellite data (NASA FIRMS / INPE) and official IBGE
 * boundaries. No citizen reports, people, teams or internal identifiers.
 */
export default function PublicMapPage() {
  return (
    <div style={{ height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 16px', padding: '10px 14px' }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-hi)', margin: 0 }}>
          Focos de calor no Ceará (dados públicos de satélite)
        </h1>
        <p role="note" style={{ fontSize: 12, color: 'var(--text-lo)', margin: 0 }}>
          Foco de calor é uma anomalia térmica detectada por satélite e não confirma incêndio.
          Em emergência, ligue 193 (Corpo de Bombeiros).
        </p>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <OrbitalExplorer mode="public" />
      </div>
    </div>
  );
}
