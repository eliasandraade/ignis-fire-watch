import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ResourceGrid } from '@/components/gestor/ResourceGrid';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataState } from '@/components/shared/DataState';
import { useTeams } from '@/hooks/useTeams';
import { useResources } from '@/hooks/useResources';
import { updateTeam } from '@/services/api/teamsService';
import { TEAM_STATUS_TO_API } from '@/services/adapters/teamAdapter';
import { useToast } from '@/hooks/use-toast';

const STATUS_DOT: Record<string, string> = {
  disponivel:   'var(--risk-low)',
  mobilizado:   'var(--risk-high)',
  'em-transito':'var(--orbital)',
  indisponivel: 'var(--text-ghost)',
};

export default function MobilizationPage() {
  const [filter, setFilter] = useState<string>('all');

  const { teams, dataSource: teamsSource } = useTeams();
  const { resources, dataSource: resourcesSource } = useResources();
  const qc = useQueryClient();
  const { toast } = useToast();

  // Filtros derivados dos tipos realmente cadastrados (nenhuma categoria inventada).
  const teamTypes = useMemo(
    () => Array.from(new Set(teams.map(t => t.type).filter(Boolean))).sort(),
    [teams],
  );

  const mobilizeMutation = useMutation({
    mutationFn: (id: string) => updateTeam(id, { status: TEAM_STATUS_TO_API.mobilizado }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: 'Status "mobilizada" registrado no IGNIS',
        description: 'Apenas o cadastro foi atualizado: nenhuma equipe real foi acionada (sem integração com despacho).',
      });
    },
    onError: (_err, id) => {
      toast({ title: 'Falha — status NÃO foi alterado', description: id, variant: 'destructive' });
    },
  });

  const filtered = filter === 'all' ? teams : teams.filter(t => t.type === filter);

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
    border: 'none', fontFamily: 'inherit',
    background: filter === key ? 'var(--orbital)' : 'var(--bg-raised)',
    color:      filter === key ? 'white'           : 'var(--text-mid)',
    fontWeight: filter === key ? 700               : 400,
  });

  const teamsLoaded = teamsSource.status === 'ok' || teamsSource.status === 'empty';

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-hi)' }}>
          Mobilização e Recursos
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '4px 0 0' }}>
          {teamsLoaded ? `${teams.length} equipes cadastradas · ` : ''}
          {teamsSource.label} · alterar status não aciona equipes reais
        </p>
      </div>

      {/* Team filter */}
      {teamTypes.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['all', ...teamTypes].map(f => (
            <button key={f} style={tabStyle(f)} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todas' : f}
            </button>
          ))}
        </div>
      )}

      {/* Team cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {teamsSource.status === 'loading' ? (
          <DataState kind="loading" title="Carregando equipes…" />
        ) : teamsSource.status === 'error' ? (
          <DataState kind="error">
            Não foi possível consultar as equipes na API. Nenhuma equipe é exibida no lugar.
          </DataState>
        ) : teams.length === 0 ? (
          <DataState kind="empty" title="Nenhuma equipe cadastrada">
            Equipes de campo cadastradas no IGNIS aparecem aqui, com o status de mobilização.
          </DataState>
        ) : filtered.map(t => (
          <div key={t.id} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-raised)',
            borderRadius: 8,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: STATUS_DOT[t.status] ?? 'var(--text-ghost)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-hi)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginTop: 3,
                            display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{t.id}</span>
                <span>{t.type}</span>
                {t.location && <span>{t.location}</span>}
              </div>
            </div>
            <StatusBadge status={t.status} size="sm" />
            <button
              onClick={() => t.status === 'disponivel' && mobilizeMutation.mutate(t.id)}
              disabled={t.status !== 'disponivel' || mobilizeMutation.isPending}
              style={{
                padding: '6px 12px', borderRadius: 4, border: 'none',
                cursor: t.status === 'disponivel' ? 'pointer' : 'default',
                background: t.status === 'disponivel' ? 'var(--orbital)' : 'var(--bg-raised)',
                color: t.status === 'disponivel' ? 'white' : 'var(--text-ghost)',
                fontSize: 11, fontFamily: 'inherit', fontWeight: 600, flexShrink: 0,
              }}
            >
              {t.status === 'disponivel' ? 'Registrar mobilização' : '—'}
            </button>
          </div>
        ))}
      </div>

      {/* Resources */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
                     textTransform: 'uppercase', letterSpacing: '0.08em',
                     marginBottom: 12 }}>
          Recursos{resourcesSource.status === 'ok' || resourcesSource.status === 'empty' ? ` (${resources.length})` : ''}
        </h2>
        {resourcesSource.status === 'loading' ? (
          <DataState kind="loading" title="Carregando recursos…" />
        ) : resourcesSource.status === 'error' ? (
          <DataState kind="error">
            Não foi possível consultar os recursos na API. Nenhum recurso é exibido no lugar.
          </DataState>
        ) : resources.length === 0 ? (
          <DataState kind="empty" title="Nenhum recurso cadastrado">
            Viaturas, aeronaves, drones e demais recursos cadastrados no IGNIS aparecem aqui.
          </DataState>
        ) : (
          <ResourceGrid resources={resources} />
        )}
      </div>
    </div>
  );
}
