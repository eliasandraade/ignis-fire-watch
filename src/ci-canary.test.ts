import { expect, it } from 'vitest';

// Deliberate failure: proves a failing test fails the CI check. Never merge.
it('ci canary must fail', () => {
  expect(1).toBe(2);
});
