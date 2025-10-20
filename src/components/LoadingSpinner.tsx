import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto">
        <Loader2 className="w-full h-full animate-spin text-primary" />
      </div>
      <h2 className="text-xl font-semibold">Loading WasteWins...</h2>
      <p className="text-muted-foreground">Please wait while we prepare your experience</p>
    </div>
  </div>
);
