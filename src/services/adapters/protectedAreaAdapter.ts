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
    // Works for both POLYGON ((...)) and first ring of MULTIPOLYGON (((...)))
    const match = wkt.match(/\(\(([^)]+)\)/);
    if (!match) return null;
    return match[1].split(',').map(pair => {
      const parts = pair.trim().split(/\s+/);
      return [parseFloat(parts[0]), parseFloat(parts[1])] as [number, number];
    });
  } catch {
    return null;
  }
}

function wktToGeoJson(wkt: string | null, centerLat: number | null, centerLng: number | null): GeoJSON {
  if (wkt) {
    const ring = parseWktRing(wkt);
    if (ring && ring.length >= 3) {
      const isMulti = /^MULTIPOLYGON/i.test(wkt.trim());
      return isMulti
        ? { type: 'MultiPolygon', coordinates: [[ring]] }
        : { type: 'Polygon', coordinates: [ring] };
    }
  }
  // Fallback: ~0.08° bounding box around center point
  const lat = centerLat ?? -4.5;
  const lng = centerLng ?? -39.0;
  const d = 0.08;
  return {
    type: 'Polygon',
    coordinates: [[
      [lng - d, lat - d], [lng + d, lat - d],
      [lng + d, lat + d], [lng - d, lat + d],
      [lng - d, lat - d],
    ]],
  };
}

function mapDataQuality(raw: string | null): DataQuality {
  if (raw === 'estimated') return 'estimated';
  if (raw === 'official') return 'official';
  return 'mock';
}

export function adaptProtectedArea(api: ApiProtectedAreaRead): ProtectedArea {
  return {
    id:          api.id,
    name:        api.name,
    type:        CATEGORY_LABEL[api.category] ?? api.category,
    state:       api.state,
    hectares:    api.area_ha ?? 0,
    risk:        'low',
    center:      [api.center_lat ?? -4.5, api.center_lng ?? -39.0],
    geometry:    wktToGeoJson(api.geometry_wkt, api.center_lat, api.center_lng),
    description: api.description ?? '',
    source:      api.source ?? 'IGNIS/API',
    confidence:  api.data_quality === 'estimated' ? 75 : 85,
    lastUpdated: api.updated_at,
    dataQuality: mapDataQuality(api.data_quality),
  };
}
