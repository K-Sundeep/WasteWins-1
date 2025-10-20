// Integration with Indian recycling center databases and APIs
// This service fetches real recycling centers from multiple sources

import { RecyclingSite } from '../hooks/useOpenData';

// India-specific recycling center sources
const INDIA_SOURCES = {
  // OpenStreetMap India (primary source)
  OSM_INDIA: 'https://overpass-api.de/api/interpreter',
  
  // Swachh Bharat Mission data (if available via API)
  SWACHH_BHARAT: 'https://swachhbharatmission.gov.in',
  
  // State-specific waste management portals
  CPCB: 'https://cpcb.nic.in', // Central Pollution Control Board
};

// Major Indian cities with coordinates for fallback
const INDIAN_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025, state: 'Delhi' },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  { name: 'Surat', lat: 21.1702, lon: 72.8311, state: 'Gujarat' },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
  { name: 'Kanpur', lat: 26.4499, lon: 80.3319, state: 'Uttar Pradesh' },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  { name: 'Indore', lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  { name: 'Thane', lat: 19.2183, lon: 72.9781, state: 'Maharashtra' },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh' },
  { name: 'Patna', lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  { name: 'Vadodara', lat: 22.3072, lon: 73.1812, state: 'Gujarat' },
  { name: 'Ghaziabad', lat: 28.6692, lon: 77.4538, state: 'Uttar Pradesh' },
  { name: 'Ludhiana', lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  { name: 'Agra', lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh' },
  { name: 'Nashik', lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  { name: 'Faridabad', lat: 28.4089, lon: 77.3178, state: 'Haryana' },
  { name: 'Meerut', lat: 28.9845, lon: 77.7064, state: 'Uttar Pradesh' },
  { name: 'Rajkot', lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  { name: 'Srinagar', lat: 34.0837, lon: 74.7973, state: 'Jammu and Kashmir' },
  { name: 'Amritsar', lat: 31.6340, lon: 74.8723, state: 'Punjab' },
  { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, state: 'Chandigarh' },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu' },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673, state: 'Kerala' },
  { name: 'Mysore', lat: 12.2958, lon: 76.6394, state: 'Karnataka' },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362, state: 'Assam' },
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, state: 'Odisha' },
];

/**
 * Fetch recycling centers from OpenStreetMap for India
 */
export async function fetchOSMIndiaRecycling(
  lat: number,
  lon: number,
  radiusMeters: number = 50000
): Promise<RecyclingSite[]> {
  try {
    // Enhanced Overpass query for India-specific recycling facilities
    const query = `
      [out:json][timeout:25];
      (
        // Recycling amenities
        node["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
        way["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
        relation["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
        
        // Waste disposal sites
        node["amenity"="waste_disposal"](around:${radiusMeters},${lat},${lon});
        way["amenity"="waste_disposal"](around:${radiusMeters},${lat},${lon});
        
        // Waste transfer stations
        node["amenity"="waste_transfer_station"](around:${radiusMeters},${lat},${lon});
        way["amenity"="waste_transfer_station"](around:${radiusMeters},${lat},${lon});
        
        // Scrap yards
        node["landuse"="industrial"]["industrial"="scrap_yard"](around:${radiusMeters},${lat},${lon});
        way["landuse"="industrial"]["industrial"="scrap_yard"](around:${radiusMeters},${lat},${lon});
      );
      out center 100;
    `;

    const url = `${INDIA_SOURCES.OSM_INDIA}?data=${encodeURIComponent(query)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSM API error: ${response.status}`);
    }

    const data = await response.json();
    const elements = (data?.elements || []) as any[];

    const sites: RecyclingSite[] = elements
      .map((el) => ({
        id: `osm-${el.id}`,
        name: el.tags?.name || el.tags?.operator || 'Recycling Center',
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
        tags: el.tags,
      }))
      .filter((site) => 
        site.lat && 
        site.lon && 
        !isNaN(site.lat) && 
        !isNaN(site.lon)
      );

    return sites;
  } catch (error) {
    console.error('OSM India fetch error:', error);
    return [];
  }
}

/**
 * Fetch recycling centers from India Waste Management database
 * This is a placeholder for when official APIs become available
 */
export async function fetchIndiaWasteManagementCenters(
  lat: number,
  lon: number,
  radiusKm: number = 50
): Promise<RecyclingSite[]> {
  // TODO: Integrate with official Indian waste management APIs when available
  // Potential sources:
  // - Swachh Bharat Mission API
  // - State Municipal Corporation APIs
  // - CPCB (Central Pollution Control Board) data
  // - MyGov India waste management portal
  
  // For now, return empty array
  // This function can be updated when official APIs are available
  return [];
}

/**
 * Get nearest Indian city to use as fallback
 */
export function getNearestIndianCity(lat: number, lon: number) {
  let nearest = INDIAN_CITIES[0];
  let minDistance = Infinity;

  for (const city of INDIAN_CITIES) {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return { ...nearest, distance: minDistance };
}

/**
 * Check if coordinates are in India
 */
export function isInIndia(lat: number, lon: number): boolean {
  // India bounding box (approximate)
  const INDIA_BOUNDS = {
    north: 35.5,
    south: 6.5,
    east: 97.5,
    west: 68.0,
  };

  return (
    lat >= INDIA_BOUNDS.south &&
    lat <= INDIA_BOUNDS.north &&
    lon >= INDIA_BOUNDS.west &&
    lon <= INDIA_BOUNDS.east
  );
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Main function to fetch all available recycling centers for India
 */
export async function fetchAllIndiaRecyclingCenters(
  lat: number,
  lon: number,
  radiusMeters: number = 50000
): Promise<RecyclingSite[]> {
  const results: RecyclingSite[] = [];

  try {
    // Check if location is in India
    const inIndia = isInIndia(lat, lon);
    
    if (inIndia) {
      console.log('📍 Location is in India - fetching comprehensive data');
      
      // Fetch from OpenStreetMap (enhanced query for India)
      const osmSites = await fetchOSMIndiaRecycling(lat, lon, radiusMeters);
      results.push(...osmSites);
      
      // Fetch from India Waste Management (when available)
      const iwmSites = await fetchIndiaWasteManagementCenters(lat, lon, radiusMeters / 1000);
      results.push(...iwmSites);
      
      console.log(`✅ Found ${results.length} centers from APIs`);
    } else {
      console.log('📍 Location outside India - using standard OSM query');
    }

    // Remove duplicates by ID
    const uniqueSites = Array.from(
      new Map(results.map(site => [site.id, site])).values()
    );

    return uniqueSites;
  } catch (error) {
    console.error('Error fetching India recycling centers:', error);
    return [];
  }
}

/**
 * Get suggested cities near a location
 */
export function getSuggestedIndianCities(lat: number, lon: number, count: number = 5) {
  return INDIAN_CITIES
    .map(city => ({
      ...city,
      distance: calculateDistance(lat, lon, city.lat, city.lon),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

export { INDIAN_CITIES };
