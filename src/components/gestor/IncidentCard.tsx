import { Link } from 'react-router-dom';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getAreaById } from '@/data/areas';
import type { Incident } from '@/types/domain';

interface Props {
  incident: Incident;
}

export function IncidentCard({ incident }: Props) {
  const area = getAreaById(incident.areaId);

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
      borderRadius: 8, padding: '16px',
      borderLeft: incident.risk === 'critical' ? '3px solid var(--risk-crit)'
                : incident.risk === 'high'     ? '3px solid var(--risk-high)'
                : '3px solid var(--bg-raised)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                        fontWeight: 700, color: 'var(--text-hi)', marginBottom: 3 }}>
            {incident.id}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
            {area?.name ?? incident.areaId}
          </div>
        </div>
        <RiskBadge risk={incident.risk} size="sm" />
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-mid)', margin: '0 0 12px',
                  lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {incident.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center' }}>
        <StatusBadge status={incident.status} size="sm" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/gestor/incident/${incident.id}`} style={{
            fontSize: 12, color: 'var(--orbital)', textDecoration: 'none',
          }}>
            Detalhes
          </Link>
          <Link to="/gestor/war-room" style={{
            fontSize: 12, color: 'var(--risk-crit)', textDecoration: 'none',
          }}>
            Tática →
          </Link>
        </div>
      </div>
    </div>
  );
}
