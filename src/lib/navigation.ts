import {
  ArrowLeftRight,
  Braces,
  Compass,
  Gauge,
  History,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Satellite,
  ScrollText,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Truck,
  Users,
} from 'lucide-react';
import type { Crumb, NavGroup } from '@/components/layouts/AppShell';

export const OPERATION_NAV: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { to: '/gestor', label: 'Painel', icon: LayoutDashboard, end: true },
      { to: '/gestor/map', label: 'Mapa orbital', icon: Satellite },
      { to: '/gestor/reports', label: 'Denúncias', icon: Inbox },
      { to: '/gestor/mobilization', label: 'Mobilização', icon: Truck },
    ],
  },
  {
    label: 'Resposta',
    items: [
      { to: '/gestor/war-room', label: 'Sala de crise', icon: Siren },
      { to: '/gestor/field', label: 'Operação de campo', icon: Compass },
    ],
  },
];

export const ADMIN_GROUP: NavGroup = {
  label: 'Administração',
  items: [{ to: '/admin', label: 'Admin Cockpit', icon: ShieldCheck }],
};

const OPERATION_TITLES: Record<string, string> = {
  '/gestor': 'Painel',
  '/gestor/map': 'Mapa orbital',
  '/gestor/reports': 'Denúncias',
  '/gestor/mobilization': 'Mobilização',
};

export function crumbsFor(pathname: string): Crumb[] {
  const base: Crumb = { label: 'Operação', to: '/gestor' };
  if (OPERATION_TITLES[pathname]) return [base, { label: OPERATION_TITLES[pathname] }];
  if (pathname.startsWith('/gestor/reports/')) {
    return [base, { label: 'Denúncias', to: '/gestor/reports' }, { label: 'Validação' }];
  }
  if (pathname.startsWith('/gestor/incident/')) return [base, { label: 'Incidente' }];
  if (pathname.startsWith('/gestor/area/')) return [base, { label: 'Área protegida' }];
  return [base];
}

export const ADMIN_NAV: NavGroup[] = [
  { label: 'Visão geral', items: [{ to: '/admin', label: 'Painel', icon: Gauge, end: true }] },
  {
    label: 'Pessoas e acesso',
    items: [
      { to: '/admin/users', label: 'Usuários', icon: Users },
      { to: '/admin/permissions', label: 'Permissões', icon: KeyRound },
    ],
  },
  {
    label: 'Dados',
    items: [
      { to: '/admin/sources', label: 'Fontes de dados', icon: Satellite },
      { to: '/admin/jobs', label: 'Execuções', icon: History },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/admin/api', label: 'API e diagnóstico', icon: Braces },
      { to: '/admin/audit', label: 'Auditoria', icon: ScrollText },
      { to: '/admin/settings', label: 'Configuração', icon: SlidersHorizontal },
    ],
  },
  { label: 'Atalhos', items: [{ to: '/gestor', label: 'Voltar à operação', icon: ArrowLeftRight }] },
];

const PAGES: Record<string, string> = {
  '/admin/users': 'Usuários',
  '/admin/permissions': 'Permissões',
  '/admin/sources': 'Fontes de dados',
  '/admin/jobs': 'Execuções',
  '/admin/api': 'API e diagnóstico',
  '/admin/audit': 'Auditoria',
  '/admin/settings': 'Configuração',
};

export function adminCrumbs(pathname: string): Crumb[] {
  const root: Crumb = { label: 'Admin Cockpit', to: '/admin' };
  const page = PAGES[pathname.replace(/\/$/, '')];
  return page ? [root, { label: page }] : [{ label: 'Admin Cockpit' }, { label: 'Painel' }];
}

