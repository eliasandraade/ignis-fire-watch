/**
 * Pure rules for presenting persisted orbital detections. Kept free of React so
 * that the honesty rules (no invented severity, no unit without a known sensor)
 * are unit-tested.
 */
import type { Detection, DetectionFilters, OrbitalSource, SourceState, SourceStatus } from '@/services/api/orbitalTypes';

export const THERMAL_ANOMALY_DISCLAIMER =
  'Foco de calor é uma anomalia térmica vista por satélite. Não é incêndio confirmado: exige validação por operador humano.';

export const CEARA_BOUNDS: [[number, number], [number, number]] = [
  [-7.86, -41.43],
  [-2.78, -37.25],
];
export const CEARA_CENTER: [number, number] = [-5.2, -39.3];

export type PeriodKey = '24h' | '48h' | '7d' | '30d' | 'custom';

export const PERIODS: { key: Exclude<PeriodKey, 'custom'>; label: string; hours: number }[] = [
  { key: '24h', label: 'Últimas 24 h', hours: 24 },
  { key: '48h', label: 'Últimas 48 h', hours: 48 },
  { key: '7d', label: 'Últimos 7 dias', hours: 24 * 7 },
  { key: '30d', label: 'Últimos 30 dias', hours: 24 * 30 },
];

/** Observation window for a preset, ending now (rounded to the minute for cache keys). */
export function periodWindow(key: Exclude<PeriodKey, 'custom'>, now: Date = new Date()): { from: string; to: string } {
  const end = new Date(Math.ceil(now.getTime() / 60000) * 60000);
  const hours = PERIODS.find(p => p.key === key)?.hours ?? 24;
  const start = new Date(end.getTime() - hours * 3600 * 1000);
  return { from: start.toISOString(), to: end.toISOString() };
}

/** Custom window from two YYYY-MM-DD dates, inclusive of the last day (UTC). */
export function dateRangeWindow(fromDay: string, toDay: string): { from: string; to: string } | null {
  const valid = /^\d{4}-\d{2}-\d{2}$/;
  if (!valid.test(fromDay) || !valid.test(toDay)) return null;
  const start = new Date(`${fromDay}T00:00:00Z`);
  const end = new Date(`${toDay}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return null;
  end.setUTCDate(end.getUTCDate() + 1);
  if (end.getTime() - start.getTime() > 92 * 24 * 3600 * 1000) return null;
  return { from: start.toISOString(), to: end.toISOString() };
}

export const SOURCE_STYLE: Record<OrbitalSource, { label: string; color: string; short: string }> = {
  // Two hues to tell the providers apart — never a severity scale.
  NASA_FIRMS: { label: 'NASA FIRMS', color: '#38bdf8', short: 'FIRMS' },
  INPE_QUEIMADAS: { label: 'INPE Programa Queimadas', color: '#f472b6', short: 'INPE' },
};

export const STATE_LABEL: Record<SourceState, string> = {
  live: 'Atualizada',
  stale: 'Desatualizada',
  degraded: 'Parcial',
  unavailable: 'Indisponível',
  disabled: 'Desabilitada',
  never_ingested: 'Sem ingestão',
};

export const STATE_COLOR: Record<SourceState, string> = {
  live: '#22c55e',
  stale: '#f59e0b',
  degraded: '#f59e0b',
  unavailable: '#ef4444',
  disabled: '#94a3b8',
  never_ingested: '#94a3b8',
};

/** True when the sources can vouch for "no detection" meaning "nothing was seen". */
export function canTrustEmpty(sources: SourceStatus[], source?: OrbitalSource): boolean {
  const relevant = source ? sources.filter(s => s.source === source) : sources;
  return relevant.some(s => s.state === 'live' || s.state === 'degraded');
}

/** Short explanation for an empty result, depending on why it is empty. */
export function emptyMessage(sources: SourceStatus[], source?: OrbitalSource): string {
  if (canTrustEmpty(sources, source)) {
    return 'Nenhum foco de calor registrado no período e filtros selecionados.';
  }
  const relevant = source ? sources.filter(s => s.source === source) : sources;
  if (relevant.length > 0 && relevant.every(s => s.state === 'disabled' || s.state === 'never_ingested')) {
    return 'Sem dados para avaliar: nenhuma fonte ingerida ou configurada. Ausência de focos não pode ser afirmada.';
  }
  return 'Sem focos no período, mas as fontes estão desatualizadas ou indisponíveis: a ausência não é confirmada.';
}

const DATE_TIME = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Fortaleza',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Local time in Fortaleza (UTC−3), plus the UTC instant for traceability. */
export function formatInstant(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const utc = date.toISOString().slice(11, 16);
  return `${DATE_TIME.format(date)} (Fortaleza) · ${utc} UTC`;
}

export function formatAge(iso: string | null | undefined, now: Date = new Date()): string {
  if (!iso) return 'nunca';
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `há ${hours} h`;
  return `há ${Math.round(hours / 24)} dias`;
}

/** Confidence exactly as the sensor reports it; null when the provider has none. */
export function confidenceText(d: Pick<Detection, 'confidence' | 'confidence_pct' | 'instrument'>): string | null {
  if (d.confidence) {
    const label = { low: 'baixa', nominal: 'nominal', high: 'alta' }[d.confidence];
    return `${label} (classe ${d.instrument})`;
  }
  if (d.confidence_pct != null) return `${d.confidence_pct}% (estimativa ${d.instrument}, 0–100)`;
  return null;
}

export function brightnessText(d: Pick<Detection, 'brightness_k' | 'brightness_channel'>): string | null {
  if (d.brightness_k == null || !d.brightness_channel) return null;
  const channel = d.brightness_channel === 'VIIRS_I4' ? 'canal I-4 (VIIRS)' : 'canais 21/22 (MODIS)';
  return `${d.brightness_k.toFixed(1)} K · ${channel}`;
}

export function frpText(d: Pick<Detection, 'frp_mw' | 'source'>): string | null {
  // Only FIRMS documents FRP in MW; INPE values stay in the raw record.
  if (d.frp_mw == null || d.source !== 'NASA_FIRMS') return null;
  return `${d.frp_mw.toFixed(2)} MW`;
}

export function coordinatesText(lat: number, lng: number): string {
  const ns = lat < 0 ? 'S' : 'N';
  const ew = lng < 0 ? 'O' : 'L';
  return `${Math.abs(lat).toFixed(5)}° ${ns}, ${Math.abs(lng).toFixed(5)}° ${ew}`;
}

export function defaultFilters(now: Date = new Date()): DetectionFilters {
  return periodWindow('7d', now);
}
