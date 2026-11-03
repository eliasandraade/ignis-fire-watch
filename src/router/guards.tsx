import { Navigate, Outlet, Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { isApiEnabled } from '@/services/api/client';

/** Where to send users without a valid profile: login with the real API, profile picker in demo. */
export function entryRoute(): string {
  return isApiEnabled() ? '/login' : '/select-profile';
}

/**
 * Redireciona para /select-profile se nenhum perfil estiver ativo.
 * Campo é redirecionado para /gestor/field (sua rota nativa).
 * Público é redirecionado para /select-profile.
 */
export function RequireGestorAccess() {
  const { profile, canAccessGestorPanel, isFieldAgent } = useUser();

  if (!profile)             return <Navigate to={entryRoute()} replace />;
  if (isFieldAgent)         return <Navigate to="/gestor/field"   replace />;
  if (!canAccessGestorPanel) return <Navigate to={entryRoute()} replace />;

  return <Outlet />;
}

/**
 * Para War Room e Field: aceita qualquer perfil autenticado exceto público.
 */
export function RequireAuthenticatedAccess() {
  const { profile, isPublic } = useUser();

  if (!profile || isPublic) return <Navigate to={entryRoute()} replace />;
  return <Outlet />;
}

/**
 * Admin panel: exibe tela de acesso restrito se não for admin.
 * Não redireciona — mostra mensagem para facilitar navegação no pitch.
 */
export function RequireAdminAccess() {
  const { profile, canAccessAdminPanel } = useUser();

  if (!canAccessAdminPanel) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', background: 'var(--bg-void)',
        gap: 20, padding: 24,
      }}>
        <div style={{ fontSize: 32 }}>🔒</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
          Acesso Restrito
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-lo)', textAlign: 'center', maxWidth: 360 }}>
          {profile
            ? `O perfil "${profile.role}" não tem permissão para acessar o painel administrativo.`
            : 'Nenhum perfil ativo. Selecione um perfil para continuar.'}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Link to={entryRoute()} style={{
            padding: '10px 20px', background: 'var(--orbital)', color: 'white',
            borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600,
          }}>
            {isApiEnabled() ? 'Entrar' : 'Selecionar Perfil'}
          </Link>
          <Link to="/gestor" style={{
            padding: '10px 20px', border: '1px solid var(--bg-raised)',
            color: 'var(--text-mid)', borderRadius: 6, textDecoration: 'none', fontSize: 13,
          }}>
            Painel Gestor
          </Link>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginTop: 8 }}>
          Protótipo demonstrativo FIAP GS 2026
        </div>
      </div>
    );
  }

  return <Outlet />;
}
