import { CACHE_SETTINGS } from '../constants';
import { locationApi, type LocationPoint } from '../services/locationApi';

export type LatLon = { lat: number; lon: number };

// Session and persistent cache
const cache = new Map<string, number>();

function cacheGet(key: string): number | null {
  // Check session cache first
  if (cache.has(key)) return cache.get(key)!;
  
  // Check localStorage
  try {
    const stored = localStorage.getItem(CACHE_SETTINGS.DISTANCE_CACHE_PREFIX + key);
    if (!stored) return null;
    
    const value = Number(stored);
    if (Number.isFinite(value) && value > 0) {
      cache.set(key, value);
      return value;
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
}

function cacheSet(key: string, km: number) {
  if (!Number.isFinite(km) || km <= 0) return;
  
  cache.set(key, km);
  try {
    localStorage.setItem(CACHE_SETTINGS.DISTANCE_CACHE_PREFIX + key, String(km));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

// Estimate driving distance (km) between origin coords and a destination address.
// Uses free APIs: Nominatim for geocoding + OSRM for routing
export async function estimateDistanceKm(origin: LatLon, destinationAddress: string): Promise<number | null> {
  try {
    const addr = destinationAddress?.trim();
    if (!addr) return null;
    const cacheKey = `${origin.lat},${origin.lon}|${addr}`;
    const cached = cacheGet(cacheKey);
    if (cached !== null) return cached;

    // Nominatim geocoding
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
    const cacheKey = `${origin.lat},${origin.lon}|${dest.lat},${dest.lon}`;
    const cached = cacheGet(cacheKey);
    if (cached !== null) return cached;
    
    // Use our backend API for distance calculation
    const result = await locationApi.calculateDistance(origin, dest);
    if (!result) return null;
    
    const km = result.distance;
    cacheSet(cacheKey, km);
    return km;
  } catch (e) {
    console.warn('Distance calculation error:', e);
    return null;
  }
}
