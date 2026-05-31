import { Link, useLocation } from 'react-router-dom';
import { useCriticalIncident } from '@/hooks/useIncidents';

function getTitle(pathname: string): string {
  const exact: Record<string, string> = {
    '/gestor':              'Dashboard',
    '/gestor/reports':      'Central de Denúncias',
    '/gestor/map':          'Mapa Orbital',
    '/gestor/mobilization': 'Mobilização e Recursos',
    '/gestor/ranking':      'Ranking de Risco',
    '/gestor/aurora':       'Aurora IA',
    '/gestor/esg':          'Relatório ESG',
  };
  if (exact[pathname]) return exact[pathname];
  if (pathname.startsWith('/gestor/reports/'))  return 'Validação de Denúncia';
  if (pathname.startsWith('/gestor/incident/')) return 'Comando de Incidente';
  if (pathname.startsWith('/gestor/area/'))     return 'Detalhe da Área';
  return 'IGNIS Orbital';
}

export function GestorTopbar() {
  const { pathname } = useLocation();
  const { incident: critical } = useCriticalIncident();

  return (
    <div style={{
      height: 'var(--bar-h)', background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--bg-raised)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-hi)' }}>
        {getTitle(pathname)}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {critical && (
          <Link to="/gestor/war-room" style={{
            fontSize: 12, fontWeight: 700, color: 'var(--risk-crit)',
            textDecoration: 'none', padding: '4px 10px', borderRadius: 4,
            background: 'color-mix(in oklch, var(--risk-crit) 12%, transparent)',
            border: '1px solid color-mix(in oklch, var(--risk-crit) 30%, transparent)',
            animation: 'pulse-fire 2s ease-in-out infinite',
          }}>
            ⚠ Central Tática
          </Link>
        )}
        <span style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
          IGNIS Orbital · Protótipo
        </span>
      </div>
    </div>
  );
}
