import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Camera, MapPin, Weight, Clock, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { AuthDialog } from './AuthDialog';
import { toast } from 'sonner';

export function QuickDonate() {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [items, setItems] = useState('');

  const categories = [
    { id: 'clothes', name: 'Clothes', icon: '👕', points: '10-50 pts/kg' },
    { id: 'biowaste', name: 'BioWaste', icon: '🌱', points: '15-35 pts/kg' },
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

    if (!selectedCategory || !weight || !address || !items || !timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate donation API call
    setTimeout(() => {
      toast.success(
        `🎉 Donation scheduled successfully! You've earned ${Math.round(Number(weight) * 20)} reward points!`,
        {
          duration: 5000,
          style: {
            background: '#2F8A5C',
            color: 'white',
            border: '1px solid #FFB35C',
          }
        }
      );

      setSelectedCategory('');
      setWeight('');
      setItems('');
      setAddress('');
      setTimeSlot('');
      setLoading(false);
    }, 1500);
  };

  return (
    <section id="quick-donate" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Quick Donate</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
          <Card className="p-8">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Start Your Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-4">
                <Label className="text-lg">Select Category</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <CardContent className="p-6 text-center">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
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