const MAPBOX_TOKEN = (import.meta as any)?.env?.VITE_MAPBOX_TOKEN as string | undefined;

export function hasMapbox(): boolean {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN.length > 0);
}

export type GeocodeResult = { lat: number; lon: number } | null;

export async function geocodeAddressMapbox(address: string): Promise<GeocodeResult> {
  if (!hasMapbox()) return null;
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const feat = json?.features?.[0];
    const center = feat?.center;
    if (Array.isArray(center) && center.length === 2) {
      return { lon: Number(center[0]), lat: Number(center[1]) };
    }
    return null;
  } catch {
    return null;
  }
}

export async function routeDistanceKmMapbox(origin: { lat: number; lon: number }, dest: { lat: number; lon: number }): Promise<number | null> {
  if (!hasMapbox()) return null;
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?alternatives=false&overview=false&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const route = json?.routes?.[0];
    const meters = route?.distance;
    if (typeof meters === 'number' && isFinite(meters)) return meters / 1000;
    return null;
  } catch {
    return null;
  }
}
