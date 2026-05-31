import { Link } from 'react-router-dom';
import { FALLBACK_USERS, FALLBACK_AUDIT_LOG } from '@/data/fallback';
import { useAdminUsers, useAuditLogs } from '@/hooks/useAdminStats';
import { isApiEnabled } from '@/services/api/client';
import type { UserRole } from '@/types/domain';

function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':    return 'var(--orbital)';
    case 'gestor':   return 'var(--risk-low)';
    case 'campo':    return 'var(--risk-med)';
    case 'analista': return 'var(--risk-high)';
    case 'orgao':    return 'var(--risk-med)';
    case 'publico':  return 'var(--text-ghost)';
    default:         return 'var(--text-ghost)';
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':    return 'Admin';
    case 'gestor':   return 'Gestor';
    case 'campo':    return 'Campo';
    case 'analista': return 'Analista';
    case 'orgao':    return 'Órgão';
    case 'publico':  return 'Público';
    default:         return role;
  }
}

function getEntityColor(entity: string): string {
  switch (entity) {
    case 'incident': return 'var(--risk-high)';
    case 'report':   return 'var(--orbital)';
    case 'area':     return 'var(--risk-low)';
    default:         return 'var(--text-lo)';
  }
}

export default function AdminPanelPage() {
  const apiEnabled = isApiEnabled();
  const usersQuery = useAdminUsers();
  const auditQuery = useAuditLogs();

  const apiUsers = apiEnabled && usersQuery.isSuccess ? usersQuery.data.items : null;
  const apiAudit = apiEnabled && auditQuery.isSuccess ? auditQuery.data.items : null;

  const displayUsers = apiUsers ?? FALLBACK_USERS;
  const displayAudit = apiAudit
    ? apiAudit.map(a => ({
        id: a.id,
        ts: a.created_at,
        user: a.actor_name,
        action: a.action,
        entity: a.entity_type,
      }))
    : FALLBACK_AUDIT_LOG;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-void)',
      color: 'var(--text-hi)',
      fontFamily: 'Space Grotesk, system-ui, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: 'var(--bar-h)',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--bg-raised)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        zIndex: 100,
      }}>
        <span style={{ fontWeight: 800, color: 'var(--orbital)', fontSize: 16 }}>
          IGNIS
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>
          Painel Administrativo
        </span>
        <div style={{ flex: 1 }} />
        <Link
          to="/gestor"
          style={{
            color: 'var(--text-lo)',
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          ← Gestor
        </Link>
      </div>

      {/* Main content */}
      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>

        {/* Section 1 — Users */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>
          Usuários
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '0 0 16px 0' }}>
          {displayUsers.length} usuários cadastrados{apiUsers ? ' · dados da API' : ' · protótipo demonstrativo'}
        </p>

        <div style={{
          border: '1px solid var(--bg-raised)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 32,
        }}>
          {/* Header row */}
          <div style={{
            background: 'var(--bg-raised)',
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 2fr 1fr 1.5fr 80px',
            padding: '8px 16px',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-ghost)',
          }}>
            <span>ID</span>
            <span>Nome</span>
            <span>E-mail</span>
            <span>Papel</span>
            <span>Último Acesso</span>
            <span>Ativo</span>
          </div>

          {/* User rows */}
          {displayUsers.map(u => {
            const role = (u as { role: UserRole }).role ?? 'publico';
            const roleColor = getRoleColor(role);
            return (
              <div
                key={u.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr 2fr 1fr 1.5fr 80px',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--bg-raised)',
                  background: 'var(--bg-surface)',
                  fontSize: 13,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-ghost)', fontSize: 11 }}>
                  {u.id.substring(0, 8)}
                </span>
                <span style={{ color: 'var(--text-hi)', fontWeight: 500 }}>
                  {u.name}
                </span>
                <span style={{ color: 'var(--text-lo)', fontSize: 12 }}>
                  {u.email}
                </span>
                <span>
                  <span style={{
                    background: `color-mix(in oklch, ${roleColor} 15%, transparent)`,
                    color: roleColor,
                    border: `1px solid color-mix(in oklch, ${roleColor} 35%, transparent)`,
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {getRoleLabel(role)}
                  </span>
                </span>
                <span style={{ color: 'var(--text-mid)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                  {'lastLogin' in u
                    ? new Date((u as { lastLogin: string }).lastLogin).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                    : ('created_at' in u ? new Date((u as { created_at: string }).created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—')}
                </span>
                <span style={{
                  color: 'active' in u ? ((u as { active: boolean }).active ? 'var(--risk-low)' : 'var(--risk-crit)') : 'var(--risk-low)',
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {'active' in u ? ((u as { active: boolean }).active ? '✓ Ativo' : '✗ Inativo') : '✓ Ativo'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Section 2 — Audit Log */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '32px 0 12px 0' }}>
          Log de Auditoria
        </h2>

        <div>
          {displayAudit.map(a => {
            const entityColor = getEntityColor(a.entity);
            return (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--bg-raised)',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  color: 'var(--text-ghost)',
                  flexShrink: 0,
                  minWidth: 120,
                }}>
                  {new Date(a.ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span style={{
                  background: `color-mix(in oklch, ${entityColor} 15%, transparent)`,
                  color: entityColor,
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {a.entity}
                </span>
                <span style={{ color: 'var(--text-mid)', fontSize: 13, flex: 1 }}>
                  {a.action}
                </span>
                <span style={{ color: 'var(--text-ghost)', fontSize: 12, flexShrink: 0 }}>
                  — {a.user}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
