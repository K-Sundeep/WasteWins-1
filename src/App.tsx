import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { QuickDonate } from './components/QuickDonate';
import { HowItWorks } from './components/HowItWorks';
import { RewardsStore } from './components/RewardsStore';
import { ImpactTracker } from './components/ImpactTracker';
import { LifecycleTracker } from './components/LifecycleTracker';
import { UserDashboard } from './components/UserDashboard';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './components/AuthProvider';


function AppContent() {
  const { user } = useAuth();

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}