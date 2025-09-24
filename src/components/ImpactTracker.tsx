import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TreePine, Users, Factory, Zap } from 'lucide-react';

export function ImpactTracker() {
  const impactData = [
    { name: 'Jan', waste: 1200, products: 450 },
    { name: 'Feb', waste: 1800, products: 680 },
    { name: 'Mar', waste: 2100, products: 790 },
    { name: 'Apr', waste: 1900, products: 720 },
    { name: 'May', waste: 2400, products: 920 },
    { name: 'Jun', waste: 2800, products: 1050 },
  ];

  const wasteBreakdown = [
    { name: 'Clothes', value: 45, color: '#2F8A5C' },
    { name: 'Books', value: 30, color: '#FFB35C' },
    { name: 'Plastic', value: 25, color: '#4A9B6E' },
  ];

  const milestones = [
    { title: 'First Donation', achieved: true, points: 50 },
    { title: '10 Donations', achieved: true, points: 200 },
    { title: '50kg Donated', achieved: true, points: 500 },
    { title: '100kg Donated', achieved: false, points: 1000, progress: 75 },
    { title: 'Eco Champion', achieved: false, points: 2000, progress: 25 },
  ];

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
          <h2 className="text-3xl md:text-4xl mb-4">Your Environmental Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your positive contribution to the environment and see how your donations create real-world change.
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">75.2 kg</div>
                    <div className="text-sm text-muted-foreground">Total Donated</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">1,580</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">45.8 kg</div>
                    <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">28</div>
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
                          data={wasteBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {wasteBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-2">
                    {wasteBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Factory className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-semibold">Partner Factories</div>
                        <div className="text-sm text-muted-foreground">Active processing plants</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">247</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-secondary" />
                      <div>
                        <div className="font-semibold">Jobs Created</div>
                        <div className="text-sm text-muted-foreground">Local employment</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">1,340</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Energy Saved</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">2.8 MW</div>
                  </div>
                </div>

                {/* Monthly Progress Chart */}
                <div>
                  <h4 className="font-semibold mb-4">Monthly Waste Processing</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={impactData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="waste" fill="#2F8A5C" name="Waste Collected (kg)" />
                        <Bar dataKey="products" fill="#FFB35C" name="Products Made" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Milestones and Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className="w-5 h-5" />
                <span>Milestones & Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`p-4 rounded-lg border-2 ${
                      milestone.achieved
                        ? 'border-primary bg-primary/5'
                        : 'border-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge
                        variant={milestone.achieved ? "default" : "outline"}
                        className="text-xs"
                      >
                        +{milestone.points}
                      </Badge>
                    </div>
                    
                    {milestone.achieved ? (
                      <div className="text-sm text-primary font-medium">✓ Completed</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Progress: {milestone.progress}%
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}