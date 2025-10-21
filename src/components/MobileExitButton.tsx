import { Power } from 'lucide-react';
import { Button } from './ui/button';
import { useMobile } from '../hooks/useMobile';
import { motion } from 'framer-motion';

export function MobileExitButton() {
  const { isMobile, isCapacitor, exitApp } = useMobile();

  // Only show on mobile devices
  if (!isMobile && !isCapacitor) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <Button
        onClick={exitApp}
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 shadow-lg"
        title="Exit App"
      >
        <Power className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline">Exit</span>
      </Button>
    </motion.div>
  );
}
