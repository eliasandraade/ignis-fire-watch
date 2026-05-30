import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const NAV_ITEMS = [
  { to: '/gestor',              label: 'Dashboard',        icon: '▦',  end: true },
  { to: '/gestor/reports',      label: 'Denúncias',        icon: '📋', end: false },
  { to: '/gestor/map',          label: 'Mapa Orbital',     icon: '🗺', end: false },
  { to: '/gestor/mobilization', label: 'Mobilização',      icon: '🚒', end: false },
  { to: '/gestor/ranking',      label: 'Ranking de Risco', icon: '📊', end: false },
  { to: '/gestor/aurora',       label: 'Aurora IA',        icon: '✦',  end: false },
  { to: '/gestor/esg',               label: 'Relatório ESG',    icon: '🌿', end: false },
  { to: '/gestor/economia-espacial', label: 'Economia Espacial', icon: '🛰', end: false },
];

export function GestorSidebar() {
  const { profile, clearProfile } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearProfile();
    navigate('/select-profile');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-w)', flexShrink: 0,
      background: 'var(--bg-panel)', borderRight: '1px solid var(--bg-raised)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-raised)' }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--orbital)',
                      letterSpacing: '-0.02em' }}>IGNIS</div>
        <div style={{ fontSize: 10, color: 'var(--text-ghost)', letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginTop: 1 }}>Orbital · Gestor</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-hi)' : 'var(--text-lo)',
              textDecoration: 'none',
              borderLeft: isActive ? '3px solid var(--orbital)' : '3px solid transparent',
              background: isActive ? 'var(--orbital-dim)' : 'transparent',
              transition: 'all 0.1s',
            })}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--bg-raised)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-hi)', marginBottom: 2 }}>
          {profile?.name ?? 'Usuário'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 10,
                      textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {profile?.role ?? '—'}
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '7px 0', borderRadius: 4, border: 'none',
          background: 'var(--bg-raised)', color: 'var(--text-lo)', fontSize: 12,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Trocar Perfil
        </button>
      </div>
    </aside>
  );
}
