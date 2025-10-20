import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, Phone, Star, Search, Navigation, Loader2, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useOpenDataRecycling, type RecyclingSite } from '../hooks/useOpenData';
import { locationApi } from '../services/locationApi';
import { haversineDistance, formatDistance } from '../utils/distance';
import { routeDistanceKmMapbox, hasMapbox } from '../lib/mapbox';
import { searchCities, type City } from '../utils/cities';
import { DistanceBadge } from './DistanceEstimator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PickupLocationsDialogProps {
  children: React.ReactNode;
}

interface EnrichedSite extends RecyclingSite {
  distance: number;
  formattedDistance: string;
  services: string[];
  color: string;
}

export function PickupLocationsDialog({ children }: PickupLocationsDialogProps) {
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterText, setFilterText] = useState('');
  const [isCalculatingDistances, setIsCalculatingDistances] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'name'>('distance');

  // Use open data recycling hook - fetches real OSM data
  const { coords: geoCoords, sites, loading, error } = useOpenDataRecycling(10000);

  // Determine the active center (search overrides geolocation)
  const activeCenter = searchCenter || geoCoords;
  
  // City search suggestions
  const citySuggestions = useMemo(() => {
    if (!manualSearchQuery) return [];
    return searchCities(manualSearchQuery);
  }, [manualSearchQuery]);
  
  const handleManualSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualSearchQuery(value);
    setShowCitySuggestions(value.length >= 2);
  };
  
  const handleCitySelect = (city: City) => {
    setSearchCenter({ lat: city.lat, lon: city.lon });
    setSearchQuery(`${city.name}, ${city.country}`);
    setManualSearchQuery(`${city.name}, ${city.country}`);
    setShowCitySuggestions(false);
    
    // Trigger map update by forcing re-render
    setFilterText('');
  };

  // Enrich sites with distance and metadata
  const [enrichedSites, setEnrichedSites] = useState<EnrichedSite[]>([]);

  useEffect(() => {
    if (!sites || !activeCenter) {
      setEnrichedSites([]);
      return;
    }

    const enrichSites = async () => {
      setIsCalculatingDistances(true);
      const colors = [
        'from-primary to-primary/70',
        'from-secondary to-amber-500',
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
      ];

      const enrichedPromises = sites.map(async (site, idx) => {
        // Calculate distance - prefer Mapbox routing if available, else haversine
        let distance: number;
        if (hasMapbox()) {
          const mapboxDist = await routeDistanceKmMapbox(activeCenter, { lat: site.lat, lon: site.lon });
          distance = mapboxDist ?? haversineDistance(activeCenter.lat, activeCenter.lon, site.lat, site.lon);
        } else {
          distance = haversineDistance(activeCenter.lat, activeCenter.lon, site.lat, site.lon);
        }

        // Extract services from OSM tags
        const services: string[] = [];
        if (site.tags?.['recycling:clothes'] === 'yes') services.push('Clothes');
        if (site.tags?.['recycling:paper'] === 'yes') services.push('Paper');
        if (site.tags?.['recycling:plastic'] === 'yes') services.push('Plastic');
        if (site.tags?.['recycling:glass'] === 'yes') services.push('Glass');
        if (site.tags?.['recycling:metal'] === 'yes') services.push('Metal');
        if (site.tags?.['recycling:books'] === 'yes') services.push('Books');
        if (services.length === 0) services.push('General Recycling');

        return {
          ...site,
          distance,
          formattedDistance: formatDistance(distance),
          services,
          color: colors[idx % colors.length],
        };
      });

      const enriched = await Promise.all(enrichedPromises);
      // Sort by distance
      enriched.sort((a, b) => a.distance - b.distance);
      setEnrichedSites(enriched);
      setIsCalculatingDistances(false);
    };

    enrichSites();
  }, [sites, activeCenter]);

  // Filter and sort sites
  const filteredSites = useMemo(() => {
    let filtered = enrichedSites;
    
    // Text filter
    if (filterText.trim()) {
      const lower = filterText.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name?.toLowerCase().includes(lower) ||
          site.tags?.operator?.toLowerCase().includes(lower) ||
          site.services.some((s) => s.toLowerCase().includes(lower))
      );
    }
    
    // Distance filter
    if (distanceFilter !== 'all') {
      const maxDistance = parseFloat(distanceFilter);
      filtered = filtered.filter(site => site.distance <= maxDistance);
    }
    
    // Sort
    if (sortBy === 'distance') {
      filtered = [...filtered].sort((a, b) => a.distance - b.distance);
    } else {
      filtered = [...filtered].sort((a, b) => 
        (a.name || 'Recycling Center').localeCompare(b.name || 'Recycling Center')
      );
    }
    
    return filtered;
  }, [enrichedSites, filterText, distanceFilter, sortBy]);

  // Use current location
  const handleUseMyLocation = () => {
    if (geoCoords) {
      setSearchCenter(null);
      setSearchQuery('');
      setManualSearchQuery('');
      setShowCitySuggestions(false);
    }
  };

  const center: [number, number] = activeCenter ? [activeCenter.lat, activeCenter.lon] : [20.5937, 78.9629];
  
  // Type aliases to avoid transient TS prop issues with react-leaflet
  const AnyMapContainer = MapContainer as any;
  const AnyTileLayer = TileLayer as any;
  const AnyCircleMarker = CircleMarker as any;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Pickup Locations Near You</span>
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter Controls */}
        <div className="space-y-3 mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search for a city (e.g., Mumbai, London, Tokyo)..."
                className="pl-9"
                value={manualSearchQuery}
                onChange={handleManualSearchChange}
                onFocus={() => manualSearchQuery.length >= 2 && setShowCitySuggestions(true)}
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {citySuggestions.map((city, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground flex items-center gap-2 text-sm"
                      onClick={() => handleCitySelect(city)}
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{city.name}, {city.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleUseMyLocation}
              disabled={!geoCoords}
              title="Use my location"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Filter by name, operator, or service..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1"
            />
            
            {/* Distance Filter */}
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="2">Within 2 km</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="20">Within 20 km</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'distance' | 'name')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">By Distance</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {(loading || isCalculatingDistances) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              {loading ? 'Finding nearby locations...' : 'Calculating distances...'}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Results Count and Stats */}
        {!loading && !isCalculatingDistances && filteredSites.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {filteredSites.length} location{filteredSites.length !== 1 ? 's' : ''} found
                </span>
                {searchCenter && <span className="text-muted-foreground">near your search</span>}
                {!searchCenter && geoCoords && <span className="text-muted-foreground">near you</span>}
              </div>
              {filteredSites.length > 0 && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Closest: {filteredSites[0].formattedDistance}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredSites.slice(0, 20).map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.1, 1) }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                {/* 3D Location Icon */}
                <div className="relative h-20 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-full h-full bg-gradient-to-br ${location.color} flex items-center justify-center`}
                  >
                    <motion.div
                      animate={{ 
                        rotateY: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1, 1.1, 1]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="text-3xl text-white drop-shadow-lg"
                    >
                      ♻️
                    </motion.div>
                    
                    {/* Distance badge */}
                    <div className="absolute top-2 right-2">
                      <DistanceBadge distanceKm={location.distance} showTime={true} />
                    </div>
                  </motion.div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{location.name || 'Recycling Center'}</h3>
                      {location.distance < 2 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Very Close!
                        </Badge>
                      )}
                    </div>
                    {location.tags?.operator && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Operator: {location.tags.operator}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
                    </div>
                    {location.tags?.phone && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{location.tags.phone}</span>
                      </div>
                    )}
                    {location.tags?.opening_hours && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{location.tags.opening_hours}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-1">Accepts:</div>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs px-2 py-0.5">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" className="w-full" variant="outline">
                    Select Location
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {!loading && !isCalculatingDistances && filteredSites.length === 0 && sites && sites.length > 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No locations match your filter. Try adjusting your search.
          </div>
        )}

        {!loading && !isCalculatingDistances && (!sites || sites.length === 0) && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">
              No recycling centers found nearby. Try searching a different location.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find a location near you? <Button variant="link" className="p-0 h-auto">Request a new pickup point</Button>
          </p>
        </div>

        {/* Live Map Container - Updates with search */}
        {activeCenter && (
          <div className="mt-8 h-96 rounded-md overflow-hidden border relative">
            <AnyMapContainer 
              key={`${activeCenter.lat}-${activeCenter.lon}`} 
              center={center} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: "100%", width: "100%" }}
            >
              <AnyTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              <AnyCircleMarker
                center={center}
                radius={10}
                pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.8, weight: 3 }}
              >
                <Popup>
                  <div className="text-sm font-medium">
                    {searchQuery || 'Your Location'}
                  </div>
                </Popup>
              </AnyCircleMarker>
              
              {/* Recycling centers */}
              {filteredSites.map((location) => (
                <AnyCircleMarker
                  key={location.id}
                  center={[location.lat, location.lon]}
                  radius={8}
                  pathOptions={{ color: '#2F8A5C', fillColor: '#2F8A5C', fillOpacity: 0.6 }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-medium">{location.name || 'Recycling Center'}</div>
                      {location.tags?.operator && <div>Operator: {location.tags.operator}</div>}
                      <div className="text-xs text-muted-foreground mt-1">{location.formattedDistance} away</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {location.services.slice(0, 3).map(service => (
                          <span key={service} className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </AnyCircleMarker>
              ))}
            </AnyMapContainer>
            
            {/* Live update indicator */}
            {(loading || isCalculatingDistances) && (
              <div className="absolute top-2 right-2 bg-white/90 px-3 py-2 rounded-md shadow-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs font-medium">Updating map...</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
