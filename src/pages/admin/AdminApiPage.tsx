import { useMemo, useState } from 'react';
import { Download, ExternalLink, Lock, Play, Search, Stethoscope } from 'lucide-react';
import {
  Callout,
  EmptyState,
  ErrorState,
  Field,
  LoadingBlock,
  PageHeader,
  Panel,
  Pill,
  Spinner,
} from '@/components/admin/ui';
import { useAdminSettings, useProtectedOpenApi } from '@/hooks/useAdminCockpit';
import { apiFetch, API_BASE_URL } from '@/services/api/client';
import { ApiError } from '@/services/api/errors';
import { operationsOf, type Operation, type Spec } from '@/lib/adminHelpers';

interface Probe {
  status: number | 'erro';
  ms: number;
  body: unknown;
}

async function probe(path: string): Promise<Probe> {
  const started = performance.now();
  try {
    const body = await apiFetch<unknown>(path);
    return { status: 200, ms: Math.round(performance.now() - started), body };
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 'erro';
    return {
      status: status === 0 ? 'erro' : status,
      ms: Math.round(performance.now() - started),
      body: err instanceof ApiError ? err.body ?? err.message : String(err),
    };
  }
}

const DIAGNOSTICS = [
  { path: '/health', label: 'Liveness' },
  { path: '/ready', label: 'Readiness (banco)' },
  { path: '/api/v1/auth/me', label: 'Sessão atual' },
  { path: '/api/v1/orbital-alerts/sources', label: 'Estado das fontes' },
];

function ProbeResult({ result }: { result: Probe }) {
  const ok = typeof result.status === 'number' && result.status < 400;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <Pill tone={ok ? 'ok' : 'err'}>HTTP {result.status}</Pill>
        <span className="ig-sub">{result.ms} ms medidos pelo navegador</span>
      </div>
      <pre className="ig-code" style={{ maxHeight: 260 }}>{JSON.stringify(result.body, null, 2)}</pre>
    </div>
  );
}

