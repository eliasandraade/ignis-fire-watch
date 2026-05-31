import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OrbitalBackground } from '../../components/orbital';

export default function SplashPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 4;
      });
    }, 100);
    const timeout = setTimeout(() => navigate('/login'), 2500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [navigate]);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 28,
      overflow: 'hidden',
    }}>
      {/* Full-screen orbital backdrop */}
      <OrbitalBackground intensity="low" />

      {/* Animated rings */}
      <div style={{ position: 'relative', width: 120, height: 120, zIndex: 1 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: i * 16,
              borderRadius: '50%',
              border: `1px solid color-mix(in oklch, var(--orbital) ${60 - i * 15}%, transparent)`,
            }}
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{
              rotate: { duration: 6 + i * 2, repeat: Infinity, ease: 'linear' },
              scale:  { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
            }}
          />
        ))}
        {/* Core dot */}
        <div style={{
          position: 'absolute', inset: '50%', transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--orbital)',
          boxShadow: '0 0 20px var(--orbital)',
        }} />
      </div>

      {/* Logo */}
      <motion.div
        style={{ textAlign: 'center', zIndex: 1 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ fontWeight: 800, fontSize: 40, color: 'var(--orbital)',
                      letterSpacing: '-0.04em', lineHeight: 1 }}>IGNIS</div>
        <div style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.2em',
                      textTransform: 'uppercase', marginTop: 4 }}>
          Orbital · Inteligência Espacial Ambiental
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        style={{
          zIndex: 1,
          maxWidth: 380,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-mid)',
          lineHeight: 1.6,
          letterSpacing: '0.01em',
          padding: '0 24px',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        Dados orbitais, IA e comando operacional para proteger áreas ambientais críticas.
      </motion.div>

      {/* Support tagline */}
      <motion.div
        style={{
          zIndex: 1,
          fontSize: 11,
          color: 'var(--text-ghost)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Uma aplicação da economia espacial
      </motion.div>

      {/* Data chain — monospace cadeia */}
      <motion.div
        style={{
          zIndex: 1,
          fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
          fontSize: 10,
          color: 'var(--text-ghost)',
          letterSpacing: '0.04em',
          opacity: 0.6,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        Satélite → dado orbital → inteligência → decisão → resposta
      </motion.div>

      {/* Progress bar */}
      <div style={{ zIndex: 1, width: 200, height: 2, background: 'var(--bg-raised)', borderRadius: 1 }}>
        <motion.div
          style={{ height: '100%', background: 'var(--orbital)', borderRadius: 1 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation links */}
      <motion.div
        style={{
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          marginTop: 4,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <NavLink to="/public" label="Acessar Portal Público" />
        <NavLink to="/login" label="Entrar como Gestor" />
        <NavLink to="/login" label="Ver Economia Espacial" note="área restrita — login necessário" />
      </motion.div>

      {/* Footer note */}
      <div style={{ position: 'absolute', bottom: 24, zIndex: 1, fontSize: 11,
                    color: 'var(--text-ghost)', textAlign: 'center' }}>
        FIAP Global Solution 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427
      </div>
    </div>
  );
}

function NavLink({ to, label, note }: { to: string; label: string; note?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Link
        to={to}
        style={{
          display: 'inline-block',
          padding: '6px 18px',
          fontSize: 12,
          color: 'var(--orbital)',
          border: '1px solid color-mix(in oklch, var(--orbital) 35%, transparent)',
          borderRadius: 6,
          textDecoration: 'none',
          letterSpacing: '0.04em',
          background: 'color-mix(in oklch, var(--orbital) 5%, transparent)',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background =
            'color-mix(in oklch, var(--orbital) 14%, transparent)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor =
            'color-mix(in oklch, var(--orbital) 60%, transparent)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background =
            'color-mix(in oklch, var(--orbital) 5%, transparent)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor =
            'color-mix(in oklch, var(--orbital) 35%, transparent)';
        }}
      >
        {label}
      </Link>
      {note && (
        <div style={{
          marginTop: 3,
          fontSize: 10,
          color: 'var(--text-ghost)',
          letterSpacing: '0.03em',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {note}
        </div>
      )}
    </div>
  );
}
