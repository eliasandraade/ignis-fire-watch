import { motion, useReducedMotion } from 'framer-motion';
import { slideInLeftVariants } from '../../lib/motion';

interface OrbitalSectionHeaderProps {
  children: string;
  icon?: string;
  accent?: string;
}

export function OrbitalSectionHeader({
  children,
  icon,
  accent = 'var(--orbital)',
}: OrbitalSectionHeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={slideInLeftVariants}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      custom={0}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 3,
          height: 18,
          borderRadius: 2,
          background: accent,
          flexShrink: 0,
        }}
      />

      {/* Icon */}
      {icon && (
        <span
          style={{
            fontSize: 16,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}

      {/* Label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: accent,
          lineHeight: 1,
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}
