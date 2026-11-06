import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AlertTriangle, CircleSlash, Inbox, Loader2, RefreshCw, X } from 'lucide-react';
import { describeError } from '@/lib/apiErrors';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="ig-page-head">
      <div>
        <h1 className="ig-page-title">{title}</h1>
        {description && <p className="ig-page-desc">{description}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  icon,
  note,
  actions,
  children,
  flush,
}: {
  title?: ReactNode;
  icon?: ReactNode;
  note?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="ig-panel">
      {(title || actions) && (
        <header className="ig-panel-head">
          <div>
            {title && (
              <h2 className="ig-panel-title">
                {icon}
                {title}
              </h2>
            )}
            {note && <div className="ig-panel-note" style={{ marginTop: 3 }}>{note}</div>}
          </div>
          {actions}
        </header>
      )}
      {flush ? children : <div className="ig-panel-body">{children}</div>}
    </section>
  );
}

export function Stat({
  label,
  value,
  foot,
  icon,
  tone,
}: {
  label: string;
  value: ReactNode;
  foot?: ReactNode;
  icon?: ReactNode;
  tone?: 'ok' | 'warn' | 'err';
}) {
  const color = tone ? `var(--ig-${tone})` : undefined;
  return (
    <div className="ig-panel ig-stat">
      <div className="ig-stat-label">
        {icon}
        {label}
      </div>
      <div className="ig-stat-value" style={{ color }}>{value}</div>
      {foot && <div className="ig-stat-foot">{foot}</div>}
    </div>
  );
}

export type Tone = 'ok' | 'warn' | 'err' | 'info' | 'muted';

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`ig-pill ${tone}`}>{children}</span>;
}

export function EmptyState({
  title,
  children,
  icon,
  action,
}: {
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="ig-state" role="status">
      <div className="ig-state-icon">{icon ?? <Inbox size={20} />}</div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { title, detail } = describeError(error);
  return (
    <div className="ig-state" role="alert">
      <div className="ig-state-icon" style={{ color: 'var(--ig-err)' }}>
        <AlertTriangle size={20} />
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
      {onRetry && (
        <button type="button" className="ig-btn sm" onClick={onRetry}>
          <RefreshCw size={14} /> Tentar novamente
        </button>
      )}
    </div>
  );
}

export function NotAvailable({ title, children }: { title: string; children: ReactNode }) {
  return (
    <EmptyState title={title} icon={<CircleSlash size={20} />}>
      {children}
    </EmptyState>
  );
}

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: number | string }) {
  return <div className="ig-skel" style={{ height, width }} aria-hidden="true" />;
}

export function LoadingBlock({ rows = 4, label = 'Carregando' }: { rows?: number; label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }} aria-busy="true">
      <span className="ig-sr">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={18} width={`${92 - i * 9}%`} />
      ))}
    </div>
  );
}

export function Callout({
  tone = 'info',
  icon,
  children,
}: {
  tone?: 'info' | 'warn' | 'err' | 'ok';
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`ig-callout ${tone === 'info' ? '' : tone}`} role={tone === 'err' ? 'alert' : undefined}>
      {icon}
      <div>{children}</div>
    </div>
  );
}

export function Pager({
  page,
  pages,
  total,
  onPage,
  noun = 'registros',
}: {
  page: number;
  pages: number;
  total: number;
  onPage: (page: number) => void;
  noun?: string;
}) {
  return (
    <nav className="ig-pager" aria-label="Paginação">
      <span>
        {total.toLocaleString('pt-BR')} {noun} · página {Math.min(page, Math.max(pages, 1))} de{' '}
        {Math.max(pages, 1)}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" className="ig-btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Anterior
        </button>
        <button
          type="button"
          className="ig-btn sm"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  // The hint stays outside the <label>: inside, it became part of the field's
  // accessible name (screen readers read it twice; "e-mail" in a password hint
  // made the password field answer to "E-mail").
  return (
    <div className="ig-field">
      <label className="ig-field-control">
        <span className="ig-field-label">{label}</span>
        {children}
      </label>
      {error ? (
        <small className="ig-error" role="alert">{error}</small>
      ) : (
        hint && <small>{hint}</small>
      )}
    </div>
  );
}

/** Modal dialog with focus trap-lite: focuses the first field, Esc closes. */
export function Dialog({
  title,
  description,
  onClose,
  children,
  footer,
}: {
  title: string;
  description?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
  footer: ReactNode;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('input, select, textarea, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="ig-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="ig-dialog" role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}>
        <div className="ig-dialog-head">
          <h2 id={id}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {children && <div className="ig-dialog-body">{children}</div>}
        <div className="ig-dialog-foot">{footer}</div>
      </div>
    </div>
  );
}

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const id = useId();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.ig-overlay')) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className="ig-drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="ig-drawer" role="dialog" aria-modal="true" aria-labelledby={id}>
        <div className="ig-drawer-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id={id} style={{ margin: 0, fontSize: 17 }}>{title}</h2>
            {subtitle && <div className="ig-sub" style={{ marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button type="button" className="ig-btn ghost icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="ig-drawer-body">{children}</div>
      </aside>
    </>
  );
}

export function Spinner({ size = 14 }: { size?: number }) {
  return <Loader2 size={size} style={{ animation: 'spin .8s linear infinite' }} aria-hidden="true" />;
}
