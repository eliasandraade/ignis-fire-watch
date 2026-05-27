import { MetricCard } from '@/components/shared/MetricCard';
import { ESGCharts } from '@/components/gestor/ESGCharts';
import { ESG_DATA } from '@/data/esg';

const ODS_LIST = [
  { id: 2,  label: 'Fome Zero',              color: '#D3A029' },
  { id: 8,  label: 'Trabalho Decente',       color: '#A21942' },
  { id: 9,  label: 'Indústria e Inovação',   color: '#FD6925' },
  { id: 11, label: 'Cidades Sustentáveis',   color: '#FD9D24' },
  { id: 13, label: 'Ação Climática',         color: '#3F7E44' },
  { id: 15, label: 'Vida Terrestre',         color: '#56C02B' },
];

export default function ESGReportPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-hi)' }}>
            Relatório ESG
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '4px 0 0' }}>
            Período: {ESG_DATA.period}
          </p>
        </div>
        <div style={{ padding: '6px 12px', background: 'var(--bg-raised)', borderRadius: 6,
                      fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
          Dados demonstrativos — FIAP GS 2026
        </div>
      </div>

      {/* 4 MetricCards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 16, marginBottom: 28 }}>
        <MetricCard
          value={ESG_DATA.areasMonitored}
          label="Áreas Monitoradas"
          unit="áreas"
        />
        <MetricCard
          value={ESG_DATA.incidentsDetected}
          label="Incidentes Detectados"
          accent="var(--risk-high)"
        />
        <MetricCard
          value={ESG_DATA.incidentsPrevented}
          label="Incidentes Prevenidos"
          accent="var(--risk-low)"
        />
        <MetricCard
          value={ESG_DATA.responseTimeAvg}
          label="Tempo Médio de Resposta"
          unit="min"
          accent="var(--orbital)"
        />
      </div>

      {/* Charts */}
      <div style={{ marginBottom: 32 }}>
        <ESGCharts />
      </div>

      {/* ODS */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
                     textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          Objetivos de Desenvolvimento Sustentável
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {ODS_LIST.map(ods => (
            <div key={ods.id} style={{
              background: ods.color,
              borderRadius: 8, padding: '16px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white',
                            fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                {ods.id}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginTop: 6,
                            fontWeight: 600, lineHeight: 1.3 }}>
                {ods.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
          ODS 2 · 8 · 9 · 11 · 13 · 15 — relacionados ao escopo do IGNIS Orbital.
          Protótipo demonstrativo FIAP GS 2026.
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
