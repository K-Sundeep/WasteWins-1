import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { TreePine, Users, Factory, Zap, Loader2, RefreshCw } from 'lucide-react';
import { RecyclingMap } from './RecyclingMap';
import { useOpenDataRecycling } from '../hooks/useOpenData';
import { usePersonalImpact, useCommunityImpact } from '../hooks/useApi';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';

export function ImpactTracker() {
  const { sites } = useOpenDataRecycling();
  const { user } = useAuth();
  const { impact: personalImpact, loading: personalLoading, refetch: refetchPersonal } = usePersonalImpact();
  const { impact: communityImpact, loading: communityLoading, refetch: refetchCommunity } = useCommunityImpact();
  
  // Type assertions for impact data
  const personalData = personalImpact as any;
  const communityData = communityImpact as any;
  
  // Auto-refresh every 30 seconds
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refetchPersonal();
      }
      refetchCommunity();
      setLastRefresh(Date.now());
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [user, refetchPersonal, refetchCommunity]);
  
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (user) {
        await refetchPersonal();
      }
      await refetchCommunity();
      setLastRefresh(Date.now());
    } finally {
      setIsRefreshing(false);
    }
  }, [user, refetchPersonal, refetchCommunity]);
  
  // Listen for donation events to auto-refresh
  useEffect(() => {
    const handleDonationComplete = () => {
      console.log('🔄 Donation completed, refreshing impact...');
      setTimeout(() => {
        handleManualRefresh();
      }, 500);
    };
    
    window.addEventListener('donationComplete', handleDonationComplete);
    return () => window.removeEventListener('donationComplete', handleDonationComplete);
  }, [handleManualRefresh]);

  return (
    <section id="impact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl">Your Environmental Impact</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleManualRefresh}
              disabled={personalLoading || communityLoading || isRefreshing}
              title="Refresh impact data"
            >
              <RefreshCw className={`w-4 h-4 ${(personalLoading || communityLoading || isRefreshing) ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your positive contribution to the environment and see how your donations create real-world change.
            <span className="block text-sm mt-2 text-muted-foreground/70">
              🔄 Auto-updates every 30 seconds • Last updated: {new Date(lastRefresh).toLocaleTimeString()}
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personal Impact Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TreePine className="w-5 h-5 text-primary" />
                  <span>Your Personal Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : !user ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Sign in to track your personal impact
                  </div>
                ) : personalData ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{personalData.totalWeight} kg</div>
                        <div className="text-sm text-muted-foreground">Total Donated</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{personalData.pointsEarned}</div>
                        <div className="text-sm text-muted-foreground">Points Earned</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{personalData.carbonSaved} kg</div>
                        <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{personalData.productsMade}</div>
                        <div className="text-sm text-muted-foreground">Products Made</div>
                      </div>
                    </div>

                    {/* Waste Breakdown Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Donation Breakdown</h4>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={personalData.donationBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {personalData.donationBreakdown.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center flex-wrap gap-4 mt-2">
                        {personalData.donationBreakdown.map((item: any) => (
                          <div key={item.name} className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">{item.name} ({item.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No donation data yet. Start donating to see your impact!
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Impact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Community Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {communityLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : communityData ? (
                  <>
                    {sites && (
                      <div className="text-sm text-muted-foreground mb-4">
                        Nearby recycling centers detected: <span className="font-medium">{sites.length}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-semibold">Active Users</div>
                            <div className="text-sm text-muted-foreground">Community members</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{communityData.activeUsers.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Factory className="w-6 h-6 text-primary" />
                          <div>
                            <div className="font-semibold">Partner Factories</div>
                            <div className="text-sm text-muted-foreground">Active processing plants</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{communityData.partnerFactories}</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-secondary" />
                          <div>
                            <div className="font-semibold">Jobs Created</div>
                            <div className="text-sm text-muted-foreground">Local employment</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{communityData.jobsCreated.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Zap className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-semibold">Energy Saved</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{communityData.energySaved} MW</div>
                      </div>
                    </div>

                    {/* Nearby Recycling Centers Map */}
                    <RecyclingMap />

                    {/* Monthly Progress Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Monthly Waste Processing</h4>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={communityData.monthlyData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="waste" fill="#2F8A5C" name="Waste Collected (kg)" />
                            <Bar dataKey="products" fill="#FFB35C" name="Products Made" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Unable to load community impact data
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}