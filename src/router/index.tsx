import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { GestorLayout } from '@/components/layouts/GestorLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import {
  RequireAdminAccess,
  RequireAuthenticatedAccess,
  RequireGestorAccess,
  RequireSession,
} from './guards';

const SplashPage          = React.lazy(() => import('@/pages/shared/SplashPage'));
const LoginPage           = React.lazy(() => import('@/pages/shared/LoginPage'));
const ChangePasswordPage  = React.lazy(() => import('@/pages/shared/ChangePasswordPage'));
const NotFoundPage        = React.lazy(() => import('@/pages/shared/NotFoundPage'));
const PrivacyPage         = React.lazy(() => import('@/pages/shared/PrivacyPage'));
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
const GestorAreaDetailPage = React.lazy(() => import('@/pages/gestor/GestorAreaDetailPage'));
const AdminOverviewPage    = React.lazy(() => import('@/pages/admin/AdminOverviewPage'));
const AdminUsersPage       = React.lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminPermissionsPage = React.lazy(() => import('@/pages/admin/AdminPermissionsPage'));
const AdminSourcesPage     = React.lazy(() => import('@/pages/admin/AdminSourcesPage'));
const AdminJobsPage        = React.lazy(() => import('@/pages/admin/AdminJobsPage'));
const AdminApiPage         = React.lazy(() => import('@/pages/admin/AdminApiPage'));
const AdminAuditPage       = React.lazy(() => import('@/pages/admin/AdminAuditPage'));
const AdminSettingsPage    = React.lazy(() => import('@/pages/admin/AdminSettingsPage'));

// Not routed (not part of the operational product): Aurora (assistant),
// ESG report, space economy and risk ranking. Their code stays in the
// repository but is not bundled; see docs/IGNIS/PRODUCT-PROFESSIONALIZATION.md.

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-void)',
  }} aria-busy="true">
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      border: '2px solid var(--orbital)',
      borderTopColor: 'transparent',
      animation: 'spin 0.7s linear infinite',
    }} />
    <span className="ig-sr">Carregando</span>
  </div>
);

const page = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  { path: '/',               element: page(<SplashPage />) },
  { path: '/login',          element: page(<LoginPage />) },
  // The demonstration profile picker no longer exists.
  { path: '/select-profile', element: <Navigate to="/login" replace /> },

  {
    element: <PublicLayout />,
    children: [
      { path: '/public',                   element: page(<PublicDashboardPage />) },
      { path: '/public/map',               element: page(<PublicMapPage />) },
      { path: '/public/report',            element: page(<RegisterReportPage />) },
      { path: '/public/report/status/:id', element: page(<ReportStatusPage />) },
      { path: '/privacidade',              element: page(<PrivacyPage />) },
    ],
  },

  {
    element: <RequireSession />,
    children: [{ path: '/conta/senha', element: page(<ChangePasswordPage />) }],
  },

  {
    element: <RequireAuthenticatedAccess />,
    children: [
      { path: '/gestor/war-room', element: page(<WarRoomPage />) },
      { path: '/gestor/field',    element: page(<FieldOperationPage />) },
    ],
  },

  {
    element: <RequireGestorAccess />,
    children: [
      {
        element: <GestorLayout />,
        children: [
          { path: '/gestor',              element: page(<GestorDashboardPage />) },
          { path: '/gestor/reports',      element: page(<ReportCenterPage />) },
          { path: '/gestor/reports/:id',  element: page(<ReportValidationPage />) },
          { path: '/gestor/incident/:id', element: page(<ActiveIncidentPage />) },
          { path: '/gestor/map',          element: page(<OrbitalMapPage />) },
          { path: '/gestor/mobilization', element: page(<MobilizationPage />) },
          { path: '/gestor/area/:id',     element: page(<GestorAreaDetailPage />) },
        ],
      },
    ],
  },

  {
    element: <RequireAdminAccess />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',             element: page(<AdminOverviewPage />) },
          { path: '/admin/users',       element: page(<AdminUsersPage />) },
          { path: '/admin/permissions', element: page(<AdminPermissionsPage />) },
          { path: '/admin/sources',     element: page(<AdminSourcesPage />) },
          { path: '/admin/jobs',        element: page(<AdminJobsPage />) },
          { path: '/admin/api',         element: page(<AdminApiPage />) },
          { path: '/admin/audit',       element: page(<AdminAuditPage />) },
          { path: '/admin/settings',    element: page(<AdminSettingsPage />) },
        ],
      },
    ],
  },

  { path: '*', element: page(<NotFoundPage />) },
]);
