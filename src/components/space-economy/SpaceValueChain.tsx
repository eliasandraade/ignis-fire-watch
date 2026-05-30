interface ChainStep {
  step: number;
  title: string;
  description: string;
  tag: string;
  dotColor: string;
  lineColor: string;
}

const CHAIN_STEPS: ChainStep[] = [
  {
    step: 1,
    title: 'Satélites e Sensores',
    description:
      'Infraestrutura orbital captura sinais ambientais sobre vegetação, calor, umidade, solo e atmosfera.',
    tag: 'Obs. da Terra',
    dotColor: '#3b82f6',
    lineColor: '#3b82f6',
  },
  {
    step: 2,
    title: 'Coleta Orbital',
    description:
      'Dados brutos são recebidos de missões públicas ou comerciais de observação da Terra.',
    tag: 'Sens. Remoto',
    dotColor: '#38bdf8',
    lineColor: '#38bdf8',
  },
  {
    step: 3,
    title: 'Processamento Geoespacial',
    description:
      'Informações são cruzadas com áreas protegidas, zonas de amortecimento e histórico de ocorrências.',
    tag: 'PostGIS · GeoJSON',
    dotColor: '#22c55e',
    lineColor: '#22c55e',
  },
  {
    step: 4,
    title: 'Detecção de Risco',
    description:
      'Focos de calor, perda vegetal e anomalias são convertidos em alertas priorizados.',
    tag: 'Aurora IA',
    dotColor: '#f59e0b',
    lineColor: '#f59e0b',
  },
  {
    step: 5,
    title: 'Decisão Operacional',
    description:
      'O gestor recebe ranking de risco, recomendações e protocolos de resposta.',
    tag: 'War Room',
    dotColor: '#f97316',
    lineColor: '#f97316',
  },
  {
    step: 6,
    title: 'Resposta em Campo',
    description:
      'Equipes, recursos e evidências são coordenados pela Central Tática.',
    tag: 'Mobilização',
    dotColor: '#ef4444',
    lineColor: '#ef4444',
  },
  {
    step: 7,
    title: 'Impacto Econômico / Ambiental',
    description:
      'Redução de danos ambientais, menor custo de resposta e geração de indicadores ESG.',
    tag: 'ESG',
    dotColor: '#a855f7',
    lineColor: '#a855f7',
  },
];

export function SpaceValueChain() {
  return (
    <div>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-mid)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 24,
        }}
      >
        Cadeia de Valor Espacial
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {CHAIN_STEPS.map((s, i) => (
          <div key={s.step} style={{ display: 'flex', gap: 16 }}>
            {/* Timeline column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 20,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${s.dotColor}`,
                  background: 'var(--bg-void)',
                  marginTop: 14,
                  zIndex: 1,
                }}
              />
              {i < CHAIN_STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    width: 2,
                    marginTop: 4,
                    marginBottom: 4,
                    background: s.lineColor,
                    opacity: 0.4,
                  }}
                />
              )}
            </div>

            {/* Card */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-raised)',
                borderRadius: 8,
                padding: '12px 16px',
                flex: 1,
                marginBottom: i < CHAIN_STEPS.length - 1 ? 12 : 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: s.dotColor,
                  }}
                >
                  {String(s.step).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-hi)',
                  }}
                >
                  {s.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-lo)',
                  margin: '0 0 8px',
                  lineHeight: 1.6,
                }}
              >
                {s.description}
              </p>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${s.dotColor}22`,
                  color: s.dotColor,
                  border: `1px solid ${s.dotColor}44`,
                }}
              >
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
