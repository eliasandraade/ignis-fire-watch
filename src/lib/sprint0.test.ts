import { describe, expect, it } from 'vitest';
import {
  ACTION_STATE_LABEL,
  isActionEnabled,
  mutationActionState,
  unbackedActionState,
} from '@/lib/actionState';
import { integrityNotice } from '@/lib/dataIntegrity';
import { createDataSourceMeta, getDataSourceLabel } from '@/services/dataSource';

describe('actionState', () => {
  it('unbacked actions are simulations in demo mode and disabled with the real API', () => {
    expect(unbackedActionState(false)).toBe('demonstrativo');
    expect(unbackedActionState(true)).toBe('nao-implementado');
    expect(isActionEnabled('nao-implementado')).toBe(false);
  });

  it('real actions only become "funcional" after the request settles successfully', () => {
    expect(mutationActionState({ isPending: true, isError: false })).toBe('aguardando-confirmacao');
    expect(mutationActionState({ isPending: false, isError: true })).toBe('erro');
    expect(isActionEnabled('aguardando-confirmacao')).toBe(false);
  });

  it('simulation label says nothing is sent', () => {
    expect(ACTION_STATE_LABEL.demonstrativo.toLowerCase()).toContain('nada é enviado');
  });
});

describe('integrityNotice', () => {
  it('demo mode states that all data is fictitious', () => {
    const n = integrityNotice(false, 0);
    expect(n.level).toBe('demo');
    expect(n.message).toMatch(/fictícios/);
  });

  it('API mode with failed queries reports degraded data', () => {
    const n = integrityNotice(true, 2);
    expect(n.level).toBe('degraded');
    expect(n.message).toMatch(/2 consultas/);
    expect(n.message).toMatch(/Não use para decisão operacional/);
  });

  it('API mode never claims to be operational', () => {
    const n = integrityNotice(true, 0);
    expect(n.level).toBe('prototype');
    expect(n.message).toMatch(/NÃO OPERACIONAL/);
  });
});

describe('dataSource labels', () => {
  it('never advertise real-time data', () => {
    for (const s of ['api', 'demo', 'fallback', 'mixed', 'partial'] as const) {
      expect(getDataSourceLabel(s).toLowerCase()).not.toMatch(/tempo real|ao vivo|live/);
    }
  });

  it('demo mode is always labelled demonstrative (VITE_USE_API unset in tests)', () => {
    const meta = createDataSourceMeta(true, true);
    expect(meta.status).toBe('demo');
    expect(meta.isApi).toBe(false);
  });
});
