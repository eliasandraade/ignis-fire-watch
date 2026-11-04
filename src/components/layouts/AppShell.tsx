import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, KeyRound, LogOut, Menu, Orbit, type LucideIcon } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { clearSession } from '@/services/api/authService';
import { ROLE_LABEL } from '@/lib/roles';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface Crumb {
  label: string;
  to?: string;
}

function initials(name: string | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/**
 * Shared shell: grouped sidebar (drawer below 900 px), header with breadcrumbs.
 * Used by the operational area and by the Admin Cockpit.
 */
export function AppShell({
  context,
  groups,
  crumbs,
  headerEnd,
  children,
}: {
  context: string;
  groups: NavGroup[];
  crumbs: Crumb[];
  headerEnd?: ReactNode;
  children: ReactNode;
}) {
  const { profile, clearProfile } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const current = crumbs[crumbs.length - 1]?.label;
    document.title = current ? `${current} · IGNIS Orbital` : 'IGNIS Orbital';
  }, [crumbs]);

  const logout = () => {
    clearSession();
    clearProfile();
    navigate('/login');
  };

  return (
    <div className="ig-shell" data-nav-open={open}>
      <aside className="ig-sidebar" aria-label="Navegação principal">
        <Link to="/" className="ig-brand" aria-label="IGNIS Orbital — início">
          <span className="ig-brand-mark"><Orbit size={18} /></span>
          <span>
            <span className="ig-brand-name">IGNIS Orbital</span>
            <br />
            <span className="ig-brand-sub">by Andrade Systems</span>
          </span>
        </Link>
        <div className="ig-context">{context}</div>
        <nav className="ig-nav">
          {groups.map(group => (
            <div className="ig-nav-group" key={group.label}>
              <div className="ig-nav-label">{group.label}</div>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `ig-nav-link${isActive ? ' active' : ''}`}
                >
                  <item.icon size={17} aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="ig-account">
          <span className="ig-avatar" aria-hidden="true">{initials(profile?.name)}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ig-account-name">{profile?.name ?? 'Usuário'}</div>
            <div className="ig-account-role">{profile ? ROLE_LABEL[profile.role] ?? profile.role : '—'}</div>
          </div>
          <Link to="/conta/senha" className="ig-btn ghost icon" aria-label="Trocar senha" title="Trocar senha">
            <KeyRound size={16} />
          </Link>
          <button
            type="button"
            className="ig-btn ghost icon"
            data-testid="logout"
            onClick={logout}
            aria-label="Sair"
            title="Sair"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="ig-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="ig-main">
        <header className="ig-header">
          <button
            type="button"
            className="ig-btn ghost icon ig-menu-btn"
            onClick={() => setOpen(o => !o)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <Menu size={18} />
          </button>
          <nav aria-label="Trilha de navegação" style={{ minWidth: 0 }}>
            <ol className="ig-crumbs">
              {crumbs.map((crumb, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
                    {last || !crumb.to ? (
                      <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                    ) : (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="ig-header-end">{headerEnd}</div>
        </header>
        <main className="ig-content" id="conteudo">
          {children}
        </main>
      </div>
    </div>
  );
}
