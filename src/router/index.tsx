import { createBrowserRouter, Outlet } from 'react-router-dom';
import React from 'react';

// Placeholder component for pages not yet implemented
const Placeholder = ({ name }: { name: string }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-mid)',
    flexDirection: 'column', gap: 12, fontFamily: 'Space Grotesk, sans-serif',
  }}>
    <div style={{ fontSize: 13, color: 'var(--text-ghost)', letterSpacing: '0.1em',
                  textTransform: 'uppercase' }}>IGNIS Orbital</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-hi)' }}>{name}</div>
    <div style={{ fontSize: 12, color: 'var(--text-ghost)' }}>Em implementação...</div>
  </div>
);

// All pages start as placeholders — will be replaced phase by phase
const SplashPage = () => <Placeholder name="Splash" />;
const LoginPage = () => <Placeholder name="Login" />;
const SelectProfilePage = () => <Placeholder name="Selecionar Perfil" />;
const NotFoundPage = () => <Placeholder name="404 — Não Encontrado" />;

// Public pages
const PublicDashboardPage = () => <Placeholder name="Portal Público" />;
const PublicMapPage = () => <Placeholder name="Mapa Público" />;
const RegisterReportPage = () => <Placeholder name="Registrar Denúncia" />;
const ReportStatusPage = () => <Placeholder name="Status da Denúncia" />;

// Gestor pages
const GestorDashboardPage = () => <Placeholder name="Dashboard Gestor" />;
const ReportCenterPage = () => <Placeholder name="Central de Denúncias" />;
const ReportValidationPage = () => <Placeholder name="Validação de Denúncia" />;
const ActiveIncidentPage = () => <Placeholder name="Comando de Incidente" />;
const OrbitalMapPage = () => <Placeholder name="Mapa Orbital" />;
const MobilizationPage = () => <Placeholder name="Mobilização" />;
const GestorAreaDetailPage = () => <Placeholder name="Detalhe da Área" />;
const RiskRankingPage = () => <Placeholder name="Ranking de Risco" />;
const AuroraPage = () => <Placeholder name="Aurora IA" />;
const ESGReportPage = () => <Placeholder name="Relatório ESG" />;
const WarRoomPage = () => <Placeholder name="Central Tática Ambiental" />;
const FieldOperationPage = () => <Placeholder name="Operação de Campo" />;

// Admin
const AdminPanelPage = () => <Placeholder name="Painel Administrativo" />;

// Layout placeholders
const PublicLayout = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
    <nav style={{ padding: '12px 24px', background: 'var(--bg-panel)',
                  borderBottom: '1px solid var(--bg-raised)',
                  display: 'flex', gap: 24, alignItems: 'center' }}>
      <span style={{ fontWeight: 700, color: 'var(--orbital)', fontSize: 16 }}>
        IGNIS
      </span>
    </nav>
    {children}
  </div>
);

const GestorLayout = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex' }}>
    <aside style={{ width: 218, background: 'var(--bg-panel)',
                    borderRight: '1px solid var(--bg-raised)', flexShrink: 0 }} />
    <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
  </div>
);

const PublicLayoutOutlet = () => <PublicLayout><Outlet /></PublicLayout>;
const GestorLayoutOutlet = () => <GestorLayout><Outlet /></GestorLayout>;

export const router = createBrowserRouter([
  { path: '/', element: <SplashPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/select-profile', element: <SelectProfilePage /> },
  {
    element: <PublicLayoutOutlet />,
    children: [
      { path: '/public', element: <PublicDashboardPage /> },
      { path: '/public/map', element: <PublicMapPage /> },
      { path: '/public/report', element: <RegisterReportPage /> },
      { path: '/public/report/status/:id', element: <ReportStatusPage /> },
    ],
  },
  // WarRoom and Field bypass GestorLayout — registered BEFORE nested gestor routes
  { path: '/gestor/war-room', element: <WarRoomPage /> },
  { path: '/gestor/field', element: <FieldOperationPage /> },
  {
    element: <GestorLayoutOutlet />,
    children: [
      { path: '/gestor', element: <GestorDashboardPage /> },
      { path: '/gestor/reports', element: <ReportCenterPage /> },
      { path: '/gestor/reports/:id', element: <ReportValidationPage /> },
      { path: '/gestor/incident/:id', element: <ActiveIncidentPage /> },
      { path: '/gestor/map', element: <OrbitalMapPage /> },
      { path: '/gestor/mobilization', element: <MobilizationPage /> },
      { path: '/gestor/area/:id', element: <GestorAreaDetailPage /> },
      { path: '/gestor/ranking', element: <RiskRankingPage /> },
      { path: '/gestor/aurora', element: <AuroraPage /> },
      { path: '/gestor/esg', element: <ESGReportPage /> },
    ],
  },
  { path: '/admin', element: <AdminPanelPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
