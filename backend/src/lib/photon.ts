/**
 * Photon Geocoding API (Komoot)
 * 100% FREE - No API key required
 * Fast autocomplete and geocoding
 * https://photon.komoot.io/
 */

export interface PhotonResult {
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  displayName: string;
  type?: string;
}

/**
 * Search for places using Photon autocomplete
 * @param query Search query (min 2 characters)
 * @param limit Maximum number of results (default: 10)
 * @returns Array of location results
 */
export async function searchPhoton(query: string, limit = 10): Promise<PhotonResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=${limit}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn(`Photon API error: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    
    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }
    
    return data.features.map((feature: any) => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates || [0, 0];
      
      // Build display name
      const parts = [
        props.name,
        props.city,
        props.state,
        props.country
      ].filter(Boolean);
      
      return {
        name: props.name || props.city || 'Unknown',
        city: props.city,
        state: props.state,
        country: props.country,
        lat: coords[1], // GeoJSON uses [lon, lat]
        lon: coords[0],
        displayName: parts.join(', '),
        type: props.type,
      };
    }).filter((result: PhotonResult) => 
      result.lat && 
      result.lon && 
      !isNaN(result.lat) && 
      !isNaN(result.lon)
    );
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      console.warn('Photon search failed:', e.message);
    }
    return [];
  }
}

/**
 * Reverse geocode coordinates to address
 * @param lat Latitude
 * @param lon Longitude
 * @returns Location result or null
 */
export async function reverseGeocodePhoton(lat: number, lon: number): Promise<PhotonResult | null> {
  try {
    const url = `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const feature = data.features?.[0];
    
    if (!feature) return null;
    
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [lon, lat];
    
    const parts = [
      props.name,
      props.city,
      props.state,
      props.country
    ].filter(Boolean);
    
    return {
      name: props.name || props.city || 'Unknown',
      city: props.city,
      state: props.state,
      country: props.country,
      lat: coords[1],
      lon: coords[0],
      displayName: parts.join(', '),
      type: props.type,
    };
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      console.warn('Photon reverse geocode failed:', e.message);
    }
    return null;
  }
}
