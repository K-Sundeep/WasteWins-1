import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Package, Factory, Recycle, Gift } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Package,
      title: 'Donate',
      description: 'Collect clothes, books, or plastic items and schedule pickup or drop-off.',
      color: 'bg-blue-500',
    },
    {
      icon: Factory,
      title: 'Process',
      description: 'Items are sorted and sent to partner factories for eco-friendly processing.',
      color: 'bg-primary',
    },
    {
      icon: Recycle,
      title: 'Manufacture',
      description: 'Waste is transformed into new products like bags, books, and building materials.',
      color: 'bg-secondary',
    },
    {
      icon: Gift,
      title: 'Reward',
      description: 'Earn points and redeem them for recycled products or discount vouchers.',
      color: 'bg-purple-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple four-step process transforms your waste into rewards while creating a positive environmental impact.
          </p>
        </motion.div>

        <div className="relative">
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Step Number */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Processing Pipeline Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 bg-card rounded-2xl p-8"
          >
            <h3 className="text-2xl font-semibold text-center mb-8">Waste Transformation Pipeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cloth Pipeline */}
              <div className="text-center space-y-4">
                <div className="text-4xl">👕</div>
                <h4 className="font-semibold">Cloth & Textiles</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Bags & Purses</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Tablecloths</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Home Textiles</span>
                  </div>
                </div>
              </div>

              {/* Books Pipeline */}
              <div className="text-center space-y-4">
                <div className="text-4xl">🌱</div>
                <h4 className="font-semibold">Biowaste</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Fruit Peels</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Vegetable Peels</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Bio-Degradable</span>
                  </div>
                </div>
              </div>

              {/* Plastic Pipeline */}
              <div className="text-center space-y-4">
                <div className="text-4xl">♻️</div>
                <h4 className="font-semibold">Plastic Waste</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Eco Cement</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Building Materials</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Infrastructure</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}