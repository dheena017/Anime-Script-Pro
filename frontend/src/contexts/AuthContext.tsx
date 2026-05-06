import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fallbackAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {
    throw new Error('AuthProvider is not mounted: login is unavailable.');
  },
  logout: async () => {
    // no-op fallback
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const AUTH_REQUEST_TIMEOUT_MS = 15000;

  const fetchCurrentUser = useCallback(async (token: string) => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: AUTH_REQUEST_TIMEOUT_MS
      });
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user with token:", err);
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  // Only initialize auth once on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        await fetchCurrentUser(token);
      }
      setLoading(false);
    };

    initializeAuth();
    // Empty dependency array - only run once on mount
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('auth_token', access_token);
      } else {
        sessionStorage.setItem('auth_token', access_token);
      }
      
      await fetchCurrentUser(access_token);
    } catch (err) {
      throw err;
    }
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuthContext was used without AuthProvider. Falling back to safe auth state.');
    return fallbackAuthContext;
  }
  return context;
};



