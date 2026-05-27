import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Resource } from '@/types/domain';

interface Props {
  resources: Resource[];
}

const TYPE_LABEL: Record<string, string> = {
  veiculo:     'Veículo',
  aeronave:    'Aeronave',
  equipamento: 'Equipamento',
  suprimento:  'Suprimento',
};

export function ResourceGrid({ resources }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12 }}>
      {resources.map(r => (
        <div key={r.id} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
          borderRadius: 8, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)',
                            marginBottom: 2 }}>
                {r.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--orbital)', fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {TYPE_LABEL[r.type] ?? r.type}
              </div>
            </div>
            <StatusBadge status={r.status} size="sm" />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
            📍 {r.location}
          </div>
          {r.currentIncident && (
            <div style={{ fontSize: 11, color: 'var(--risk-high)', marginTop: 4 }}>
              Alocado: {r.currentIncident}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
