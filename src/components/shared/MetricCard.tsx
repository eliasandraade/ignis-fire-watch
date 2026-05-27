import type { ReactNode } from 'react';

interface Props {
  value: string | number;
  label: string;
  unit?: string;
  delta?: string;
  icon?: ReactNode;
  accent?: string;
}

export function MetricCard({ value, label, unit, delta, icon, accent }: Props) {
  const accentColor = accent ?? 'var(--orbital)';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--bg-raised)',
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      {icon && (
        <div style={{ color: accentColor, marginBottom: 4 }}>{icon}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--text-hi)',
          lineHeight: 1,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: 'var(--text-lo)', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 500 }}>
        {label}
      </div>
      {delta && (
        <div style={{ fontSize: 11, color: accentColor, marginTop: 2 }}>
          {delta}
        </div>
      )}
    </div>
  );
}
