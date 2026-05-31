interface OrbitalGridProps {
  style?: React.CSSProperties;
  type?: 'dots' | 'lines';
}

export function OrbitalGrid({ style, type = 'dots' }: OrbitalGridProps) {
  const backgroundImage =
    type === 'dots'
      ? 'radial-gradient(circle, oklch(65% 0.17 220 / 0.06) 1px, transparent 1px)'
      : `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 27px,
          oklch(65% 0.17 220 / 0.05) 27px,
          oklch(65% 0.17 220 / 0.05) 28px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 27px,
          oklch(65% 0.17 220 / 0.05) 27px,
          oklch(65% 0.17 220 / 0.05) 28px
        )`;

  const backgroundSize = type === 'dots' ? '28px 28px' : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage,
        backgroundSize,
        opacity: 0.7,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
