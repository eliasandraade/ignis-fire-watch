import type { DataSourceStatus } from '@/services/dataSource';

interface DataSourceBadgeProps {
  status: DataSourceStatus;
  style?: React.CSSProperties;
}

const BADGE_CONFIG: Record<DataSourceStatus, { label: string; color: string }> = {
  api:      { label: 'API ao vivo',  color: 'oklch(65% 0.15 145)' },
  demo:     { label: 'Demo',         color: 'oklch(60% 0.14 250)' },
  fallback: { label: 'Fallback',     color: 'oklch(70% 0.15 85)'  },
  mixed:    { label: 'Misto',        color: 'oklch(65% 0.14 310)' },
  partial:  { label: 'Parcial',      color: 'oklch(68% 0.14 50)'  },
};

export function DataSourceBadge({ status, style }: DataSourceBadgeProps) {
  const cfg = BADGE_CONFIG[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: 10,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 12,
      color: cfg.color,
      background: `color-mix(in oklch, ${cfg.color} 15%, transparent)`,
      border: `1px solid color-mix(in oklch, ${cfg.color} 35%, transparent)`,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: cfg.color, marginRight: 5, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
}
