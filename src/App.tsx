import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Button } from './components/ui/button';
import { AdminLogin } from './components/AdminLogin';
import { MobileExitButton } from './components/MobileExitButton';
import { Hero } from './components/Hero';
import { QuickDonate } from './components/QuickDonate';
import { HowItWorks } from './components/HowItWorks';
import { RewardsStore } from './components/RewardsStore';
import { ImpactTracker } from './components/ImpactTracker';
import { LifecycleTracker } from './components/LifecycleTracker';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
// Removed Vercel Analytics - using custom backend analytics instead
import { validateEnv } from './utils/env';
import { useAnalytics } from './hooks/useAnalytics';

function AppContent() {
  const { user } = useAuth();
  const { trackPageView } = useAnalytics();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    validateEnv();
    // Track initial page view
    trackPageView('home');
  }, [trackPageView]);

  // Handle admin access
  if (window.location.pathname === '/admin') {
    if (!adminAuthenticated) {
      return <AdminLogin onAdminLogin={setAdminAuthenticated} />;
    } else {
      return <AdminDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        {user && <UserDashboard />}
        <QuickDonate />
        <HowItWorks />
        <RewardsStore />
        <ImpactTracker />
        <LifecycleTracker />
      </main>
      <Footer />
      <MobileExitButton />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        {/* Using custom backend analytics instead of Vercel Analytics */}
      </AuthProvider>
    </ErrorBoundary>
  );
}
