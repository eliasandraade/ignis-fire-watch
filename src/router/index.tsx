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

// Placeholder component for pages not yet implemented
const Placeholder = ({ name }: { name: string }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', background: 'var(--bg-void)', color: 'var(--text-mid)',
    flexDirection: 'column', gap: 12, fontFamily: 'Space Grotesk, sans-serif',
  }}>
    <div style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.1em',
                  textTransform: 'uppercase' }}>IGNIS Orbital</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-hi)' }}>{name}</div>
    <div style={{ fontSize: 12, color: 'var(--text-ghost)' }}>Em implementação…</div>
  </div>
);
const ActiveIncidentPage   = () => <Placeholder name="Comando de Incidente" />;
const OrbitalMapPage       = () => <Placeholder name="Mapa Orbital" />;
const MobilizationPage     = () => <Placeholder name="Mobilização" />;
const GestorAreaDetailPage = () => <Placeholder name="Detalhe da Área" />;
const RiskRankingPage      = () => <Placeholder name="Ranking de Risco" />;
const AuroraPage           = () => <Placeholder name="Aurora IA" />;
const ESGReportPage        = () => <Placeholder name="Relatório ESG" />;
const FieldOperationPage   = () => <Placeholder name="Operação de Campo" />;
const AdminPanelPage       = () => <Placeholder name="Painel Administrativo" />;

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
