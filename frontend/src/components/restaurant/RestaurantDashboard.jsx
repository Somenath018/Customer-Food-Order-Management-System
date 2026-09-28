import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';
import {
  Store,
  Clock,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Phone,
  MapPin,
  Save,
  Search,
  Filter,
  Check,
  RefreshCw,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const RestaurantDashboard = ({ onBackToCustomer }) => {
  const { user } = useAuth();
  const { lastEvent } = useSocket();

  const [restaurant, setRestaurant] = useState(null);
  const [selectedRestId, setSelectedRestId] = useState(user?.restaurant_id || 'rest_biryani_01');
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'profile' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'new' | 'kitchen' | 'ready' | 'completed'

  // Modals
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishFormData, setDishFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    dietary: 'non-veg',
    description: '',
    image_url: '',
    preparation_time_mins: 20
  });

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    name: '',
    cuisine: '',
    description: '',
    phone: '',
    address: '',
    delivery_fee: 2.99,
    delivery_time_mins: 30,
    image_url: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Fetch Restaurant & Orders
  const loadDashboardData = useCallback(async (targetId) => {
    try {
      setLoading(true);
      const res = await api.getMyRestaurant(targetId || selectedRestId);
      if (res && res.restaurant) {
        setRestaurant(res.restaurant);
        setMenu(res.restaurant.menu || []);
        setOrders(res.restaurant.activeOrders || []);
        if (res.allRestaurants) {
          setAllRestaurants(res.allRestaurants);
        }

        setProfileData({
          name: res.restaurant.name || '',
          cuisine: res.restaurant.cuisine || '',
          description: res.restaurant.description || '',
          phone: res.restaurant.phone || '',
          address: res.restaurant.address || '',
          delivery_fee: res.restaurant.delivery_fee || 2.99,
          delivery_time_mins: res.restaurant.delivery_time_mins || 30,
          image_url: res.restaurant.image_url || ''
        });
      }
    } catch (err) {
      console.error('Error loading restaurant dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRestId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Socket Events (new order created, order updated)
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.type === 'order:created') {
      sound.playKitchenAlert();
      loadDashboardData();
    }

    if (lastEvent.type === 'order:status_changed') {
      loadDashboardData();
    }
  }, [lastEvent, loadDashboardData]);

  // Toggle Restaurant Open/Closed Status
  const handleToggleStoreOpen = async () => {
    if (!restaurant) return;
    try {
      const res = await api.toggleRestaurantOpen(restaurant.id);
      if (res) {
        setRestaurant((prev) => ({ ...prev, is_open: res.is_open }));
      }
    } catch (err) {
      alert(`Could not toggle status: ${err.message}`);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  // Menu Items: Add / Edit / Delete / Toggle
  const handleSaveDish = async (e) => {
    e.preventDefault();
    if (!dishFormData.name || !dishFormData.price) return;

    try {
      if (editingDish) {
        const res = await api.updateMenuItem(restaurant.id, editingDish.id, dishFormData);
        if (res && res.item) {
          setMenu((prev) => prev.map((m) => (m.id === editingDish.id ? res.item : m)));
        }
      } else {
        const res = await api.addMenuItem(restaurant.id, dishFormData);
        if (res && res.item) {
          setMenu((prev) => [res.item, ...prev]);
        }
      }
      setIsAddDishOpen(false);
      setEditingDish(null);
      resetDishForm();
    } catch (err) {
      alert(`Error saving dish: ${err.message}`);
    }
  };

  const handleToggleDishAvailability = async (dishId) => {
    try {
      const res = await api.toggleMenuItem(restaurant.id, dishId);
      if (res) {
        setMenu((prev) =>
          prev.map((m) => (m.id === dishId ? { ...m, is_available: res.is_available } : m))
        );
      }
    } catch (err) {
      alert(`Could not toggle availability: ${err.message}`);
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Are you sure you want to remove this dish from your menu?')) return;
    try {
      await api.deleteMenuItem(restaurant.id, dishId);
      setMenu((prev) => prev.filter((m) => m.id !== dishId));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const resetDishForm = () => {
    setDishFormData({
      name: '',
      category: 'Main Course',
      price: '',
      dietary: 'non-veg',
      description: '',
      image_url: '',
      preparation_time_mins: 20
    });
  };

  const handleEditDishClick = (dish) => {
    setEditingDish(dish);
    setDishFormData({
      name: dish.name,
      category: dish.category || 'Main Course',
      price: dish.price,
      dietary: dish.dietary || 'non-veg',
      description: dish.description || '',
      image_url: dish.image_url || '',
      preparation_time_mins: dish.preparation_time_mins || 20
    });
    setIsAddDishOpen(true);
  };

  // Save Restaurant Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!restaurant) return;
    setProfileSaving(true);
    setProfileSuccess('');

    try {
      const res = await api.updateRestaurant(restaurant.id, profileData);
      if (res && res.restaurant) {
        setRestaurant((prev) => ({ ...prev, ...res.restaurant }));
        setProfileSuccess('Restaurant details updated successfully! 🎉');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (err) {
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // Calculations
  const grossSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  // Filtered orders for tab
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'new') return o.status === 'placed';
    if (orderFilter === 'kitchen') return o.status === 'confirmed' || o.status === 'preparing';
    if (orderFilter === 'ready') return o.status === 'ready_for_pickup' || o.status === 'out_for_delivery';
    if (orderFilter === 'completed') return o.status === 'delivered' || o.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black text-slate-700">Connecting to Partner Kitchen...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Online Toggle */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {onBackToCustomer && (
            <button
              onClick={onBackToCustomer}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Return to Customer Explorer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Customer App</span>
            </button>
          )}
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5200] flex items-center justify-center shadow-md shadow-orange-500/10 shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900">{restaurant?.name || 'My Restaurant'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF5200]">
                {restaurant?.cuisine || 'Multi-Cuisine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{restaurant?.address}</span>
            </p>
          </div>
        </div>

        {/* Isolated Partner Badge (or Admin switcher if superadmin) */}
        {allRestaurants.length > 1 && user?.role === 'admin' ? (
          <div className="flex items-center space-x-2.5 bg-orange-50/90 border border-orange-200/90 px-3.5 py-2.5 rounded-2xl shadow-xs">
            <Store className="w-4 h-4 text-[#FF5200] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Admin Kitchen View:
              </span>
              <select
                value={restaurant?.id || selectedRestId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedRestId(newId);
                  loadDashboardData(newId);
                }}
                className="bg-transparent text-xs font-black text-[#FF5200] outline-none cursor-pointer pr-2"
              >
                {allRestaurants.map((r) => (
                  <option key={r.id} value={r.id} className="text-slate-800 font-bold">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2.5 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Partner Console
              </span>
              <span className="text-xs font-black text-slate-800">
                Isolated Kitchen Session
              </span>
            </div>
          </div>
        )}

        {/* Live Store Status Switch */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Kitchen Status
            </span>
            <span
              className={`text-xs font-black ${
                restaurant?.is_open ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {restaurant?.is_open ? 'ACCEPTING ORDERS' : 'STORE CLOSED'}
            </span>
          </div>

          <button
            onClick={handleToggleStoreOpen}
            className={`p-1.5 rounded-2xl transition-colors cursor-pointer ${
              restaurant?.is_open ? 'text-emerald-600' : 'text-slate-400'
            }`}
            title="Toggle store open/closed"
          >
            {restaurant?.is_open ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10" />
            )}
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Today's Sales</span>
            <DollarSign className="w-4 h-4 text-[#FF5200]" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹{grossSales.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Mock Settlement</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeOrdersCount}</div>
          <span className="text-[10px] text-amber-600 font-bold">Currently in kitchen pipeline</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Menu Items</span>
            <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{menu.length} Dishes</div>
          <span className="text-[10px] text-emerald-600 font-bold">Available to customers</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{completedOrdersCount}</div>
          <span className="text-[10px] text-blue-600 font-bold">Delivered orders</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-black uppercase tracking-wider">
        {[
          { id: 'orders', label: `Kitchen Orders (${activeOrdersCount})`, icon: Clock },
          { id: 'menu', label: `Manage Menu (${menu.length})`, icon: UtensilsCrossed },
          { id: 'profile', label: 'Restaurant Profile', icon: Store },
          { id: 'analytics', label: 'Sales & Analytics', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KITCHEN ORDERS BOARD */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Sub-filter chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'new', label: 'New / Incoming' },
              { id: 'kitchen', label: 'In Kitchen (Cooking)' },
              { id: 'ready', label: 'Ready for Pickup / Out' },
              { id: 'completed', label: 'Completed' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                  orderFilter === f.id
                    ? 'bg-orange-100 text-[#FF5200] font-black border border-orange-300'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={loadDashboardData}
              className="ml-auto p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Refresh order board"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-extrabold text-slate-800">No orders in this queue</h4>
              <p className="text-xs text-slate-400">
                New incoming orders will appear here automatically with chime sound alerts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((ord) => {
                const isNew = ord.status === 'placed';
                const isConfirmed = ord.status === 'confirmed';
                const isPreparing = ord.status === 'preparing';
                const isReady = ord.status === 'ready_for_pickup';

                return (
                  <div
                    key={ord.id}
                    className={`bg-white rounded-3xl p-5 border transition-all space-y-4 ${
                      isNew
                        ? 'border-orange-400 ring-2 ring-orange-200 shadow-lg'
                        : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-black text-slate-400">
                          #{ord.id?.slice(-4).toUpperCase()}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">{ord.customer_name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ord.customer_phone}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          isNew
                            ? 'bg-orange-500 text-white animate-bounce'
                            : isPreparing
                            ? 'bg-amber-100 text-amber-800'
                            : isReady
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Items checklist */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Kitchen Ticket
                      </span>
                      <ul className="space-y-1">
                        {ord.items?.map((it, i) => (
                          <li
                            key={i}
                            className="flex justify-between font-bold text-slate-800 p-1.5 rounded-lg bg-slate-50"
                          >
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono">₹{(Number(it.price) * it.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      {ord.special_instructions && (
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-900 font-medium text-[11px]">
                          Note: {ord.special_instructions}
                        </div>
                      )}
                    </div>

                    {/* Address & Total */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="truncate max-w-[200px]">{ord.delivery_address}</span>
                      <span className="text-sm font-black text-slate-900">₹{Number(ord.total).toFixed(2)}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      {isNew && (
                        <>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm cursor-pointer"
                          >
                            Accept Order ✔
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition shadow-sm cursor-pointer"
                        >
                          Start Cooking & Preparing 🍳
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'ready_for_pickup')}
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-sm cursor-pointer"
                        >
                          Food Ready • Dispatch to Driver 🛵
                        </button>
                      )}

                      {isReady && (
                        <div className="w-full py-2 rounded-xl bg-blue-50 text-blue-700 text-center font-bold text-xs border border-blue-200">
                          Awaiting Driver Pickup (Broadcasted to Fleet)
                        </div>
                      )}

                      {ord.status === 'out_for_delivery' && (
                        <div className="w-full py-2 rounded-xl bg-orange-50 text-[#FF5200] text-center font-bold text-xs border border-orange-200">
                          Driver {ord.driver_name || ''} is on the way to customer
                        </div>
                      )}

                      {ord.status === 'delivered' && (
                        <div className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-center font-bold text-xs">
                          Order Delivered Successfully ✔
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

      {/* TAB 2: MENU MANAGEMENT (CRUD) */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Menu Catalog</h3>
              <p className="text-xs text-slate-500">Add, modify dish prices, and toggle in-stock availability</p>
            </div>
            <button
              onClick={() => {
                resetDishForm();
                setEditingDish(null);
                setIsAddDishOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#FF5200] hover:brightness-105 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center p-0.5 ${
                        dish.dietary === 'veg' || dish.dietary === 'vegan'
                          ? 'border-emerald-600'
                          : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dish.dietary === 'veg' || dish.dietary === 'vegan'
                            ? 'bg-emerald-600'
                            : 'bg-rose-600'
                        }`}
                      ></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {dish.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">{dish.name}</h4>
                  <div className="text-xs font-black text-slate-800">₹{Number(dish.price).toFixed(2)}</div>
                  {dish.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">{dish.description}</p>
                  )}

                  {/* Availability toggle */}
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleDishAvailability(dish.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                        dish.is_available !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {dish.is_available !== false ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <img
                    src={
                      dish.image_url ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
                    }
                    alt={dish.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-xs"
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditDishClick(dish)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESTAURANT PROFILE EDITOR */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Restaurant Settings & Profile</h3>
            <p className="text-xs text-slate-500">Update store address, delivery fees, and description</p>
          </div>

          {profileSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Cuisine Speciality
                </label>
                <input
                  type="text"
                  required
                  value={profileData.cuisine}
                  onChange={(e) => setProfileData({ ...profileData, cuisine: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={profileData.delivery_fee}
                  onChange={(e) => setProfileData({ ...profileData, delivery_fee: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Avg Delivery Time (mins)
                </label>
                <input
                  type="number"
                  value={profileData.delivery_time_mins}
                  onChange={(e) =>
                    setProfileData({ ...profileData, delivery_time_mins: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Kitchen Phone
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Store Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={profileData.image_url}
                onChange={(e) => setProfileData({ ...profileData, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="py-2.5 px-6 rounded-2xl bg-[#FF5200] hover:brightness-105 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{profileSaving ? 'Saving...' : 'Save Restaurant Settings'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SALES & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Orders</span>
              <div className="text-2xl font-black text-slate-900">{orders.length}</div>
              <p className="text-[11px] text-slate-500">Lifetime orders placed with your kitchen</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <div className="text-2xl font-black text-emerald-600">₹{grossSales.toFixed(2)}</div>
              <p className="text-[11px] text-slate-500">Gross revenue accrued from orders</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</span>
              <div className="text-2xl font-black text-blue-600">
                ₹{orders.length > 0 ? (grossSales / orders.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-[11px] text-slate-500">Average ticket size per order</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT DISH MODAL */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingDish ? 'Edit Dish' : 'Add New Dish'}
                </h3>
                <p className="text-xs text-slate-500">Fill in dish details for your menu</p>
              </div>
              <button
                onClick={() => {
                  setIsAddDishOpen(false);
                  setEditingDish(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Chicken Biryani"
                  value={dishFormData.name}
                  onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="249.00"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Main Course"
                    value={dishFormData.category}
                    onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Dietary Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['veg', 'non-veg', 'vegan'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDishFormData({ ...dishFormData, dietary: d })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                        dishFormData.dietary === d
                          ? 'bg-[#FF5200] text-white border-[#FF5200]'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Mouth-watering spices and tender meat layered with long-grain basmati..."
                  value={dishFormData.description}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={dishFormData.image_url}
                  onChange={(e) => setDishFormData({ ...dishFormData, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddDishOpen(false);
                    setEditingDish(null);
                  }}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#FF5200] hover:brightness-105 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {editingDish ? 'Update Dish' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
