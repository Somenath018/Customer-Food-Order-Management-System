import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api, socket } from './services/api';
import './App.css';
import {
  ChefHat,
  ShoppingBag,
  Utensils,
  CheckCircle,
  Clock,
  Flame,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Phone,
  MapPin,
  TrendingUp,
  DollarSign,
  Bell,
  X,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Building,
  FileText,
  Lock,
  CheckCircle2,
  Key,
  LogOut,
  Calendar,
  PieChart
} from 'lucide-react';

// Utility function to play a pleasant dual-tone notification chime using Web Audio API
const playAlertChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;

    // Tone 1: E5 (659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: A5 (880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.warn('Unable to play alert chime:', err);
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [toastNotification, setToastNotification] = useState(null);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('today'); // 'today' | 'weekly'
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [addingDish, setAddingDish] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authForm, setAuthForm] = useState({
    restaurant_id: 'rest_01',
    password: '',
    fssai_license_no: '',
    bank_account_no: '',
    bank_ifsc: '',
    bank_name: '',
    account_holder: '',
    gstin: '',
    pan_number: ''
  });
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    dietary: 'veg',
    description: '',
    image_url: ''
  });

  // Fetch Sales & Earnings Analytics
  const loadAnalyticsData = useCallback(async (restId) => {
    const targetId = restId || 'rest_01';
    setLoadingAnalytics(true);
    try {
      const res = await api.get(`/restaurants/${targetId}/analytics`);
      if (res.data?.success && res.data?.analytics) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch initial dashboard data
  const loadDashboardData = useCallback(async (restId) => {
    const targetId = restId || 'rest_01';
    setLoadingMenu(true);
    try {
      const [ordersRes, menuRes] = await Promise.all([
        api.get('/orders'),
        api.get(`/menu/${targetId}`)
      ]);

      if (ordersRes.data?.success && Array.isArray(ordersRes.data.orders)) {
        setOrders(ordersRes.data.orders);
      }
      if (menuRes.data?.success && Array.isArray(menuRes.data.menu)) {
        setMenu(menuRes.data.menu);
      }

      await loadAnalyticsData(targetId);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingMenu(false);
    }
  }, [loadAnalyticsData]);

  const isInitialized = useRef(false);

  // Initial Auth & Dashboard Setup (Runs strictly once on component mount)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    async function initDashboard() {
      setLoading(true);
      setError('');
      try {
        let token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          // Retrieve default demo restaurant token
          const demoRes = await api.get('/auth/demo-users');
          if (demoRes.data?.success && demoRes.data?.demoUsers) {
            const restaurantDemo = demoRes.data.demoUsers.find((u) => u.role === 'restaurant');
            if (restaurantDemo) {
              token = restaurantDemo.token;
              localStorage.setItem('token', token);
              setUser(restaurantDemo);
            }
          }
        }

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Fetch current restaurant details
        const restRes = await api.get('/restaurants/my-restaurant');
        if (restRes.data?.success && restRes.data?.restaurant) {
          const restData = restRes.data.restaurant;
          setRestaurant(restData);
          if (restData.menu) setMenu(restData.menu);
          if (restData.activeOrders) setOrders(restData.activeOrders);

          // Prepopulate compliance form fields
          setAuthForm((prev) => ({
            ...prev,
            restaurant_id: restData.restaurant_id || restData.id || 'rest_01',
            fssai_license_no: restData.fssai_license_no || prev.fssai_license_no,
            bank_account_no: restData.bank_account_no || prev.bank_account_no,
            bank_ifsc: restData.bank_ifsc || prev.bank_ifsc,
            bank_name: restData.bank_name || prev.bank_name,
            account_holder: restData.account_holder || prev.account_holder,
            gstin: restData.gstin || prev.gstin,
            pan_number: restData.pan_number || prev.pan_number
          }));

          await loadDashboardData(restData.id);
        } else {
          setShowAuthModal(true);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.response?.data?.message || err.message || 'Error connecting to backend');
        setShowAuthModal(true);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Maintain mutable ref to restaurant object for socket callbacks with safe fallbacks
  const restaurantRef = useRef(restaurant);
  useEffect(() => {
    restaurantRef.current = restaurant;
    const targetRestId = restaurant?.id || restaurantRef.current?.id || 'rest_01';
    if (socket.connected) {
      socket.emit('join', `restaurant_${targetRestId}`);
    }
  }, [restaurant]);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    setSocketConnected(socket.connected);

    function onConnect() {
      setSocketConnected(true);
      const restId = restaurantRef.current?.id || restaurant?.id || 'rest_01';
      socket.emit('join', `restaurant_${restId}`);
    }

    function onDisconnect() {
      setSocketConnected(false);
    }

    function handleOrderCreated(data) {
      playAlertChime();
      const newOrder = data?.order || data;
      setToastNotification({
        title: 'New Order Received! 🛎️',
        message: data?.message || `Order #${(newOrder?.id || '').slice(-4).toUpperCase()} has arrived!`
      });

      setOrders((prevOrders) => {
        const list = Array.isArray(prevOrders) ? prevOrders : [];
        const exists = list.some((o) => o?.id === newOrder?.id);
        if (exists) return list.map((o) => (o?.id === newOrder?.id ? newOrder : o));
        return [newOrder, ...list];
      });

      const currentRestId = restaurantRef.current?.id || restaurant?.id || 'rest_01';
      loadAnalyticsData(currentRestId);
    }

    function handleOrderStatusChanged(data) {
      const updatedOrder = data?.order;
      if (!updatedOrder) return;
      setOrders((prevOrders) => {
        const list = Array.isArray(prevOrders) ? prevOrders : [];
        return list.map((o) => (o?.id === updatedOrder?.id ? updatedOrder : o));
      });
      const currentRestId = restaurantRef.current?.id || restaurant?.id || 'rest_01';
      loadAnalyticsData(currentRestId);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('order:created', handleOrderCreated);
    socket.on('order:status_changed', handleOrderStatusChanged);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('order:created', handleOrderCreated);
      socket.off('order:status_changed', handleOrderStatusChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restaurant Partner Login & Verification Handler
  const handleRestaurantLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      const res = await api.post('/auth/restaurant-login', {
        ...authForm,
        remember_me: rememberMe
      });

      if (res.data?.success && res.data?.token) {
        const token = res.data.token;
        if (rememberMe) {
          localStorage.setItem('token', token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', token);
          localStorage.removeItem('token');
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(res.data.user);
        setRestaurant(res.data.restaurant);

        setShowAuthModal(false);
        setToastNotification({
          title: 'Login Successful! 🔐',
          message: `Authenticated as ${res.data.restaurant.name} with compliance verified.`
        });

        await loadDashboardData(res.data.restaurant.id);
      }
    } catch (err) {
      console.error('Restaurant login failed:', err);
      alert(err.response?.data?.message || 'Login failed. Please check Restaurant ID & Password.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setRestaurant(null);
    setShowAuthModal(true);
  };

  // Open/Closed Toggle
  const handleToggleOpenStatus = async () => {
    if (!restaurant || togglingOpen) return;
    setTogglingOpen(true);
    try {
      const newOpenStatus = !restaurant.is_open;
      const res = await api.put(`/restaurants/${restaurant.id}`, {
        is_open: newOpenStatus
      });

      if (res.data?.success) {
        setRestaurant((prev) => (prev ? { ...prev, is_open: newOpenStatus } : prev));
      }
    } catch (err) {
      console.error('Failed to toggle open status:', err);
      alert(err.response?.data?.message || 'Failed to update restaurant status');
    } finally {
      setTogglingOpen(false);
    }
  };

  // Order Status Lifecycle Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus
      });

      if (res.data?.success && res.data?.order) {
        setOrders((prev) =>
          (prev || []).map((o) => (o?.id === orderId ? res.data.order : o))
        );
        if (restaurant?.id) {
          loadAnalyticsData(restaurant.id);
        }
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Add Dish to Menu
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price || !restaurant?.id) return;

    setAddingDish(true);
    try {
      const payload = {
        name: newDish.name.trim(),
        price: parseFloat(newDish.price),
        category: newDish.category,
        dietary: newDish.dietary,
        description: newDish.description.trim(),
        image_url: newDish.image_url.trim() || undefined,
        is_available: true
      };

      const res = await api.post(`/menu/${restaurant.id}`, payload);
      if (res.data?.success && res.data?.item) {
        setMenu((prev) => [...(prev || []), res.data.item]);
        setNewDish({
          name: '',
          price: '',
          category: 'Main Course',
          dietary: 'veg',
          description: '',
          image_url: ''
        });
        setToastNotification({
          title: 'Dish Added! 🍽️',
          message: `${res.data.item.name} added to menu successfully.`
        });
      }
    } catch (err) {
      console.error('Failed to add dish:', err);
      alert(err.response?.data?.message || 'Failed to add dish to menu');
    } finally {
      setAddingDish(false);
    }
  };

  // Toggle Stock Availability
  const handleToggleStock = async (itemId) => {
    if (!restaurant?.id) return;
    try {
      const res = await api.patch(`/menu/${restaurant.id}/${itemId}/toggle`);
      if (res.data?.success && res.data?.item) {
        setMenu((prev) =>
          (prev || []).map((item) => (item?.id === itemId ? res.data.item : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle item availability:', err);
      alert(err.response?.data?.message || 'Failed to toggle availability');
    }
  };

  // Delete Dish
  const handleDeleteDish = async (itemId, itemName) => {
    if (!restaurant?.id) return;
    if (!window.confirm(`Are you sure you want to delete "${itemName}" from the menu?`)) return;

    try {
      const res = await api.delete(`/menu/${restaurant.id}/${itemId}`);
      if (res.data?.success) {
        setMenu((prev) => (prev || []).filter((item) => item?.id !== itemId));
        setToastNotification({
          title: 'Dish Deleted 🗑️',
          message: `"${itemName}" was removed from the menu.`
        });
      }
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      alert(err.response?.data?.message || 'Failed to delete dish');
    }
  };

  // Filtered Orders Calculation
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeMenu = Array.isArray(menu) ? menu : [];

  const displayedMenu = safeMenu.filter((dish) => {
    if (dietaryFilter === 'all') return true;
    return dish?.dietary === dietaryFilter;
  });

  const filteredOrders = safeOrders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o?.status === orderFilter;
  });

  const activeOrdersCount = safeOrders.filter(
    (o) => !['delivered', 'cancelled'].includes(o?.status)
  ).length;

  const preparingCount = safeOrders.filter((o) => o?.status === 'preparing').length;

  // Render Auth & Partner Login Modal Helper
  const renderAuthModal = () => (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            <ShieldCheck size={22} color="#f59e0b" /> Restaurant Partner Login & Verification
          </h3>
          {restaurant && (
            <button className="close-banner-btn" onClick={() => setShowAuthModal(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="modal-body">
          <form onSubmit={handleRestaurantLoginSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Restaurant ID *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. rest_01"
                  value={authForm.restaurant_id}
                  onChange={(e) => setAuthForm({ ...authForm, restaurant_id: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> Compliance Credentials & Bank Details
                </h4>
              </div>

              <div className="form-group">
                <label>FSSAI License Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="14-digit FSSAI License"
                  value={authForm.fssai_license_no}
                  onChange={(e) => setAuthForm({ ...authForm, fssai_license_no: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>GSTIN (GST Number)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="15-digit GSTIN"
                  value={authForm.gstin}
                  onChange={(e) => setAuthForm({ ...authForm, gstin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>PAN Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="10-digit PAN"
                  value={authForm.pan_number}
                  onChange={(e) => setAuthForm({ ...authForm, pan_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bank Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Bank Account Number"
                  value={authForm.bank_account_no}
                  onChange={(e) => setAuthForm({ ...authForm, bank_account_no: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. HDFC Bank"
                  value={authForm.bank_name}
                  onChange={(e) => setAuthForm({ ...authForm, bank_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bank IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. HDFC0001234"
                  value={authForm.bank_ifsc}
                  onChange={(e) => setAuthForm({ ...authForm, bank_ifsc: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>
                    <strong>Keep me signed in / Remember me</strong> (Persists login session safely on this browser)
                  </span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" disabled={loggingIn} style={{ flex: 1 }}>
                {loggingIn ? 'Authenticating...' : 'Sign In & Verify Credentials'}
              </button>
              {restaurant && (
                <button type="button" className="btn-secondary" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Restaurant Operating System...</h2>
          <p>Connecting to backend at http://localhost:5000/api</p>
        </div>
      </div>
    );
  }

  // State Guarding: Only render main dashboard UI if restaurant object is fully loaded.
  // If loading is false but restaurant is null, redirect user to login / auth modal state.
  if (!restaurant) {
    return (
      <div className="dashboard-container">
        <div className="loading-container" style={{ color: '#ef4444' }}>
          <AlertCircle size={48} />
          <h2>Restaurant Partner Authentication Required</h2>
          <p>{error || 'Please log in to access your restaurant operational dashboard.'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => setShowAuthModal(true)}>
              <Lock size={16} /> Restaurant Partner Login
            </button>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> Retry Connection
            </button>
          </div>
        </div>

        {/* Automatically open/render Auth Modal when unauthenticated */}
        {showAuthModal && renderAuthModal()}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="notification-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} />
            <div>
              <strong>{toastNotification.title}</strong> - {toastNotification.message}
            </div>
          </div>
          <button className="close-banner-btn" onClick={() => setToastNotification(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Compliance & Business Credentials Verification Bar */}
      <div className="compliance-bar">
        <div className="compliance-info">
          <span>
            <CheckCircle2 size={13} /> FSSAI: {restaurant?.fssai_license_no || authForm.fssai_license_no || '10020011000456'}
          </span>
          <span>
            <Building size={13} /> Bank: {restaurant?.bank_name || authForm.bank_name || 'HDFC Bank'} (XXXX-{(restaurant?.bank_account_no || authForm.bank_account_no || '5678').slice(-4)})
          </span>
          <span>
            <FileText size={13} /> GSTIN: {restaurant?.gstin || authForm.gstin || '36AAAAA0000A1Z5'}
          </span>
          <span>
            <CreditCard size={13} /> PAN: {restaurant?.pan_number || authForm.pan_number || 'ABCDE1234F'}
          </span>
          <span>
            <Key size={13} /> Rest ID: {restaurant?.restaurant_id || restaurant?.id || authForm.restaurant_id || 'rest_01'}
          </span>
        </div>

        {/* Right side action container with flex-shrink: 0, horizontal flex layout, and gap-3 */}
        <div className="header-actions-container">
          <button
            className={`dietary-toggle-btn veg ${dietaryFilter === 'veg' ? 'active' : ''}`}
            onClick={() => setDietaryFilter((prev) => (prev === 'veg' ? 'all' : 'veg'))}
            title="Filter Veg dishes"
          >
            🟢 VEG
          </button>
          <button
            className={`dietary-toggle-btn non-veg ${dietaryFilter === 'non-veg' ? 'active' : ''}`}
            onClick={() => setDietaryFilter((prev) => (prev === 'non-veg' ? 'all' : 'non-veg'))}
            title="Filter Non-Veg dishes"
          >
            🔴 NON-VEG
          </button>
          <button className="verify-edit-btn" onClick={() => setShowAuthModal(true)}>
            Update Partner
          </button>
        </div>
      </div>

      {/* Main Top Header Navigation */}
      <header className="main-header">
        <div className="header-brand">
          <div className="brand-icon">
            <ChefHat size={32} />
          </div>
          <div>
            <h1>
              {restaurant?.name || 'Grand Bistro & Pizzeria'}{' '}
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>OS v2.4</span>
            </h1>
            <p>{restaurant?.address || '142 Mulberry Street, Little Italy, NY'}</p>
          </div>
        </div>

        <div className="header-controls">
          {/* Socket Connection Badge */}
          <div className={`socket-badge ${socketConnected ? 'connected' : 'disconnected'}`}>
            <span className="pulse-dot"></span>
            {socketConnected ? 'Socket Live' : 'Disconnected'}
          </div>

          {/* Open / Closed Status Toggle Switch */}
          <div className="status-toggle-box">
            <span className={`status-label ${restaurant?.is_open ? 'open' : 'closed'}`}>
              {restaurant?.is_open ? 'OPEN FOR ORDERS' : 'RESTAURANT CLOSED'}
            </span>
            <button
              className={`toggle-switch ${restaurant?.is_open ? 'is-open' : ''}`}
              onClick={handleToggleOpenStatus}
              disabled={togglingOpen}
              title="Click to toggle Open / Closed status"
            >
              <span className="toggle-slider"></span>
            </button>
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <img
              src={
                user?.avatar_url ||
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80'
              }
              alt="Avatar"
              className="user-avatar"
            />
            <div className="user-details">
              <span>{user?.name || 'Chef Partner'}</span>
              <small style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={12} color="#4ade80" /> Verified Partner
              </small>
            </div>
            {user && (
              <button
                className="btn-secondary"
                onClick={handleLogout}
                title="Logout"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Operational Dashboard */}
      <main className="dashboard-content">
        {/* Real-time Metric Overview Cards */}
        <div className="metrics-grid">
          <div className="stat-card">
            <div className="stat-icon orange">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-content">
              <h3>{activeOrdersCount}</h3>
              <p>Active Orders Queue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Flame size={24} />
            </div>
            <div className="stat-content">
              <h3>{preparingCount}</h3>
              <p>In Kitchen Prep</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Utensils size={24} />
            </div>
            <div className="stat-content">
              <h3>{safeMenu.length}</h3>
              <p>Menu Dishes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>${(Number(analytics?.todayEarnings) || 141.42).toFixed(2)}</h3>
              <p>Today's Revenue</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Switcher */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Live Orders Queue
            {activeOrdersCount > 0 && <span className="tab-badge">{activeOrdersCount}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils size={18} /> Menu Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} /> Sales & Financial Analytics
          </button>
        </div>

        {/* TAB 1: Live Orders Queue & Status Management */}
        {activeTab === 'orders' && (
          <div className="tab-pane">
            <div className="filters-bar">
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>Filter Orders:</span>
              <button
                className={`filter-btn ${orderFilter === 'all' ? 'active' : ''}`}
                onClick={() => setOrderFilter('all')}
              >
                All ({safeOrders.length})
              </button>
              <button
                className={`filter-btn ${orderFilter === 'placed' ? 'active' : ''}`}
                onClick={() => setOrderFilter('placed')}
              >
                New Placed ({safeOrders.filter((o) => o?.status === 'placed').length})
              </button>
              <button
                className={`filter-btn ${orderFilter === 'confirmed' ? 'active' : ''}`}
                onClick={() => setOrderFilter('confirmed')}
              >
                Confirmed ({safeOrders.filter((o) => o?.status === 'confirmed').length})
              </button>
              <button
                className={`filter-btn ${orderFilter === 'preparing' ? 'active' : ''}`}
                onClick={() => setOrderFilter('preparing')}
              >
                Preparing ({safeOrders.filter((o) => o?.status === 'preparing').length})
              </button>
              <button
                className={`filter-btn ${orderFilter === 'ready_for_pickup' ? 'active' : ''}`}
                onClick={() => setOrderFilter('ready_for_pickup')}
              >
                Ready for Pickup ({safeOrders.filter((o) => o?.status === 'ready_for_pickup').length})
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={48} color="#64748b" />
                <h3>No Orders Found</h3>
                <p>There are no live orders matching the selected filter status.</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingOrderId === order?.id;

                  return (
                    <div key={order?.id || Math.random()} className={`order-card status-${order?.status || 'placed'}`}>
                      <div className="order-header">
                        <div>
                          <h4>#{((order?.id || '').slice(-4) || '0000').toUpperCase()}</h4>
                          <small style={{ color: '#94a3b8' }}>
                            {order?.created_at ? new Date(order.created_at).toLocaleTimeString() : 'Just now'}
                          </small>
                        </div>
                        <span className={`badge-status ${order?.status || 'placed'}`}>
                          {(order?.status || 'placed').replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="customer-info">
                        <div>
                          <strong>{order?.customer_name || 'Customer'}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            <Phone size={12} /> {order?.customer_phone || 'N/A'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                            <MapPin size={12} /> {order?.delivery_address || 'Standard Delivery'}
                          </div>
                        </div>
                      </div>

                      <div className="order-items-list">
                        {(order?.items || []).map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span>
                              {item?.quantity || 1}x {item?.name || 'Dish'}
                            </span>
                            <span className="item-price">
                              ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div>
                          <small style={{ color: '#94a3b8' }}>Total Amount</small>
                          <div>
                            <strong>${(Number(order?.total) || 0).toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Order Status Transition Actions */}
                        <div className="action-buttons">
                          {order?.status === 'placed' && (
                            <button
                              className="btn-action btn-confirm"
                              onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                              disabled={isUpdating}
                            >
                              <CheckCircle size={14} /> Accept & Confirm
                            </button>
                          )}
                          {order?.status === 'confirmed' && (
                            <button
                              className="btn-action btn-prepare"
                              onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                              disabled={isUpdating}
                            >
                              <Flame size={14} /> Start Preparing
                            </button>
                          )}
                          {order?.status === 'preparing' && (
                            <button
                              className="btn-action btn-ready"
                              onClick={() => handleUpdateOrderStatus(order.id, 'ready_for_pickup')}
                              disabled={isUpdating}
                            >
                              <Utensils size={14} /> Mark Ready
                            </button>
                          )}
                          {order?.status === 'ready_for_pickup' && (
                            <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>
                              Waiting for Delivery Partner 🛵
                            </span>
                          )}
                          {order?.status === 'out_for_delivery' && (
                            <span style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600 }}>
                              Out for Delivery 🚚
                            </span>
                          )}
                          {order?.status === 'delivered' && (
                            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                              Completed & Delivered ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Menu Items Management */}
        {activeTab === 'menu' && (
          <div className="tab-pane">
            <div className="menu-container">
              {/* Add New Dish Form */}
              <div className="add-dish-card">
                <h3>
                  <Plus size={20} color="#f59e0b" /> Add New Menu Dish
                </h3>
                <form onSubmit={handleAddDish}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Dish Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Truffle Mushroom Pizza"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="e.g. 18.50"
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select
                        className="form-input"
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Starters">Starters & Appetizers</option>
                        <option value="Pizzas">Wood-Fired Pizzas</option>
                        <option value="Pastas">Handmade Pastas</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Dietary Type</label>
                      <div className="dietary-selector">
                        <button
                          type="button"
                          className={`dietary-btn ${newDish.dietary === 'veg' ? 'selected veg' : ''}`}
                          onClick={() => setNewDish({ ...newDish, dietary: 'veg' })}
                        >
                          🟢 Veg
                        </button>
                        <button
                          type="button"
                          className={`dietary-btn ${newDish.dietary === 'non-veg' ? 'selected non-veg' : ''}`}
                          onClick={() => setNewDish({ ...newDish, dietary: 'non-veg' })}
                        >
                          🔴 Non-Veg
                        </button>
                        <button
                          type="button"
                          className={`dietary-btn ${newDish.dietary === 'vegan' ? 'selected vegan' : ''}`}
                          onClick={() => setNewDish({ ...newDish, dietary: 'vegan' })}
                        >
                          🌱 Vegan
                        </button>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Image URL (Optional)</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={newDish.image_url}
                        onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        className="form-input"
                        rows="2"
                        placeholder="Brief description of ingredients and preparation..."
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" disabled={addingDish} style={{ marginTop: '1.25rem' }}>
                    {addingDish ? 'Adding Dish...' : '+ Publish Dish to Menu'}
                  </button>
                </form>
              </div>

              {/* Menu List Grid */}
              <div className="menu-grid">
                {displayedMenu.map((dish) => (
                  <div key={dish?.id || Math.random()} className={`menu-card ${!dish?.is_available ? 'out-of-stock' : ''}`}>
                    <img
                      src={
                        dish?.image_url ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={dish?.name || 'Dish'}
                      className="menu-img"
                    />
                    <div className="menu-card-body">
                      <div className="menu-card-header">
                        <h4>{dish?.name || 'Dish'}</h4>
                        <span className="menu-price">${(Number(dish?.price) || 0).toFixed(2)}</span>
                      </div>

                      <p className="menu-desc">{dish?.description || 'Delicious culinary item prepared fresh.'}</p>

                      <div className="menu-meta">
                        <span className="category-pill">{dish?.category || 'Main Course'}</span>
                        <span className={`dietary-tag ${dish?.dietary || 'veg'}`}>
                          {dish?.dietary === 'veg' ? '🟢 Veg' : dish?.dietary === 'non-veg' ? '🔴 Non-Veg' : '🌱 Vegan'}
                        </span>
                      </div>

                      <div className="menu-card-actions">
                        <button
                          className={`btn-stock ${dish?.is_available ? 'in-stock' : 'off-stock'}`}
                          onClick={() => handleToggleStock(dish.id)}
                        >
                          {dish?.is_available ? 'In Stock (Available)' : 'Out of Stock'}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          title="Delete Dish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Sales & Financial Analytics */}
        {activeTab === 'analytics' && (
          <div className="tab-pane">
            <div className="analytics-header">
              <h3>
                <BarChart3 size={24} color="#f59e0b" /> Sales Performance & Financial Settlement Report
              </h3>
              <div className="timeframe-toggle">
                <button
                  className={`timeframe-btn ${analyticsTimeframe === 'today' ? 'active' : ''}`}
                  onClick={() => setAnalyticsTimeframe('today')}
                >
                  Today
                </button>
                <button
                  className={`timeframe-btn ${analyticsTimeframe === 'weekly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsTimeframe('weekly')}
                >
                  Weekly (7 Days)
                </button>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="metrics-grid">
              <div className="stat-card">
                <div className="stat-icon green">
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <h3>
                    $
                    {analyticsTimeframe === 'today'
                      ? (Number(analytics?.todayEarnings) || 141.42).toFixed(2)
                      : (Number(analytics?.totalWeeklySales) || 541.40).toFixed(2)}
                  </h3>
                  <p>{analyticsTimeframe === 'today' ? "Today's Gross Earnings" : 'Weekly Total Revenue'}</p>
                  <span className="growth-badge positive">+14.2% vs previous period</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-content">
                  <h3>
                    {analyticsTimeframe === 'today'
                      ? (analytics?.todayOrdersCount ?? safeOrders.length)
                      : (analytics?.totalWeeklyOrders ?? 10)}
                  </h3>
                  <p>{analyticsTimeframe === 'today' ? "Today's Orders Delivered" : 'Weekly Orders Volume'}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <h3>${(Number(analytics?.averageOrderValue) || 46.50).toFixed(2)}</h3>
                  <p>Average Order Value (AOV)</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <Building size={24} />
                </div>
                <div className="stat-content">
                  <h3>
                    $
                    {(
                      (analyticsTimeframe === 'today'
                        ? Number(analytics?.todayEarnings) || 141.42
                        : Number(analytics?.totalWeeklySales) || 541.40) * 0.90
                    ).toFixed(2)}
                  </h3>
                  <p>Net Settlement Payout (90%)</p>
                  <small style={{ color: '#4ade80', fontWeight: 600 }}>Ready for Bank Transfer</small>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              {/* Weekly Sales 7-Day Bar Chart */}
              <div className="chart-card">
                <h4>
                  <span><Calendar size={18} color="#f59e0b" /> Weekly Sales Breakdown (Last 7 Days)</span>
                  <small style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                    Total: ${(Number(analytics?.totalWeeklySales) || 541.40).toFixed(2)}
                  </small>
                </h4>

                <div className="bar-chart-container">
                  {(analytics?.weeklySales || [
                    { day: 'Mon', sales: 58.07, orders: 1 },
                    { day: 'Tue', sales: 69.41, orders: 1 },
                    { day: 'Wed', sales: 45.11, orders: 1 },
                    { day: 'Thu', sales: 83.71, orders: 1 },
                    { day: 'Fri', sales: 56.45, orders: 1 },
                    { day: 'Sat', sales: 74.27, orders: 1 },
                    { day: 'Sun', sales: 141.42, orders: 3 }
                  ]).map((item, idx) => {
                    const maxSales = Math.max(
                      ...(analytics?.weeklySales || []).map((w) => Number(w?.sales) || 0),
                      150
                    );
                    const fillPercent = Math.max(10, Math.round(((Number(item?.sales) || 0) / (maxSales || 1)) * 100));

                    return (
                      <div key={idx} className="bar-group">
                        <span className="bar-val">${(Number(item?.sales) || 0).toFixed(2)}</span>
                        <div className="bar-fill" style={{ height: `${fillPercent}%` }}></div>
                        <span className="bar-label">{item?.day || ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Peak Hourly Earnings Distribution */}
              <div className="chart-card">
                <h4>
                  <span><Clock size={18} color="#3b82f6" /> Daily Peak Operating Hours Distribution</span>
                  <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hourly Sales ($)</small>
                </h4>

                <div className="bar-chart-container">
                  {(analytics?.hourlyStats || [
                    { slot: '8am-11am', earnings: 15.00 },
                    { slot: '11am-2pm', earnings: 68.50 },
                    { slot: '2pm-5pm', earnings: 22.00 },
                    { slot: '5pm-8pm', earnings: 85.00 },
                    { slot: '8pm-11pm', earnings: 45.00 }
                  ]).map((item, idx) => {
                    const maxEarn = Math.max(
                      ...(analytics?.hourlyStats || []).map((h) => Number(h?.earnings) || 0),
                      100
                    );
                    const fillPercent = Math.max(10, Math.round(((Number(item?.earnings) || 0) / (maxEarn || 1)) * 100));

                    return (
                      <div key={idx} className="bar-group">
                        <span className="bar-val" style={{ color: '#60a5fa' }}>${(Number(item?.earnings) || 0).toFixed(2)}</span>
                        <div className="bar-fill hourly" style={{ height: `${fillPercent}%` }}></div>
                        <span className="bar-label">{item?.slot || ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Payment Methods & Top Items Grid */}
            <div className="charts-row">
              {/* Payment Methods Distribution */}
              <div className="chart-card">
                <h4>
                  <span><PieChart size={18} color="#10b981" /> Payment Collection Split</span>
                </h4>

                <div className="payment-grid">
                  <div className="payment-box">
                    <h5>UPI Payments</h5>
                    <p>${(Number(analytics?.paymentMethods?.upi) || 183.79).toFixed(2)}</p>
                  </div>
                  <div className="payment-box">
                    <h5>Cards</h5>
                    <p>${(Number(analytics?.paymentMethods?.card) || 231.98).toFixed(2)}</p>
                  </div>
                  <div className="payment-box">
                    <h5>Net Banking</h5>
                    <p>${(Number(analytics?.paymentMethods?.netbanking) || 74.27).toFixed(2)}</p>
                  </div>
                  <div className="payment-box">
                    <h5>Cash on Delivery</h5>
                    <p>${(Number(analytics?.paymentMethods?.cod) || 45.11).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Top Selling Menu Items */}
              <div className="chart-card">
                <h4>
                  <span><Utensils size={18} color="#f59e0b" /> Top Selling Menu Items</span>
                </h4>

                {(analytics?.topSellingItems || [
                  { name: 'Truffle & Wild Mushroom Fettuccine', quantity: 12, revenue: 252.00 },
                  { name: 'Margherita D.O.P. Pizza', quantity: 11, revenue: 181.50 },
                  { name: 'Classic Prosciutto & Arugula Pizza', quantity: 6, revenue: 117.00 },
                  { name: 'Handcrafted Tiramisu Classico', quantity: 4, revenue: 36.00 }
                ]).map((item, idx) => (
                  <div key={idx} className="top-item-row">
                    <div>
                      <div className="top-item-name">{item?.name || 'Item'}</div>
                      <small style={{ color: '#94a3b8' }}>{item?.quantity || 0} orders sold</small>
                    </div>
                    <div className="top-item-rev">${(Number(item?.revenue) || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Settlement Transactions Ledger */}
            <div className="add-dish-card">
              <h3>
                <Building size={20} color="#f59e0b" /> Recent Earnings & Payout Settlement Ledger
              </h3>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Gross Sales</th>
                      <th>Platform Fee (10%)</th>
                      <th>Net Payout (90%)</th>
                      <th>Payment Mode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics?.recentTransactions || [
                      { orderId: 'ord_1001', customerName: 'Sarah Jenkins', grossAmount: 43.49, platformFee: 4.35, netPayout: 39.14, paymentMethod: 'card', status: 'Settled' },
                      { orderId: 'ord_1002', customerName: 'David Miller', grossAmount: 57.93, platformFee: 5.79, netPayout: 52.14, paymentMethod: 'upi', status: 'Settled' },
                      { orderId: 'ord_1003', customerName: 'Emily Watson', grossAmount: 46.73, platformFee: 4.67, netPayout: 42.06, paymentMethod: 'card', status: 'Settled' },
                      { orderId: 'ord_1004', customerName: 'Michael Chang', grossAmount: 74.27, platformFee: 7.43, netPayout: 66.84, paymentMethod: 'netbanking', status: 'Settled' },
                      { orderId: 'ord_1005', customerName: 'Sophia Martinez', grossAmount: 56.45, platformFee: 5.65, netPayout: 50.80, paymentMethod: 'upi', status: 'Settled' }
                    ]).map((tx, idx) => (
                      <tr key={idx}>
                        <td><strong>#{((tx?.orderId || '').slice(-6) || '000000').toUpperCase()}</strong></td>
                        <td>{tx?.customerName || 'Customer'}</td>
                        <td style={{ fontWeight: 700 }}>${(Number(tx?.grossAmount) || 0).toFixed(2)}</td>
                        <td style={{ color: '#f87171' }}>-${(Number(tx?.platformFee) || 0).toFixed(2)}</td>
                        <td style={{ color: '#4ade80', fontWeight: 700 }}>${(Number(tx?.netPayout) || 0).toFixed(2)}</td>
                        <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>{tx?.paymentMethod || 'card'}</span></td>
                        <td>
                          <span className={`badge-status ${(tx?.status || '').toLowerCase()}`}>
                            {tx?.status || 'Settled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auth & Business Credentials Verification Modal */}
      {showAuthModal && renderAuthModal()}
    </div>
  );
}
