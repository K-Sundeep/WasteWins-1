import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  points?: number;
  total_donations?: number;
  total_weight?: number;
}

interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        
        // Handle backward compatibility with old session format
        const normalizedSession = parsedSession.token 
          ? { 
              access_token: parsedSession.token,
              user: parsedSession.user 
            } 
          : parsedSession;
          
        setSession(normalizedSession);
        setUser(normalizedSession.user);
      } catch (error) {
        console.error('Failed to parse stored session:', error);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      // Use access_token to match the API client's expectation
      const session = { access_token: data.token, user: data.user };
      localStorage.setItem('session', JSON.stringify(session));
      setSession(session);
      setUser(data.user);
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting signup with:', { email, name });
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      console.log('Signup response:', { status: response.status, data });
      
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Signup failed';
        console.error('Signup failed:', errorMessage);
        return { error: errorMessage };
      }

      // If we have a token in the response, use it directly
      if (data.token && data.user) {
        console.log('Signup successful, using token from response');
        // Use access_token to match the API client's expectation
        const session = { access_token: data.token, user: data.user };
        localStorage.setItem('session', JSON.stringify(session));
        setSession(session);
        setUser(data.user);
        return { error: null };
      }

      // Otherwise, try to log in with the credentials
      console.log('No token in response, attempting login...');
      return await signIn(email, password);
      
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('session');
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}