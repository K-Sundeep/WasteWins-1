import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Clock, Leaf, TrendingDown, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DistanceEstimatorProps {
  distanceKm: number;
  weight?: number;
  showDetails?: boolean;
}

export function DistanceEstimator({ distanceKm, weight = 0, showDetails = true }: DistanceEstimatorProps) {
  const [travelTime, setTravelTime] = useState('');
  const [co2Saved, setCo2Saved] = useState(0);
  const [co2FromTravel, setCo2FromTravel] = useState(0);
  const [netImpact, setNetImpact] = useState(0);
  
  useEffect(() => {
    // Calculate travel time (assuming 30 km/h average in city)
    const hours = distanceKm / 30;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) {
      setTravelTime(`${minutes} min`);
    } else {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      setTravelTime(`${hrs}h ${mins}m`);
    }
    
    // Calculate CO2 saved from recycling (0.61 kg CO2 per kg waste)
    const saved = weight * 0.61;
    setCo2Saved(saved);
    
    // Calculate CO2 from travel (0.12 kg CO2 per km for average vehicle)
    const travel = distanceKm * 0.12;
    setCo2FromTravel(travel);
    
    // Net impact
    setNetImpact(saved - travel);
  }, [distanceKm, weight]);
  
  const getDistanceCategory = () => {
    if (distanceKm < 2) return { label: 'Very Close', color: 'bg-green-100 text-green-800', icon: '🎯' };
    if (distanceKm < 5) return { label: 'Nearby', color: 'bg-blue-100 text-blue-800', icon: '📍' };
    if (distanceKm < 10) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800', icon: '🚗' };
    return { label: 'Far', color: 'bg-orange-100 text-orange-800', icon: '🛣️' };
  };
  
  const category = getDistanceCategory();
  
  if (!showDetails) {
    return (
      <Badge className={category.color}>
        {category.icon} {distanceKm.toFixed(1)} km • {travelTime}
      </Badge>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/20">
        <CardContent className="p-4 space-y-3">
          {/* Distance Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">{distanceKm.toFixed(1)} km</span>
            </div>
            <Badge className={category.color}>
              {category.icon} {category.label}
            </Badge>
          </div>
          
          {/* Travel Time */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated travel time: <span className="font-medium text-foreground">{travelTime}</span></span>
          </div>
          
          {/* Environmental Impact */}
          {weight > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-sm font-medium flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>Environmental Impact</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-green-600 font-medium">CO₂ Saved</div>
                  <div className="text-lg font-bold text-green-700">+{co2Saved.toFixed(2)} kg</div>
                  <div className="text-muted-foreground">From recycling</div>
                </div>
                
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-orange-600 font-medium">CO₂ Travel</div>
                  <div className="text-lg font-bold text-orange-700">-{co2FromTravel.toFixed(2)} kg</div>
                  <div className="text-muted-foreground">From pickup</div>
                </div>
              </div>
              
              {/* Net Impact */}
              <div className={`p-3 rounded-lg ${netImpact > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Environmental Impact:</span>
                  <span className={`text-lg font-bold ${netImpact > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {netImpact > 0 ? '+' : ''}{netImpact.toFixed(2)} kg CO₂
                  </span>
                </div>
                {netImpact > 0 ? (
                  <div className="text-xs text-green-700 mt-1 flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>Great! Your donation has a positive environmental impact!</span>
                  </div>
                ) : (
                  <div className="text-xs text-orange-700 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Consider donating more items to maximize environmental benefit</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Distance Recommendations */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              {distanceKm < 2 && (
                <div className="flex items-center space-x-1 text-green-600">
                  <span>✓</span>
                  <span>Perfect! Very close pickup location - minimal travel impact</span>
                </div>
              )}
              {distanceKm >= 2 && distanceKm < 5 && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <span>✓</span>
                  <span>Good distance - reasonable travel time and impact</span>
                </div>
              )}
              {distanceKm >= 5 && distanceKm < 10 && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <span>⚠</span>
                  <span>Moderate distance - consider combining with other donations</span>
                </div>
              )}
              {distanceKm >= 10 && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <span>⚠</span>
                  <span>Far distance - try to find a closer location or donate more items</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Compact version for lists
export function DistanceBadge({ distanceKm, showTime = true }: { distanceKm: number; showTime?: boolean }) {
  const minutes = Math.round((distanceKm / 30) * 60);
  const timeStr = minutes < 60 ? `${minutes}min` : `${Math.floor(minutes / 60)}h${minutes % 60}m`;
  
  const getColor = () => {
    if (distanceKm < 2) return 'bg-green-100 text-green-800 border-green-300';
    if (distanceKm < 5) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (distanceKm < 10) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };
  
  return (
    <Badge className={`${getColor()} border font-medium`}>
      <MapPin className="w-3 h-3 mr-1" />
      {distanceKm.toFixed(1)} km
      {showTime && ` • ${timeStr}`}
    </Badge>
  );
}
