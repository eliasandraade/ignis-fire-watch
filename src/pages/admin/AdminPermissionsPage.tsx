import { useMemo, useState } from 'react';
import { Check, Info, Minus } from 'lucide-react';
import {
  Callout,
  ErrorState,
  Field,
  LoadingBlock,
  PageHeader,
  Panel,
} from '@/components/admin/ui';
import { usePermissions } from '@/hooks/useAdminCockpit';
import { allows } from '@/lib/adminHelpers';

export default function AdminPermissionsPage() {
  const { data, error, isLoading, refetch } = usePermissions();
  const [tag, setTag] = useState('');
  const [text, setText] = useState('');

  const tags = useMemo(() => Array.from(new Set(data?.endpoints.map(e => e.tag) ?? [])).sort(), [data]);
  const endpoints = useMemo(
    () =>
      (data?.endpoints ?? []).filter(
        e => (!tag || e.tag === tag) && (!text || `${e.method} ${e.path}`.toLowerCase().includes(text.toLowerCase())),
      ),
    [data, tag, text],
  );
  const roles = (data?.roles ?? []).filter(r => r.role !== 'publico');

  return (
    <div className="ig-page">
      <PageHeader
        title="Permissões"
        description="Matriz somente leitura do controle de acesso. Os papéis são fixos e hierárquicos; a verificação acontece no servidor, em cada endpoint."
      />
      {isLoading && <Panel><LoadingBlock rows={6} /></Panel>}
      {error && <Panel><ErrorState error={error} onRetry={() => void refetch()} /></Panel>}
      {data && (
        <div className="ig-stack">
          <Callout icon={<Info size={16} />}>
            {data.note} A matriz é lida das dependências de cada rota da API em execução, por isso não
            diverge do que o servidor aplica. Não há editor de permissões: mudar o acesso de um papel exige
            alteração de código revisada.
          </Callout>
          <div className="ig-grid ig-grid-2">
            {data.roles.map(r => (
              <Panel key={r.role} title={r.label} note={`Nível ${r.level} · ${r.role}`}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.5 }}>{r.description}</p>
              </Panel>
            ))}
          </div>
          <Panel title="Endpoints por papel" note={`${data.endpoints.length} operações`} flush>
            <div className="ig-toolbar">
              <Field label="Domínio">
                <select className="ig-input" value={tag} onChange={e => setTag(e.target.value)}>
                  <option value="">Todos</option>
                  {tags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Filtrar">
                <input className="ig-input" placeholder="Método ou caminho" value={text} onChange={e => setText(e.target.value)} />
              </Field>
            </div>
            <div className="ig-table-wrap">
              <table className="ig-table">
                <thead>
                  <tr>
                    <th>Operação</th>
                    <th>Exige</th>
                    {roles.map(r => <th key={r.role} style={{ textAlign: 'center' }}>{r.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map(e => (
                    <tr key={`${e.method} ${e.path}`}>
                      <td>
                        <span className={`ig-method ${e.method.toLowerCase()}`}>{e.method}</span>{' '}
                        <span className="ig-mono">{e.path}</span>
                        <div className="ig-sub">{e.tag}</div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {e.access === 'público' ? 'Sem login' : e.access === 'autenticado' ? 'Login' : data.roles.find(r => r.role === e.access)?.label ?? e.access}
                      </td>
                      {roles.map(r => (
                        <td key={r.role} style={{ textAlign: 'center' }}>
                          {allows(e.access, r.role) ? (
                            <Check size={16} color="var(--ig-ok)" aria-label="permitido" />
                          ) : (
                            <Minus size={16} color="var(--text-ghost)" aria-label="negado" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
