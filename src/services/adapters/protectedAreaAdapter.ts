import type { ProtectedArea, DataQuality, GeoJSON } from '@/types/domain';
import type { ApiProtectedAreaRead } from '@/services/api/types';

const CATEGORY_LABEL: Record<string, string> = {
  APA:   'APA',
  PARNA: 'Parque Nacional',
  RESEX: 'RESEX',
  RPPN:  'RPPN',
  REBIO: 'Reserva Biológica',
  ESEC:  'Estação Ecológica',
  PE:    'Parque Estadual',
  FLONA: 'Floresta Nacional',
  ARI:   'ARI',
  other: 'Área Protegida',
};

function parseWktRing(wkt: string): [number, number][] | null {
  try {
    // Works for POLYGON ((lng lat, ...)) and MULTIPOLYGON (((lng lat, ...)))
    // The captured group may start with '(' for MULTIPOLYGON — strip it.
    const match = wkt.match(/\(\(+([^)]+)\)/);
    if (!match) return null;
    const content = match[1].replace(/^\(+/, '');
    return content.split(',').map(pair => {
      const parts = pair.trim().split(/\s+/);
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (isNaN(lng) || isNaN(lat)) return null;
      return [lng, lat] as [number, number];
    }).filter((p): p is [number, number] => p !== null);
  } catch {
    return null;
  }
}

/** Geometria real a partir do WKT da API. Sem WKT válido não há perímetro (nada é estimado). */
function wktToGeoJson(wkt: string | null): { geometry: GeoJSON; ring: [number, number][] } | null {
  if (!wkt) return null;
  const ring = parseWktRing(wkt);
  if (!ring || ring.length < 3) return null;
  const isMulti = /^MULTIPOLYGON/i.test(wkt.trim());
  const geometry: GeoJSON = isMulti
    ? { type: 'MultiPolygon', coordinates: [[ring]] }
    : { type: 'Polygon', coordinates: [ring] };
  return { geometry, ring };
}

function ringCentroid(ring: [number, number][]): [number, number] {
  const lng = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const lat = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  return [lat, lng];
}

const DATA_QUALITIES: readonly DataQuality[] = ['high', 'medium', 'low', 'estimated', 'mock'];

function mapDataQuality(raw: string | null): DataQuality {
  return DATA_QUALITIES.includes(raw as DataQuality) ? (raw as DataQuality) : 'unknown';
}

export function adaptProtectedArea(api: ApiProtectedAreaRead): ProtectedArea {
  const shape = wktToGeoJson(api.geometry_wkt);
  const center: [number, number] | null =
    api.center_lat != null && api.center_lng != null
      ? [api.center_lat, api.center_lng]
      : shape ? ringCentroid(shape.ring) : null;

  return {
    id:          api.id,
    name:        api.name,
    type:        CATEGORY_LABEL[api.category] ?? api.category,
    state:       api.state,
    hectares:    api.area_ha,
    // O backend não calcula risco por área: nenhum nível é atribuído aqui.
    risk:        null,
    center,
    geometry:    shape?.geometry ?? null,
    description: api.description ?? '',
    source:      api.source,
    lastUpdated: api.updated_at,
    dataQuality: mapDataQuality(api.data_quality),
  };
}
