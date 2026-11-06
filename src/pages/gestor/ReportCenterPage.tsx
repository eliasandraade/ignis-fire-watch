import { useState } from 'react';
import { ReportTable } from '@/components/gestor/ReportTable';
import { useInternalReports } from '@/hooks/useInternalReports';
import { DataState } from '@/components/shared/DataState';
import type { ReportStatus } from '@/types/domain';

const TABS: { key: ReportStatus | 'all'; label: string }[] = [
  { key: 'all',                  label: 'Todas' },
  { key: 'em-triagem',           label: 'Em Triagem' },
  { key: 'validada',             label: 'Validadas' },
  { key: 'em-campo',             label: 'Em Campo' },
  { key: 'descartada',           label: 'Descartadas' },
];

export default function ReportCenterPage() {
  const [activeTab, setActiveTab] = useState<ReportStatus | 'all'>('all');
  const [search, setSearch]       = useState('');
  const { reports, dataSource } = useInternalReports();

  const filtered = reports
    .filter(r => activeTab === 'all' || r.status === activeTab)
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return r.id.toLowerCase().includes(q)
          || r.occurrenceType.toLowerCase().includes(q)
          || r.description.toLowerCase().includes(q);
    });

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: '6px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
    border: 'none', fontFamily: 'inherit',
    background: activeTab === key ? 'var(--orbital)' : 'var(--bg-raised)',
    color:      activeTab === key ? 'white'           : 'var(--text-mid)',
    fontWeight: activeTab === key ? 700               : 400,
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-hi)' }}>
          Central de Denúncias
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '4px 0 0' }}>
          {dataSource.status === 'ok' || dataSource.status === 'empty'
            ? `${reports.length} ${reports.length === 1 ? 'denúncia registrada' : 'denúncias registradas'} · consulta à API`
            : dataSource.status === 'loading'
              ? 'Consultando a API…'
              : 'Serviço temporariamente indisponível'}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
                    alignItems: 'center' }}>
        {TABS.map(t => (
          <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por ID, tipo ou descrição..."
          style={{
            marginLeft: 'auto', padding: '7px 14px', borderRadius: 6, fontSize: 13,
            background: 'var(--bg-raised)', border: '1px solid var(--bg-void)',
            color: 'var(--text-hi)', fontFamily: 'inherit', outline: 'none', width: 260,
          }}
        />
      </div>

      {dataSource.status === 'loading' ? (
        <DataState kind="loading" title="Carregando denúncias…" />
      ) : dataSource.status === 'error' ? (
        <DataState kind="error">
          Não foi possível consultar as denúncias na API. Nenhuma denúncia é exibida no lugar.
        </DataState>
      ) : reports.length === 0 ? (
        <DataState kind="empty" title="Nenhuma denúncia recebida">
          Denúncias enviadas pelo formulário público aparecem aqui para triagem.
        </DataState>
      ) : (
        <ReportTable reports={filtered} />
      )}
    </div>
  );
}
