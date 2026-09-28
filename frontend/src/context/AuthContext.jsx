import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodie_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodie_token'));
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  // Fetch demo users for convenience
  useEffect(() => {
    api.getDemoUsers()
      .then((res) => {
        if (res && res.demoUsers) {
          setDemoUsers(res.demoUsers);
        }
      })
      .catch((err) => console.warn('Could not prefetch demo users:', err));
  }, []);

  // Fetch driver profile if role is driver
  const loadDriverProfile = useCallback(async () => {
    try {
      const dashData = await api.getDriverDashboard();
      if (dashData && dashData.driver) {
        setDriver(dashData.driver);
      }
    } catch (err) {
      console.warn('Could not fetch driver dashboard info:', err);
    }
  }, []);

  // Fetch current user details on boot if token exists
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('foodie_token');
    if (!savedToken) {
      setUser(null);
      setDriver(null);
      setLoading(false);
      return;
    }

    api.setToken(savedToken);
    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(res.user);
        setToken(savedToken);
        localStorage.setItem('foodie_user', JSON.stringify(res.user));
        if (res.user.role === 'driver') {
          await loadDriverProfile();
        }
      } else {
        api.setToken(null);
        setUser(null);
        setToken(null);
        setDriver(null);
        localStorage.removeItem('foodie_token');
        localStorage.removeItem('foodie_user');
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err.message);
      api.setToken(null);
      setUser(null);
      setToken(null);
      setDriver(null);
      localStorage.removeItem('foodie_token');
      localStorage.removeItem('foodie_user');
    } finally {
      setLoading(false);
    }
  }, [loadDriverProfile]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res && res.token && res.user) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      if (res.user.role === 'driver') {
        await loadDriverProfile();
      }
      return res;
    }
    throw new Error('Invalid login response');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res && res.token && res.user) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      if (res.user.role === 'driver') {
        await loadDriverProfile();
      }
      return res;
    }
    throw new Error('Invalid registration response');
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
    setDriver(null);
    localStorage.removeItem('foodie_token');
    localStorage.removeItem('foodie_user');
  };

  const restaurantLogin = async (restaurantId, pin) => {
    const res = await api.restaurantLogin(restaurantId, pin);
    if (res && res.token && res.user) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error('Restaurant authentication failed');
  };

  const toggleOnline = async (isOnline) => {
    const res = await api.toggleDriverStatus(isOnline);
    if (res) {
      setDriver((prev) => (prev ? { ...prev, is_online: isOnline } : { is_online: isOnline }));
    }
    return res;
  };

  const quickLoginAs = async (targetRole) => {
    let target = demoUsers.find(u => u.role === targetRole);
    if (!target) {
      const emailMap = {
        customer: 'customer@foodsystem.com',
        restaurant: 'restaurant@foodsystem.com',
        driver: 'driver@foodsystem.com',
        admin: 'admin@foodsystem.com'
      };
      const email = emailMap[targetRole] || 'customer@foodsystem.com';
      return await login(email, 'password123');
    }

    if (target.token) {
      api.setToken(target.token);
      setToken(target.token);
      localStorage.setItem('foodie_token', target.token);
      try {
        const meRes = await api.getMe();
        setUser(meRes.user);
        localStorage.setItem('foodie_user', JSON.stringify(meRes.user));
        if (meRes.user.role === 'driver') {
          await loadDriverProfile();
        }
      } catch {
        setUser(target);
        localStorage.setItem('foodie_user', JSON.stringify(target));
      }
      return target;
    } else {
      return await login(target.email, 'password123');
    }
  };

  const updateProfile = async (profileUpdates) => {
    const res = await api.updateProfile(profileUpdates);
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      if (res.user.role === 'driver') {
        await loadDriverProfile();
      }
      return res.user;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        driver,
        token,
        role: user?.role || 'guest',
        loading,
        demoUsers,
        login,
        restaurantLogin,
        register,
        logout,
        quickLoginAs,
        toggleOnline,
        refreshDriverDashboard: loadDriverProfile,
        updateProfile,
        refreshUser: checkAuth
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
