import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Leaf, User, Gift, MapPin, LogOut, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { AuthDialog } from './AuthDialog';
import { toast } from 'sonner';
import wasteWinsLogo from 'figma:asset/64842a1307aaa63c3be652b7db9827f80be7ab2a.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const navItems = [
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Rewards', href: '#rewards' },
    { name: 'Impact', href: '#impact' },
    { name: 'Pickup', href: '#quick-donate' },
  ];

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Sign out failed');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src={wasteWinsLogo} 
                alt="WASTE WINS" 
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 0 0 transparent)',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>
            <span className="text-3xl font-black text-foreground">WASTE WINS</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Welcome, </span>
                  <span className="font-medium">{(user as any).user_metadata?.name || user.email}</span>
                </div>
                {/* Admin Dashboard Link - Hidden for security */}
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)} className="space-x-2">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Button>
                <Button size="sm" className="space-x-2" onClick={() => user ? undefined : setAuthDialogOpen(true)}>
                  <Gift className="w-4 h-4" />
                  <span>Donate Now</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border bg-card"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-3 py-2 space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm">
                        <span className="text-muted-foreground">Welcome, </span>
                        <span className="font-medium">{(user as any).user_metadata?.name || user.email}</span>
                      </div>
                      {/* Admin Dashboard Link - Hidden for security */}
                      <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)} className="w-full justify-start space-x-2">
                        <User className="w-4 h-4" />
                        <span>Login</span>
                      </Button>
                      <Button size="sm" onClick={() => setAuthDialogOpen(true)} className="w-full justify-start space-x-2">
                        <Gift className="w-4 h-4" />
                        <span>Donate Now</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>
  );
}