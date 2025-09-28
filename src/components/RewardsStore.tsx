import { useState } from 'react';
import { motion } from 'framer-motion'; // fix import
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingBag, Gift, Star, Award, Coins, Loader2, Coffee, Leaf } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { AuthDialog } from './AuthDialog';
import { useRewards, useUserProfile } from '../hooks/useApi';
import { toast } from 'sonner';

// Add UserProfile type to fix TS errors
type UserProfile = {
  points?: number;
  // add other fields as needed
};

export function RewardsStore() {
  const { user } = useAuth();
  // Cast hook result to correct type
  const { profile } = useUserProfile() as { profile: UserProfile | null };
  const { rewards, redeemReward } = useRewards();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [redeeming, setRedeeming] = useState<number | null>(null);

  const userPoints = profile?.points || 0;

  const handleRedeem = async (rewardId: number) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    setRedeeming(rewardId);
    const { data, error } = await redeemReward(rewardId);
    
    if (error) {
      toast.error('Redemption failed: ' + error);
    } else {
      toast.success('Reward redeemed successfully!');
    }
    
    setRedeeming(null);
  };

  const products = [
    {
      id: 1,
      name: 'Solar Panel 100W',
      points: 1500,
      originalPrice: '₹8,500',
      category: 'products',
      sustainability: 'Custom-built from recycled materials',
      rating: 4.8,
      icon: '☀️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Solar Panel 250W',
      points: 3000,
      originalPrice: '₹18,000',
      category: 'products',
      sustainability: 'High-efficiency panels from waste',
      rating: 4.9,
      icon: '🔆',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 3,
      name: 'Solar Panel 500W',
      points: 5500,
      originalPrice: '₹32,000',
      category: 'products',
      sustainability: 'Premium solar panels crafted from scratch',
      rating: 4.7,
      icon: '⚡',
      color: 'from-yellow-500 to-yellow-600'
    },
  ];

  const vouchers = [
    {
      id: 4,
      name: '20% Off Organic Groceries',
      points: 200,
      originalPrice: '₹500 value',
      category: 'vouchers',
      partner: 'GreenMart',
      validUntil: '30 days',
      icon: '🥬',
      color: 'from-secondary to-amber-500'
    },
    {
      id: 5,
      name: 'Free Coffee for a Week',
      points: 120,
      originalPrice: '₹1,750 value',
      category: 'vouchers',
      partner: 'EcoCafe',
      validUntil: '7 days',
      icon: '☕',
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 6,
      name: '₹1,250 Sustainable Fashion',
      points: 350,
      originalPrice: '₹1,250 value',
      category: 'vouchers',
      partner: 'EcoWear',
      validUntil: '60 days',
      icon: '👕',
      color: 'from-green-500 to-green-600'
    },
  ];

  const allRewards = [...products, ...vouchers];

  return (
    <section id="rewards" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Rewards Store</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Redeem your earned points for custom-built solar panels made from scratch or get discount vouchers.
          </p>

          {/* User Points Display */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-3 bg-primary/10 text-primary px-6 py-3 rounded-2xl"
          >
            <Coins className="w-6 h-6" />
            <span className="text-xl font-semibold">{userPoints.toLocaleString()} Points</span>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12">
            <TabsTrigger value="all">All Rewards</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allRewards.map((item, index) => (
                <RewardCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  userPoints={userPoints}
                  onRedeem={handleRedeem}
                  redeeming={redeeming === item.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item, index) => (
                <RewardCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  userPoints={userPoints}
                  onRedeem={handleRedeem}
                  redeeming={redeeming === item.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vouchers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vouchers.map((item, index) => (
                <RewardCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  userPoints={userPoints}
                  onRedeem={handleRedeem}
                  redeeming={redeeming === item.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* How Points Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-muted/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-semibold text-center mb-8">How Points Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold">Earn Points</h4>
              <p className="text-sm text-muted-foreground">Get 10-50 points per kg of donated waste based on material type</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-semibold">Bonus Rewards</h4>
              <p className="text-sm text-muted-foreground">Extra points for referrals, milestones, and regular donations</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold">Redeem Rewards</h4>
              <p className="text-sm text-muted-foreground">Exchange points for products or vouchers with no expiry</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </section>
  );
}

function RewardCard({ 
  item, 
  index, 
  userPoints, 
  onRedeem, 
  redeeming 
}: { 
  item: any; 
  index: number; 
  userPoints: number;
  onRedeem: (id: number) => void;
  redeeming: boolean;
}) {
  const canAfford = userPoints >= item.points;
  const isProduct = item.category === 'products';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer">
        {/* 3D Product Visualization */}
        <div className="relative overflow-hidden h-48">
          <motion.div
            whileHover={{ rotateY: 10, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center relative`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Product Icon */}
            <motion.div
              animate={{ 
                rotateY: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl relative"
              style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
            >
              {item.icon}
            </motion.div>
            
            {/* Floating particles */}
            <motion.div
              animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full"
            />
            <motion.div
              animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-white/40 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 right-8 w-1 h-1 bg-white/50 rounded-full"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
          
          <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">
            {item.points} pts
          </Badge>
          {isProduct && item.rating && (
            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs">{item.rating}</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{item.originalPrice}</span>
            {!isProduct && (
              <Badge variant="outline" className="text-xs">
                {item.validUntil}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {isProduct ? (
            <p className="text-sm text-muted-foreground">{item.sustainability}</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">Partner: {item.partner}</p>
              <p className="text-xs text-muted-foreground">Valid for {item.validUntil}</p>
            </div>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full"
              disabled={!canAfford || redeeming}
              variant={canAfford ? "default" : "outline"}
              onClick={() => canAfford && onRedeem(item.id)}
            >
              {redeeming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : canAfford ? (
                'Redeem'
              ) : (
                `Need ${item.points - userPoints} more points`
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}