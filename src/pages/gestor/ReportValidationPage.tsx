import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { isApiEnabled } from '@/services/api/client';
import { useInternalReportDetail, useReportActions } from '@/hooks/useInternalReports';
import { OCCURRENCE_LABEL } from '@/lib/labels';
import { useArea } from '@/hooks/useArea';
import { useCriticalIncident } from '@/hooks/useIncidents';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Marker } from 'react-leaflet';
import { useToast } from '@/hooks/use-toast';

export default function ReportValidationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiEnabled = isApiEnabled();

  const [decision, setDecision] = useState<'none' | 'validated' | 'discarded' | 'converted'>('none');

  const { report, loading } = useInternalReportDetail(id);
  const { incident: critical } = useCriticalIncident();
  const { validate, discard, convert } = useReportActions();

  const { area } = useArea(report?.areaId ?? undefined);

  const mapCenter: [number, number] = area
    ? area.center
    : report?.coords
      ? [report.coords.lat, report.coords.lng]
      : [-4.5, -39.0];

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)' }}>Carregando denúncia...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)' }}>Denúncia não encontrada.</p>
        <Link to="/gestor/reports" style={{ color: 'var(--orbital)' }}>
          ← Central de Denúncias
        </Link>
      </div>
    );
  }

  const handleValidate = () => {
    if (apiEnabled) {
      validate.mutate(
        { id: report.id },
        {
          onSuccess: () => {
            setDecision('validated');
            toast({ title: 'Denúncia validada ✓', description: report.id });
          },
          onError: () => toast({ title: 'Erro ao validar', description: 'Tente novamente.' }),
        },
      );
    } else {
      setDecision('validated');
      toast({ title: 'Denúncia validada ✓', description: `${report.id} — protótipo` });
    }
  };

  const handleConvert = () => {
    if (apiEnabled) {
      convert.mutate(report.id, {
        onSuccess: () => {
          setDecision('converted');
          toast({ title: 'Convertida em incidente', description: 'Redirecionando à Central Tática...' });
          setTimeout(() => navigate('/gestor/war-room'), 1500);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Erro ao converter.';
          toast({ title: 'Erro ao converter', description: msg });
        },
      });
    } else {
      setDecision('converted');
      toast({ title: 'Convertida em incidente', description: 'Redirecionando à Central Tática...' });
      setTimeout(() => navigate('/gestor/war-room'), 1500);
    }
  };

  const handleDiscard = () => {
    if (apiEnabled) {
      discard.mutate(
        { id: report.id },
        {
          onSuccess: () => {
            setDecision('discarded');
            toast({ title: 'Denúncia descartada', description: report.id });
            setTimeout(() => navigate('/gestor/reports'), 1200);
          },
          onError: () => toast({ title: 'Erro ao descartar', description: 'Tente novamente.' }),
        },
      );
    } else {
      setDecision('discarded');
      toast({ title: 'Denúncia descartada', description: report.id });
      setTimeout(() => navigate('/gestor/reports'), 1200);
    }
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
                  {area?.name ?? '—'}
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
            <div style={{ height: 220 }}>
              <OrbitalMap center={mapCenter} zoom={10} darkTiles>
                {report.coords && (
                  <Marker position={[report.coords.lat, report.coords.lng]} />
                )}
              </OrbitalMap>
            </div>
          </div>

          {/* Aurora cross-reference */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orbital)',
                          textTransform: 'uppercase', letterSpacing: '0.1em',
                          marginBottom: 10 }}>
              Aurora IA · Cruzamento de Dados
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-lo)', margin: 0, lineHeight: 1.5 }}>
              {area && critical && area.id === critical.areaId
                ? `Esta denúncia está relacionada ao incidente crítico ${critical.code ?? critical.id}. Dados orbitais simulados confirmam ocorrência na área. Confiança: ${critical.confidence}%.`
                : `Sem cruzamento orbital confirmado para esta denúncia no momento. Recomenda-se verificação in loco. — Resposta simulada — protótipo demonstrativo`
              }
            </p>
          </div>
        </div>

        {/* Right: decision */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                        border: '1px solid var(--bg-raised)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)',
                          marginBottom: 8 }}>
              Recomendação Aurora
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-lo)', lineHeight: 1.5, margin: '0 0 12px' }}>
              {area?.risk === 'critical' || area?.risk === 'high'
                ? `Área de alto risco. Verificação prioritária recomendada. Confiança: 74%.`
                : `Área de risco ${area?.risk ?? 'desconhecido'}. Triagem padrão recomendada.`
              }
            </p>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
              Resposta simulada — protótipo demonstrativo
            </div>
          </div>

          {decision === 'none' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleValidate} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6,
                border: '1px solid color-mix(in oklch, var(--risk-low) 35%, transparent)',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'color-mix(in oklch, var(--risk-low) 15%, transparent)',
                color: 'var(--risk-low)', fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
              }}>
                {validate.isPending ? 'Validando...' : '✓ Validar Denúncia'}
              </button>
              <button onClick={handleConvert} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6, border: 'none',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'color-mix(in oklch, var(--risk-crit) 15%, transparent)',
                color: 'var(--risk-crit)', fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
              }}>
                {convert.isPending ? 'Convertendo...' : '⚡ Converter em Incidente'}
              </button>
              <button onClick={handleDiscard} disabled={isBusy} style={{
                padding: '12px', borderRadius: 6, border: 'none',
                cursor: isBusy ? 'default' : 'pointer',
                background: 'var(--bg-raised)', color: 'var(--text-ghost)',
                fontSize: 14, fontFamily: 'inherit', opacity: isBusy ? 0.6 : 1,
              }}>
                {discard.isPending ? 'Descartando...' : '✗ Descartar'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--bg-raised)', borderRadius: 8,
                          fontSize: 14, color: 'var(--text-mid)', textAlign: 'center' }}>
              {decision === 'validated' && '✓ Denúncia validada'}
              {decision === 'converted' && '⚡ Convertida — redirecionando...'}
              {decision === 'discarded' && '✗ Descartada — voltando...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
