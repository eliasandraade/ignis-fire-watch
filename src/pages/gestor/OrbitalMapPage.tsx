import { OrbitalExplorer } from '@/components/orbital-map/OrbitalExplorer';

/** Operational map of Ceará: persisted heat spots, official IBGE boundaries, source status. */
export default function OrbitalMapPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-hi)', margin: 0, padding: '10px 14px',
                   borderBottom: '1px solid var(--bg-raised)' }}>
        Mapa orbital do Ceará — focos de calor persistidos
      </h1>
      <div style={{ flex: 1, minHeight: 0 }}>
        <OrbitalExplorer mode="gestor" />
      </div>
    </div>
  );
}
