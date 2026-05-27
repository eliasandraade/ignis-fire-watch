import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { GestorLayout } from '@/components/layouts/GestorLayout';
import SplashPage          from '@/pages/shared/SplashPage';
import LoginPage           from '@/pages/shared/LoginPage';
import SelectProfilePage   from '@/pages/shared/SelectProfilePage';
import NotFoundPage        from '@/pages/shared/NotFoundPage';
import PublicDashboardPage from '@/pages/public/PublicDashboardPage';
import PublicMapPage       from '@/pages/public/PublicMapPage';
import RegisterReportPage  from '@/pages/public/RegisterReportPage';
import ReportStatusPage    from '@/pages/public/ReportStatusPage';
import GestorDashboardPage  from '@/pages/gestor/GestorDashboardPage';
import ReportCenterPage     from '@/pages/gestor/ReportCenterPage';
import ReportValidationPage from '@/pages/gestor/ReportValidationPage';
import WarRoomPage          from '@/pages/gestor/WarRoomPage';
import OrbitalMapPage       from '@/pages/gestor/OrbitalMapPage';
import ActiveIncidentPage   from '@/pages/gestor/ActiveIncidentPage';
import MobilizationPage     from '@/pages/gestor/MobilizationPage';
import FieldOperationPage   from '@/pages/gestor/FieldOperationPage';
import AuroraPage           from '@/pages/gestor/AuroraPage';
import ESGReportPage        from '@/pages/gestor/ESGReportPage';

import GestorAreaDetailPage from '@/pages/gestor/GestorAreaDetailPage';
import RiskRankingPage      from '@/pages/gestor/RiskRankingPage';
import AdminPanelPage       from '@/pages/admin/AdminPanelPage';

export const router = createBrowserRouter([
  { path: '/',               element: <SplashPage /> },
  { path: '/login',          element: <LoginPage /> },
  { path: '/select-profile', element: <SelectProfilePage /> },
  {
    element: <PublicLayout />,
    children: [
      { path: '/public',                     element: <PublicDashboardPage /> },
      { path: '/public/map',                 element: <PublicMapPage /> },
      { path: '/public/report',              element: <RegisterReportPage /> },
      { path: '/public/report/status/:id',   element: <ReportStatusPage /> },
    ],
  },
  // WarRoom + Field bypass GestorLayout — must be BEFORE the nested gestor block
  { path: '/gestor/war-room', element: <WarRoomPage /> },
  { path: '/gestor/field',    element: <FieldOperationPage /> },
  {
    element: <GestorLayout />,
    children: [
      { path: '/gestor',                element: <GestorDashboardPage /> },
      { path: '/gestor/reports',        element: <ReportCenterPage /> },
      { path: '/gestor/reports/:id',    element: <ReportValidationPage /> },
      { path: '/gestor/incident/:id',   element: <ActiveIncidentPage /> },
      { path: '/gestor/map',            element: <OrbitalMapPage /> },
      { path: '/gestor/mobilization',   element: <MobilizationPage /> },
      { path: '/gestor/area/:id',       element: <GestorAreaDetailPage /> },
      { path: '/gestor/ranking',        element: <RiskRankingPage /> },
      { path: '/gestor/aurora',         element: <AuroraPage /> },
      { path: '/gestor/esg',            element: <ESGReportPage /> },
    ],
  },
  { path: '/admin', element: <AdminPanelPage /> },
  { path: '*',      element: <NotFoundPage /> },
]);
