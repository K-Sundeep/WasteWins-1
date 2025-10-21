import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Recycle, Award, MapPin } from 'lucide-react';
import { PickupLocationsDialog } from './PickupLocationsDialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import wasteWinsLogo from 'figma:asset/64842a1307aaa63c3be652b7db9827f80be7ab2a.png';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full"
              >
                <Recycle className="w-4 h-4" />
                <span className="text-sm font-medium">Waste to Rewards Platform</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold">
                <span className="block">Turn Your</span>
                <span className="block text-primary">Waste</span>
                <span className="block">Into Rewards</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Donate clothes, biowaste, and plastics. Earn points. Redeem for custom solar panels. 
                Track your environmental impact in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="group space-x-2"
                  onClick={() => {
                    const quickDonateElement = document.getElementById('quick-donate');
                    if (quickDonateElement) {
                      quickDonateElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span>Start Donating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <PickupLocationsDialog>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Find Pickup Location</span>
                  </Button>
                </motion.div>
              </PickupLocationsDialog>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 pt-6 sm:pt-8 border-t border-border"
            >
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-primary">15K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Tons Recycled</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-primary">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-primary">200+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Partner Factories</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive 3D Logo & Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl sm:rounded-3xl overflow-hidden">
              {/* Interactive Central Logo */}
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 15,
                  rotateX: 10 
                }}
                animate={{ 
                  rotateY: [0, 5, 0, -5, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => {
                  const quickDonateElement = document.getElementById('quick-donate');
                  if (quickDonateElement) {
                    quickDonateElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="relative w-32 h-32 bg-white rounded-3xl shadow-2xl transform-gpu flex items-center justify-center group">
                  <img 
                    src={wasteWinsLogo} 
                    alt="WASTE WINS Interactive Logo" 
                    className="w-24 h-24 object-contain transition-transform group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      mixBlendMode: 'multiply'
                    }}
                  />
                  {/* 3D depth effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-3xl transform translate-x-2 translate-y-2 -z-10"></div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20"></div>
                </div>
              </motion.div>

              {/* 3D Waste Transformation Scene */}
              <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                {/* Waste Bin 3D Element */}
                <motion.div
                  animate={{ 
                    rotateY: [0, 10, 0, -10, 0],
                    rotateX: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-8 top-16"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative w-16 h-20 bg-primary rounded-lg shadow-2xl transform-gpu">
                    {/* Bin body */}
                    <div className="absolute inset-0 bg-primary rounded-lg shadow-inner"></div>
                    {/* Bin lid */}
                    <div className="absolute -top-2 inset-x-0 h-3 bg-primary rounded-t-lg shadow-lg"></div>
                    {/* Bin handle */}
                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary-foreground rounded-full"></div>
                    {/* 3D depth effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>
                  </div>
                </motion.div>

                {/* Solar Panel 3D Element */}
                <motion.div
                  animate={{ 
                    rotateY: [0, -15, 0, 15, 0],
                    rotateZ: [0, 2, 0, -2, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-16 top-20"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative w-20 h-12 bg-blue-600 rounded shadow-2xl transform-gpu">
                    {/* Solar panel grid */}
                    <div className="absolute inset-1 grid grid-cols-4 gap-px">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="bg-blue-700 rounded-sm"></div>
                      ))}
                    </div>
                    {/* 3D depth effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded transform translate-x-1 translate-y-1 -z-10"></div>
                    {/* Reflective surface */}
                    <div className="absolute top-1 left-1 w-3 h-2 bg-white/30 rounded blur-sm"></div>
                  </div>
                </motion.div>

                {/* Lightning Bolt Energy Element */}
                <motion.div
                  animate={{ 
                    rotateZ: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-8 bottom-20"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative w-14 h-18 bg-secondary rounded-lg shadow-2xl transform-gpu">
                    {/* Lightning bolt shape */}
                    <div className="absolute inset-2 flex items-center justify-center">
                      <div className="text-2xl text-white">⚡</div>
                    </div>
                    {/* 3D depth effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-amber-500 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-secondary/50 rounded-lg blur-md -z-20"></div>
                  </div>
                </motion.div>
              </div>
              
              {/* Floating Data Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-8 bg-card p-4 rounded-xl shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">2.4kg Collected</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-8 bg-card p-4 rounded-xl shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">+240 Points</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-4 bg-primary/20 backdrop-blur-sm p-4 rounded-xl"
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-primary">Processing...</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}