import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const RADAR_DATA = [
  { axis: 'Dados Orbitais',   value: 72 },
  { axis: 'Geodados',         value: 88 },
  { axis: 'IA Operacional',   value: 65 },
  { axis: 'Resp. em Campo',   value: 80 },
  { axis: 'Rastreabilidade',  value: 58 },
  { axis: 'ESG',              value: 75 },
];

const FILL_COLOR = 'oklch(65% 0.17 220)';

export function SpaceImpactChart() {
  return (
    <div>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-mid)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 20,
        }}
      >
        Maturidade de Uso Espacial
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* RadarChart */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-raised)',
            borderRadius: 8,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-mid)',
              marginBottom: 12,
            }}
          >
            Capacidade orbital atual · simulado
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart
              data={RADAR_DATA}
              outerRadius={90}
              margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            >
              <PolarGrid stroke="var(--bg-raised)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 11, fill: 'var(--text-lo)' as string }}
              />
              <Radar
                name="IGNIS"
                dataKey="value"
                stroke={FILL_COLOR}
                fill={FILL_COLOR}
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Axis list with progress bars */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-raised)',
            borderRadius: 8,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-mid)',
              marginBottom: 16,
            }}
          >
            Dimensões de capacidade espacial
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {RADAR_DATA.map((d) => (
              <div key={d.axis}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--text-mid)',
                      fontWeight: 500,
                    }}
                  >
                    {d.axis}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--orbital)',
                    }}
                  >
                    {d.value}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: 'var(--bg-raised)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${d.value}%`,
                      background: FILL_COLOR,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 10,
              color: 'var(--text-ghost)',
              fontStyle: 'italic',
            }}
          >
            valores simulados para demonstração acadêmica · FIAP GS 2026
          </div>
        </div>
      </div>
    </div>
  );
}
