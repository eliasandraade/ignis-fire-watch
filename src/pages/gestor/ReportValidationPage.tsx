import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Loader2, X, Zap } from 'lucide-react';
import { useInternalReportDetail, useReportActions } from '@/hooks/useInternalReports';
import { OCCURRENCE_LABEL } from '@/lib/labels';
import { useArea } from '@/hooks/useArea';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataState } from '@/components/shared/DataState';
import { ApiError } from '@/services/api/errors';
import { Marker } from 'react-leaflet';
import { useToast } from '@/hooks/use-toast';

const ICON_ROW: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6 };

export default function ReportValidationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [decision, setDecision] = useState<'none' | 'validated' | 'discarded' | 'converted'>('none');

  const { report, loading, error } = useInternalReportDetail(id);
  const { validate, discard, convert } = useReportActions();

  const { area } = useArea(report?.areaId ?? undefined);

  const backLink = (
    <Link to="/gestor/reports" style={{ color: 'var(--orbital)', fontSize: 13 }}>
      ← Central de Denúncias
    </Link>
  );

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <DataState kind="loading" title="Carregando denúncia…" />
      </div>
    );
  }

  if (!report) {
    const notFound = !error || (error instanceof ApiError && error.status === 404);
    return (
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notFound ? (
          <DataState kind="empty" title="Denúncia não encontrada">
            Nenhuma denúncia com este identificador foi encontrada na API.
          </DataState>
        ) : (
          <DataState kind="error">
            Não foi possível consultar esta denúncia na API. Tente novamente em instantes.
          </DataState>
        )}
        {backLink}
      </div>
    );
  }

  // Sem coordenadas reais, o mapa não é exibido (nenhum ponto inventado).
  const mapCenter: [number, number] | null = report.coords
    ? [report.coords.lat, report.coords.lng]
    : area?.center ?? null;

  const handleValidate = () => {
    validate.mutate(
      { id: report.id },
      {
        onSuccess: () => {
          setDecision('validated');
          toast({ title: 'Denúncia validada', description: report.id });
        },
        onError: () => toast({ title: 'Falha — denúncia NÃO foi validada', description: 'Tente novamente.', variant: 'destructive' }),
      },
    );
  };

  const handleConvert = () => {
    convert.mutate(report.id, {
      onSuccess: (created) => {
        setDecision('converted');
        // Abre o incidente efetivamente criado, não o primeiro crítico.
        const incidentId = (created as { id?: string } | undefined)?.id;
        toast({ title: 'Incidente criado no IGNIS', description: 'Nenhum órgão externo foi notificado.' });
        setTimeout(() => navigate(incidentId ? `/gestor/incident/${incidentId}` : '/gestor'), 1500);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : 'Erro ao converter.';
        toast({ title: 'Falha — incidente NÃO foi criado', description: msg, variant: 'destructive' });
      },
    });
  };

  const handleDiscard = () => {
    discard.mutate(
      { id: report.id },
      {
        onSuccess: () => {
          setDecision('discarded');
          toast({ title: 'Denúncia descartada', description: report.id });
          setTimeout(() => navigate('/gestor/reports'), 1200);
        },
        onError: () => toast({ title: 'Falha — denúncia NÃO foi descartada', description: 'Tente novamente.', variant: 'destructive' }),
      },
    );
  };

  const isBusy = validate.isPending || discard.isPending || convert.isPending;

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, fontSize: 13,
                    color: 'var(--text-mid)' }}>
        <Link to="/gestor/reports" style={{ color: 'var(--orbital)' }}>Denúncias</Link>
        <span>/</span>
        <span style={{ fontFamily: 'monospace' }}>{report.id.substring(0, 24)}…</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Left: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Report header */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
                              fontWeight: 700, color: 'var(--text-hi)', marginBottom: 4 }}>
                  {report.id}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusBadge status={report.status} />
                  <RiskBadge risk={report.urgency} size="sm" />
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-ghost)',
                            fontFamily: 'monospace' }}>
                {new Date(report.submittedAt).toLocaleString('pt-BR')}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                          marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 3 }}>
                  Tipo de Ocorrência
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-hi)', fontWeight: 500 }}>
                  {OCCURRENCE_LABEL[report.occurrenceType] ?? report.occurrenceType}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 3 }}>
                  Área Protegida
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-hi)', fontWeight: 500 }}>
                  {area?.name ?? report.customLocation ?? '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 3 }}>
                  Denunciante
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-hi)' }}>
                  {report.isAnonymous ? 'Anônimo' : report.reporterName ?? '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 3 }}>
                  Urgência Declarada
                </div>
                <RiskBadge risk={report.urgency} size="sm" />
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 }}>
              {report.description}
            </p>
          </div>

          {/* Location map */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8,
                        border: '1px solid var(--bg-raised)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bg-raised)',
                          fontSize: 12, fontWeight: 600, color: 'var(--text-mid)' }}>
              Localização
            </div>
            {mapCenter ? (
              <div style={{ height: 220 }}>
                <OrbitalMap center={mapCenter} zoom={10} darkTiles>
                  {report.coords && (
                    <Marker position={[report.coords.lat, report.coords.lng]} />
                  )}
                </OrbitalMap>
              </div>
            ) : (
              <DataState kind="empty" compact title="Sem coordenadas"
                         style={{ border: 'none', borderRadius: 0 }}>
                A denúncia não informou coordenadas nem está vinculada a uma área cadastrada.
              </DataState>
            )}
          </div>

          {/* Aurora cross-reference */}
          <DataState kind="not-implemented" title="Aurora IA · cruzamento de dados ainda não implementado">
            Não há correlação automática entre denúncias, focos orbitais e incidentes nesta versão.
            A verificação in loco continua sendo a referência.
          </DataState>
        </div>

        {/* Right: decision */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DataState kind="not-implemented" title="Recomendação automática ainda não implementada">
            A decisão de triagem é da equipe gestora.
          </DataState>

          {decision === 'none' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleValidate} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6,
                border: '1px solid color-mix(in oklch, var(--risk-low) 35%, transparent)',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'color-mix(in oklch, var(--risk-low) 15%, transparent)',
                color: 'var(--risk-low)', fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
                justifyContent: 'center', ...ICON_ROW,
              }}>
                {validate.isPending
                  ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Validando…</>
                  : <><Check size={15} aria-hidden="true" /> Validar Denúncia</>}
              </button>
              <button onClick={handleConvert} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6, border: 'none',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'color-mix(in oklch, var(--risk-crit) 15%, transparent)',
                color: 'var(--risk-crit)', fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
                justifyContent: 'center', ...ICON_ROW,
              }}>
                {convert.isPending
                  ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Convertendo…</>
                  : <><Zap size={15} aria-hidden="true" /> Converter em Incidente</>}
              </button>
              <button onClick={handleDiscard} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6, border: 'none',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'var(--bg-raised)', color: 'var(--text-ghost)',
                fontSize: 14, fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
                justifyContent: 'center', ...ICON_ROW,
              }}>
                {discard.isPending
                  ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Descartando…</>
                  : <><X size={15} aria-hidden="true" /> Descartar</>}
              </button>
            </div>
          ) : (
            <div role="status" style={{ padding: '16px', background: 'var(--bg-raised)', borderRadius: 8,
                          fontSize: 14, color: 'var(--text-mid)', justifyContent: 'center', ...ICON_ROW }}>
              {decision === 'validated' && <><Check size={15} aria-hidden="true" /> Denúncia validada</>}
              {decision === 'converted' && <><Zap size={15} aria-hidden="true" /> Convertida — redirecionando…</>}
              {decision === 'discarded' && <><X size={15} aria-hidden="true" /> Descartada — voltando…</>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
