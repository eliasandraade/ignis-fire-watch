/**
 * Base map tiles. The default is the OpenStreetMap standard layer, suitable
 * only for low-volume testing under the OSMF tile usage policy. A deployment
 * must set VITE_TILE_URL / VITE_TILE_ATTRIBUTION to an institutional or
 * contracted provider and add its host to the CSP img-src (deploy/nginx).
 */
export interface TileConfig {
  url: string;
  attribution: string;
  maxZoom: number;
}

const OSM: TileConfig = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};

export function tileConfig(env: Record<string, string | undefined> = import.meta.env): TileConfig {
  const url = env.VITE_TILE_URL?.trim();
  if (!url) return OSM;
  return {
    url,
    // A custom provider without attribution would breach most licences.
    attribution: env.VITE_TILE_ATTRIBUTION?.trim() || 'Atribuição do provedor não configurada',
    maxZoom: Number(env.VITE_TILE_MAX_ZOOM) || 19,
  };
}
