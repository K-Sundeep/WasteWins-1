import { motion } from 'motion/react';
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
import { useUserProfile, useDonations } from '../hooks/useApi';

export function UserDashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { donations, loading: donationsLoading } = useDonations();

  if (!user) return null;

  const userPoints = profile?.points || 0;
  const totalDonations = profile?.totalDonations || 0;
  const totalWeight = profile?.totalWeight || 0;

  const recentDonations = donations.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'manufactured': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2">
                Welcome back, {profile?.name || user.email}!
              </h2>
              <p className="text-lg text-muted-foreground">
                Here's your sustainability impact overview
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-primary/10 text-primary px-6 py-3 rounded-2xl">
              <Coins className="w-6 h-6" />
              <span className="text-xl font-semibold">{userPoints.toLocaleString()} Points</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDonations}</div>
                <p className="text-xs text-muted-foreground">
                  Keep up the great work!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weight Donated</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
                <p className="text-xs text-muted-foreground">
                  Environmental impact growing
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(totalWeight * 0.6).toFixed(1)} kg</div>
                <p className="text-xs text-muted-foreground">
                  Carbon footprint reduced
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donations">Recent Donations</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : recentDonations.length > 0 ? (
                  <div className="space-y-4">
                    {recentDonations.map((donation: any) => (
                      <motion.div
                        key={donation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold capitalize">{donation.category}</h4>
                            <p className="text-sm text-muted-foreground">
                              {donation.weight}kg • {donation.items}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-1 ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            +{donation.pointsEarned} points
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No donations yet</p>
                    <Button className="mt-4" onClick={() => document.getElementById('quick-donate')?.scrollIntoView({ behavior: 'smooth' })}>
                      Make Your First Donation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      <div>
                        <h4 className="font-semibold">First Donation</h4>
                        <p className="text-sm text-muted-foreground">Welcome to the community!</p>
                      </div>
                    </div>
                    <Badge>+50 points</Badge>
                  </div>

                  {totalDonations >= 5 && (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">5 Donations</h4>
                          <p className="text-sm text-muted-foreground">You're making a difference!</p>
                        </div>
                      </div>
                      <Badge>+100 points</Badge>
                    </div>
                  )}

                  {totalWeight >= 10 && (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">10kg Donated</h4>
                          <p className="text-sm text-muted-foreground">Eco warrior status!</p>
                        </div>
                      </div>
                      <Badge>+200 points</Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">50kg Donated</h4>
                        <p className="text-sm text-muted-foreground">Progress: {Math.min(100, (totalWeight / 50) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">+500 points</Badge>
                      <Progress value={Math.min(100, (totalWeight / 50) * 100)} className="w-20 h-2 mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}