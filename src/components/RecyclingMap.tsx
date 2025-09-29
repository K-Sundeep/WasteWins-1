import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useOpenDataRecycling } from '../hooks/useOpenData';

export function RecyclingMap() {
  const { coords, sites } = useOpenDataRecycling(5000);
  // Alias react-leaflet components to any to avoid transient TS prop issues
  const AnyMapContainer = MapContainer as any;
  const AnyTileLayer = TileLayer as any;
  const AnyCircleMarker = CircleMarker as any;

  const center = useMemo<[number, number] | null>(() => {
    if (coords) return [coords.lat, coords.lon];
    if (sites && sites.length > 0) return [sites[0].lat, sites[0].lon];
    return null;
  }, [coords, sites]);

  if (!sites || !center) {
    return null; // keep UI minimal; show map only when we have data
  }

  return (
    <div className="relative h-60 rounded-md overflow-hidden border">
      {/* Count badge */}
      <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur px-2 py-1 rounded text-xs shadow">
        Centers: <span className="font-medium">{sites.length}</span>
      </div>
      <AnyMapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <AnyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((s) => (
          <AnyCircleMarker key={s.id} center={[s.lat, s.lon]} radius={6} pathOptions={{ color: '#2F8A5C' }}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{s.name || 'Recycling Center'}</div>
                {s.tags?.operator && <div>Operator: {s.tags.operator}</div>}
              </div>
            </Popup>
          </AnyCircleMarker>
        ))}
      </AnyMapContainer>
      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur px-2 py-1 rounded text-xs shadow flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2F8A5C' }} />
        <span>Recycling Center</span>
      </div>
    </div>
  );
}
