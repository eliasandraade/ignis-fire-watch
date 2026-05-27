import type { ReactNode } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons for Vite — run once at module load
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Props {
  center: [number, number];
  zoom?: number;
  children?: ReactNode;
  darkTiles?: boolean;
  zoomControl?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function OrbitalMap({
  center,
  zoom = 11,
  children,
  darkTiles = true,
  zoomControl = true,
  className,
  style,
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%', ...style }}
      className={`${darkTiles ? 'ignis-dark-map' : ''} ${className ?? ''}`.trim()}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {zoomControl && <ZoomControl position="bottomright" />}
      {children}
    </MapContainer>
  );
}
