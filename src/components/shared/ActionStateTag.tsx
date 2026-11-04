import { ACTION_STATE_LABEL, type ActionState } from '@/lib/actionState';

const COLOR: Record<ActionState, string> = {
  funcional: 'var(--risk-low)',
  indisponivel: 'var(--text-ghost)',
  'nao-implementado': 'var(--text-ghost)',
  erro: 'var(--risk-crit)',
  'aguardando-confirmacao': 'oklch(70% 0.15 85)',
};

export function ActionStateTag({ state, style }: { state: ActionState; style?: React.CSSProperties }) {
  const color = COLOR[state];
  return (
    <span
      data-action-state={state}
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 12,
        color,
        border: `1px solid color-mix(in oklch, ${color} 40%, transparent)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {ACTION_STATE_LABEL[state]}
    </span>
  );
}
