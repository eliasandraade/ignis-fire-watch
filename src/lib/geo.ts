import type { GeoJSON } from '@/types/domain';

export function getPolygonPositions(geometry: GeoJSON): [number, number][] {
  const ring = geometry.type === 'Polygon'
    ? (geometry.coordinates as number[][][])[0]
    : ((geometry.coordinates as number[][][][])[0])[0];
  return ring.map(([lng, lat]) => [lat, lng] as [number, number]);
}
