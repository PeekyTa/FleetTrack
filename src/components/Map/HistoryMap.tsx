import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../../types/index';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const currentIcon = L.divIcon({
  className: 'history-current-marker',
  html: `
    <div style="
      width: 18px; height: 18px; border-radius: 50%;
      background: #2563EB; border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(37,99,235,0.3), 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const startIcon = L.divIcon({
  className: 'history-start-marker',
  html: `<div style="width: 12px; height: 12px; border-radius: 50%; background: #10B981; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface FitHistoryProps {
  positions: [number, number][];
}

function FitHistory({ positions }: FitHistoryProps) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 16 });
    }
  }, [positions, map]);
  return null;
}

interface HistoryMapProps {
  history: Location[];
  progressPercent: number;
  height?: string;
}

export function HistoryMap({ history, progressPercent, height = '100%' }: HistoryMapProps) {
  // Sort chronologically (oldest first)
  const sorted = useMemo(
    () => [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [history]
  );

  const positions: [number, number][] = useMemo(
    () => sorted.map((loc) => [loc.latitude, loc.longitude]),
    [sorted]
  );

  const progressIndex = Math.min(
    Math.floor((progressPercent / 100) * (positions.length - 1)),
    positions.length - 1
  );

  const visiblePositions = positions.slice(0, progressIndex + 1);
  const currentPos = positions[progressIndex] || positions[0];

  if (positions.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', borderRadius: 12 }}>
        <span style={{ color: '#94A3B8', fontSize: 14 }}>Aucun historique de position disponible</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={positions[0]}
      zoom={14}
      style={{ height, width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitHistory positions={positions} />

      {/* Full path (faded) */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#94A3B8', weight: 2, dashArray: '6 4', opacity: 0.4 }}
      />

      {/* Traveled path */}
      {visiblePositions.length > 1 && (
        <Polyline
          positions={visiblePositions}
          pathOptions={{ color: '#2563EB', weight: 4, opacity: 0.8 }}
        />
      )}

      {/* Start marker */}
      <Marker position={positions[0]} icon={startIcon}>
        <Popup>
          <strong>Départ</strong><br />
          {new Date(sorted[0].timestamp).toLocaleTimeString('fr-FR')}
        </Popup>
      </Marker>

      {/* Current position */}
      {currentPos && (
        <Marker position={currentPos} icon={currentIcon}>
          <Popup>
            <strong>Position actuelle</strong><br />
            Vitesse: {sorted[progressIndex]?.speed?.toFixed(1) ?? '—'} km/h<br />
            {new Date(sorted[progressIndex]?.timestamp).toLocaleTimeString('fr-FR')}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
