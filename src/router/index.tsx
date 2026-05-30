import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { GestorLayout } from '@/components/layouts/GestorLayout';
import { RequireGestorAccess, RequireAdminAccess, RequireAuthenticatedAccess } from './guards';

const SplashPage          = React.lazy(() => import('@/pages/shared/SplashPage'));
const LoginPage           = React.lazy(() => import('@/pages/shared/LoginPage'));
const SelectProfilePage   = React.lazy(() => import('@/pages/shared/SelectProfilePage'));
const NotFoundPage        = React.lazy(() => import('@/pages/shared/NotFoundPage'));
const PublicDashboardPage = React.lazy(() => import('@/pages/public/PublicDashboardPage'));
const PublicMapPage       = React.lazy(() => import('@/pages/public/PublicMapPage'));
const RegisterReportPage  = React.lazy(() => import('@/pages/public/RegisterReportPage'));
const ReportStatusPage    = React.lazy(() => import('@/pages/public/ReportStatusPage'));
const GestorDashboardPage  = React.lazy(() => import('@/pages/gestor/GestorDashboardPage'));
const ReportCenterPage     = React.lazy(() => import('@/pages/gestor/ReportCenterPage'));
const ReportValidationPage = React.lazy(() => import('@/pages/gestor/ReportValidationPage'));
const WarRoomPage          = React.lazy(() => import('@/pages/gestor/WarRoomPage'));
const OrbitalMapPage       = React.lazy(() => import('@/pages/gestor/OrbitalMapPage'));
const ActiveIncidentPage   = React.lazy(() => import('@/pages/gestor/ActiveIncidentPage'));
const MobilizationPage     = React.lazy(() => import('@/pages/gestor/MobilizationPage'));
const FieldOperationPage   = React.lazy(() => import('@/pages/gestor/FieldOperationPage'));
const AuroraPage           = React.lazy(() => import('@/pages/gestor/AuroraPage'));
const ESGReportPage        = React.lazy(() => import('@/pages/gestor/ESGReportPage'));
const GestorAreaDetailPage = React.lazy(() => import('@/pages/gestor/GestorAreaDetailPage'));
const RiskRankingPage        = React.lazy(() => import('@/pages/gestor/RiskRankingPage'));
const EconomiaEspacialPage   = React.lazy(() => import('@/pages/gestor/EconomiaEspacialPage'));
const AdminPanelPage       = React.lazy(() => import('@/pages/admin/AdminPanelPage'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-void)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      border: '2px solid var(--orbital)',
      borderTopColor: 'transparent',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  { path: '/',               element: withSuspense(<SplashPage />) },
  { path: '/login',          element: withSuspense(<LoginPage />) },
  { path: '/select-profile', element: withSuspense(<SelectProfilePage />) },

  // Public area — acessível sem perfil
  {
    element: <PublicLayout />,
    children: [
      { path: '/public',                   element: withSuspense(<PublicDashboardPage />) },
      { path: '/public/map',               element: withSuspense(<PublicMapPage />) },
      { path: '/public/report',            element: withSuspense(<RegisterReportPage />) },
      { path: '/public/report/status/:id', element: withSuspense(<ReportStatusPage />) },
    ],
  },

  // War Room + Field: autenticado, qualquer perfil exceto público
  {
    element: <RequireAuthenticatedAccess />,
    children: [
      { path: '/gestor/war-room', element: withSuspense(<WarRoomPage />) },
      { path: '/gestor/field',    element: withSuspense(<FieldOperationPage />) },
    ],
  },

  // Painel gestor: requer canAccessGestorPanel (gestor, analista/orgao, admin)
  // Campo é redirecionado para /gestor/field pelo RequireGestorAccess
  {
    element: <RequireGestorAccess />,
    children: [
      {
        element: <GestorLayout />,
        children: [
          { path: '/gestor',              element: withSuspense(<GestorDashboardPage />) },
          { path: '/gestor/reports',      element: withSuspense(<ReportCenterPage />) },
          { path: '/gestor/reports/:id',  element: withSuspense(<ReportValidationPage />) },
          { path: '/gestor/incident/:id', element: withSuspense(<ActiveIncidentPage />) },
          { path: '/gestor/map',          element: withSuspense(<OrbitalMapPage />) },
          { path: '/gestor/mobilization', element: withSuspense(<MobilizationPage />) },
          { path: '/gestor/area/:id',     element: withSuspense(<GestorAreaDetailPage />) },
          { path: '/gestor/ranking',      element: withSuspense(<RiskRankingPage />) },
          { path: '/gestor/aurora',       element: withSuspense(<AuroraPage />) },
          { path: '/gestor/esg',              element: withSuspense(<ESGReportPage />) },
          { path: '/gestor/economia-espacial', element: withSuspense(<EconomiaEspacialPage />) },
        ],
      },
    ],
  },

  // Admin: requer canAccessAdminPanel (somente admin)
  {
    element: <RequireAdminAccess />,
    children: [
      { path: '/admin', element: withSuspense(<AdminPanelPage />) },
    ],
  },

  { path: '*', element: withSuspense(<NotFoundPage />) },
]);
