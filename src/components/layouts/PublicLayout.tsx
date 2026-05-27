import { Outlet, Link, useLocation } from 'react-router-dom';

export function PublicLayout() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => {
    const active = pathname === to || (to !== '/public' && pathname.startsWith(to));
    return (
      <Link to={to} style={{
        fontSize: 13, fontWeight: 500,
        color: active ? 'var(--orbital)' : 'var(--text-mid)',
        textDecoration: 'none', padding: '4px 0',
        borderBottom: active ? '1px solid var(--orbital)' : '1px solid transparent',
      }}>
        {label}
      </Link>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px', height: 52,
        background: 'oklch(10% 0.022 240 / 92%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--bg-raised)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/public" style={{ textDecoration: 'none', display: 'flex',
                                    alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--orbital)',
                         letterSpacing: '-0.02em' }}>IGNIS</span>
          <span style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.1em',
                         textTransform: 'uppercase', marginTop: 1 }}>Orbital</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navLink('/public', 'Painel')}
          {navLink('/public/map', 'Mapa')}
          {navLink('/public/report', 'Registrar Denúncia')}
          <Link to="/login" style={{
            fontSize: 12, color: 'var(--text-ghost)', textDecoration: 'none',
            padding: '5px 12px', border: '1px solid var(--bg-raised)', borderRadius: 4,
          }}>
            Área Restrita
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
