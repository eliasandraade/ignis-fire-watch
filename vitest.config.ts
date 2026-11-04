import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Unit tests only: e2e/*.spec.ts belong to Playwright (npm run test:e2e).
export default mergeConfig(
  viteConfig,
  defineConfig({ test: { include: ['src/**/*.test.{ts,tsx}'] } }),
);
