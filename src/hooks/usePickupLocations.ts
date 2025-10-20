import { useState, useEffect, useCallback } from 'react';
import { locationApi } from '../services/locationApi';

export interface PickupSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
  tags?: Record<string, string>;
}

export function usePickupLocations(
  coords?: { lat: number; lon: number } | null,
  radius: number = 10000
) {
  const [sites, setSites] = useState<PickupSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPickupSites = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching pickup sites from backend API...');
      
      // Use backend API for pickup sites
      const result = await locationApi.getPickupSites(coords.lat, coords.lon, radius);
      
      if (result && result.sites) {
        console.log(`✅ Found ${result.sites.length} pickup sites from ${result.source}`);
        setSites(result.sites);
      } else {
        console.log('⚠️ No pickup sites found');
        setSites([]);
      }
    } catch (err) {
      console.error('❌ Error fetching pickup sites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pickup sites');
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, [coords, radius]);

  useEffect(() => {
    if (coords) {
      fetchPickupSites();
    }
  }, [fetchPickupSites]);

  return {
    sites,
    loading,
    error,
    refetch: fetchPickupSites,
  };
}

// Hook for enhanced pickup locations with fallback
export function useEnhancedPickupLocations(
  coords?: { lat: number; lon: number } | null,
  radius: number = 10000
) {
  const [sites, setSites] = useState<PickupSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  const fetchSites = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      // Try backend API first
      console.log('🔍 Trying backend API for pickup sites...');
      const backendResult = await locationApi.getPickupSites(coords.lat, coords.lon, radius);
      
      if (backendResult && backendResult.sites && backendResult.sites.length > 0) {
        console.log(`✅ Backend API: Found ${backendResult.sites.length} sites`);
        setSites(backendResult.sites);
        setSource(backendResult.source || 'backend');
        return;
      }

      // Fallback to mock data if backend has no results
      console.log('📍 Using fallback mock data...');
      const mockSites: PickupSite[] = [
        {
          id: 'mock-1',
          name: 'Community Recycling Center',
          lat: coords.lat + 0.01,
          lon: coords.lon + 0.01,
          distance: 1.2,
          tags: { operator: 'Local Council', 'recycling:paper': 'yes', 'recycling:plastic': 'yes' }
        },
        {
          id: 'mock-2', 
          name: 'Green Drop-off Point',
          lat: coords.lat - 0.005,
          lon: coords.lon + 0.015,
          distance: 1.8,
          tags: { operator: 'EcoWaste', 'recycling:glass': 'yes', 'recycling:metal': 'yes' }
        },
        {
          id: 'mock-3',
          name: 'Sustainable Waste Hub',
          lat: coords.lat + 0.008,
          lon: coords.lon - 0.012,
          distance: 2.1,
          tags: { operator: 'GreenTech', 'recycling:clothes': 'yes', 'recycling:books': 'yes' }
        }
      ];

      setSites(mockSites);
      setSource('mock');
      console.log(`✅ Mock data: Provided ${mockSites.length} sites`);

    } catch (err) {
      console.error('❌ Error in enhanced pickup locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pickup sites');
      setSites([]);
      setSource('error');
    } finally {
      setLoading(false);
    }
  }, [coords, radius]);

  useEffect(() => {
    if (coords) {
      fetchSites();
    }
  }, [fetchSites]);

  return {
    sites,
    loading,
    error,
    source,
    refetch: fetchSites,
  };
}
