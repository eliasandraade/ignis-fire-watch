import { motion, useReducedMotion } from 'framer-motion';

interface OrbitalBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  showGrid?: boolean;
  showOrbits?: boolean;
  showDots?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const intensityOpacity: Record<'low' | 'medium' | 'high', number> = {
  low: 0.5,
  medium: 1,
  high: 1,
};

const TELEMETRY_DOTS = [
  { top: '18%', left: '12%', delay: 0 },
  { top: '42%', left: '78%', delay: 0.8 },
  { top: '65%', left: '28%', delay: 1.4 },
  { top: '30%', left: '55%', delay: 0.4 },
  { top: '80%', left: '63%', delay: 1.1 },
  { top: '55%', left: '88%', delay: 0.6 },
];

export function OrbitalBackground({
  style,
  showGrid = true,
  showOrbits = true,
  showDots = true,
  intensity = 'medium',
}: OrbitalBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const multiplier = intensityOpacity[intensity];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Base void background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-void)',
        }}
      />

      {/* Dot grid */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, oklch(65% 0.17 220 / 0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: multiplier * 1,
          }}
        />
      )}

      {/* Radial glow top-right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 80% 0%, oklch(65% 0.17 220 / ${0.07 * multiplier}) 0%, transparent 60%)`,
        }}
      />

      {/* Orbital lines SVG */}
      {showOrbits && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <ellipse
            cx="500"
            cy="300"
            rx="420"
            ry="160"
            fill="none"
            stroke={`oklch(65% 0.17 220 / ${0.12 * multiplier})`}
            strokeWidth="1"
          />
          <ellipse
            cx="500"
            cy="280"
            rx="290"
            ry="100"
            fill="none"
            stroke={`oklch(65% 0.17 220 / ${0.09 * multiplier})`}
            strokeWidth="0.8"
          />
          <ellipse
            cx="500"
            cy="320"
            rx="560"
            ry="220"
            fill="none"
            stroke={`oklch(65% 0.17 220 / ${0.06 * multiplier})`}
            strokeWidth="0.6"
          />
        </svg>
      )}

      {/* Telemetry dots */}
      {showDots &&
        TELEMETRY_DOTS.map((dot, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--orbital)',
            }}
            animate={
              reducedMotion
                ? { opacity: 0.4 }
                : { opacity: [0.3, 1, 0.3] }
            }
            transition={
              reducedMotion
                ? {}
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: dot.delay,
                  }
            }
          />
        ))}
    </div>
  );
}
