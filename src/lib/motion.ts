// IGNIS Orbital — Animation variant helpers
// Used across orbital components for consistent motion design

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
};

export const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const criticalPulseVariants = {
  pulse: {
    boxShadow: [
      '0 0 0 0 oklch(58% 0.22 25 / 0)',
      '0 0 0 6px oklch(58% 0.22 25 / 0.35)',
      '0 0 0 12px oklch(58% 0.22 25 / 0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeOut' as const },
  },
};

export const orbitalGlowVariants = {
  glow: {
    boxShadow: [
      '0 0 0 0 oklch(65% 0.17 220 / 0)',
      '0 0 0 4px oklch(65% 0.17 220 / 0.25)',
      '0 0 0 8px oklch(65% 0.17 220 / 0)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeOut' as const },
  },
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
};
