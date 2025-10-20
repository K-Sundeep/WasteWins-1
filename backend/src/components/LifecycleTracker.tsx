import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useDonations } from '../hooks/useApi';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { DonationCard } from './DonationCard';
import { Donation } from '../types/donation';
import { sampleDonations } from '../data/sampleDonations';

export function LifecycleTracker() {
  const { user } = useAuth();
  const { donations, loading, error, refetch } = useDonations();
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const validDonations = (donations || []).filter(d => 
    d?.id && d?.status && d?.items && typeof d.weight === 'number'
  );

  if (!user) {
    return <div className="text-center py-6">Please sign in to view your donations.</div>;
  }

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-destructive mb-2">Error loading donations.</p>
        <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const displayDonations = validDonations.length > 0 ? validDonations : sampleDonations;
  const isSample = validDonations.length === 0;

  return (
    <div className="space-y-4">
      {isSample && (
        <div className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">No donations found yet.</p>
          <p>Here are a few sample donations to show how your journey will look once you start donating.</p>
        </div>
      )}
      {displayDonations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} />
      ))}
    </div>
  );
}