function OperationRow({ op }: { op: Operation }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Probe | null>(null);
  const [running, setRunning] = useState(false);
  const runnable = op.method === 'GET' && !op.parameters.some(p => p.in === 'path');
  const run = async () => {
    setRunning(true);
    setResult(await probe(op.path));
    setRunning(false);
  };
  return (
    <li style={{ borderBottom: '1px solid var(--ig-line)' }}>
      <button
        type="button"
        className="ig-row-btn"
        style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 16px', width: '100%', boxSizing: 'border-box', fontWeight: 400 }}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={`ig-method ${op.method.toLowerCase()}`}>{op.method}</span>
        <span className="ig-mono" style={{ color: 'var(--text-hi)' }}>{op.path}</span>
        <span className="ig-sub ig-hide-sm" style={{ marginLeft: 'auto', marginTop: 0 }}>{op.summary}</span>
        {op.secured && <Lock size={13} color="var(--text-ghost)" aria-label="exige autenticação" />}
      </button>
      {open && (
        <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          {op.description && <p style={{ margin: 0, color: 'var(--text-mid)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{op.description}</p>}
          {op.parameters.length > 0 && (
            <div>
              <div className="ig-section-title" style={{ marginBottom: 6 }}>Parâmetros</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                {op.parameters.map(p => (
                  <li key={`${p.in}-${p.name}`}>
                    <span className="ig-mono">{p.name}</span> <span className="ig-sub" style={{ display: 'inline' }}>({p.in}{p.required ? ', obrigatório' : ''})</span>
                    {p.description && ` — ${p.description}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <div className="ig-section-title" style={{ marginBottom: 6 }}>Respostas</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {Object.entries(op.responses).map(([code, r]) => (
                <li key={code}><span className="ig-mono">{code}</span> — {r.description}</li>
              ))}
            </ul>
          </div>
          {runnable ? (
            <div>
              <button type="button" className="ig-btn sm" onClick={() => void run()} disabled={running}>
                {running ? <Spinner /> : <Play size={13} />} Executar com sua sessão
              </button>
              {result && <ProbeResult result={result} />}
            </div>
          ) : (
            <p className="ig-sub" style={{ margin: 0 }}>
              {op.method === 'GET'
                ? 'Execução direta indisponível: a operação exige parâmetros de caminho.'
                : 'Operações que alteram dados não são executadas a partir desta tela.'}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export default function AdminApiPage() {
  const { data: spec, error, isLoading, refetch } = useProtectedOpenApi();
  const settings = useAdminSettings();
  const [text, setText] = useState('');
  const [diag, setDiag] = useState<Record<string, Probe | 'running'>>({});
  const ops = useMemo(() => operationsOf((spec ?? {}) as Spec), [spec]);
  const filtered = ops.filter(o => !text || `${o.method} ${o.path} ${o.summary} ${o.tag}`.toLowerCase().includes(text.toLowerCase()));
  const byTag = filtered.reduce<Record<string, Operation[]>>((acc, op) => {
    (acc[op.tag] ??= []).push(op);
    return acc;
  }, {});
  const tags = ((spec as Spec | undefined)?.tags ?? []).map(t => t.name);
  const ordered = [...tags.filter(t => byTag[t]), ...Object.keys(byTag).filter(t => !tags.includes(t))];
  const publicDocs = settings.data?.application.api_docs_public === true;

  const downloadSpec = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ignis-openapi-${(spec as Spec).info?.version ?? 'atual'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runDiagnostics = async () => {
    for (const d of DIAGNOSTICS) {
      setDiag(s => ({ ...s, [d.path]: 'running' }));
      const result = await probe(d.path);
      setDiag(s => ({ ...s, [d.path]: result }));
    }
  };

  return (
    <div className="ig-page">
      <PageHeader
        title="API e diagnóstico"
        description="Especificação OpenAPI completa, servida apenas a administradores com o token da sessão no cabeçalho (nunca na URL)."
        actions={
          <>
            {publicDocs && (
              <a className="ig-btn" href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> Swagger público (dev)
              </a>
            )}
            <button type="button" className="ig-btn" onClick={downloadSpec} disabled={!spec}>
              <Download size={15} /> Baixar OpenAPI
            </button>
          </>
        }
      />
      <div className="ig-stack">
        <Callout icon={<Lock size={16} />}>
          {publicDocs
            ? 'Neste ambiente de desenvolvimento /docs e /openapi.json também são públicos.'
            : 'Neste ambiente /docs, /redoc e /openapi.json públicos estão desligados (404). A especificação só é entregue a administradores por /api/v1/admin/openapi.json.'}
        </Callout>

        <Panel
          title="Diagnóstico rápido"
          icon={<Stethoscope size={16} />}
          note="Chamadas de leitura com a sua sessão; latência medida pelo navegador, agora."
          actions={<button type="button" className="ig-btn sm" onClick={() => void runDiagnostics()}><Play size={13} /> Executar</button>}
        >
          <div className="ig-grid ig-grid-2">
            {DIAGNOSTICS.map(d => {
              const r = diag[d.path];
              const headingId = `diag-${d.path.replace(/[^a-z0-9]+/gi, '-')}`;
              return (
                <section
                  key={d.path}
                  aria-labelledby={headingId}
                  data-testid={`diagnostic-${d.path}`}
                  className="ig-panel"
                  style={{ padding: 12, background: 'var(--bg-deep)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <h3 id={headingId} style={{ fontSize: 13, margin: 0 }}>{d.label}</h3>
                    <span className="ig-mono ig-sub" style={{ marginTop: 0 }}>GET {d.path}</span>
                  </div>
                  {r === 'running' && <div style={{ marginTop: 8 }}><Spinner /></div>}
                  {r && r !== 'running' && <ProbeResult result={r} />}
                  {!r && <div className="ig-sub" style={{ marginTop: 8 }}>Ainda não executado.</div>}
                </section>
              );
            })}
          </div>
        </Panel>

        <Panel
          title={(spec as Spec | undefined)?.info?.title ?? 'Especificação'}
          note={spec ? `Versão ${(spec as Spec).info?.version} · ${ops.length} operações` : undefined}
          flush
        >
          <div className="ig-toolbar">
            <Field label="Buscar operação">
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-ghost)' }} aria-hidden="true" />
                <input className="ig-input" style={{ paddingLeft: 32, width: 300 }} placeholder="Caminho, método ou domínio" value={text} onChange={e => setText(e.target.value)} />
              </div>
            </Field>
          </div>
          {isLoading && <LoadingBlock rows={8} />}
          {error && <ErrorState error={error} onRetry={() => void refetch()} />}
          {spec && filtered.length === 0 && <EmptyState title="Nenhuma operação encontrada" />}
          {ordered.map(tag => (
            <section key={tag}>
              <h3 className="ig-section-title" style={{ padding: '14px 16px 6px', margin: 0, borderBottom: '1px solid var(--ig-line)' }}>
                {tag} <span style={{ fontWeight: 400 }}>· {(spec as Spec).tags?.find(t => t.name === tag)?.description}</span>
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {byTag[tag].map(op => <OperationRow key={`${op.method} ${op.path}`} op={op} />)}
              </ul>
            </section>
          ))}
        </Panel>
      </div>
    </div>
  );
}
