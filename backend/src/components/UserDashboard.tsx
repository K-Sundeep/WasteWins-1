import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Gift, 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  Factory,
  Star,
  Coins,
  Calendar
} from 'lucide-react';
import { useAuth } from './AuthProvider';

export function UserDashboard() {
  // Example static values (restore to initial state)
  const userName = "John Doe";
  const totalDonations = 12;
  const totalPoints = 1580;
  const upcomingPickup = "Oct 5, 2025, 11:00 AM";
  const recentRewards = [
    { name: "Eco Bag", date: "Sep 20, 2025", points: 200 },
    { name: "Discount Coupon", date: "Aug 15, 2025", points: 150 },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>{userName}'s Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{totalDonations}</div>
                  <div className="text-sm text-muted-foreground">Total Donations</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Upcoming Pickup</h4>
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>{upcomingPickup}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recent Rewards</h4>
                <ul>
                  {recentRewards.map((reward, idx) => (
                    <li key={idx} className="flex items-center justify-between py-2 border-b">
                      <span>{reward.name}</span>
                      <span className="text-xs text-muted-foreground">{reward.date}</span>
                      <Badge variant="secondary">-{reward.points} pts</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}