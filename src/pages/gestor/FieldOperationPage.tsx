import { Link } from 'react-router-dom';
import { AlertTriangle, Camera, ChevronRight, MapPin, Send } from 'lucide-react';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { useCriticalIncident } from '@/hooks/useIncidents';
import { useMissions } from '@/hooks/useMissions';
import { useArea } from '@/hooks/useArea';
import { ActionStateTag } from '@/components/shared/ActionStateTag';
import { DataState } from '@/components/shared/DataState';

const SHELL: React.CSSProperties = {
  maxWidth: 390, margin: '0 auto', minHeight: '100vh',
  background: 'var(--bg-void)', paddingBottom: 48,
};

const DISABLED_ACTION: React.CSSProperties = {
  width: '100%', minHeight: 48, borderRadius: 8, cursor: 'not-allowed',
  background: 'var(--bg-raised)', color: 'var(--text-ghost)',
  border: '1px solid var(--bg-raised)', fontSize: 14, fontWeight: 600,
  fontFamily: 'inherit', marginBottom: 10, opacity: 0.7,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
};

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: 'var(--bg-panel)',
                  borderBottom: '1px solid var(--bg-raised)', position: 'sticky',
                  top: 0, zIndex: 10 }}>
      <Link to="/gestor/mobilization" style={{
        color: 'var(--orbital)', textDecoration: 'none', fontSize: 14,
        fontWeight: 600, padding: '6px 0',
      }}>
        ← Operações
      </Link>
      <span style={{ fontSize: 12, color: 'var(--text-ghost)', marginLeft: 'auto' }}>
        Operação de Campo
      </span>
    </div>
  );
}

export default function FieldOperationPage() {
  const { incident, loading: incidentLoading, error: incidentError } = useCriticalIncident();
  const { missions, dataSource: missionsSource } = useMissions(incident?.id);
  const { area } = useArea(incident?.areaId || undefined);
  const mission = incident ? missions[0] : undefined;

  let state: React.ReactNode = null;
  if (incidentLoading) {
    state = <DataState kind="loading" title="Carregando incidente…" />;
  } else if (incidentError) {
    state = (
      <DataState kind="error">
        Não foi possível consultar os incidentes na API. Nenhuma missão é exibida no lugar.
      </DataState>
    );
  } else if (!incident) {
    state = (
      <DataState kind="empty" title="Nenhum incidente crítico ativo">
        A operação de campo mostra a missão vinculada ao incidente crítico em andamento.
      </DataState>
    );
  } else if (missionsSource.status === 'loading') {
    state = <DataState kind="loading" title="Carregando missões…" />;
  } else if (missionsSource.status === 'error') {
    state = (
      <DataState kind="error">
        Não foi possível consultar as missões na API.
      </DataState>
    );
  } else if (!mission) {
    state = (
      <DataState kind="empty" title="Nenhuma missão registrada">
        Missões cadastradas para o incidente {incident.code ?? incident.id} aparecem aqui.
      </DataState>
    );
  }

  if (state) {
    return (
      <div style={SHELL}>
        <Header />
        <div style={{ padding: 16 }}>{state}</div>
      </div>
    );
  }

  // Aqui `mission` está definido (todos os outros casos retornaram acima).
  const m = mission!;

  return (
    <div style={SHELL}>
      <Header />

      <div style={{ padding: '16px 16px 0' }}>
        {/* Mission card */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                      border: '1px solid var(--bg-raised)', marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--orbital)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginBottom: 6 }}>
            {m.type} · {m.id}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-hi)',
                        marginBottom: 10 }}>
            {m.title}
          </div>

          {m.objectives.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-ghost)',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            marginBottom: 6 }}>
                Objetivos
              </div>
              {m.objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4,
                                      fontSize: 13, color: 'var(--text-mid)' }}>
                  <ChevronRight size={14} aria-hidden="true" style={{ color: 'var(--orbital)', flexShrink: 0, marginTop: 2 }} />
                  {obj}
                </div>
              ))}
            </div>
          )}

          {m.notes && (
            <div style={{ padding: '10px 12px', background: 'oklch(70% 0.18 45 / 10%)',
                          border: '1px solid oklch(70% 0.18 45 / 25%)', borderRadius: 5,
                          fontSize: 12, color: 'oklch(80% 0.12 60)', lineHeight: 1.4,
                          display: 'flex', gap: 6 }}>
              <AlertTriangle size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
              {m.notes}
            </div>
          )}
        </div>

        {/* Location map: só com a área real do incidente */}
        {area?.center ? (
          <div style={{ borderRadius: 8, overflow: 'hidden',
                        border: '1px solid var(--bg-raised)', marginBottom: 16 }}>
            <div style={{ height: 200 }}>
              <OrbitalMap center={area.center} zoom={12} darkTiles zoomControl={false} />
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--bg-panel)',
                          fontSize: 11, color: 'var(--text-ghost)',
                          fontFamily: 'JetBrains Mono, monospace' }}>
              {area.name} · {area.center[0].toFixed(5)}, {area.center[1].toFixed(5)}
            </div>
          </div>
        ) : (
          <DataState kind="empty" compact title="Localização indisponível" style={{ marginBottom: 16 }}>
            O incidente não tem área cadastrada com geometria; nenhuma posição é estimada.
          </DataState>
        )}

        {/* Ações de campo: ainda sem registro no backend → desabilitadas */}
        <button disabled style={DISABLED_ACTION}>
          <MapPin size={16} aria-hidden="true" /> Cheguei ao Local
        </button>
        <button disabled style={DISABLED_ACTION}>
          <Camera size={16} aria-hidden="true" /> Anexar Evidência
        </button>
        <button disabled style={DISABLED_ACTION}>
          <Send size={16} aria-hidden="true" /> Enviar Relatório de Campo
        </button>

        <div style={{ marginTop: 4, textAlign: 'center' }}>
          <ActionStateTag state="nao-implementado" />
        </div>

        <DataState kind="not-implemented" title="Registro de campo ainda não implementado" style={{ marginTop: 16 }}>
          Check-in no local, anexos e relatórios de campo ainda não são registrados pela API.
          As ações ficam desabilitadas até essa integração existir.
        </DataState>
      </div>
    </div>
  );
}
