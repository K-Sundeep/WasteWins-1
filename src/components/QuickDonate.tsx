import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Camera, MapPin, Weight, Clock, Loader2, Navigation } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { AuthDialog } from './AuthDialog';
import { useDonations, useUserProfile, usePersonalImpact, useCommunityImpact } from '../hooks/useApi';
import { toast } from 'sonner';
import { useWeatherAqi } from '../hooks/useWeatherAqi';
import { useCarbon } from '../hooks/useCarbon';
import { estimateDistanceKm, estimateDistanceKmBetween } from '../hooks/useDistance';
import { useOpenDataRecycling } from '../hooks/useOpenData';
import { usePlacesAutocomplete } from '../hooks/usePlaces';
import { DistanceEstimator, DistanceBadge } from './DistanceEstimator';

export function QuickDonate() {
  const { user } = useAuth();
  const { createDonation, refetch: refetchDonations } = useDonations();
  const { refetch: refetchProfile } = useUserProfile();
  const { refetch: refetchPersonalImpact } = usePersonalImpact();
  const { refetch: refetchCommunityImpact } = useCommunityImpact();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const { weather, aqi } = useWeatherAqi();
  const { estimate } = useCarbon();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [weight, setWeight] = useState('');

  const defaultDistanceKm = Number(((import.meta as any)?.env?.VITE_DEFAULT_PICKUP_DISTANCE_KM)) || 5;
  const [address, setAddress] = useState('');
  const addressRef = useRef<HTMLInputElement>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [items, setItems] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lon: number } | null>(null);
  const { sites, loading: locationsLoading } = useOpenDataRecycling(50000, addressCoords); // 50km radius
  const [enrichedLocations, setEnrichedLocations] = useState<any[]>([]);
  usePlacesAutocomplete(addressRef, (p) => {
    setAddress(p.address);
    if (Number.isFinite(p.lat) && Number.isFinite(p.lon)) {
      setDestCoords({ lat: p.lat, lon: p.lon });
      setAddressCoords({ lat: p.lat, lon: p.lon });
    } else {
      setDestCoords(null);
      setAddressCoords(null);
    }
  });
  
  // Geocode address if not already geocoded
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address || address.length < 5 || addressCoords) {
        return;
      }
      
      try {
        // Use Nominatim to geocode the address
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        const geoRes = await fetch(geoUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'WasteWins-App/1.0'
          }
        });
        
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          const first = Array.isArray(geoJson) && geoJson.length > 0 ? geoJson[0] : null;
          if (first) {
            const lat = parseFloat(first.lat);
            const lon = parseFloat(first.lon);
            if (isFinite(lat) && isFinite(lon)) {
              setAddressCoords({ lat, lon });
            }
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };
    
    // Debounce geocoding
    const timer = setTimeout(geocodeAddress, 1500);
    return () => clearTimeout(timer);
  }, [address, addressCoords]);
  
  // Calculate distances for all nearby locations based on pickup address
  useEffect(() => {
    const enrichLocations = async () => {
      if (!sites || !addressCoords) {
        setEnrichedLocations([]);
        return;
      }
      
      const enrichedPromises = sites.map(async (site: any) => {
        // Calculate distance from pickup address to donation center
        let distance: number;
        const mapboxDist = await estimateDistanceKmBetween(addressCoords, { lat: site.lat, lon: site.lon });
        distance = mapboxDist ?? ((lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        })(addressCoords.lat, addressCoords.lon, site.lat, site.lon);
        
        // Extract services
        const services: string[] = [];
        if (site.tags?.['recycling:clothes'] === 'yes') services.push('Clothes');
        if (site.tags?.['recycling:paper'] === 'yes') services.push('Paper');
        if (site.tags?.['recycling:plastic'] === 'yes') services.push('Plastic');
        if (site.tags?.['recycling:books'] === 'yes') services.push('Books');
        if (services.length === 0) services.push('General Recycling');
        
        return {
          ...site,
          distance,
          services,
          travelTime: Math.round((distance / 30) * 60), // minutes
        };
      });
      
      const enriched = await Promise.all(enrichedPromises);
      enriched.sort((a, b) => a.distance - b.distance);
      setEnrichedLocations(enriched);
    };
    
    enrichLocations();
  }, [sites, addressCoords]);

  const categories = [
    { id: 'clothes', name: 'Clothes', icon: '👕', points: '10-50 pts/kg' },
    { id: 'biowaste', name: 'BIOWASTE', icon: '🌱', points: '15-35 pts/kg' },
    { id: 'plastic', name: 'Plastic', icon: '♻️', points: '5-25 pts/kg' },
  ];

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
  ];

  const handleSubmit = async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    if (!selectedCategory || !weight || !address || !items || !timeSlot || !selectedLocation) {
      toast.error('Please fill in all required fields including donation location');
      return;
    }

    setLoading(true);
    
    const donationData = {
      category: selectedCategory,
      weight: parseFloat(weight),
      items,
      pickupType: 'pickup',
      address,
      timeSlot,
      donationLocation: selectedLocation.name || 'Recycling Center',
      distanceKm: selectedLocation.distance,
    };

    const { data, error } = await createDonation(donationData);
    
    if (error) {
      toast.error('Failed to create donation: ' + error);
    } else {
      // Calculate points earned
      const estimatedPoints = Math.round(Number(weight) * 20);
      // Calculate CO2 impact
      const co2Saved = parseFloat(weight) * 0.61;
      const co2Travel = selectedLocation.distance * 0.12;
      const netImpact = co2Saved - co2Travel;
      const co2Note = ` • CO₂ saved: ${co2Saved.toFixed(2)} kg • Travel: ${co2Travel.toFixed(2)} kg • Net: +${netImpact.toFixed(2)} kg`;

      toast.success(
        `🎉 Donation scheduled successfully! You've earned ${estimatedPoints} reward points!${co2Note}`, 
        {
          duration: 5000,
          style: {
            background: '#2F8A5C',
            color: 'white',
            border: '1px solid #FFB35C',
          }
        }
      );
      
      // Reset form
      setSelectedCategory('');
      setWeight('');
      setItems('');
      setAddress('');
      setTimeSlot('');
      setSelectedLocation(null);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('donationComplete'));
      
      // Refresh all data to show updated impact
      // Add delay to ensure backend has processed the donation
      setTimeout(async () => {
        await refetchProfile();
        await refetchDonations();
        await refetchPersonalImpact();
        await refetchCommunityImpact();
        
        // Scroll to impact section
        const impactSection = document.getElementById('impact');
        if (impactSection) {
          impactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
    
    setLoading(false);
  };

  return (
    <section id="quick-donate" className="py-12 sm:py-16 md:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 font-bold">Quick Donate</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Choose your waste category, estimate weight, enter your address and select a time slot for pickup.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-4 sm:p-6 md:p-8">
            <CardHeader className="text-center pb-6 sm:pb-8">
              <CardTitle className="text-xl sm:text-2xl">Start Your Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              {/* Category Selection */}
              <div className="space-y-4">
                <Label className="text-lg">Select Category</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-4 sm:p-6 text-center">
                          <div className="text-4xl mb-3">{category.icon}</div>
                          <h3 className="font-semibold mb-2">{category.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {category.points}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Items and Weight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="items" className="flex items-center space-x-2">
                    <span>Items Description *</span>
                  </Label>
                  <Input
                    id="items"
                    type="text"
                    placeholder="e.g., 3 t-shirts, 2 jeans"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Weight className="w-4 h-4" />
                    <span>Estimated Weight (kg) *</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Address and Time Slot Selection */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Pickup Address *</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your pickup address"
                    ref={addressRef}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Where to Donate Section */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2 text-base font-semibold">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>Where to Donate *</span>
                    </Label>
                    {enrichedLocations.length > 0 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {enrichedLocations.length} locations nearby
                      </Badge>
                    )}
                  </div>

                  {!address || address.length < 5 ? (
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-6 text-center space-y-2">
                        <div className="text-4xl">⬆️</div>
                        <p className="font-medium">Enter your pickup address first</p>
                        <p className="text-sm text-muted-foreground">
                          We'll find donation centers near your pickup location
                        </p>
                      </CardContent>
                    </Card>
                  ) : locationsLoading || !addressCoords ? (
                    <div className="flex items-center justify-center py-8 bg-muted/30 rounded-lg">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {!addressCoords ? 'Locating your address...' : 'Finding nearby locations...'}
                      </span>
                    </div>
                  ) : enrichedLocations.length === 0 ? (
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="text-5xl">🔍</div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-lg">No Recycling Centers Found</h3>
                          <p className="text-sm text-muted-foreground">
                            We couldn't find any recycling centers within 50km of your pickup address.
                          </p>
                          {addressCoords && (
                            <p className="text-xs text-muted-foreground">
                              Searching near: {addressCoords.lat.toFixed(4)}, {addressCoords.lon.toFixed(4)}
                            </p>
                          )}
                        </div>
                        <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                          <p className="font-medium">What you can do:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Try entering a different address or nearby city</li>
                            <li>We search within 50km radius - try major cities</li>
                            <li>Contact us to add recycling centers in your area</li>
                            <li>Check back later as we're constantly adding new locations</li>
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => window.location.reload()} 
                            variant="outline"
                            className="flex-1"
                          >
                            Try Again
                          </Button>
                          <Button 
                            variant="default"
                            className="flex-1"
                            onClick={() => {
                              const section = document.getElementById('quick-donate');
                              if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            Contact Support
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Select a donation center (sorted by distance from your pickup address):
                      </p>
                      
                      {/* Top 5 Closest Locations */}
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                        {enrichedLocations.slice(0, 10).map((location) => (
                          <motion.div
                            key={location.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all ${
                                selectedLocation?.id === location.id
                                  ? 'border-2 border-primary bg-primary/5'
                                  : 'border hover:border-primary/50'
                              }`}
                              onClick={() => {
                                setSelectedLocation(location);
                                setShowLocationSuggestions(false);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h4 className="font-semibold text-sm">
                                        {location.name || 'Recycling Center'}
                                      </h4>
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
                                    
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {location.services.slice(0, 4).map((service: string) => (
                                        <Badge key={service} variant="outline" className="text-xs">
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4">
                                    <DistanceBadge distanceKm={location.distance} showTime={true} />
                                  </div>
                                </div>
                                
                                {/* Distance Estimator for selected location */}
                                {selectedLocation?.id === location.id && weight && parseFloat(weight) > 0 && (
                                  <div className="mt-4 pt-4 border-t">
                                    <DistanceEstimator 
                                      distanceKm={location.distance} 
                                      weight={parseFloat(weight)}
                                      showDetails={true}
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      {enrichedLocations.length > 10 && (
                        <p className="text-xs text-center text-muted-foreground">
                          Showing closest 10 locations out of {enrichedLocations.length} found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Preferred Time Slot *</span>
                  </Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Weather & Air Quality Hints (non-intrusive) */}
                  {(weather || aqi) && (
                    <div className="text-sm text-muted-foreground bg-muted/40 rounded-md p-3">
                      <div className="flex flex-wrap gap-3">
                        {weather?.temperatureC !== undefined && (
                          <span>
                            Temp: <span className="font-medium">{Math.round(weather?.temperatureC ?? 0)}°C</span>
                          </span>
                        )}
                        {weather?.precipitationProb !== undefined && (
                          <span>
                            Rain chance next hr: <span className="font-medium">{Math.round(weather?.precipitationProb ?? 0)}%</span>
                          </span>
                        )}
                        {aqi?.category && (
                          <span>
                            Air quality: <span className="font-medium">{aqi.category}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : user ? (
                    'Schedule Pickup'
                  ) : (
                    'Sign In to Donate'
                  )}
                </Button>
              </motion.div>

              {/* Estimated Points */}
              {selectedCategory && weight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-muted-foreground">Estimated reward points</p>
                  <p className="text-2xl font-semibold text-primary">
                    {Math.round(Number(weight) * 20)} points
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </section>
  );
}





