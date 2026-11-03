import { describe, expect, it } from 'vitest';
import {
  protocolButtonView,
  protocolReducer,
  type ProtocolEvent,
  type ProtocolPhase,
} from '@/lib/protocolActivation';

const api = (incidentFromApi: boolean, hasIncident = true) => ({
  apiEnabled: true,
  incidentFromApi,
  hasIncident,
});

const run = (events: ProtocolEvent[], from: ProtocolPhase = 'idle') =>
  events.reduce(protocolReducer, from);

describe('protocol activation — API failure and recovery (Codex P2, PR #4)', () => {
  it('is unavailable while the war-room data is fallback, and re-enables after recovery', () => {
    // 1) war-room query failed: incident shown is not from the API
    const phase: ProtocolPhase = 'idle';
    const failed = protocolButtonView(phase, api(false));
    expect(failed.disabled).toBe(true);
    expect(failed.unavailable).toBe(true);
    expect(failed.label).toMatch(/Indisponível/);

    // 2) polling recovers: same phase (no remount, no reset), API incident loaded
    const recovered = protocolButtonView(phase, api(true));
    expect(recovered.disabled).toBe(false);
    expect(recovered.unavailable).toBe(false);
    expect(recovered.label).toBe('Registrar Ativação de Protocolo');
  });

  it('regression: an attempt while unavailable does not lock the button forever', () => {
    // The old implementation stored "indisponivel" on click; the reducer has no
    // such phase, so availability can only come from the current context.
    const phase = run([]); // click while unavailable dispatches nothing
    expect(protocolButtonView(phase, api(false)).disabled).toBe(true);
    expect(protocolButtonView(phase, api(true)).disabled).toBe(false);
  });

  it('backend failure allows retry, and success is reported only after 2xx', () => {
    const pending = run([{ type: 'submit' }]);
    expect(pending).toBe('pending');
    expect(protocolButtonView(pending, api(true))).toMatchObject({
      disabled: true,
      label: 'Aguardando confirmação da API…',
    });

    const failed = protocolReducer(pending, { type: 'failure' });
    expect(failed).toBe('failed');
    expect(protocolButtonView(failed, api(true))).toMatchObject({
      disabled: false,
      label: 'Falhou — tentar novamente',
    });

    const confirmed = run([{ type: 'submit' }, { type: 'success' }], failed);
    expect(confirmed).toBe('confirmed');
    expect(protocolButtonView(confirmed, api(true)).label).toMatch(/registrada no IGNIS/);
  });

  it('failure during an outage then recovery restores the retry action', () => {
    const failed = run([{ type: 'submit' }, { type: 'failure' }]);
    expect(protocolButtonView(failed, api(false)).disabled).toBe(true); // outage
    expect(protocolButtonView(failed, api(true))).toMatchObject({ disabled: false }); // recovered
  });

  it('never confirms without a pending request', () => {
    expect(protocolReducer('idle', { type: 'success' })).toBe('idle');
    expect(protocolReducer('failed', { type: 'success' })).toBe('failed');
  });

  it('a confirmation does not carry over to another incident', () => {
    expect(protocolReducer('confirmed', { type: 'incident-changed' })).toBe('idle');
    expect(protocolReducer('pending', { type: 'incident-changed' })).toBe('pending');
  });

  it('demo mode is always a labelled simulation', () => {
    const view = protocolButtonView(protocolReducer('idle', { type: 'simulate' }), {
      apiEnabled: false,
      incidentFromApi: false,
      hasIncident: true,
    });
    expect(view.label).toMatch(/Simulação concluída — nada registrado/);
  });
});
