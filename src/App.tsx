import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
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
import { Analytics } from "@vercel/analytics/react";
import { validateEnv } from './utils/env';
import { useAnalytics } from './hooks/useAnalytics';

function AppContent() {
  const { user } = useAuth();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    validateEnv();
    // Track initial page view
    trackPageView('home');
  }, [trackPageView]);

  // Check if user is admin (you can modify this logic)
  const isAdmin = user?.email === 'admin@wastewins.com' || (user as any)?.role === 'admin';

  // Show admin dashboard if admin
  if (isAdmin && window.location.pathname === '/admin') {
    return <AdminDashboard />;
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
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Analytics />
      </AuthProvider>
    </ErrorBoundary>
  );
}
