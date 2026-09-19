import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { deliveryApi } from '../api/deliveryApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('food_delivery_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('food_delivery_token'));
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load driver profile & dashboard data on mount if token exists
  const loadProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('food_delivery_token');
    if (!currentToken) {
      setLoading(false);
      return;
    }
    try {
      const dashData = await deliveryApi.getDashboard();
      if (dashData.success && dashData.driver) {
        setDriver(dashData.driver);
      }
    } catch (err) {
      console.warn('Could not fetch driver dashboard info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();

    const handleExpired = () => {
      setUser(null);
      setToken(null);
      setDriver(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [loadProfile]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await deliveryApi.login(email, password);
      if (data.user.role !== 'driver' && data.user.role !== 'admin') {
        throw new Error('Access denied. Only registered Delivery Partners can access this portal.');
      }
      localStorage.setItem('food_delivery_token', data.token);
      localStorage.setItem('food_delivery_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      await loadProfile();
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const quickDemoLogin = async () => {
    setError(null);
    try {
      const data = await deliveryApi.getDemoUsers();
      if (data.success && data.demoUsers) {
        const demoRider = data.demoUsers.find(u => u.role === 'driver');
        if (demoRider) {
          localStorage.setItem('food_delivery_token', demoRider.token);
          const safeUser = {
            id: demoRider.id,
            name: demoRider.name,
            email: demoRider.email,
            role: demoRider.role,
            avatar_url: demoRider.avatar_url
          };
          localStorage.setItem('food_delivery_user', JSON.stringify(safeUser));
          setUser(safeUser);
          setToken(demoRider.token);
          await loadProfile();
          return demoRider;
        }
      }
      // Fallback manual login
      return await login('driver@foodsystem.com', 'password123');
    } catch (err) {
      setError(err.message || 'Demo login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('food_delivery_token');
    localStorage.removeItem('food_delivery_user');
    setUser(null);
    setToken(null);
    setDriver(null);
  };

  const toggleOnline = async (isOnlineStatus) => {
    try {
      const res = await deliveryApi.toggleStatus(isOnlineStatus);
      if (res.success && res.driver) {
        setDriver(prev => ({
          ...prev,
          is_online: res.driver.is_online
        }));
      }
      return res;
    } catch (err) {
      console.error('Error toggling online status:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        driver,
        loading,
        error,
        login,
        quickDemoLogin,
        logout,
        toggleOnline,
        refreshDashboard: loadProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
