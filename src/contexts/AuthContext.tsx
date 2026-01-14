import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode, FC } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        clearAuth();
        return false;
      }

      const response = await authAPI.refreshToken(refreshToken);
      
      if (response.success && response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // If server returns new refresh token, update it
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        return true;
      }
      
      // Refresh token is invalid/expired
      clearAuth();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth data on refresh failure
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  // Load user and verify authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // If we have tokens, try to verify and get user
        if (storedAccessToken || storedRefreshToken) {
          let token = storedAccessToken;
          
          // If no access token but have refresh token, try to refresh
          if (!token && storedRefreshToken) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              token = localStorage.getItem('accessToken');
            }
          }

          // If we have a token, verify by fetching profile
          if (token) {
            try {
              const response = await authAPI.getProfile();
              
              if (response.success && response.data.user) {
                setUser(response.data.user);
                setAccessToken(token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setLoading(false);
                return;
              }
            } catch (error: any) {
              // Access token expired, try refresh
              if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                const refreshed = await refreshAccessToken();
                
                if (refreshed) {
                  // Retry with new access token
                  try {
                    const retryResponse = await authAPI.getProfile();
                    if (retryResponse.success && retryResponse.data.user) {
                      setUser(retryResponse.data.user);
                      setAccessToken(localStorage.getItem('accessToken'));
                      localStorage.setItem('user', JSON.stringify(retryResponse.data.user));
                      setLoading(false);
                      return;
                    }
                  } catch (retryError) {
                    // Refresh failed, clear everything
                    console.error('Retry after refresh failed:', retryError);
                  }
                }
              }
            }
          }
        }

        // No valid authentication found, clear storage
        clearAuth();
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAccessToken, clearAuth]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    
    if (response.success) {
      const { user: userData, accessToken, refreshToken } = response.data;
      setUser(userData);
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await authAPI.register(userData);
    
    if (response.success) {
      const { user: newUser, accessToken, refreshToken } = response.data;
      setUser(newUser);
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate refresh token on server
      if (accessToken) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      // Navigation will be handled by ProtectedRoute
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [accessToken, clearAuth]);

  const updateUser = async (userData: Partial<User>) => {
    const response = await authAPI.updateProfile(userData);
    
    if (response.success) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      throw new Error(response.message || 'Update failed');
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!accessToken && !!user,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
