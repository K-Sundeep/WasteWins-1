import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-84fed428`;

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
    } else if (!requireAuth) {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
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
        throw new Error(data.error || `HTTP ${response.status}`);
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiCall('/impact/community');
    
    if (apiError) {
      setError(apiError);
    } else {
      setImpact(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  return { impact, loading, error, refetch: fetchImpact };
}