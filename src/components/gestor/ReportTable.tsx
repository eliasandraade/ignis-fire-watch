import { Link } from 'react-router-dom';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import type { PublicReport } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';
import { OCCURRENCE_LABEL } from '@/lib/labels';

interface Props {
  reports: PublicReport[];
}

export function ReportTable({ reports }: Props) {
  const { toast } = useToast();
  const { areas } = useProtectedAreas();

  if (reports.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center',
                    color: 'var(--text-ghost)', fontSize: 14 }}>
        Nenhuma denúncia encontrada.
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-surface)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 130px 1fr 90px 120px 140px 120px',
        gap: 12, padding: '10px 16px',
        borderBottom: '1px solid var(--bg-raised)',
        fontSize: 11, color: 'var(--text-ghost)', textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        <span>ID</span>
        <span>Tipo</span>
        <span>Área</span>
        <span>Urgência</span>
        <span>Status</span>
        <span>Recebida</span>
        <span>Ações</span>
      </div>

      {/* Rows */}
      {reports.map(r => {
        const area = r.areaId ? areas.find(a => a.id === r.areaId) ?? null : null;
        return (
          <div key={r.id} style={{
            display: 'grid',
            gridTemplateColumns: '160px 130px 1fr 90px 120px 140px 120px',
            gap: 12, padding: '12px 16px',
            borderBottom: '1px solid var(--bg-raised)',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                           color: 'var(--text-lo)' }}>
              {r.id.substring(0, 20)}…
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>
              {OCCURRENCE_LABEL[r.occurrenceType] ?? r.occurrenceType}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-hi)',
                           overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {area?.name ?? r.customLocation ?? '—'}
            </span>
            <RiskBadge risk={r.urgency} size="sm" />
            <StatusBadge status={r.status} size="sm" />
            <span style={{ fontSize: 11, color: 'var(--text-ghost)',
                           fontFamily: 'JetBrains Mono, monospace' }}>
              {new Date(r.submittedAt).toLocaleDateString('pt-BR')}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Link to={`/gestor/reports/${r.id}`} style={{
                fontSize: 11, color: 'var(--orbital)', textDecoration: 'none',
                padding: '3px 8px', border: '1px solid var(--orbital)', borderRadius: 4,
              }}>
                Analisar
              </Link>
              <button
                onClick={() => toast({ title: 'Denúncia validada (protótipo)',
                                       description: r.id })}
                style={{
                  fontSize: 11, color: 'var(--risk-low)', cursor: 'pointer',
                  padding: '3px 8px',
                  border: '1px solid color-mix(in oklch, var(--risk-low) 40%, transparent)',
                  borderRadius: 4, background: 'transparent', fontFamily: 'inherit',
                }}
              >
                Validar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
