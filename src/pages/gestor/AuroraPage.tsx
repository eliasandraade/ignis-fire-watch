import { AuroraChat } from '@/components/shared/AuroraChat';
import { useCriticalIncident } from '@/hooks/useIncidents';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { RiskBadge } from '@/components/shared/RiskBadge';

export default function AuroraPage() {
  const { incident: critical } = useCriticalIncident();
  const { areas } = useProtectedAreas();

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Context sidebar */}
      <div style={{ width: 260, background: 'var(--bg-panel)',
                    borderRight: '1px solid var(--bg-raised)',
                    overflowY: 'auto', padding: 16, flexShrink: 0,
                    display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Disclaimer */}
        <div style={{ padding: '8px 10px', background: 'var(--bg-raised)',
                      borderRadius: 6, fontSize: 11, color: 'var(--text-ghost)',
                      fontStyle: 'italic', lineHeight: 1.5 }}>
          Sistema de IA demonstrativo — respostas simuladas para fins acadêmicos.
          Não representa integração real com modelos de linguagem. FIAP GS 2026.
        </div>

        {/* Critical incident context */}
        {critical && (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 12,
                        border: '1px solid color-mix(in oklch, var(--risk-crit) 25%, transparent)' }}>
            <div style={{ fontSize: 10, color: 'var(--risk-crit)', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          marginBottom: 6 }}>
              Incidente Crítico Ativo
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                          fontWeight: 700, color: 'var(--text-hi)', marginBottom: 4 }}>
              {critical.code ?? critical.id}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-lo)', margin: 0, lineHeight: 1.4 }}>
              {critical.description.substring(0, 120)}...
            </p>
          </div>
        )}

        {/* Area context */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-ghost)',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        marginBottom: 8 }}>
            Áreas Monitoradas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {areas.map(area => (
              <div key={area.id} style={{ display: 'flex', justifyContent: 'space-between',
                                          alignItems: 'center', padding: '6px 8px',
                                          background: 'var(--bg-raised)', borderRadius: 5 }}>
                <div style={{ fontSize: 11, color: 'var(--text-mid)', overflow: 'hidden',
                              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              maxWidth: 140 }}>
                  {area.name}
                </div>
                <RiskBadge risk={area.risk} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat — full height */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column',
                    overflow: 'hidden' }}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-hi)', margin: 0 }}>
            Aurora IA
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-ghost)', margin: '2px 0 0' }}>
            Inteligência analítica orbital — respostas simuladas para demonstração
          </p>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <AuroraChat />
        </div>
      </div>
    </div>
  );
}
