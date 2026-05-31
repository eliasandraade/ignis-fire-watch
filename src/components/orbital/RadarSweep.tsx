import { motion, useReducedMotion } from 'framer-motion';

interface RadarSweepProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: React.CSSProperties;
}

const OPTIONAL_DOTS = [
  // [ringFraction, angleDeg]
  [0.33, 45],
  [0.66, 120],
  [1.0, 200],
  [0.33, 210],
  [0.66, 300],
] as const;

export function RadarSweep({
  size = 120,
  color = 'var(--orbital)',
  speed = 4,
  style,
}: RadarSweepProps) {
  const reducedMotion = useReducedMotion();
  const r = size / 2;
  const strokeColor = color === 'var(--orbital)'
    ? 'oklch(65% 0.17 220)'
    : color;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Concentric rings */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Outer ring */}
        <circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* 66% ring */}
        <circle
          cx={r}
          cy={r}
          r={(r - 1) * 0.66}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.7"
          strokeOpacity="0.25"
        />
        {/* 33% ring */}
        <circle
          cx={r}
          cy={r}
          r={(r - 1) * 0.33}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.6"
          strokeOpacity="0.2"
        />

        {/* Small dots on rings */}
        {OPTIONAL_DOTS.map(([ring, angle], i) => {
          const rad = (angle * Math.PI) / 180;
          const dotR = (r - 1) * ring;
          const x = r + dotR * Math.cos(rad);
          const y = r + dotR * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5}
              fill={strokeColor}
              fillOpacity="0.5"
            />
          );
        })}

        {/* Cross-hairs */}
        <line
          x1={r}
          y1={1}
          x2={r}
          y2={size - 1}
          stroke={strokeColor}
          strokeWidth="0.4"
          strokeOpacity="0.15"
        />
        <line
          x1={1}
          y1={r}
          x2={size - 1}
          y2={r}
          stroke={strokeColor}
          strokeWidth="0.4"
          strokeOpacity="0.15"
        />
      </svg>

      {/* Sweep layer — conic gradient rotating div */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 270deg,
            ${strokeColor}22 290deg,
            ${strokeColor}44 310deg,
            ${strokeColor}66 330deg,
            ${strokeColor}99 355deg,
            transparent 360deg
          )`,
          maskImage: `radial-gradient(circle, black ${r - 2}px, transparent ${r - 1}px)`,
          WebkitMaskImage: `radial-gradient(circle, black ${r - 2}px, transparent ${r - 1}px)`,
        }}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={
          reducedMotion
            ? {}
            : { duration: speed, repeat: Infinity, ease: 'linear' }
        }
      />
    </div>
  );
}
