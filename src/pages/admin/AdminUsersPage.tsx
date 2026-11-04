import { useInlineToast } from '@/hooks/useInlineToast';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  KeyRound,
  Pencil,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  UserX,
  Wand2,
} from 'lucide-react';
import {
  Callout,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  Field,
  LoadingBlock,
  PageHeader,
  Pager,
  Panel,
  Pill,
  Spinner,
} from '@/components/admin/ui';
import { errorMessage } from '@/lib/apiErrors';
import {
  useAdminUser,
  useTeamsForAdmin,
  useUserHistory,
  useUserMutation,
  useUsers,
} from '@/hooks/useAdminCockpit';
import * as api from '@/services/api/adminCockpit';
import { ApiError } from '@/services/api/errors';
import { useUser } from '@/context/UserContext';
import { ASSIGNABLE_ROLES, ROLE_LABEL } from '@/lib/roles';
import { formatDateTime, formatRelative } from '@/lib/time';
import { actionLabel, actionTone, DENIAL_CAUSE } from '@/lib/adminLabels';
import { generatePassword } from '@/lib/adminHelpers';

const MIN_PASSWORD = 12;

function useDebounced<T>(value: T, ms = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return debounced;
}

function StatusPills({ user }: { user: api.AdminUser }) {
  return (
    <span style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
      {user.is_active ? <Pill tone="ok">Ativo</Pill> : <Pill tone="muted">Inativo</Pill>}
      {user.must_change_password && <Pill tone="warn">Troca de senha pendente</Pill>}
    </span>
  );
}

// ── Create ────────────────────────────────────────────────────────────────────

function PasswordField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      label={label}
      hint={`Mínimo de ${MIN_PASSWORD} caracteres e boa variedade. Comunique-a por um canal seguro: o IGNIS não envia senhas por e-mail. A troca é exigida no primeiro acesso.`}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="ig-input"
          style={{ flex: 1 }}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="new-password"
          minLength={MIN_PASSWORD}
          required
        />
        <button type="button" className="ig-btn sm" onClick={() => setVisible(v => !v)} aria-pressed={visible}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
        <button
          type="button"
          className="ig-btn sm"
          onClick={() => {
            onChange(generatePassword());
            setVisible(true);
          }}
        >
          <Wand2 size={14} /> Gerar
        </button>
      </div>
    </Field>
  );
}

function CreateUserDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (u: api.AdminUser) => void }) {
  const teams = useTeamsForAdmin();
  const [form, setForm] = useState({ name: '', email: '', role: 'gestor' as api.Role, team_id: '', password: '', reason: '' });
  const mutation = useUserMutation((body: api.CreateUserBody) => api.createUser(body));
  const set = (key: keyof typeof form) => (value: string) => setForm(f => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        team_id: form.team_id || null,
        temporary_password: form.password,
        reason: form.reason.trim() || undefined,
      },
      { onSuccess: onCreated },
    );
  };

  return (
    <Dialog
      title="Novo usuário"
      description="A conta nasce ativa, com senha provisória e troca obrigatória no primeiro acesso."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="ig-btn ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="create-user" className="ig-btn primary" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />} Criar usuário
          </button>
        </>
      }
    >
      <form id="create-user" onSubmit={submit} style={{ display: 'contents' }}>
        <Field label="Nome completo">
          <input className="ig-input" value={form.name} onChange={e => set('name')(e.target.value)} required minLength={2} autoComplete="off" />
        </Field>
        <Field label="E-mail" hint="Usado no login. Não diferencia maiúsculas e minúsculas.">
          <input className="ig-input" type="email" value={form.email} onChange={e => set('email')(e.target.value)} required autoComplete="off" />
        </Field>
        <div className="ig-grid ig-grid-2" style={{ gap: 12 }}>
          <Field label="Papel">
            <select className="ig-input" value={form.role} onChange={e => set('role')(e.target.value)}>
              {ASSIGNABLE_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </Field>
          <Field label="Equipe (opcional)" hint={teams.isError ? 'Equipes indisponíveis no momento.' : undefined}>
            <select className="ig-input" value={form.team_id} onChange={e => set('team_id')(e.target.value)} disabled={!teams.data}>
              <option value="">Sem equipe</option>
              {teams.data?.items.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
        </div>
        <PasswordField label="Senha provisória" value={form.password} onChange={set('password')} />
        <Field label="Motivo (opcional)" hint="Registrado na auditoria.">
          <input className="ig-input" value={form.reason} onChange={e => set('reason')(e.target.value)} maxLength={500} />
        </Field>
        {mutation.error && <Callout tone="err">{errorMessage(mutation.error)}</Callout>}
      </form>
    </Dialog>
  );
}

// ── Guarded actions (step-up + reason) ────────────────────────────────────────

