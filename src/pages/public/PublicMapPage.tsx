import { OrbitalExplorer } from '@/components/orbital-map/OrbitalExplorer';

/**
 * Public map: only public satellite data (NASA FIRMS / INPE) and official IBGE
 * boundaries. No citizen reports, people, teams or internal identifiers.
 */
export default function PublicMapPage() {
  return (
    <div style={{ height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-hi)', margin: 0, padding: '10px 14px' }}>
        Focos de calor no Ceará (dados públicos de satélite)
      </h1>
      <div style={{ flex: 1, minHeight: 0 }}>
        <OrbitalExplorer mode="public" />
      </div>
    </div>
  );
}
