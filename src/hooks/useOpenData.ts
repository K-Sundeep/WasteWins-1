import { useEffect, useMemo, useState } from 'react';

export interface RecyclingSite {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export function useOpenDataRecycling(radiusMeters = 5000) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [sites, setSites] = useState<RecyclingSite[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    const fetchOverpass = async () => {
      if (!coords) return;
      setLoading(true);
      setError(null);
      try {
        // Query OSM for recycling amenities around current location
        const q = `data=[out:json];(node["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon});way["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon});relation["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon}););out center 50;`;
        const url = `https://overpass-api.de/api/interpreter?${q}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Overpass ${res.status}`);
        const data = await res.json();
        const elements = (data?.elements || []) as any[];
        const mapped: RecyclingSite[] = elements.map((el) => ({
          id: String(el.id),
          name: el.tags?.name,
          lat: el.lat ?? el.center?.lat,
          lon: el.lon ?? el.center?.lon,
          tags: el.tags,
        })).filter((e) => e.lat && e.lon);
        setSites(mapped);
      } catch (e: any) {
        setError(e?.message || 'Failed to load open data');
      } finally {
        setLoading(false);
      }
    };
    fetchOverpass();
  }, [coords, radiusMeters]);

  return useMemo(() => ({ coords, sites, loading, error }), [coords, sites, loading, error]);
}
