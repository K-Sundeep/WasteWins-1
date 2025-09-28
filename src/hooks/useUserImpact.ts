// src/hooks/useUserImpact.ts
import { useState, useEffect, useCallback } from "react";

export function useUserImpact(userId?: string) {
  const [impact, setImpact] = useState<{
    totalDonated: number;
    pointsEarned: number;
    co2Saved: number;
    productsMade: number;
  } | null>(null);

  const fetchImpact = useCallback(() => {
    if (!userId) {
      setImpact(null);
      return;
    }
    fetch(`/api/user-impact?userId=${userId}`)
      .then(res => res.json())
      .then(data => setImpact(data));
  }, [userId]);

  useEffect(() => {
    fetchImpact();
  }, [fetchImpact]);

  return { impact, refresh: fetchImpact };
}