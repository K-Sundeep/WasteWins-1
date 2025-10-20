import { useEffect, useMemo, useState, useCallback } from 'react';
import { EXTERNAL_APIS, MAP_SETTINGS } from '../constants';
import { customRecyclingCenters, convertToRecyclingSite } from '../data/customRecyclingCenters';
import { fetchAllIndiaRecyclingCenters, isInIndia } from '../services/indiaRecyclingApi';

export interface RecyclingSite {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

const DEFAULT_COORDS = {
  lat: MAP_SETTINGS.DEFAULT_CENTER[0],
  lon: MAP_SETTINGS.DEFAULT_CENTER[1],
};

export function useOpenDataRecycling(
  radiusMeters: number = MAP_SETTINGS.SEARCH_RADIUS_METERS,
  customCoords?: { lat: number; lon: number } | null,
) {
  const initialCoords = useMemo(() => customCoords || DEFAULT_COORDS, [customCoords]);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(initialCoords);
  const [sites, setSites] = useState<RecyclingSite[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update coords when customCoords changes
  useEffect(() => {
    if (customCoords) {
      console.log('📍 Using custom coordinates:', customCoords);
      setCoords(customCoords);
      return;
    }

    if (!('geolocation' in navigator)) {
      console.log('⚠️ Geolocation not available');
      setCoords((current) => current ?? DEFAULT_COORDS);
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 10000, // Increased timeout to 10 seconds
      maximumAge: 300000, // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const browserCoords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        console.log('📍 Using browser geolocation:', browserCoords);
        setCoords(browserCoords);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setCoords(DEFAULT_COORDS);
      },
      geoOptions
    );
  }, [customCoords]);

  // Fetch recycling sites from multiple sources
  const fetchOverpass = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      let osmSites: RecyclingSite[] = [];

      // Check if location is in India for enhanced fetching
      if (isInIndia(coords.lat, coords.lon)) {
        console.log('🇮🇳 Fetching India-specific recycling centers...');
        
        // Use India-specific enhanced query
        osmSites = await fetchAllIndiaRecyclingCenters(coords.lat, coords.lon, radiusMeters);
        
        console.log(`✅ Found ${osmSites.length} centers from India APIs`);
      } else {
        // Standard OSM query for non-India locations
        const query = `data=[out:json];(
          node["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon});
          way["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon});
          relation["amenity"="recycling"](around:${radiusMeters},${coords.lat},${coords.lon});
        );out center 50;`;

        const url = `${EXTERNAL_APIS.OVERPASS}?${query}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Overpass API error: ${res.status}`);
        }

        const data = await res.json();
        const elements = (data?.elements || []) as any[];

        osmSites = elements
          .map((el) => ({
            id: String(el.id),
            name: el.tags?.name,
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
      }

      // Add custom recycling centers within radius
      console.log(`🔍 Checking ${customRecyclingCenters.length} custom centers against radius ${radiusMeters / 1000}km`);
      console.log(`📍 Search coordinates: ${coords.lat}, ${coords.lon}`);
      
      const customSites = customRecyclingCenters
        .map(center => {
          const distance = calculateDistance(coords.lat, coords.lon, center.lat, center.lon);
          console.log(`  - ${center.name}: ${distance.toFixed(2)}km (${distance <= (radiusMeters / 1000) ? 'INCLUDED' : 'EXCLUDED'})`);
          return { center, distance };
        })
        .filter(({ distance }) => distance <= (radiusMeters / 1000))
        .map(({ center }) => convertToRecyclingSite(center));

      console.log(`📦 Adding ${customSites.length} custom centers`);

      // Merge OSM and custom sites, removing duplicates by ID
      const allSites = [...osmSites, ...customSites];
      const uniqueSites = Array.from(
        new Map(allSites.map(site => [site.id, site])).values()
      );

      setSites(uniqueSites);

      console.log(`🎯 Total unique centers: ${uniqueSites.length}`);

      if (uniqueSites.length === 0) {
        setError('No recycling centers found nearby. Try searching a different location.');
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError(e?.message || 'Failed to load recycling centers');
      }
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [coords, radiusMeters]);

  useEffect(() => {
    fetchOverpass();
  }, [fetchOverpass]);

  return useMemo(
    () => ({ coords, sites, loading, error, refetch: fetchOverpass }),
    [coords, sites, loading, error, fetchOverpass]
  );
}

// Helper function to calculate distance (Haversine formula)
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
