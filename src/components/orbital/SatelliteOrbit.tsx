import { motion, useReducedMotion } from 'framer-motion';
import { Satellite } from 'lucide-react';

interface SatelliteOrbitProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal';
}

export function SatelliteOrbit({
  size = 80,
  color = 'var(--orbital)',
  speed = 'slow',
}: SatelliteOrbitProps) {
  const reducedMotion = useReducedMotion();
  const duration = speed === 'slow' ? 14 : 10;

  // Ellipse radii relative to total size
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.42;
  const ry = size * 0.18;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {/* Orbit ring SVG */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.35"
        />
      </svg>

      {/* Central glowing dot */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - 4,
          left: cx - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px 2px ${color}`,
        }}
        animate={
          reducedMotion
            ? {}
            : {
                boxShadow: [
                  `0 0 4px 1px ${color}`,
                  `0 0 12px 4px ${color}`,
                  `0 0 4px 1px ${color}`,
                ],
              }
        }
        transition={
          reducedMotion
            ? {}
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Orbiting satellite icon */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - 8,
          left: cx - 8,
          width: 16,
          height: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
        animate={
          reducedMotion
            ? { x: rx, y: 0 }
            : {
                // parametric ellipse: x = cx + rx*cos(t), y = cy + ry*sin(t)
                // We offset from the center div's initial position (cx, cy)
                x: [
                  rx, rx * 0.707, 0, -rx * 0.707,
                  -rx, -rx * 0.707, 0, rx * 0.707, rx,
                ],
                y: [
                  0, ry * 0.707, ry, ry * 0.707,
                  0, -ry * 0.707, -ry, -ry * 0.707, 0,
                ],
              }
        }
        transition={
          reducedMotion
            ? {}
            : {
                duration,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
              }
        }
      >
        <Satellite size={12} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
