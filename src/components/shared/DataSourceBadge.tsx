import type { DataSourceStatus } from '@/services/dataSource';
import { getDataSourceLabel } from '@/services/dataSource';

interface DataSourceBadgeProps {
  status: DataSourceStatus;
  style?: React.CSSProperties;
}

const BADGE_COLOR: Record<DataSourceStatus, string> = {
  loading: 'oklch(60% 0.02 250)',
  ok:      'oklch(65% 0.15 145)',
  empty:   'oklch(68% 0.05 250)',
  error:   'oklch(70% 0.15 50)',
};

export function DataSourceBadge({ status, style }: DataSourceBadgeProps) {
  const color = BADGE_COLOR[status];

  return (
    <span
      data-source-status={status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 12,
        color,
        background: `color-mix(in oklch, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in oklch, ${color} 35%, transparent)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color, marginRight: 5, flexShrink: 0,
      }} />
      {getDataSourceLabel(status)}
    </span>
  );
}
