export type LatLon = { lat: number; lon: number };

import { hasGoogle, geocodeAddressGoogle, routeDistanceKmGoogle } from '../lib/google';

const FREE_ONLY = String(((import.meta as any)?.env?.VITE_FREE_ONLY_MODE) ?? '').toLowerCase() === 'true';

const cache = new Map<string, number>(); // session cache
const LS_PREFIX = 'ww_dist_cache_';

function cacheGet(key: string): number | null {
  if (cache.has(key)) return cache.get(key)!;
  try {
    const s = localStorage.getItem(LS_PREFIX + key);
    if (!s) return null;
    const v = Number(s);
    if (Number.isFinite(v)) {
      cache.set(key, v);
      return v;
    }
  } catch {}
  return null;
}

function cacheSet(key: string, km: number) {
  cache.set(key, km);
  try { localStorage.setItem(LS_PREFIX + key, String(km)); } catch {}
}

// Estimate driving distance (km) between origin coords and a destination address.
// Primary: Google Geocoding + Directions (if API key present)
// Fallback: Nominatim + OSRM demo
export async function estimateDistanceKm(origin: LatLon, destinationAddress: string): Promise<number | null> {
  try {
    const addr = destinationAddress?.trim();
    if (!addr) return null;
    const cacheKey = `${origin.lat},${origin.lon}|${addr}`;
    const cached = cacheGet(cacheKey);
    if (cached !== null) return cached;

    // Try Google first if available
    if (!FREE_ONLY && hasGoogle()) {
      const gDest = await geocodeAddressGoogle(addr);
      if (gDest) {
        const gKm = await routeDistanceKmGoogle(origin, gDest);
        if (gKm && isFinite(gKm)) {
          cacheSet(cacheKey, gKm);
          return gKm;
        }
      }
    }

    // Fallback: Nominatim geocoding
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`;
    const geoRes = await fetch(geoUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WasteWins-App/1.0 (distance estimation)'
      }
    });
    if (!geoRes.ok) return null;
    const geoJson = await geoRes.json();
    const first = Array.isArray(geoJson) && geoJson.length > 0 ? geoJson[0] : null;
    if (!first) return null;
    const destLat = parseFloat(first.lat);
    const destLon = parseFloat(first.lon);
    if (!isFinite(destLat) || !isFinite(destLon)) return null;

    // OSRM routing
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destLon},${destLat}?overview=false`;
    const routeRes = await fetch(osrmUrl);
    if (!routeRes.ok) return null;
    const routeJson = await routeRes.json();
    const route = routeJson?.routes?.[0];
    const meters = route?.distance;
    if (!isFinite(meters)) return null;
    const km = meters / 1000;
    cacheSet(cacheKey, km);
    return km;
  } catch {
    return null;
  }
}

// Estimate driving distance (km) directly between two coordinates
export async function estimateDistanceKmBetween(origin: LatLon, dest: LatLon): Promise<number | null> {
  try {
    // Try Google first
    if (!FREE_ONLY && hasGoogle()) {
      const gKm = await routeDistanceKmGoogle(origin, dest);
      if (gKm && isFinite(gKm)) return gKm;
    }
    // Fallback: OSRM demo
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`;
    const routeRes = await fetch(osrmUrl);
    if (!routeRes.ok) return null;
    const json = await routeRes.json();
    const meters = json?.routes?.[0]?.distance;
    if (!isFinite(meters)) return null;
    return meters / 1000;
  } catch {
    return null;
  }
}
