import type { ReactNode } from 'react';
import { AlertTriangle, CircleSlash, Inbox, Loader2, PlugZap } from 'lucide-react';

/**
 * Únicos estados permitidos quando não há dado real para exibir.
 * Nenhum deles substitui a informação ausente por valores fictícios.
 */
export type DataStateKind = 'loading' | 'empty' | 'error' | 'not-configured' | 'not-implemented';

const DEFAULT_TITLE: Record<DataStateKind, string> = {
  loading: 'Carregando…',
  empty: 'Nenhum registro',
  error: 'Serviço temporariamente indisponível',
  'not-configured': 'Fonte não configurada',
  'not-implemented': 'Ainda não implementado',
};

const ICON: Record<DataStateKind, ReactNode> = {
  loading: <Loader2 size={18} aria-hidden="true" className="animate-spin" />,
  empty: <Inbox size={18} aria-hidden="true" />,
  error: <AlertTriangle size={18} aria-hidden="true" />,
  'not-configured': <PlugZap size={18} aria-hidden="true" />,
  'not-implemented': <CircleSlash size={18} aria-hidden="true" />,
};

const COLOR: Record<DataStateKind, string> = {
  loading: 'var(--text-lo)',
  empty: 'var(--text-lo)',
  error: 'var(--risk-high)',
  'not-configured': 'var(--text-lo)',
  'not-implemented': 'var(--text-lo)',
};

interface DataStateProps {
  kind: DataStateKind;
  title?: string;
  children?: ReactNode;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function DataState({ kind, title, children, compact, style }: DataStateProps) {
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      data-state={kind}
      style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        padding: compact ? '10px 12px' : '16px 18px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-raised)',
        borderLeft: `3px solid ${kind === 'error' ? 'var(--risk-high)' : 'var(--bg-raised)'}`,
        borderRadius: 8,
        ...style,
      }}
    >
      <span style={{ color: COLOR[kind], flexShrink: 0, marginTop: 1 }}>{ICON[kind]}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: 'var(--text-hi)' }}>
          {title ?? DEFAULT_TITLE[kind]}
        </div>
        {children && (
          <div style={{ fontSize: 12, color: 'var(--text-lo)', marginTop: 4, lineHeight: 1.5 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
