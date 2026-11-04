import { describe, expect, it } from 'vitest';
import {
  brightnessText,
  canTrustEmpty,
  confidenceText,
  coordinatesText,
  dateRangeWindow,
  emptyMessage,
  formatAge,
  formatInstant,
  frpText,
  periodWindow,
  SOURCE_STYLE,
} from './orbital';
import { tileConfig } from './tiles';
import { filterQuery } from '@/services/api/orbitalService';
import type { SourceStatus } from '@/services/api/orbitalTypes';

const source = (over: Partial<SourceStatus>): SourceStatus => ({
  source: 'INPE_QUEIMADAS',
  label: 'INPE',
  state: 'live',
  message: '',
  last_success_at: null,
  latest_observation_at: null,
  stale_after_minutes: 60,
  origin: 'live',
  products: [],
  ...over,
});

describe('observation windows', () => {
  it('presets end now (rounded up to the minute) and span the right hours', () => {
    const now = new Date('2026-11-04T12:00:30Z');
    expect(periodWindow('24h', now)).toEqual({ from: '2026-11-03T12:01:00.000Z', to: '2026-11-04T12:01:00.000Z' });
    const week = periodWindow('7d', now);
    expect(new Date(week.to).getTime() - new Date(week.from).getTime()).toBe(7 * 24 * 3600 * 1000);
  });

  it('custom ranges include the last day and refuse invalid or too long ranges', () => {
    expect(dateRangeWindow('2026-11-03', '2026-11-03')).toEqual({
      from: '2026-11-03T00:00:00.000Z',
      to: '2026-11-04T00:00:00.000Z',
    });
    expect(dateRangeWindow('2026-11-04', '2026-11-03')).toBeNull();
    expect(dateRangeWindow('2026-01-01', '2026-11-03')).toBeNull();
    expect(dateRangeWindow('', '2026-11-03')).toBeNull();
  });

  it('filters become a query string without empty values', () => {
    expect(filterQuery({ from: 'a', to: 'b', jurisdiction: '2304400' })).toBe('from=a&to=b&jurisdiction=2304400');
  });
});

describe('empty results are explained by the source state', () => {
  it('trusts "no detection" only when a source is live', () => {
    expect(canTrustEmpty([source({ state: 'live' })])).toBe(true);
    expect(canTrustEmpty([source({ state: 'stale' })])).toBe(false);
    expect(emptyMessage([source({ state: 'live' })])).toMatch(/Nenhum foco/);
  });

  it('never claims absence when nothing was ingested or configured', () => {
    const msg = emptyMessage([source({ state: 'disabled' }), source({ state: 'never_ingested' })]);
    expect(msg).toMatch(/não pode ser afirmada/);
    expect(emptyMessage([source({ state: 'unavailable' })])).toMatch(/não é confirmada/);
  });

  it('judges a source filter by that source only', () => {
    const sources = [source({ source: 'NASA_FIRMS', state: 'disabled' }), source({ state: 'live' })];
    expect(canTrustEmpty(sources, 'NASA_FIRMS')).toBe(false);
    expect(canTrustEmpty(sources, 'INPE_QUEIMADAS')).toBe(true);
  });
});

describe('sensor fields are shown only with known semantics', () => {
  it('VIIRS confidence is a class, MODIS a percentage, INPE none', () => {
    expect(confidenceText({ confidence: 'nominal', confidence_pct: null, instrument: 'VIIRS' })).toBe('nominal (classe VIIRS)');
    expect(confidenceText({ confidence: null, confidence_pct: 61, instrument: 'MODIS' })).toBe('61% (estimativa MODIS, 0–100)');
    expect(confidenceText({ confidence: null, confidence_pct: null, instrument: 'ABI' })).toBeNull();
  });

  it('brightness always names its channel; without a channel it is hidden', () => {
    expect(brightnessText({ brightness_k: 330.12, brightness_channel: 'VIIRS_I4' })).toBe('330.1 K · canal I-4 (VIIRS)');
    expect(brightnessText({ brightness_k: 330, brightness_channel: null })).toBeNull();
  });

  it('FRP in MW only for FIRMS (INPE does not document the unit)', () => {
    expect(frpText({ frp_mw: 1.15, source: 'NASA_FIRMS' })).toBe('1.15 MW');
    expect(frpText({ frp_mw: 43.2, source: 'INPE_QUEIMADAS' })).toBeNull();
  });

  it('colours tell sources apart and are not a severity scale', () => {
    expect(new Set(Object.values(SOURCE_STYLE).map(s => s.color)).size).toBe(2);
  });
});

describe('formatting', () => {
  it('shows Fortaleza time and the UTC instant', () => {
    expect(formatInstant('2026-11-03T00:12:00Z')).toBe('02/11/2026, 21:12 (Fortaleza) · 00:12 UTC');
    expect(formatInstant(null)).toBe('—');
  });

  it('ages and coordinates', () => {
    const now = new Date('2026-11-04T12:00:00Z');
    expect(formatAge('2026-11-04T11:30:00Z', now)).toBe('há 30 min');
    expect(formatAge('2026-11-01T12:00:00Z', now)).toBe('há 3 dias');
    expect(formatAge(null, now)).toBe('nunca');
    expect(coordinatesText(-3.7319, -38.5267)).toBe('3.73190° S, 38.52670° O');
  });
});

describe('tile provider', () => {
  it('defaults to OpenStreetMap with attribution and accepts an institutional provider', () => {
    expect(tileConfig({}).attribution).toMatch(/OpenStreetMap/);
    const custom = tileConfig({ VITE_TILE_URL: 'https://tiles.example.org/{z}/{x}/{y}.png', VITE_TILE_ATTRIBUTION: '© Órgão' });
    expect(custom).toMatchObject({ url: 'https://tiles.example.org/{z}/{x}/{y}.png', attribution: '© Órgão' });
    expect(tileConfig({ VITE_TILE_URL: 'https://t/{z}/{x}/{y}.png' }).attribution).toMatch(/não configurada/);
  });
});
