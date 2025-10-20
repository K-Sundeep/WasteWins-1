import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Calculate distance between two points
router.post('/distance', asyncHandler(async (req: Request, res: Response) => {
  const { origin, destination } = req.body;
  
  if (!origin?.lat || !origin?.lon || !destination?.lat || !destination?.lon) {
    return res.status(400).json({ error: 'Invalid coordinates provided' });
  }

  try {
    // Use Haversine formula for distance calculation (fallback)
    const distance = calculateHaversineDistance(origin, destination);
    
    // Try to get more accurate routing distance from OSRM
    let routingDistance = null;
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
      const response = await fetch(osrmUrl);
      if (response.ok) {
        const data = await response.json() as any;
        const meters = data?.routes?.[0]?.distance;
        if (meters) {
          routingDistance = meters / 1000; // Convert to km
        }
      }
    } catch (error) {
      console.warn('OSRM routing failed, using Haversine distance');
    }

    res.json({
      distance: routingDistance || distance,
      method: routingDistance ? 'routing' : 'haversine',
      unit: 'km'
    });
  } catch (error) {
    console.error('Distance calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
}));

// Get nearby pickup locations
router.post('/pickup-sites', asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, radius = 10000 } = req.body;
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordinates required' });
  }

  try {
    // Mock data for now - in production, you'd integrate with real APIs or database
    const mockSites = [
      {
        id: '1',
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
        id: '2', 
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
        id: '3',
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

    // Try to fetch real data from Overpass API
    let realSites = [];
    try {
      const query = `[out:json][timeout:10];(
        node["amenity"="recycling"](around:${radius},${lat},${lon});
        way["amenity"="recycling"](around:${radius},${lat},${lon});
        relation["amenity"="recycling"](around:${radius},${lat},${lon});
      );out center 20;`;
      
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(overpassUrl);
      
      if (response.ok) {
        const data = await response.json() as any;
        realSites = data.elements?.map((element: any) => ({
          id: element.id.toString(),
          name: element.tags?.name || 'Recycling Point',
          lat: element.lat || element.center?.lat,
          lon: element.lon || element.center?.lon,
          tags: element.tags || {},
          distance: calculateHaversineDistance({ lat, lon }, { 
            lat: element.lat || element.center?.lat, 
            lon: element.lon || element.center?.lon 
          })
        })).filter((site: any) => site.lat && site.lon) || [];
      }
    } catch (error) {
      console.warn('Overpass API failed, using mock data');
    }

    // Use real data if available, otherwise fallback to mock
    const sites = realSites.length > 0 ? realSites : mockSites;
    
    res.json({
      sites: sites.sort((a: any, b: any) => a.distance - b.distance),
      count: sites.length,
      source: realSites.length > 0 ? 'openstreetmap' : 'mock'
    });
  } catch (error) {
    console.error('Pickup sites error:', error);
    res.status(500).json({ error: 'Failed to fetch pickup sites' });
  }
}));

// Geocode address to coordinates
router.post('/geocode', asyncHandler(async (req: Request, res: Response) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address required' });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'WasteWins-App/1.0 (geocoding service)'
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json() as any[];
    const result = data[0];

    if (!result) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name,
      address: result.address
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
}));

// Helper function to calculate Haversine distance
function calculateHaversineDistance(
  point1: { lat: number; lon: number },
  point2: { lat: number; lon: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lon - point1.lon);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default router;
