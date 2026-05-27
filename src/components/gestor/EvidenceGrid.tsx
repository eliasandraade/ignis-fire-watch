import type { Evidence } from '@/types/domain';

interface Props {
  evidence: Evidence[];
}

const TYPE_LABEL: Record<Evidence['type'], string> = {
  image:       'Imagem',
  satellite:   'Orbital',
  'field-photo':'Campo',
  document:    'Documento',
};

export function EvidenceGrid({ evidence }: Props) {
  if (evidence.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center',
                    color: 'var(--text-ghost)', fontSize: 13,
                    background: 'var(--bg-surface)', borderRadius: 6,
                    border: '1px solid var(--bg-raised)' }}>
        Nenhuma evidência registrada para este incidente.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {evidence.map(ev => (
        <div key={ev.id} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
          borderRadius: 8, overflow: 'hidden',
        }}>
          <img
            src={ev.url}
            alt={ev.caption}
            style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--orbital)', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                          marginBottom: 3 }}>
              {TYPE_LABEL[ev.type] ?? ev.type}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-hi)', fontWeight: 600,
                          marginBottom: 2 }}>
              {ev.caption}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
              {ev.source} · {new Date(ev.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
