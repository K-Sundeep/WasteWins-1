import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface PickupLocationsDialogProps {
  children: React.ReactNode;
}

export function PickupLocationsDialog({ children }: PickupLocationsDialogProps) {
  const locations = [
    {
      id: 1,
      name: 'Mumbai Collection Center',
      address: '123 Marine Drive, Mumbai',
      distance: '0.5 km',
      hours: 'Mon-Sat: 8AM-6PM',
      phone: '+91 91234 56789',
      rating: 4.8,
      services: ['Clothes', 'Books', 'Plastic'],
      color: 'from-primary to-primary/70',
      coordinates: [19.0760, 72.8777] // Mumbai
    },
    {
      id: 2,
      name: 'Delhi Hub',
      address: '456 Connaught Place, Delhi',
      distance: '1.2 km',
      hours: 'Mon-Sun: 7AM-8PM',
      phone: '+91 92345 67890',
      rating: 4.9,
      services: ['Clothes', 'Books'],
      color: 'from-secondary to-amber-500',
      coordinates: [28.6139, 77.2090] // Delhi
    },
    {
      id: 3,
      name: 'Bangalore Drop-off',
      address: '789 MG Road, Bangalore',
      distance: '2.1 km',
      hours: 'Tue-Sun: 9AM-5PM',
      phone: '+91 93456 78901',
      rating: 4.7,
      services: ['Plastic', 'Books'],
      color: 'from-blue-500 to-blue-600',
      coordinates: [12.9716, 77.5946] // Bangalore
    },
    {
      id: 4,
      name: 'Hyderabad Central Station',
      address: '321 Banjara Hills, Hyderabad',
      distance: '1.8 km',
      hours: 'Mon-Fri: 8AM-7PM',
      phone: '+91 94567 89012',
      rating: 4.6,
      services: ['Clothes', 'Plastic'],
      color: 'from-green-500 to-green-600',
      coordinates: [17.3850, 78.4867] // Hyderabad
    },
    {
      id: 5,
      name: 'Chennai Northside Point',
      address: '654 Anna Salai, Chennai',
      distance: '3.0 km',
      hours: 'Wed-Sun: 10AM-6PM',
      phone: '+91 95678 90123',
      rating: 4.5,
      services: ['Clothes', 'Books', 'Plastic'],
      color: 'from-purple-500 to-purple-600',
      coordinates: [13.0827, 80.2707] // Chennai
    }
  ];

  const center = [22.9734, 78.6569]; // Center of India (near Jabalpur)

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
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
                      🏢
                    </motion.div>
                    
                    {/* Distance badge */}
                    <Badge className="absolute top-2 right-2 bg-white/20 text-white">
                      {location.distance}
                    </Badge>
                  </motion.div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{location.name}</h3>
                      <div className="flex items-center space-x-1 text-xs">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        <span>{location.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{location.address}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{location.phone}</span>
                    </div>
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

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find a location near you? <Button variant="link" className="p-0 h-auto">Request a new pickup point</Button>
          </p>
        </div>

        {/* Map Container */}
        <div className="mt-8 h-96">
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <Marker key={location.id} position={location.coordinates}>
                <Popup>
                  {location.name}<br />{location.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}