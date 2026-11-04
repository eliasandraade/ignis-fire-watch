import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Orbit } from 'lucide-react';
import { login, saveSession } from '@/services/api/authService';
import { adaptApiUser, getRouteForRole } from '@/services/adapters/authAdapter';
import { useUser } from '@/context/UserContext';
import { ApiError } from '@/services/api/errors';
import { Callout, Field, Spinner } from '@/components/admin/ui';

const schema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe a senha'),
});
type FormData = z.infer<typeof schema>;

function loginError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'E-mail ou senha incorretos, ou conta sem acesso.';
    if (err.status === 429) return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
    if (err.status === 0 || err.status >= 500) return 'Serviço temporariamente indisponível. Tente novamente em instantes.';
  }
  return 'Não foi possível entrar. Tente novamente.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useUser();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (profile) return <Navigate to={getRouteForRole(profile.role, profile.mustChangePassword)} replace />;

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const session = await login(data.email, data.password);
      saveSession(session);
      const user = adaptApiUser(session.user);
      setProfile(user);
      navigate(getRouteForRole(user.role, user.mustChangePassword), { replace: true });
    } catch (err) {
      setError(loginError(err));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(1200px 600px at 20% -10%, oklch(20% 0.05 230 / 60%), transparent), var(--bg-void)', padding: 16 }}>
      <main className="ig-panel" style={{ width: 'min(400px, 100%)', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
          <span className="ig-brand-mark" style={{ width: 38, height: 38, borderRadius: 10 }}><Orbit size={20} /></span>
          <div>
            <div className="ig-brand-name" style={{ fontSize: 18 }}>IGNIS Orbital</div>
            <div className="ig-brand-sub">by Andrade Systems</div>
          </div>
        </div>
        <h1 style={{ fontSize: 19, margin: '0 0 4px' }}>Acesso restrito</h1>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--text-lo)', lineHeight: 1.5 }}>
          Entre com a conta fornecida pelo administrador da sua organização.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
          <Field label="E-mail" error={errors.email?.message}>
            <input
              {...register('email')}
              className="ig-input"
              type="email"
              autoComplete="username"
              placeholder="nome@organizacao.gov.br"
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field label="Senha" error={errors.password?.message}>
            <input
              {...register('password')}
              className="ig-input"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
            />
          </Field>
          {error && <Callout tone="err">{error}</Callout>}
          <button type="submit" className="ig-btn primary" disabled={isSubmitting} style={{ height: 40, marginTop: 4 }}>
            {isSubmitting ? <Spinner /> : <LogIn size={16} />} {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p style={{ margin: '22px 0 0', fontSize: 12.5, color: 'var(--text-ghost)', textAlign: 'center' }}>
          Quer registrar uma ocorrência?{' '}
          <Link to="/public" style={{ color: 'var(--orbital)' }}>Acesse o portal público</Link>
        </p>
        <p style={{ margin: '10px 0 0', fontSize: 11.5, color: 'var(--text-ghost)', textAlign: 'center', lineHeight: 1.5 }}>
          Esqueceu a senha? Peça a redefinição a um administrador do IGNIS na sua organização.
        </p>
      </main>
    </div>
  );
}