type Action = 'role' | 'deactivate' | 'activate' | 'reset';

const ACTION_COPY: Record<Action, { title: string; confirm: string; danger?: boolean; effect: string }> = {
  role: {
    title: 'Alterar papel',
    confirm: 'Alterar papel',
    effect: 'As sessões abertas deste usuário serão encerradas; o novo papel vale no próximo login.',
  },
  deactivate: {
    title: 'Desativar conta',
    confirm: 'Desativar',
    danger: true,
    effect: 'O usuário perde o acesso imediatamente e as sessões abertas são encerradas. Nada é excluído; a conta pode ser reativada.',
  },
  activate: {
    title: 'Reativar conta',
    confirm: 'Reativar',
    effect: 'O usuário volta a poder entrar com a senha atual.',
  },
  reset: {
    title: 'Redefinir senha',
    confirm: 'Redefinir senha',
    danger: true,
    effect: 'A senha atual deixa de valer, as sessões são encerradas e a troca será exigida no próximo acesso.',
  },
};

function GuardedActionDialog({
  user,
  action,
  onClose,
  onDone,
}: {
  user: api.AdminUser;
  action: Action;
  onClose: () => void;
  onDone: (u: api.AdminUser, message: string) => void;
}) {
  const copy = ACTION_COPY[action];
  const [role, setRole] = useState<api.Role>(user.role);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [temporary, setTemporary] = useState('');
  const mutation = useUserMutation(async () => {
    const guard = { expected_version: user.row_version, confirm_password: password, reason: reason.trim() };
    if (action === 'role') return api.changeRole(user.id, { ...guard, role });
    if (action === 'reset') return api.resetPassword(user.id, { ...guard, temporary_password: temporary });
    return api.setActive(user.id, action === 'activate', guard);
  });
  const conflict = mutation.error instanceof ApiError && mutation.error.status === 409;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(undefined, {
      onSuccess: updated => onDone(updated, `${copy.title}: concluído para ${updated.name}.`),
    });
  };

  return (
    <Dialog
      title={`${copy.title} — ${user.name}`}
      description={copy.effect}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="ig-btn ghost" onClick={onClose}>Cancelar</button>
          <button
            type="submit"
            form="guarded-action"
            className={`ig-btn ${copy.danger ? 'danger' : 'primary'}`}
            disabled={mutation.isPending || (action === 'role' && role === user.role)}
          >
            {mutation.isPending && <Spinner />} {copy.confirm}
          </button>
        </>
      }
    >
      <form id="guarded-action" onSubmit={submit} style={{ display: 'contents' }}>
        {action === 'role' && (
          <Field label="Novo papel" hint={`Papel atual: ${ROLE_LABEL[user.role]}`}>
            <select className="ig-input" value={role} onChange={e => setRole(e.target.value as api.Role)}>
              {ASSIGNABLE_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </Field>
        )}
        {action === 'reset' && <PasswordField label="Nova senha provisória" value={temporary} onChange={setTemporary} />}
        <Field label="Motivo" hint="Obrigatório (5 a 500 caracteres). Fica na auditoria.">
          <textarea className="ig-input" value={reason} onChange={e => setReason(e.target.value)} required minLength={5} maxLength={500} />
        </Field>
        <Field label="Sua senha" hint="Confirmação exigida para ações sensíveis. Verificada no servidor.">
          <input className="ig-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        </Field>
        {mutation.error && (
          <Callout tone="err" icon={<ShieldAlert size={16} />}>
            {errorMessage(mutation.error)}
            {conflict && ' Feche e reabra o usuário para ver os dados atuais.'}
          </Callout>
        )}
      </form>
    </Dialog>
  );
}

// ── Profile edit ──────────────────────────────────────────────────────────────

function ProfileForm({ user, onSaved }: { user: api.AdminUser; onSaved: (u: api.AdminUser) => void }) {
  const teams = useTeamsForAdmin();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [team, setTeam] = useState(user.team_id ?? '');
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setTeam(user.team_id ?? '');
  }, [user]);
  const mutation = useUserMutation((body: api.ProfileBody) => api.updateProfile(user.id, body));
  const dirty = name.trim() !== user.name || email.trim().toLowerCase() !== user.email || (team || null) !== user.team_id;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body: api.ProfileBody = { expected_version: user.row_version };
    if (name.trim() !== user.name) body.name = name.trim();
    if (email.trim().toLowerCase() !== user.email) body.email = email.trim();
    if ((team || null) !== user.team_id) body.team_id = team || null;
    mutation.mutate(body, { onSuccess: onSaved });
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Nome">
        <input className="ig-input" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
      </Field>
      <Field label="E-mail">
        <input className="ig-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </Field>
      <Field label="Equipe">
        <select className="ig-input" value={team} onChange={e => setTeam(e.target.value)} disabled={!teams.data}>
          <option value="">Sem equipe</option>
          {teams.data?.items.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          {user.team_id && !teams.data?.items.some(t => t.id === user.team_id) && (
            <option value={user.team_id}>Equipe atual</option>
          )}
        </select>
      </Field>
      {mutation.error && <Callout tone="err">{errorMessage(mutation.error)}</Callout>}
      <div>
        <button type="submit" className="ig-btn primary sm" disabled={!dirty || mutation.isPending}>
          {mutation.isPending ? <Spinner /> : <Pencil size={14} />} Salvar alterações
        </button>
      </div>
    </form>
  );
}

