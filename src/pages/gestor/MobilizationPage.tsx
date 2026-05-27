import { useState } from 'react';
import { ResourceGrid } from '@/components/gestor/ResourceGrid';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TEAMS, RESOURCES } from '@/data/operations';
import { useToast } from '@/hooks/use-toast';
import type { FieldTeam } from '@/types/domain';

type TeamFilter = 'all' | 'Combate' | 'Reconhecimento' | 'Apoio Logístico';

export default function MobilizationPage() {
  const [filter, setFilter]     = useState<TeamFilter>('all');
  const [teams, setTeams]       = useState<FieldTeam[]>(TEAMS);
  const { toast } = useToast();

  const filtered = filter === 'all' ? teams : teams.filter(t => t.type === filter);

  const handleMobilize = (id: string) => {
    setTeams(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'mobilizado' as const } : t
    ));
    toast({ title: 'Equipe mobilizada (protótipo)', description: id });
  };

  const tabStyle = (key: TeamFilter): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
    border: 'none', fontFamily: 'inherit',
    background: filter === key ? 'var(--orbital)' : 'var(--bg-raised)',
    color:      filter === key ? 'white'           : 'var(--text-mid)',
    fontWeight: filter === key ? 700               : 400,
  });

  const STATUS_DOT: Record<string, string> = {
    disponivel:   'var(--risk-low)',
    mobilizado:   'var(--risk-high)',
    'em-transito':'var(--orbital)',
    indisponivel: 'var(--text-ghost)',
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-hi)' }}>
          Mobilização e Recursos
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '4px 0 0' }}>
          {teams.length} equipes cadastradas · Protótipo demonstrativo
        </p>
      </div>

      {/* Team filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'Combate', 'Reconhecimento', 'Apoio Logístico'] as TeamFilter[]).map(f => (
          <button key={f} style={tabStyle(f)} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Todas' : f}
          </button>
        ))}
      </div>

      {/* Team cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {filtered.map(t => (
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
                <span>{t.members} membros</span>
                {t.location && <span>{t.location}</span>}
              </div>
            </div>
            <StatusBadge status={t.status} size="sm" />
            <button
              onClick={() => t.status === 'disponivel' && handleMobilize(t.id)}
              disabled={t.status !== 'disponivel'}
              style={{
                padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
                background: t.status === 'disponivel' ? 'var(--orbital)' : 'var(--bg-raised)',
                color: t.status === 'disponivel' ? 'white' : 'var(--text-ghost)',
                fontSize: 11, fontFamily: 'inherit', fontWeight: 600, flexShrink: 0,
              }}
            >
              {t.status === 'disponivel' ? 'Mobilizar' : '—'}
            </button>
          </div>
        ))}
      </div>

      {/* Resources */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
                     textTransform: 'uppercase', letterSpacing: '0.08em',
                     marginBottom: 12 }}>
          Recursos ({RESOURCES.length})
        </h2>
        <ResourceGrid resources={RESOURCES} />
      </div>
    </div>
  );
}
