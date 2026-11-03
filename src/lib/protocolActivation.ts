/**
 * Protocol activation (War Room) as a pure state machine.
 *
 * Availability is DERIVED from the current data source on every render and is
 * never stored: if the war-room query fails and later recovers (polling), the
 * button becomes usable again without remounting the page.
 */
export type ProtocolPhase =
  | 'idle'        // nothing attempted yet
  | 'pending'     // request sent, waiting for the backend
  | 'confirmed'   // backend answered 2xx
  | 'failed'      // backend error: NOT registered, retry allowed
  | 'simulated';  // demo mode: nothing registered anywhere

export type ProtocolEvent =
  | { type: 'submit' }
  | { type: 'success' }
  | { type: 'failure' }
  | { type: 'simulate' }
  | { type: 'incident-changed' };

export function protocolReducer(phase: ProtocolPhase, event: ProtocolEvent): ProtocolPhase {
  switch (event.type) {
    case 'submit':
      return phase === 'pending' || phase === 'confirmed' ? phase : 'pending';
    case 'success':
      return phase === 'pending' ? 'confirmed' : phase;
    case 'failure':
      return phase === 'pending' ? 'failed' : phase;
    case 'simulate':
      return 'simulated';
    case 'incident-changed':
      // A confirmation belongs to one incident; never carry it over.
      return phase === 'pending' ? phase : 'idle';
  }
}

export interface ProtocolContext {
  apiEnabled: boolean;
  /** True only when the incident shown was loaded from the API (not mock/fallback). */
  incidentFromApi: boolean;
  hasIncident: boolean;
}

export interface ProtocolButtonView {
  disabled: boolean;
  label: string;
  /** Unavailable right now because of the data source (not because of the phase). */
  unavailable: boolean;
}

export function protocolButtonView(phase: ProtocolPhase, ctx: ProtocolContext): ProtocolButtonView {
  if (!ctx.apiEnabled) {
    return {
      disabled: false,
      unavailable: false,
      label: phase === 'simulated'
        ? 'Simulação concluída — nada registrado'
        : 'Registrar Ativação de Protocolo',
    };
  }
  const unavailable = !ctx.hasIncident || !ctx.incidentFromApi;
  if (phase === 'pending') {
    return { disabled: true, unavailable, label: 'Aguardando confirmação da API…' };
  }
  if (phase === 'confirmed') {
    return { disabled: true, unavailable, label: '✓ Ativação registrada no IGNIS' };
  }
  if (unavailable) {
    return { disabled: true, unavailable, label: 'Indisponível (incidente fora da API)' };
  }
  if (phase === 'failed') {
    return { disabled: false, unavailable, label: 'Falhou — tentar novamente' };
  }
  return { disabled: false, unavailable, label: 'Registrar Ativação de Protocolo' };
}
