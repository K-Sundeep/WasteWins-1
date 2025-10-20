import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  userId?: number;
}

interface AnalyticsHook {
  trackEvent: (eventType: string, eventData?: Record<string, any>) => void;
  startSession: () => void;
  endSession: () => void;
  trackPageView: (pageName: string) => void;
  trackDonation: (donationData: any) => void;
  trackCenterView: (centerData: any) => void;
  trackUserAction: (action: string, data?: any) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useAnalytics = (): AnalyticsHook => {
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<number | null>(null);

  // Get current user ID from localStorage or context
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userIdRef.current = user.id;
      } catch (error) {
        console.warn('Failed to parse user data for analytics');
      }
    }
  }, []);

  // Track analytics event
  const trackEvent = useCallback(async (eventType: string, eventData: Record<string, any> = {}) => {
    try {
      const payload = {
        userId: userIdRef.current,
        sessionId: sessionIdRef.current,
        eventType,
        eventData: {
          ...eventData,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
        platform: 'web'
      };

      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Fail silently to not disrupt user experience
    }
  }, []);

  // Start user session
  const startSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userIdRef.current,
          platform: 'web'
        }),
      });

      const data = await response.json();
      sessionIdRef.current = data.sessionId;

      // Track app open event
      trackEvent('app_open', {
        sessionStart: true,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
      });

    } catch (error) {
      console.warn('Failed to start analytics session:', error);
      // Generate local session ID as fallback
      sessionIdRef.current = uuidv4();
    }
  }, [trackEvent]);

  // End user session
  const endSession = useCallback(async () => {
    if (!sessionIdRef.current) return;

    try {
      await fetch(`${API_BASE_URL}/analytics/session/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
        }),
      });

      sessionIdRef.current = null;

    } catch (error) {
      console.warn('Failed to end analytics session:', error);
    }
  }, []);

  // Track page views
  const trackPageView = useCallback((pageName: string) => {
    trackEvent('page_view', {
      pageName,
      path: window.location.pathname,
      search: window.location.search,
    });
  }, [trackEvent]);

  // Track donation creation
  const trackDonation = useCallback((donationData: any) => {
    trackEvent('donation_created', {
      category: donationData.category,
      weight: donationData.weight,
      carbon_saved: donationData.carbonSaved,
      center_id: donationData.centerId,
      estimated_value: donationData.estimatedValue,
    });
  }, [trackEvent]);

  // Track recycling center views
  const trackCenterView = useCallback((centerData: any) => {
    trackEvent('center_viewed', {
      centerId: centerData.id,
      centerName: centerData.name,
      distance: centerData.distance,
      services: centerData.services,
    });
  }, [trackEvent]);

  // Track general user actions
  const trackUserAction = useCallback((action: string, data: any = {}) => {
    trackEvent('user_action', {
      action,
      ...data,
    });
  }, [trackEvent]);

  // Auto-start session on hook initialization
  useEffect(() => {
    startSession();

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, [startSession, endSession]);

  return {
    trackEvent,
    startSession,
    endSession,
    trackPageView,
    trackDonation,
    trackCenterView,
    trackUserAction,
  };
};

// Convenience hook for tracking specific events
export const useEventTracker = () => {
  const { trackEvent } = useAnalytics();

  return {
    // Authentication events
    trackLogin: () => trackEvent('user_login'),
    trackLogout: () => trackEvent('user_logout'),
    trackRegister: () => trackEvent('user_register'),

    // Feature usage
    trackSearch: (query: string) => trackEvent('search', { query }),
    trackFilter: (filters: any) => trackEvent('filter_applied', filters),
    trackShare: (content: string) => trackEvent('content_shared', { content }),

    // Engagement
    trackButtonClick: (buttonName: string) => trackEvent('button_click', { buttonName }),
    trackFormSubmit: (formName: string) => trackEvent('form_submit', { formName }),
    trackError: (error: string, context?: any) => trackEvent('error', { error, context }),

    // Business metrics
    trackRewardClaim: (rewardId: string) => trackEvent('reward_claimed', { rewardId }),
    trackImpactView: () => trackEvent('impact_viewed'),
    trackProfileUpdate: () => trackEvent('profile_updated'),
  };
};
