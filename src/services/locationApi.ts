const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface LocationPoint {
  lat: number;
  lon: number;
}

export interface PickupSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
  distance?: number;
}

export interface DistanceResult {
  distance: number;
  method: 'routing' | 'haversine';
  unit: string;
}

export interface PickupSitesResult {
  sites: PickupSite[];
  count: number;
  source: 'openstreetmap' | 'mock';
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
  address?: any;
}

class LocationApiService {
  private baseUrl = `${API_BASE_URL}/location`;

  async calculateDistance(origin: LocationPoint, destination: LocationPoint): Promise<DistanceResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/distance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination }),
      });

      if (!response.ok) {
        throw new Error(`Distance API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Distance calculation failed:', error);
      
      // Fallback to client-side Haversine calculation
      const distance = this.calculateHaversineDistance(origin, destination);
      return {
        distance,
        method: 'haversine',
        unit: 'km'
      };
    }
  }

  async getNearbyPickupSites(lat: number, lon: number, radius: number = 10000): Promise<PickupSitesResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/pickup-sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lon, radius }),
      });

      if (!response.ok) {
        throw new Error(`Pickup sites API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Pickup sites fetch failed:', error);
      
      // Fallback to mock data
      return {
        sites: this.getMockPickupSites(lat, lon),
        count: 3,
        source: 'mock'
      };
    }
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }

  // Fallback Haversine distance calculation
  private calculateHaversineDistance(point1: LocationPoint, point2: LocationPoint): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLon = this.toRadians(point2.lon - point1.lon);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Fallback mock pickup sites
  private getMockPickupSites(lat: number, lon: number): PickupSite[] {
    return [
      {
        id: 'mock-1',
        name: 'Green Recycling Center',
        lat: lat + 0.01,
        lon: lon + 0.01,
        tags: {
          amenity: 'recycling',
          recycling_type: 'centre',
          materials: 'plastic;paper;glass;metal'
        },
        distance: 1.2
      },
      {
        id: 'mock-2',
        name: 'Eco Waste Collection',
        lat: lat - 0.015,
        lon: lon + 0.02,
        tags: {
          amenity: 'recycling',
          recycling_type: 'container',
          materials: 'plastic;paper'
        },
        distance: 2.1
      },
      {
        id: 'mock-3',
        name: 'Municipal Recycling Point',
        lat: lat + 0.02,
        lon: lon - 0.01,
        tags: {
          amenity: 'recycling',
          recycling_type: 'centre',
          materials: 'electronics;batteries;glass'
        },
        distance: 2.8
      }
    ];
  }
}

export const locationApi = new LocationApiService();
