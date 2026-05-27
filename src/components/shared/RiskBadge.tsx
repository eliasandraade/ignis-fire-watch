import type { RiskLevel } from '@/types/domain';

interface Props {
  risk: RiskLevel;
  size?: 'sm' | 'md';
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  critical: { label: 'Crítico', color: 'var(--risk-crit)' },
  high:     { label: 'Alto',    color: 'var(--risk-high)' },
  medium:   { label: 'Médio',   color: 'var(--risk-med)'  },
  low:      { label: 'Baixo',   color: 'var(--risk-low)'  },
};

export function RiskBadge({ risk, size = 'md' }: Props) {
  const cfg = RISK_CONFIG[risk] ?? { label: risk, color: 'var(--text-ghost)' };
  const pad = size === 'sm' ? '2px 7px' : '3px 10px';
  const fs  = size === 'sm' ? 11 : 12;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: pad,
      borderRadius: 4,
      fontSize: fs,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: cfg.color,
      background: `color-mix(in oklch, ${cfg.color} 15%, transparent)`,
      border: `1px solid color-mix(in oklch, ${cfg.color} 35%, transparent)`,
    }}>
      {cfg.label}
    </span>
  );
}
