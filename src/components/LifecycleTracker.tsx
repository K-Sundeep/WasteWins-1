import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Package, Truck, Factory, Recycle, CheckCircle, Clock, MapPin } from 'lucide-react';

export function LifecycleTracker() {
  const donations = [
    {
      id: 'DON-2024-001',
      items: 'Winter Clothes (3.2kg)',
      date: '2024-01-15',
      status: 'manufactured',
      currentStep: 4,
      estimatedCompletion: '2024-01-22',
      trackingSteps: [
        { title: 'Collected', icon: Package, completed: true, date: '2024-01-15' },
        { title: 'In Transit', icon: Truck, completed: true, date: '2024-01-16' },
        { title: 'Processing', icon: Factory, completed: true, date: '2024-01-18' },
        { title: 'Manufactured', icon: Recycle, completed: true, date: '2024-01-22' },
        { title: 'Available for Redemption', icon: CheckCircle, completed: true, date: '2024-01-22' },
      ],
      products: ['Eco Tote Bag', 'Reusable Tablecloth'],
      pointsEarned: 160,
    },
    {
      id: 'DON-2024-002',
      items: 'Books & Magazines (5.1kg)',
      date: '2024-01-20',
      status: 'processing',
      currentStep: 2,
      estimatedCompletion: '2024-01-28',
      trackingSteps: [
        { title: 'Collected', icon: Package, completed: true, date: '2024-01-20' },
        { title: 'In Transit', icon: Truck, completed: true, date: '2024-01-21' },
        { title: 'Processing', icon: Factory, completed: false, date: null },
        { title: 'Manufactured', icon: Recycle, completed: false, date: null },
        { title: 'Available for Redemption', icon: CheckCircle, completed: false, date: null },
      ],
      products: ['Recycled Notebooks', 'Eco Paper'],
      pointsEarned: 255,
    },
    {
      id: 'DON-2024-003',
      items: 'Plastic Containers (2.8kg)',
      date: '2024-01-25',
      status: 'collected',
      currentStep: 0,
      estimatedCompletion: '2024-02-05',
      trackingSteps: [
        { title: 'Collected', icon: Package, completed: true, date: '2024-01-25' },
        { title: 'In Transit', icon: Truck, completed: false, date: null },
        { title: 'Processing', icon: Factory, completed: false, date: null },
        { title: 'Manufactured', icon: Recycle, completed: false, date: null },
        { title: 'Available for Redemption', icon: CheckCircle, completed: false, date: null },
      ],
      products: ['Eco Cement Mix'],
      pointsEarned: 140,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'manufactured':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'collected':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'manufactured':
        return 'Ready to Redeem';
      case 'processing':
        return 'In Processing';
      case 'collected':
        return 'Recently Collected';
      default:
        return status;
    }
  };

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Donation Lifecycle Tracker</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow your donations through every step of their transformation journey from waste to valuable products.
          </p>
        </motion.div>

        <div className="space-y-8">
          {donations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{donation.id}</span>
                        <Badge className={getStatusColor(donation.status)}>
                          {getStatusText(donation.status)}
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground">{donation.items}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Donated: {donation.date}</span>
                        </span>
                        <span>Est. completion: {donation.estimatedCompletion}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">+{donation.pointsEarned}</div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Progress Steps */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Transformation Progress</h4>
                      <div className="text-sm text-muted-foreground">
                        Step {donation.currentStep + 1} of {donation.trackingSteps.length}
                      </div>
                    </div>
                    
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted"></div>
                      <div 
                        className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500"
                        style={{ width: `${(donation.currentStep / (donation.trackingSteps.length - 1)) * 100}%` }}
                      ></div>

                      {/* Steps */}
                      <div className="flex justify-between">
                        {donation.trackingSteps.map((step, stepIndex) => {
                          const Icon = step.icon;
                          const isCompleted = step.completed;
                          const isCurrent = stepIndex === donation.currentStep && !isCompleted;

                          return (
                            <motion.div
                              key={step.title}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: stepIndex * 0.1 }}
                              viewport={{ once: true }}
                              className="flex flex-col items-center space-y-2"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-primary text-primary-foreground'
                                    : isCurrent
                                    ? 'bg-secondary text-secondary-foreground animate-pulse'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="text-center">
                                <div className={`text-sm font-medium ${
                                  isCompleted ? 'text-primary' : isCurrent ? 'text-secondary' : 'text-muted-foreground'
                                }`}>
                                  {step.title}
                                </div>
                                {step.date && (
                                  <div className="text-xs text-muted-foreground">{step.date}</div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Products and Actions */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                      <h4 className="font-semibold mb-2">Products Being Made</h4>
                      <div className="flex flex-wrap gap-2">
                        {donation.products.map((product) => (
                          <Badge key={product} variant="outline">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Track Location</span>
                      </Button>
                      {donation.status === 'manufactured' && (
                        <Button size="sm" className="space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>View Products</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Total Donations</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-secondary">24.7 kg</div>
            <div className="text-sm text-muted-foreground">Total Weight</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-muted-foreground">Products Created</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-2xl font-bold text-purple-600">1,240</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}