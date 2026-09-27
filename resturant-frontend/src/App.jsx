import React, { useState, useEffect, useCallback } from 'react';
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
  Volume2,
  RefreshCw,
  AlertCircle,
  Phone,
  MapPin,
  TrendingUp,
  Leaf,
  DollarSign,
  Power,
  Bell,
  X,
  Bike
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [orderFilter, setOrderFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [toastNotification, setToastNotification] = useState(null);

  // Form State for Add Dish
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    dietary: 'veg',
    description: '',
    image_url: ''
  });
  const [addingDish, setAddingDish] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [togglingOpen, setTogglingOpen] = useState(false);

  // Sound chime for incoming orders
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Browser audio block fallback
    }
  };

  // Fetch initial data function
  const loadDashboardData = useCallback(async (restId) => {
    try {
      const [ordersRes, menuRes] = await Promise.all([
        api.get('/orders'),
        api.get(`/menu/${restId}`)
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }

      if (menuRes.data.success) {
        setMenu(menuRes.data.menu);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  // 1. Auto-login & Initialize Dashboard
  useEffect(() => {
    async function initDashboard() {
      setLoading(true);
      setError('');
      try {
        // Auto-login with demo restaurant credentials from /api/auth/demo-users
        const demoRes = await api.get('/auth/demo-users');
        if (!demoRes.data.success || !demoRes.data.demoUsers) {
          throw new Error('Failed to retrieve demo users');
        }

        const restaurantDemoUser = demoRes.data.demoUsers.find(
          (u) => u.role === 'restaurant'
        );

        if (!restaurantDemoUser) {
          throw new Error('Demo restaurant user not found');
        }

        // Store auth token in localStorage so axios interceptor automatically attaches it
        localStorage.setItem('token', restaurantDemoUser.token);
        setUser(restaurantDemoUser);

        // Retrieve restaurant details for this logged-in user
        const restRes = await api.get('/restaurants/my-restaurant');
        if (restRes.data.success && restRes.data.restaurant) {
          const restData = restRes.data.restaurant;
          setRestaurant(restData);

          if (restData.menu) setMenu(restData.menu);
          if (restData.activeOrders) setOrders(restData.activeOrders);

          // Fetch full fresh orders & menu
          await loadDashboardData(restData.id);
        } else {
          throw new Error('Could not load restaurant profile');
        }
      } catch (err) {
        console.error('Auto-login / Init error:', err);
        setError(err.response?.data?.message || err.message || 'Error connecting to backend');
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, [loadDashboardData]);

  // 2. Real-Time Socket.io Connection & Event Listeners
  useEffect(() => {
    if (!restaurant?.id) return;

    // Connect socket and join restaurant room
    setSocketConnected(socket.connected);

    function onConnect() {
      setSocketConnected(true);
      socket.emit('join', `restaurant_${restaurant.id}`);
    }

    function onDisconnect() {
      setSocketConnected(false);
    }

    // Handlers for real-time socket events
    function handleOrderCreated(data) {
      playAlertChime();
      const newOrder = data.order || data;
      setToastNotification({
        title: 'New Order Received! 🛎️',
        message: data.message || `Order #${(newOrder.id || '').slice(-4).toUpperCase()} has arrived!`
      });

      setOrders((prevOrders) => {
        const exists = prevOrders.some((o) => o.id === newOrder.id);
        if (exists) return prevOrders.map((o) => (o.id === newOrder.id ? newOrder : o));
        return [newOrder, ...prevOrders];
      });
    }

    function handleOrderStatusChanged(data) {
      const updatedOrder = data.order;
      if (!updatedOrder) return;
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    }

    if (socket.connected) {
      onConnect();
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
  }, [restaurant]);

  // Header Toggle: Switch restaurant status between Open & Closed via PUT /api/restaurants/:id
  const handleToggleOpenStatus = async () => {
    if (!restaurant || togglingOpen) return;
    setTogglingOpen(true);
    try {
      const newOpenStatus = !restaurant.is_open;
      const res = await api.put(`/restaurants/${restaurant.id}`, {
        is_open: newOpenStatus
      });

      if (res.data.success) {
        setRestaurant((prev) => ({ ...prev, is_open: newOpenStatus }));
      }
    } catch (err) {
      console.error('Failed to toggle open status:', err);
      alert(err.response?.data?.message || 'Failed to update restaurant status');
    } finally {
      setTogglingOpen(false);
    }
  };

  // Order Status Lifecycle Updates: confirmed -> preparing -> ready_for_pickup
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus
      });

      if (res.data.success && res.data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data.order : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Menu Action: Add Dish Form Submit via POST /api/menu/:restaurantId
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
      if (res.data.success && res.data.item) {
        setMenu((prev) => [...prev, res.data.item]);
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

  // Menu Action: Toggle Stock Availability via PATCH /api/menu/:restaurantId/:itemId/toggle
  const handleToggleStock = async (itemId) => {
    if (!restaurant?.id) return;
    try {
      const res = await api.patch(`/menu/${restaurant.id}/${itemId}/toggle`);
      if (res.data.success && res.data.item) {
        setMenu((prev) =>
          prev.map((item) => (item.id === itemId ? res.data.item : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle item availability:', err);
      alert(err.response?.data?.message || 'Failed to toggle availability');
    }
  };

  // Menu Action: Delete Dish via DELETE /api/menu/:restaurantId/:itemId
  const handleDeleteDish = async (itemId, itemName) => {
    if (!restaurant?.id) return;
    if (!window.confirm(`Are you sure you want to delete "${itemName}" from the menu?`)) {
      return;
    }

    try {
      const res = await api.delete(`/menu/${restaurant.id}/${itemId}`);
      if (res.data.success) {
        setMenu((prev) => prev.filter((item) => item.id !== itemId));
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
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const activeOrdersCount = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status)
  ).length;

  const preparingCount = orders.filter((o) => o.status === 'preparing').length;

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

  if (error && !restaurant) {
    return (
      <div className="dashboard-container">
        <div className="loading-container" style={{ color: '#ef4444' }}>
          <AlertCircle size={48} />
          <h2>Backend Connection Error</h2>
          <p>{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            <RefreshCw size={16} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Toast Banner for Socket Events & Actions */}
      {toastNotification && (
        <div className="notification-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} />
            <div>
              <strong>{toastNotification.title}</strong> - {toastNotification.message}
            </div>
          </div>
          <button
            className="close-banner-btn"
            onClick={() => setToastNotification(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="brand-icon">
            <ChefHat size={28} />
          </div>
          <div className="restaurant-info">
            <h1>
              {restaurant?.name || "Chef's Table Kitchen"}{' '}
              <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 600 }}>
                ⭐ {restaurant?.rating || '4.8'}
              </span>
            </h1>
            <p>{restaurant?.address || '142 Mulberry Street, Little Italy, NY'}</p>
          </div>
        </div>

        <div className="header-controls">
          {/* Socket Connection Badge */}
          <div
            className={`socket-badge ${socketConnected ? 'connected' : 'disconnected'}`}
          >
            <span className="pulse-dot"></span>
            {socketConnected ? 'Socket Live' : 'Disconnected'}
          </div>

          {/* Restaurant Status Open/Closed Toggle via PUT /api/restaurants/:id */}
          <div className="status-toggle-box">
            <span
              className={`status-label ${restaurant?.is_open ? 'open' : 'closed'}`}
            >
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
              <span>{user?.name || 'Chef Marco Rossi'}</span>
              <small>Restaurant Partner</small>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="dashboard-main">
        {/* Top Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orange">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-content">
              <h3>{activeOrdersCount}</h3>
              <p>Active Live Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Flame size={24} />
            </div>
            <div className="stat-content">
              <h3>{preparingCount}</h3>
              <p>Items Preparing</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Utensils size={24} />
            </div>
            <div className="stat-content">
              <h3>{menu.length}</h3>
              <p>Menu Dishes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>Total Orders Today</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Live Orders Queue
            <span className="badge-count">{activeOrdersCount}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils size={18} /> Menu Management
            <span className="badge-count">{menu.length}</span>
          </button>
        </div>

        {/* TAB 1: LIVE ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter Pills */}
            <div className="filter-bar">
              <button
                className={`filter-pill ${orderFilter === 'all' ? 'active' : ''}`}
                onClick={() => setOrderFilter('all')}
              >
                All Orders ({orders.length})
              </button>
              <button
                className={`filter-pill ${orderFilter === 'placed' ? 'active' : ''}`}
                onClick={() => setOrderFilter('placed')}
              >
                New Placed ({orders.filter((o) => o.status === 'placed').length})
              </button>
              <button
                className={`filter-pill ${orderFilter === 'confirmed' ? 'active' : ''}`}
                onClick={() => setOrderFilter('confirmed')}
              >
                Confirmed ({orders.filter((o) => o.status === 'confirmed').length})
              </button>
              <button
                className={`filter-pill ${orderFilter === 'preparing' ? 'active' : ''}`}
                onClick={() => setOrderFilter('preparing')}
              >
                Preparing ({orders.filter((o) => o.status === 'preparing').length})
              </button>
              <button
                className={`filter-pill ${
                  orderFilter === 'ready_for_pickup' ? 'active' : ''
                }`}
                onClick={() => setOrderFilter('ready_for_pickup')}
              >
                Ready for Pickup (
                {orders.filter((o) => o.status === 'ready_for_pickup').length})
              </button>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={48} className="empty-icon" />
                <h3>No Orders Found</h3>
                <p>No incoming orders match the selected status filter.</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div key={order.id} className="order-card">
                      <div>
                        {/* Card Header */}
                        <div className="order-card-header">
                          <div className="order-id-box">
                            <h4>#{order.id.slice(-4).toUpperCase()}</h4>
                            <div className="order-time">
                              <Clock size={12} />
                              {new Date(order.placed_at || Date.now()).toLocaleTimeString(
                                [],
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </div>
                          </div>
                          <span className={`status-tag ${order.status}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="customer-info-block">
                          <div className="info-row">
                            <strong style={{ color: '#ffffff' }}>
                              {order.customer_name || 'Sarah Jenkins'}
                            </strong>
                          </div>
                          <div className="info-row">
                            <Phone size={14} />
                            <span>{order.customer_phone || '+1 (555) 432-8765'}</span>
                          </div>
                          <div className="info-row">
                            <MapPin size={14} />
                            <span>
                              {order.delivery_address || '742 Evergreen Terrace'}
                            </span>
                          </div>

                          {order.special_instructions && (
                            <div className="special-instruction">
                              <strong>Note:</strong> {order.special_instructions}
                            </div>
                          )}
                        </div>

                        {/* Order Items Breakdown */}
                        <div className="order-items-list">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <div>
                                <span className="item-qty">{item.quantity}x</span>
                                <span className="item-name">{item.name}</span>
                              </div>
                              <span className="item-price">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}

                          <div className="order-summary-row">
                            <span className="payment-method-tag">
                              {order.payment_method || 'CARD'} •{' '}
                              <span style={{ color: '#4ade80' }}>PAID</span>
                            </span>
                            <span>Total: ${(order.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons for Status Lifecycle */}
                      <div className="order-actions">
                        {order.status === 'placed' && (
                          <>
                            <button
                              className="btn-primary"
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, 'confirmed')
                              }
                            >
                              <CheckCircle size={16} /> Confirm Order
                            </button>
                            <button
                              className="btn-danger"
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, 'cancelled')
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <button
                            className="btn-primary"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'preparing')
                            }
                          >
                            <Flame size={16} /> Start Preparing
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            className="btn-primary"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'ready_for_pickup')
                            }
                          >
                            <CheckCircle size={16} /> Mark Ready for Pickup
                          </button>
                        )}

                        {order.status === 'ready_for_pickup' && (
                          <div className="waiting-driver-banner">
                            <Bike size={18} />
                            Waiting for Delivery Rider Pickup
                          </div>
                        )}

                        {['out_for_delivery', 'delivered', 'cancelled'].includes(
                          order.status
                        ) && (
                          <div
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              fontSize: '0.8rem',
                              color: '#94a3b8',
                              padding: '0.4rem'
                            }}
                          >
                            Order lifecycle completed ({order.status})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="menu-section">
            {/* Add Dish Form Card */}
            <div className="add-dish-card">
              <h3>
                <Plus size={20} style={{ color: '#f59e0b' }} /> Add New Menu Item
              </h3>
              <form onSubmit={handleAddDish}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Dish Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Truffle Mushroom Risotto"
                      value={newDish.name}
                      onChange={(e) =>
                        setNewDish({ ...newDish, name: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewDish({ ...newDish, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-select"
                      value={newDish.category}
                      onChange={(e) =>
                        setNewDish({ ...newDish, category: e.target.value })
                      }
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Pizzas">Pizzas</option>
                      <option value="Pastas">Pastas</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Dietary Type</label>
                    <div className="dietary-options">
                      <button
                        type="button"
                        className={`dietary-btn ${
                          newDish.dietary === 'veg' ? 'selected veg' : ''
                        }`}
                        onClick={() => setNewDish({ ...newDish, dietary: 'veg' })}
                      >
                        🥦 Veg
                      </button>
                      <button
                        type="button"
                        className={`dietary-btn ${
                          newDish.dietary === 'non-veg' ? 'selected non-veg' : ''
                        }`}
                        onClick={() =>
                          setNewDish({ ...newDish, dietary: 'non-veg' })
                        }
                      >
                        🍗 Non-Veg
                      </button>
                      <button
                        type="button"
                        className={`dietary-btn ${
                          newDish.dietary === 'vegan' ? 'selected vegan' : ''
                        }`}
                        onClick={() => setNewDish({ ...newDish, dietary: 'vegan' })}
                      >
                        🌱 Vegan
                      </button>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Short mouth-watering description of ingredients & preparation"
                      value={newDish.description}
                      onChange={(e) =>
                        setNewDish({ ...newDish, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Image URL (Optional)</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newDish.image_url}
                      onChange={(e) =>
                        setNewDish({ ...newDish, image_url: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" disabled={addingDish}>
                    <Plus size={18} /> {addingDish ? 'Adding Dish...' : 'Add Dish to Menu'}
                  </button>
                </div>
              </form>
            </div>

            {/* Menu Dish Items Grid */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
              Current Restaurant Menu ({menu.length} Items)
            </h3>

            {menu.length === 0 ? (
              <div className="empty-state">
                <Utensils size={48} className="empty-icon" />
                <h3>No Menu Items</h3>
                <p>Add your first dish using the form above.</p>
              </div>
            ) : (
              <div className="menu-grid">
                {menu.map((dish) => (
                  <div
                    key={dish.id}
                    className={`menu-card ${!dish.is_available ? 'unavailable' : ''}`}
                  >
                    <div>
                      {/* Image & Dietary Tag */}
                      <div className="menu-img-container">
                        <img
                          src={
                            dish.image_url ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
                          }
                          alt={dish.name}
                          className="menu-img"
                        />
                        <span className={`dietary-tag ${dish.dietary || 'veg'}`}>
                          {dish.dietary || 'veg'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="menu-card-body">
                        <div className="menu-card-title">
                          <h4>{dish.name}</h4>
                          <span className="menu-price">${Number(dish.price).toFixed(2)}</span>
                        </div>
                        <span className="menu-category-badge">{dish.category || 'Main Course'}</span>
                        <p className="menu-description">
                          {dish.description || 'Prepared fresh with premium hand-selected ingredients.'}
                        </p>
                      </div>
                    </div>

                    {/* Stock Availability Toggle & Delete Actions */}
                    <div className="menu-card-footer">
                      <button
                        className={`stock-toggle-btn ${
                          dish.is_available ? 'in-stock' : 'out-stock'
                        }`}
                        onClick={() => handleToggleStock(dish.id)}
                        title="Click to toggle stock availability"
                      >
                        {dish.is_available ? (
                          <>
                            <CheckCircle size={14} /> In Stock
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} /> Out of Stock
                          </>
                        )}
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteDish(dish.id, dish.name)}
                        title="Delete item from menu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
