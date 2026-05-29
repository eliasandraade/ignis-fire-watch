import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isApiEnabled } from '@/services/api/client';
import { login, saveSession } from '@/services/api/authService';
import { adaptApiUser, getRouteForRole } from '@/services/adapters/authAdapter';
import { useUser } from '@/context/UserContext';

const schema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setProfile } = useUser();
  const [loginError, setLoginError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoginError(null);

    if (isApiEnabled()) {
      try {
        const token = await login(data.email, data.password);
        saveSession(token);
        const profile = adaptApiUser(token.user);
        setProfile(profile);
        navigate(getRouteForRole(profile.role));
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Credenciais inválidas.';
        setLoginError(msg);
        return;
      }
    }

    // Mock mode — any credentials accepted for demonstration
    await new Promise(r => setTimeout(r, 400));
    navigate('/select-profile');
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-void)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 380, background: 'var(--bg-surface)',
          border: '1px solid var(--bg-raised)', borderRadius: 12,
          padding: 40,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: 'var(--orbital)',
                        letterSpacing: '-0.04em' }}>IGNIS</div>
          <div style={{ fontSize: 13, color: 'var(--text-lo)', marginTop: 4 }}>
            Plataforma Orbital Ambiental
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 500,
                            display: 'block', marginBottom: 6 }}>
              E-mail institucional
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="usuario@orgao.gov.br"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 13,
                background: 'var(--bg-raised)', border: `1px solid ${errors.email ? 'var(--risk-crit)' : 'var(--bg-void)'}`,
                color: 'var(--text-hi)', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.email && (
              <p style={{ fontSize: 11, color: 'var(--risk-crit)', marginTop: 4 }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 500,
                            display: 'block', marginBottom: 6 }}>
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 13,
                background: 'var(--bg-raised)', border: `1px solid ${errors.password ? 'var(--risk-crit)' : 'var(--bg-void)'}`,
                color: 'var(--text-hi)', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.password && (
              <p style={{ fontSize: 11, color: 'var(--risk-crit)', marginTop: 4 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p style={{ fontSize: 12, color: 'var(--risk-crit)', padding: '8px 12px',
                         background: 'color-mix(in oklch, var(--risk-crit) 10%, transparent)',
                         borderRadius: 6, margin: 0 }}>
              {loginError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} style={{
            width: '100%', padding: '12px 0', borderRadius: 6, border: 'none',
            background: isSubmitting ? 'var(--bg-raised)' : 'var(--orbital)',
            color: isSubmitting ? 'var(--text-ghost)' : 'white',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            marginTop: 4,
          }}>
            {isSubmitting ? 'Autenticando...' : 'Acessar Sistema'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-ghost)' }}>
          Acesso público?{' '}
          <Link to="/public" style={{ color: 'var(--orbital)', textDecoration: 'none' }}>
            Portal de Denúncias
          </Link>
        </div>

        <div style={{ marginTop: 20, padding: '10px 12px', background: 'var(--bg-raised)',
                      borderRadius: 6, fontSize: 11, color: 'var(--text-ghost)',
                      textAlign: 'center', lineHeight: 1.5 }}>
          {isApiEnabled()
            ? <>Use as credenciais do sistema para acessar.<br /></>
            : <>Protótipo demonstrativo — qualquer credencial é aceita.<br /></>
          }
          FIAP GS 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427
        </div>
      </motion.div>
    </div>
  );
}
