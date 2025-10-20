import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';

// New Express.js backend URL
// For development: http://localhost:5000/api/v1
// For production: Update this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean;
}

export function useApi() {
  const { session } = useAuth();

  const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
    const { method = 'GET', body, requireAuth = false } = options;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requireAuth && session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { apiCall };
}

export function useUserProfile() {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/user/profile', { requireAuth: true });
    
    if (apiError) {
      setError(apiError);
    } else {
      setProfile(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: any) => {
    const { data, error: apiError } = await apiCall('/user/profile', {
      method: 'PUT',
      body: updates,
      requireAuth: true,
    });

    if (!apiError) {
      setProfile(data);
    }

    return { data, error: apiError };
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

export function useDonations() {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/donations', { requireAuth: true });
    
    if (apiError) {
      setError(apiError);
    } else {
      setDonations(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDonations();
    } else {
      setDonations([]);
    }
  }, [user]);

  const createDonation = async (donationData: any) => {
    const { data, error: apiError } = await apiCall('/donations', {
      method: 'POST',
      body: donationData,
      requireAuth: true,
    });

    if (!apiError) {
      setDonations(prev => [data, ...prev]);
    }

    return { data, error: apiError };
  };

  return { donations, loading, error, createDonation, refetch: fetchDonations };
}

export function useRewards() {
  const { apiCall } = useApi();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/rewards');
    
    if (apiError) {
      setError(apiError);
    } else {
      setRewards(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const redeemReward = async (rewardId: number) => {
    const { data, error: apiError } = await apiCall(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
      requireAuth: true,
    });

    return { data, error: apiError };
  };

  return { rewards, loading, error, redeemReward, refetch: fetchRewards };
}

export function useCommunityImpact() {
  const { apiCall } = useApi();
  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/impact/community');
    
    if (apiError) {
      console.warn('Community impact API error:', apiError);
      // Provide fallback data for better UX
      setImpact({
        totalUsers: 1,
        totalDonations: 0,
        totalWeight: 0,
        totalCarbonSaved: 0,
        source: 'fallback'
      });
      setError(null); // Don't show error to user, use fallback
    } else {
      setImpact({
        ...data,
        source: 'api'
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  return { impact, loading, error, refetch: fetchImpact };
}

export function usePersonalImpact() {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImpact = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/impact/personal', { requireAuth: true });
    
    if (apiError) {
      setError(apiError);
    } else {
      setImpact(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchImpact();
    } else {
      setImpact(null);
    }
  }, [user]);

  return { impact, loading, error, refetch: fetchImpact };
}