function UserHistory({ id }: { id: string }) {
  const { data, error, isLoading, refetch } = useUserHistory(id);
  if (isLoading) return <LoadingBlock rows={3} />;
  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (!data || data.items.length === 0) return <EmptyState title="Nenhum evento para este usuário" />;
  return (
    <ul className="ig-timeline">
      {data.items.map(e => {
        const meta = e.metadata_json ?? {};
        const cause = typeof meta.cause === 'string' ? DENIAL_CAUSE[meta.cause] ?? meta.cause : null;
        const reason = typeof meta.reason === 'string' ? meta.reason : null;
        const tone = actionTone(e.action);
        return (
          <li key={e.id}>
            <span className="ig-dot" style={{ background: tone === 'err' ? 'var(--ig-err)' : tone === 'warn' ? 'var(--ig-warn)' : 'var(--orbital)' }} />
            <div>
              <div>
                <strong>{actionLabel(e.action)}</strong>
                {e.action === 'user.role_changed' && typeof meta.from === 'string' && (
                  <> · {ROLE_LABEL[meta.from] ?? meta.from} → {ROLE_LABEL[String(meta.to)] ?? String(meta.to)}</>
                )}
              </div>
              <div className="ig-sub">
                {formatDateTime(e.created_at)} · por {e.actor_name}
                {cause && ` · motivo da recusa: ${cause}`}
              </div>
              {reason && <div className="ig-sub">Motivo informado: “{reason}”</div>}
            </div>
          </li>
        );
      })}
      {data.total > data.items.length && (
        <li><span /><span className="ig-sub">Mais {data.total - data.items.length} eventos na tela Auditoria.</span></li>
      )}
    </ul>
  );
}

