import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants, orbitalGlowVariants } from '../../lib/motion';

interface SpaceMetricCardProps {
  value: string | number;
  label: string;
  accent?: string;
  unit?: string;
  sublabel?: string;
  delay?: number;
}

export function SpaceMetricCard({
  value,
  label,
  accent = 'var(--orbital)',
  unit,
  sublabel,
  delay = 0,
}: SpaceMetricCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={
        reducedMotion
          ? {}
          : {
              boxShadow: `0 0 0 1px ${accent}, 0 4px 24px oklch(65% 0.17 220 / 0.12)`,
              transition: { duration: 0.2 },
            }
      }
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid var(--bg-raised)`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Telemetry pulse dot — top right */}
      <motion.div
        variants={reducedMotion ? {} : orbitalGlowVariants}
        animate={reducedMotion ? {} : 'glow'}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: accent,
          opacity: 0.8,
        }}
      />

      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: accent,
            lineHeight: 1,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 13,
              color: 'var(--text-lo)',
              fontWeight: 500,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 12,
          color: 'var(--text-lo)',
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            fontSize: 10,
            color: accent,
            opacity: 0.55,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}
        >
          {sublabel}
        </div>
      )}
    </motion.div>
  );
}
