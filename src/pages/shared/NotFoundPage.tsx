import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-void)',
      gap: 16, textAlign: 'center', padding: 24,
    }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 64, fontWeight: 700,
                    color: 'var(--bg-raised)', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-hi)' }}>
        Coordenadas não encontradas
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-lo)', maxWidth: 360 }}>
        A rota solicitada não existe neste sistema orbital.
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <Link to="/public" style={{
          fontSize: 13, color: 'var(--orbital)', textDecoration: 'none',
          padding: '8px 16px', border: '1px solid var(--orbital)', borderRadius: 6,
        }}>
          Portal Público
        </Link>
        <Link to="/login" style={{
          fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none',
          padding: '8px 16px', border: '1px solid var(--bg-raised)', borderRadius: 6,
        }}>
          Login
        </Link>
      </div>
    </div>
  );
}
