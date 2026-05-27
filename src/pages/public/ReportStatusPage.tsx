import { useParams, Link } from 'react-router-dom';
import { getReportById } from '@/data/reports';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ReportStatus } from '@/types/domain';

const STATUS_STEPS: { status: ReportStatus; label: string; description: string }[] = [
  { status: 'em-triagem',          label: 'Recebida',             description: 'Sua denúncia foi recebida e está na fila de triagem.' },
  { status: 'em-triagem',          label: 'Em Triagem',           description: 'Gestores estão avaliando as informações.' },
  { status: 'validada',            label: 'Validada',             description: 'Denúncia confirmada e priorizada.' },
  { status: 'em-campo',            label: 'Equipe Despachada',    description: 'Equipe de campo enviada ao local.' },
  { status: 'convertida-incidente',label: 'Incidente Registrado', description: 'Convertida em incidente oficial no sistema.' },
];

const STATUS_ORDER: Record<ReportStatus, number> = {
  'em-triagem': 1, 'validada': 2, 'em-campo': 3,
  'convertida-incidente': 4, 'descartada': 5,
};

export default function ReportStatusPage() {
  const { id } = useParams<{ id: string }>();
  const report = id ? getReportById(id) : null;

  // If not in DB (freshly submitted), show mock em-triagem
  const status: ReportStatus = report?.status ?? 'em-triagem';
  const currentOrder = STATUS_ORDER[status] ?? 1;

  return (
    <div style={{ padding: '48px 48px', maxWidth: 680, margin: '0 auto' }}>
      {/* ID card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
                    borderRadius: 10, padding: '24px 28px', marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginBottom: 8 }}>
          Protocolo de Denúncia
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22,
                      fontWeight: 700, color: 'var(--orbital)', marginBottom: 12 }}>
          {id}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={status} />
          <span style={{ fontSize: 12, color: 'var(--text-ghost)' }}>
            {status === 'descartada'
              ? 'Denúncia descartada após verificação'
              : 'Acompanhe o status abaixo'}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)',
                   textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Andamento
      </h2>

      {status === 'descartada' ? (
        <div style={{ padding: '16px', background: 'var(--bg-surface)',
                      border: '1px solid var(--bg-raised)', borderRadius: 8,
                      fontSize: 13, color: 'var(--text-lo)' }}>
          {report?.notes ?? 'Esta denúncia foi descartada após análise pelos gestores.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STATUS_STEPS.map((step, idx) => {
            const stepOrder = idx + 1;
            const isDone    = currentOrder > stepOrder;
            const isCurrent = currentOrder === stepOrder;
            const isPending = currentOrder < stepOrder;

            return (
              <div key={idx} style={{ display: 'flex', gap: 16, paddingBottom: 20 }}>
                {/* Dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: isDone ? 'var(--risk-low)' : isCurrent ? 'var(--orbital)' : 'var(--bg-raised)',
                    border: `2px solid ${isDone ? 'var(--risk-low)' : isCurrent ? 'var(--orbital)' : 'var(--bg-raised)'}`,
                    boxShadow: isCurrent ? '0 0 8px var(--orbital)' : 'none',
                  }} />
                  {idx < STATUS_STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 20, marginTop: 4,
                                  background: isDone ? 'var(--risk-low)' : 'var(--bg-raised)' }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500,
                                color: isPending ? 'var(--text-ghost)' : 'var(--text-hi)',
                                marginBottom: 2 }}>
                    {step.label}
                  </div>
                  {!isPending && (
                    <div style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <Link to="/public/report" style={{
          padding: '10px 20px', background: 'var(--orbital)', color: 'white',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600,
        }}>
          Nova Denúncia
        </Link>
        <Link to="/public" style={{
          padding: '10px 20px', border: '1px solid var(--bg-raised)',
          color: 'var(--text-mid)', borderRadius: 6, textDecoration: 'none', fontSize: 13,
        }}>
          Início
        </Link>
      </div>
    </div>
  );
}
