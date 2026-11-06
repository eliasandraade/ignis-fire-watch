import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { homeForRole, ROLE_LABEL } from '@/lib/roles';

/**
 * Route guards mirror the API's permissions for navigation only: every
 * endpoint enforces its own role on the server, so hiding a route is never
 * the protection.
 */

function PasswordGate() {
  const { profile } = useUser();
  const { pathname } = useLocation();
  if (profile?.mustChangePassword && pathname !== '/conta/senha') {
    return <Navigate to="/conta/senha" replace />;
  }
  return <Outlet />;
}

/** Gestor panel: gestor, órgão and admin. Field teams land on their own screen. */
export function RequireGestorAccess() {
  const { profile, canAccessGestorPanel, isFieldAgent } = useUser();
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.mustChangePassword) return <Navigate to="/conta/senha" replace />;
  if (isFieldAgent) return <Navigate to="/gestor/field" replace />;
  if (!canAccessGestorPanel) return <AccessDenied />;
  return <Outlet />;
}

/** Crisis room and field operation: any authenticated operational role. */
export function RequireAuthenticatedAccess() {
  const { profile, isPublic } = useUser();
  if (!profile) return <Navigate to="/login" replace />;
  if (isPublic) return <AccessDenied />;
  return <PasswordGate />;
}

/** Signed in, whatever the role (account pages). */
export function RequireSession() {
  const { profile } = useUser();
  if (!profile) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Admin Cockpit: administrators only. */
export function RequireAdminAccess() {
  const { profile, canAccessAdminPanel } = useUser();
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.mustChangePassword) return <Navigate to="/conta/senha" replace />;
  if (!canAccessAdminPanel) return <AccessDenied />;
  return <Outlet />;
}

export function AccessDenied() {
  const { profile } = useUser();
  return (
    <div className="ig-state" style={{ minHeight: '100vh', justifyContent: 'center', background: 'var(--bg-void)' }} role="alert">
      <div className="ig-state-icon"><ShieldOff size={20} /></div>
      <h3>Acesso não permitido</h3>
      <p>
        {profile
          ? `Seu papel (${ROLE_LABEL[profile.role] ?? profile.role}) não dá acesso a esta área. Se precisar dela, peça a um administrador.`
          : 'Entre com uma conta autorizada para continuar.'}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link className="ig-btn primary" to={profile ? homeForRole(profile.role) : '/login'}>
          {profile ? 'Ir para minha área' : 'Entrar'}
        </Link>
        <Link className="ig-btn" to="/public">Portal público</Link>
      </div>
    </div>
  );
}