function UserDrawer({ id, onClose, notify }: { id: string; onClose: () => void; notify: (text: string) => void }) {
  const { profile } = useUser();
  const { data: user, error, isLoading, refetch } = useAdminUser(id);
  const [action, setAction] = useState<Action | null>(null);
  const self = profile?.id === id;

  return (
    <Drawer
      title={user?.name ?? 'Usuário'}
      subtitle={user ? <span className="ig-mono">{user.email}</span> : undefined}
      onClose={onClose}
    >
      {isLoading && <LoadingBlock rows={5} />}
      {error && <ErrorState error={error} onRetry={() => void refetch()} />}
      {user && (
        <>
          <section>
            <h3 className="ig-section-title">Situação</h3>
            <dl className="ig-kv">
              <dt>Papel</dt><dd>{ROLE_LABEL[user.role] ?? user.role}</dd>
              <dt>Situação</dt><dd><StatusPills user={user} /></dd>
              <dt>Criado em</dt><dd>{formatDateTime(user.created_at)}</dd>
              <dt>Último login</dt>
              <dd>{user.last_login_at ? `${formatDateTime(user.last_login_at)} (${formatRelative(user.last_login_at)})` : 'Sem registro'}</dd>
              <dt>Última alteração</dt><dd>{formatDateTime(user.updated_at)}</dd>
              <dt>Identificador</dt><dd className="ig-mono">{user.id}</dd>
            </dl>
          </section>

          <section>
            <h3 className="ig-section-title">Ações protegidas</h3>
            {self && (
              <div style={{ marginBottom: 10 }}>
                <Callout tone="warn">
                  Esta é a sua conta: alterar o próprio papel, desativá-la ou redefinir a senha não é permitido.
                  Para trocar sua senha, use “Trocar senha” no menu da conta.
                </Callout>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button type="button" className="ig-btn sm" disabled={self} onClick={() => setAction('role')}>
                <ShieldAlert size={14} /> Alterar papel
              </button>
              {user.is_active ? (
                <button type="button" className="ig-btn sm danger" disabled={self} onClick={() => setAction('deactivate')}>
                  <UserX size={14} /> Desativar
                </button>
              ) : (
                <button type="button" className="ig-btn sm" onClick={() => setAction('activate')}>
                  <UserCheck size={14} /> Reativar
                </button>
              )}
              <button type="button" className="ig-btn sm" disabled={self} onClick={() => setAction('reset')}>
                <KeyRound size={14} /> Redefinir senha
              </button>
            </div>
            <p className="ig-sub" style={{ marginTop: 10 }}>
              Cada ação exige sua senha e um motivo, encerra as sessões do usuário quando cabível e fica registrada.
              O último administrador ativo não pode ser rebaixado nem desativado.
            </p>
          </section>

          <section>
            <h3 className="ig-section-title">Dados cadastrais</h3>
            <ProfileForm user={user} onSaved={u => notify(`Dados de ${u.name} atualizados.`)} />
          </section>

          <section>
            <h3 className="ig-section-title">Histórico administrativo</h3>
            <UserHistory id={user.id} />
          </section>

          {action && (
            <GuardedActionDialog
              user={user}
              action={action}
              onClose={() => setAction(null)}
              onDone={(_, message) => {
                setAction(null);
                notify(message);
              }}
            />
          )}
        </>
      )}
    </Drawer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') ?? '');
  const q = useDebounced(search.trim());
  const role = params.get('role') ?? '';
  const status = params.get('status') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const selected = params.get('user');
  const [creating, setCreating] = useState(false);
  const toast = useInlineToast();

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if ((params.get('q') ?? '') !== q) update({ q: q || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filters = useMemo(() => ({ page, q: q || undefined, role: role || undefined, status: status || undefined }), [page, q, role, status]);
  const { data, error, isLoading, isFetching, refetch } = useUsers(filters);

  return (
    <div className="ig-page">
      <PageHeader
        title="Usuários"
        description="Contas de acesso ao IGNIS. Não há exclusão física: contas são desativadas e o histórico é preservado."
        actions={
          <button type="button" className="ig-btn primary" onClick={() => setCreating(true)}>
            <UserPlus size={16} /> Novo usuário
          </button>
        }
      />
      <Panel flush>
        <div className="ig-toolbar" role="search">
          <Field label="Buscar">
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-ghost)' }} aria-hidden="true" />
              <input
                className="ig-input"
                style={{ paddingLeft: 32, width: 260 }}
                placeholder="Nome ou e-mail"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar por nome ou e-mail"
              />
            </div>
          </Field>
          <Field label="Papel">
            <select className="ig-input" value={role} onChange={e => update({ role: e.target.value || null, page: null })}>
              <option value="">Todos</option>
              {ASSIGNABLE_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </Field>
          <Field label="Situação">
            <select className="ig-input" value={status} onChange={e => update({ status: e.target.value || null, page: null })}>
              <option value="">Todas</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </Field>
          <button type="button" className="ig-btn ghost sm" onClick={() => void refetch()} aria-label="Atualizar lista" style={{ marginLeft: 'auto' }}>
            {isFetching ? <Spinner /> : <RefreshCw size={14} />} Atualizar
          </button>
        </div>
        {isLoading && <LoadingBlock rows={6} />}
        {error && !data && <ErrorState error={error} onRetry={() => void refetch()} />}
        {data && data.items.length === 0 && (
          <EmptyState title={q || role || status ? 'Nenhum usuário com estes filtros' : 'Nenhum usuário cadastrado'}>
            {q || role || status ? 'Ajuste a busca ou limpe os filtros.' : 'Crie o primeiro usuário pelo botão “Novo usuário”.'}
          </EmptyState>
        )}
        {data && data.items.length > 0 && (
          <>
            <div className="ig-table-wrap">
              <table className="ig-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Papel</th>
                    <th>Situação</th>
                    <th className="ig-hide-sm">Criado em</th>
                    <th>Último login</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map(u => (
                    <tr key={u.id}>
                      <td>
                        <button type="button" className="ig-row-btn" onClick={() => update({ user: u.id })}>
                          {u.name}
                        </button>
                        <div className="ig-sub">{u.email}</div>
                      </td>
                      <td>{ROLE_LABEL[u.role] ?? u.role}</td>
                      <td><StatusPills user={u} /></td>
                      <td className="ig-hide-sm">{formatDateTime(u.created_at)}</td>
                      <td>{u.last_login_at ? formatRelative(u.last_login_at) : <span className="ig-sub">Sem registro</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={data.page} pages={data.pages} total={data.total} noun="usuários" onPage={p => update({ page: String(p) })} />
          </>
        )}
      </Panel>

      {creating && (
        <CreateUserDialog
          onClose={() => setCreating(false)}
          onCreated={u => {
            setCreating(false);
            toast.show({ tone: 'ok', text: `Usuário ${u.name} criado. Comunique a senha provisória por um canal seguro.` });
            update({ user: u.id });
          }}
        />
      )}
      {selected && (
        <UserDrawer
          id={selected}
          onClose={() => update({ user: null })}
          notify={text => toast.show({ tone: 'ok', text })}
        />
      )}
      {toast.node}
    </div>
  );
}
