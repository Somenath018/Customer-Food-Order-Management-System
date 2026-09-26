import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { customerApi } from '../api/customerApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('food_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('food_customer_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('food_customer_token');
    if (!currentToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await customerApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('food_customer_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Could not verify customer session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();

    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('customer_auth:expired', handleExpired);
    return () => window.removeEventListener('customer_auth:expired', handleExpired);
  }, [loadProfile]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await customerApi.login(email, password);
      localStorage.setItem('food_customer_token', data.token);
      localStorage.setItem('food_customer_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await customerApi.register(userData);
      localStorage.setItem('food_customer_token', data.token);
      localStorage.setItem('food_customer_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const quickDemoLogin = async () => {
    setError(null);
    try {
      const data = await customerApi.getDemoUsers();
      if (data.success && data.demoUsers) {
        const demoCustomer = data.demoUsers.find(u => u.role === 'customer');
        if (demoCustomer) {
          localStorage.setItem('food_customer_token', demoCustomer.token);
          const safeUser = {
            id: demoCustomer.id,
            name: demoCustomer.name,
            email: demoCustomer.email,
            role: demoCustomer.role,
            avatar_url: demoCustomer.avatar_url,
            phone: '+1 (555) 432-8765',
            address: '742 Evergreen Terrace, Apt 4B, New York, NY'
          };
          localStorage.setItem('food_customer_user', JSON.stringify(safeUser));
          setUser(safeUser);
          setToken(demoCustomer.token);
          return safeUser;
        }
      }
      return await login('customer@foodsystem.com', 'password123');
    } catch (err) {
      setError(err.message || 'Demo login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('food_customer_token');
    localStorage.removeItem('food_customer_user');
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('food_customer_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        quickDemoLogin,
        logout,
        updateUserProfile,
        refreshProfile: loadProfile
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
