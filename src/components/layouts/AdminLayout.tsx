import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from './AppShell';
import { ADMIN_NAV, adminCrumbs } from '@/lib/navigation';
import { useAdminSettings } from '@/hooks/useAdminCockpit';
import { Pill } from '@/components/admin/ui';

const ENV_LABEL: Record<string, string> = {
  production: 'Produção',
  staging: 'Homologação',
  development: 'Desenvolvimento',
  test: 'Teste',
};

function EnvironmentBadge() {
  const { data } = useAdminSettings();
  const env = data?.application.environment as string | undefined;
  if (!env) return null;
  return <Pill tone={env === 'production' ? 'err' : 'info'}>{ENV_LABEL[env] ?? env}</Pill>;
}

export function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell
      context="Admin Cockpit"
      groups={ADMIN_NAV}
      crumbs={adminCrumbs(pathname)}
      headerEnd={<EnvironmentBadge />}
    >
      <Outlet />
    </AppShell>
  );
}
