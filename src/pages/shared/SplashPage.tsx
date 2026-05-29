import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', background: 'var(--bg-void)',
      gap: 32, overflow: 'hidden',
    }}>
      {/* Animated rings */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: 'var(--orbital)',
                      letterSpacing: '-0.04em', lineHeight: 1 }}>IGNIS</div>
        <div style={{ fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.2em',
                      textTransform: 'uppercase', marginTop: 4 }}>
          Orbital · Inteligência Espacial Ambiental
        </div>
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 14, color: 'var(--text-lo)', letterSpacing: '0.06em' }}>
        Conectando dados, salvando vidas.
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: 'var(--bg-raised)', borderRadius: 1 }}>
        <motion.div
          style={{ height: '100%', background: 'var(--orbital)', borderRadius: 1 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Footer note */}
      <div style={{ position: 'absolute', bottom: 24, fontSize: 11,
                    color: 'var(--text-ghost)', textAlign: 'center' }}>
        FIAP Global Solution 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427
      </div>
    </div>
  );
}
