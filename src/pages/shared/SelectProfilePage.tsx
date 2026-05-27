import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import type { UserProfile } from '@/types/domain';

const PROFILES: (UserProfile & { description: string; route: string })[] = [
  {
    id: 'u4', name: 'Admin IGNIS', email: 'admin@ignis.ce.gov.br',
    role: 'admin', description: 'Gestão de usuários, áreas e auditoria', route: '/admin',
  },
  {
    id: 'u1', name: 'Ana Lima — Gestora', email: 'ana.lima@ignis.ce.gov.br',
    role: 'gestor', description: 'Monitoramento, denúncias e coordenação', route: '/gestor',
  },
  {
    id: 'u6', name: 'Maria Cecília — Analista', email: 'm.cecilia@semace.ce.gov.br',
    role: 'analista', description: 'Análise de dados e Aurora IA', route: '/gestor/aurora',
  },
  {
    id: 'u2', name: 'Carlos Drummond — Campo', email: 'c.drummond@bombeiros.ce.gov.br',
    role: 'campo', description: 'Operações de campo e missões', route: '/gestor/field',
  },
  {
    id: 'u5', name: 'Cidadão / Público', email: '',
    role: 'publico', description: 'Portal público de denúncias', route: '/public',
  },
];

const ROLE_COLOR: Record<string, string> = {
  admin:   'var(--risk-crit)',
  gestor:  'var(--orbital)',
  analista:'var(--risk-med)',
  campo:   'var(--risk-high)',
  publico: 'var(--risk-low)',
};

export default function SelectProfilePage() {
  const { setProfile } = useUser();
  const navigate = useNavigate();

  const handleSelect = (p: typeof PROFILES[0]) => {
    setProfile({ id: p.id, name: p.name, email: p.email, role: p.role });
    navigate(p.route);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-void)',
      padding: 24,
    }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: 'var(--orbital)',
                      letterSpacing: '-0.04em' }}>IGNIS Orbital</div>
        <div style={{ fontSize: 14, color: 'var(--text-lo)', marginTop: 6 }}>
          Selecione o perfil de acesso para este protótipo
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16, width: '100%', maxWidth: 900 }}>
        {PROFILES.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => handleSelect(p)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
              borderRadius: 10, padding: '20px 20px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left',
              fontFamily: 'inherit',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `color-mix(in oklch, ${ROLE_COLOR[p.role]} 15%, transparent)`,
              border: `1px solid color-mix(in oklch, ${ROLE_COLOR[p.role]} 30%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, marginBottom: 4,
            }}>
              {p.role === 'admin' ? '⚙' : p.role === 'gestor' ? '🎯' :
               p.role === 'analista' ? '🔭' : p.role === 'campo' ? '🚒' : '👤'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-hi)' }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)', lineHeight: 1.4 }}>
              {p.description}
            </div>
            <div style={{
              fontSize: 10, color: ROLE_COLOR[p.role], fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4,
            }}>
              {p.role}
            </div>
          </motion.button>
        ))}
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: 'var(--text-ghost)', textAlign: 'center' }}>
        Protótipo demonstrativo FIAP GS 2026 · Elias Sales de Freitas — RM561257
      </div>
    </div>
  );
}
