import type { IncidentEvent } from '@/types/domain';

interface Props {
  events: IncidentEvent[];
  reverse?: boolean;
}

const EVENT_COLOR: Record<IncidentEvent['type'], string> = {
  detection:    'var(--orbital)',
  confirmation: 'var(--risk-low)',
  mobilization: 'var(--risk-med)',
  update:       'var(--text-mid)',
  alert:        'var(--risk-crit)',
  resolution:   'var(--risk-low)',
};

export function IncidentTimeline({ events, reverse = true }: Props) {
  const sorted = reverse ? [...events].reverse() : events;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {sorted.map((ev, idx) => (
        <div key={ev.id} style={{ display: 'flex', gap: 12 }}>
          {/* Dot + connector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                        flexShrink: 0 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', marginTop: 4,
              background: EVENT_COLOR[ev.type] ?? 'var(--text-ghost)',
              boxShadow: idx === 0 ? `0 0 6px ${EVENT_COLOR[ev.type]}` : 'none',
              flexShrink: 0,
            }} />
            {idx < sorted.length - 1 && (
              <div style={{ width: 1, flex: 1, minHeight: 16, marginTop: 2,
                            background: 'var(--bg-raised)' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)',
                          fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>
              {new Date(ev.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
              })}
              {' — '}{ev.author}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.4 }}>
              {ev.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
