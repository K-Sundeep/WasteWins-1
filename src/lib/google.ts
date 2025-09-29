const GOOGLE_KEY = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export function hasGoogle(): boolean {
  return Boolean(GOOGLE_KEY && GOOGLE_KEY.length > 0);
}

export type LatLon = { lat: number; lon: number };

export async function geocodeAddressGoogle(address: string): Promise<LatLon | null> {
  if (!hasGoogle()) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const first = json?.results?.[0]?.geometry?.location;
    if (first && typeof first.lat === 'number' && typeof first.lng === 'number') {
      return { lat: first.lat, lon: first.lng };
    }
    return null;
  } catch {
    return null;
  }
}

export async function routeDistanceKmGoogle(origin: LatLon, dest: LatLon): Promise<number | null> {
  if (!hasGoogle()) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lon}&destination=${dest.lat},${dest.lon}&mode=driving&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const leg = json?.routes?.[0]?.legs?.[0];
    const meters = leg?.distance?.value;
    if (typeof meters === 'number' && isFinite(meters)) return meters / 1000;
    return null;
  } catch {
    return null;
  }
}
