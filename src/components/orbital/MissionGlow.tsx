interface MissionGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

export function MissionGlow({
  color = 'oklch(65% 0.17 220)',
  size = 400,
  opacity = 0.18,
  style,
}: MissionGlowProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
