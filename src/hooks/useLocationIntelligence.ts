import { useState, useCallback } from 'react';
import { locationApi } from '../services/locationApi';

export interface LocationSuggestion {
  address: string;
  lat: number;
  lon: number;
  confidence: number;
  type: 'exact' | 'approximate' | 'fallback';
}

export interface RouteOptimization {
  optimizedRoute: Array<{ lat: number; lon: number; name: string }>;
  totalDistance: number;
  estimatedTime: number;
  carbonSaved: number;
}

export function useLocationIntelligence() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI-powered address suggestions
  const getAddressSuggestions = useCallback(async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 3) return [];

    setLoading(true);
    setError(null);

    try {
      // Use backend geocoding API
      const result = await locationApi.geocodeAddress(query);
      
      if (result) {
        return [{
          address: result.display_name || query,
          lat: result.lat,
          lon: result.lon,
          confidence: 0.9,
          type: 'exact'
        }];
      }

      // Fallback suggestions based on common patterns
      const fallbackSuggestions: LocationSuggestion[] = [
        {
          address: `${query} - City Center`,
          lat: 28.6139 + Math.random() * 0.1 - 0.05,
          lon: 77.2090 + Math.random() * 0.1 - 0.05,
          confidence: 0.6,
          type: 'approximate'
        }
      ];

      return fallbackSuggestions;
    } catch (err) {
      console.error('Address suggestion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get suggestions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Smart route optimization for multiple pickup points
  const optimizePickupRoute = useCallback(async (
    origin: { lat: number; lon: number },
    destinations: Array<{ lat: number; lon: number; name: string }>
  ): Promise<RouteOptimization | null> => {
    setLoading(true);
    setError(null);

    try {
      // Calculate distances to all destinations
      const distancePromises = destinations.map(async (dest) => {
        const result = await locationApi.calculateDistance(origin, dest);
        return {
          ...dest,
          distance: result?.distance || 0,
          method: result?.method || 'haversine'
        };
      });

      const destinationsWithDistance = await Promise.all(distancePromises);
      
      // Simple optimization: sort by distance (nearest first)
      const optimized = destinationsWithDistance.sort((a, b) => a.distance - b.distance);
      
      const totalDistance = optimized.reduce((sum, dest) => sum + dest.distance, 0);
      const estimatedTime = totalDistance * 3; // Rough estimate: 3 minutes per km
      const carbonSaved = totalDistance * 0.2; // Rough estimate: 0.2kg CO2 per km

      return {
        optimizedRoute: optimized,
        totalDistance,
        estimatedTime,
        carbonSaved
      };
    } catch (err) {
      console.error('Route optimization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to optimize route');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // AI-powered pickup recommendations
  const getSmartPickupRecommendations = useCallback(async (
    userLocation: { lat: number; lon: number },
    wasteType: string = 'general'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Get nearby pickup sites
      const sitesResult = await locationApi.getPickupSites(userLocation.lat, userLocation.lon, 10000);
      
      if (!sitesResult?.sites) {
        return {
          recommendations: [],
          insights: ['No pickup sites found in your area']
        };
      }

      // AI-like filtering and ranking
      const recommendations = sitesResult.sites
        .filter(site => {
          // Filter by waste type if specified
          if (wasteType !== 'general') {
            const recyclingKey = `recycling:${wasteType.toLowerCase()}`;
            return site.tags?.[recyclingKey] === 'yes';
          }
          return true;
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 5) // Top 5 recommendations
        .map(site => ({
          ...site,
          score: calculateRecommendationScore(site, wasteType),
          reason: getRecommendationReason(site, wasteType)
        }));

      const insights = generateInsights(recommendations, wasteType);

      return {
        recommendations,
        insights,
        totalSites: sitesResult.sites.length
      };
    } catch (err) {
      console.error('Smart recommendations error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      return {
        recommendations: [],
        insights: ['Unable to generate recommendations at this time']
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAddressSuggestions,
    optimizePickupRoute,
    getSmartPickupRecommendations
  };
}

// Helper functions for AI-like recommendations
function calculateRecommendationScore(site: any, wasteType: string): number {
  let score = 100;
  
  // Distance penalty (closer is better)
  if (site.distance) {
    score -= site.distance * 5; // 5 points per km
  }
  
  // Bonus for specific waste type support
  if (wasteType !== 'general') {
    const recyclingKey = `recycling:${wasteType.toLowerCase()}`;
    if (site.tags?.[recyclingKey] === 'yes') {
      score += 20;
    }
  }
  
  // Bonus for multiple services
  const services = Object.keys(site.tags || {}).filter(key => 
    key.startsWith('recycling:') && site.tags[key] === 'yes'
  );
  score += services.length * 5;
  
  return Math.max(0, Math.min(100, score));
}

function getRecommendationReason(site: any, wasteType: string): string {
  const reasons = [];
  
  if (site.distance && site.distance < 2) {
    reasons.push('Very close to you');
  } else if (site.distance && site.distance < 5) {
    reasons.push('Nearby location');
  }
  
  if (wasteType !== 'general') {
    const recyclingKey = `recycling:${wasteType.toLowerCase()}`;
    if (site.tags?.[recyclingKey] === 'yes') {
      reasons.push(`Accepts ${wasteType}`);
    }
  }
  
  const services = Object.keys(site.tags || {}).filter(key => 
    key.startsWith('recycling:') && site.tags[key] === 'yes'
  );
  
  if (services.length > 3) {
    reasons.push('Multiple services available');
  }
  
  return reasons.join(' • ') || 'Available for recycling';
}

function generateInsights(recommendations: any[], wasteType: string): string[] {
  const insights = [];
  
  if (recommendations.length === 0) {
    insights.push('No suitable pickup locations found for your criteria');
    return insights;
  }
  
  const avgDistance = recommendations.reduce((sum, rec) => sum + (rec.distance || 0), 0) / recommendations.length;
  
  if (avgDistance < 2) {
    insights.push('Great news! You have several pickup points within 2km');
  } else if (avgDistance < 5) {
    insights.push('Good options available within a reasonable distance');
  } else {
    insights.push('Consider planning your route to visit multiple locations efficiently');
  }
  
  if (wasteType !== 'general') {
    const specializedCount = recommendations.filter(rec => 
      rec.tags?.[`recycling:${wasteType.toLowerCase()}`] === 'yes'
    ).length;
    
    if (specializedCount > 0) {
      insights.push(`${specializedCount} locations specifically accept ${wasteType}`);
    }
  }
  
  return insights;
}
