import { Link, Outlet, useLocation } from 'react-router-dom';
import { Siren } from 'lucide-react';
import { AppShell } from './AppShell';
import { ADMIN_GROUP, OPERATION_NAV, crumbsFor } from '@/lib/navigation';
import { useUser } from '@/context/UserContext';
import { useCriticalIncident } from '@/hooks/useIncidents';

function CriticalIncidentLink() {
  const { incident } = useCriticalIncident();
  if (!incident) return null;
  return (
    <Link to="/gestor/war-room" className="ig-btn sm danger" title={incident.code ?? incident.description}>
      <Siren size={14} /> Incidente crítico ativo
    </Link>
  );
}

export function GestorLayout() {
  const { pathname } = useLocation();
  const { isAdmin } = useUser();
  return (
    <AppShell
      context="Operação"
      groups={isAdmin ? [...OPERATION_NAV, ADMIN_GROUP] : OPERATION_NAV}
      crumbs={crumbsFor(pathname)}
      headerEnd={<CriticalIncidentLink />}
    >
      <Outlet />
    </AppShell>
  );
}
