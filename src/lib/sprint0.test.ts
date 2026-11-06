import { describe, expect, it } from 'vitest';
import {
  ACTION_STATE_LABEL,
  isActionEnabled,
  mutationActionState,
} from '@/lib/actionState';
import { integrityNotice } from '@/lib/dataIntegrity';
import { createDataSourceMeta, getDataSourceLabel } from '@/services/dataSource';

describe('actionState', () => {
  it('actions without a backend are disabled and labelled as not implemented', () => {
    expect(isActionEnabled('nao-implementado')).toBe(false);
    expect(ACTION_STATE_LABEL['nao-implementado']).toMatch(/Não implementado/);
  });

  it('real actions only become "funcional" after the request settles successfully', () => {
    expect(mutationActionState({ isPending: true, isError: false })).toBe('aguardando-confirmacao');
    expect(mutationActionState({ isPending: false, isError: true })).toBe('erro');
    expect(mutationActionState({ isPending: false, isError: false })).toBe('funcional');
    expect(isActionEnabled('aguardando-confirmacao')).toBe(false);
  });

  it('has no simulated/demonstrative state', () => {
    expect(Object.keys(ACTION_STATE_LABEL)).not.toContain('demonstrativo');
  });
});

describe('integrityNotice', () => {
  it('shows nothing when every query succeeded', () => {
    expect(integrityNotice(0)).toBeNull();
  });

  it('failed queries are reported as unavailable, never as substituted data', () => {
    const n = integrityNotice(2);
    expect(n?.level).toBe('degraded');
    expect(n?.message).toMatch(/2 consultas/);
    expect(n?.message).toMatch(/não estão sendo exibidas/);
    expect(n?.message.toLowerCase()).not.toMatch(/demonstra|fictíc|protótipo/);
  });
});

describe('dataSource', () => {
  it('labels never advertise real-time or demonstrative data', () => {
    for (const s of ['loading', 'ok', 'empty', 'error'] as const) {
      expect(getDataSourceLabel(s).toLowerCase()).not.toMatch(/tempo real|ao vivo|live|demonstra|fictíc/);
    }
  });

  it('derives the status only from the real request state', () => {
    expect(createDataSourceMeta(true, true).status).toBe('ok');
    expect(createDataSourceMeta(true, false).status).toBe('empty');
    expect(createDataSourceMeta(false, false).status).toBe('error');
    expect(createDataSourceMeta(false, false, true).status).toBe('loading');
  });
});
