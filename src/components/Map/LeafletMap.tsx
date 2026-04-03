import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DeviceLocation, GeofenceZone } from '../../types/index';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
const STATUS_COLORS: Record<string, string> = {
  ONLINE: '#10B981',
  OFFLINE: '#94A3B8',
  LOW_BATTERY: '#F59E0B',
  WARNING: '#EF4444',
};
function createDeviceIcon(status: string): L.DivIcon {
  const color = STATUS_COLORS[status] || '#94A3B8';
  return L.divIcon({
    className: 'custom-device-marker',
    html: `
      <div style="
        width: 28px; height: 28px; border-radius: 50%;
        background: ${color}; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}
interface FitBoundsProps {
  locations: DeviceLocation[];
}
function FitBounds({ locations }: FitBoundsProps) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((dl) => [dl.location.latitude, dl.location.longitude] as L.LatLngTuple)
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, map]);
  return null;
}
interface LeafletMapProps {
  deviceLocations: DeviceLocation[];
  selectedDeviceId?: number | null;
  onDeviceClick?: (deviceId: number) => void;
  geofenceZones?: GeofenceZone[];
  showGeofences?: boolean;
  height?: string;
  center?: [number, number];
  zoom?: number;
}
export function LeafletMap({
  deviceLocations,
  onDeviceClick,
  geofenceZones = [],
  showGeofences = false,
  height = '100%',
  center = [36.8065, 10.1815],
  zoom = 10,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deviceLocations.length > 0 && <FitBounds locations={deviceLocations} />}
      {}
      {deviceLocations.map((dl) => (
        <Marker
          key={dl.deviceId}
          position={[dl.location.latitude, dl.location.longitude]}
          icon={createDeviceIcon(dl.status)}
          eventHandlers={{
            click: () => onDeviceClick?.(dl.deviceId),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{dl.deviceName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{dl.deviceIdentifier}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Statut</span>
                  <span style={{
                    color: STATUS_COLORS[dl.status],
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}>
                    {dl.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Batterie</span>
                  <span style={{ fontWeight: 500 }}>{dl.battery}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Signal</span>
                  <span style={{ fontWeight: 500 }}>{dl.signal}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Groupe</span>
                  <span style={{ fontWeight: 500 }}>{dl.groupName}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {}
      {showGeofences && geofenceZones.filter((z) => z.active).map((zone) => {
        const coords = zone.coordinates;
        if (coords.type === 'circle' && coords.center && coords.radius) {
          return (
            <Circle
              key={zone.id}
              center={[coords.center.lat, coords.center.lng]}
              radius={coords.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.15,
                weight: 2,
              }}
            >
              <Popup><strong>{zone.name}</strong></Popup>
            </Circle>
          );
        }
        if (coords.type === 'polygon' && coords.points) {
          return (
            <Polygon
              key={zone.id}
              positions={coords.points.map((p) => [p.lat, p.lng] as L.LatLngTuple)}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.15,
                weight: 2,
              }}
            >
              <Popup><strong>{zone.name}</strong></Popup>
            </Polygon>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}
