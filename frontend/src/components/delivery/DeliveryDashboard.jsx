import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { deliveryApi } from '../../api/deliveryApi';

// Component Imports
import { ShiftStatusBar } from './dashboard/ShiftStatusBar';
import { MetricsGrid } from './dashboard/MetricsGrid';
import { NewTaskList } from './tasks/NewTaskList';
import { ActiveDeliveryView } from './active/ActiveDeliveryView';
import { EarningsView } from './earnings/EarningsView';
import { HistoryView } from './history/HistoryView';
import { ProfileView } from './profile/ProfileView';
import { BottomNav } from './common/BottomNav';
import { AlertBanner } from './common/AlertBanner';
import { FoodieLogo } from '../common/FoodieLogo';
import { soundEngine } from '../../utils/audio';
import {
  Bike,
  Volume2,
  VolumeX,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const DeliveryDashboard = ({ onBackToCustomer }) => {
  const { user, driver, loading: authLoading, toggleOnline, refreshDriverDashboard, logout } = useAuth();
  const { isConnected, lastEvent } = useSocket();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isOnline = driver ? driver.is_online : true;

  // Fetch all delivery data from backend
  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setIsRefreshing(true);
      const [dashRes, availRes] = await Promise.all([
        deliveryApi.getDashboard().catch(() => null),
        deliveryApi.getAvailableDeliveries().catch(() => null)
      ]);

      if (dashRes && dashRes.success) {
        if (dashRes.activeDeliveries && dashRes.activeDeliveries.length > 0) {
          setActiveDelivery(dashRes.activeDeliveries[0]);
        } else {
          setActiveDelivery(null);
        }
        if (dashRes.completedDeliveries) {
          setCompletedDeliveries(dashRes.completedDeliveries);
        }
      }

      if (availRes && availRes.success) {
        setAvailableOrders(availRes.orders || []);
      }
    } catch (err) {
      console.error('Error loading delivery partner data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    if (refreshDriverDashboard) {
      refreshDriverDashboard();
    }
  }, [fetchData, refreshDriverDashboard]);

  // When socket alert arrives for new tasks or delivery updates
  useEffect(() => {
    if (lastEvent?.type === 'delivery:task_ready' || lastEvent?.type === 'order:created') {
      fetchData();
      if (!isMuted) {
        soundEngine.playNewTaskChime();
      }
    }
  }, [lastEvent, fetchData, isMuted]);

  // Periodic polling for available tasks every 20s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      deliveryApi.getAvailableDeliveries()
        .then((res) => {
          if (res && res.success && res.orders) {
            setAvailableOrders(res.orders);
          }
        })
        .catch(() => {});
    }, 20000);
    return () => clearInterval(interval);
  }, [user]);

  const handleStatusToggle = async () => {
    try {
      setIsUpdatingStatus(true);
      if (toggleOnline) {
        await toggleOnline(!isOnline);
      } else {
        await deliveryApi.toggleStatus(!isOnline);
      }
      if (refreshDriverDashboard) {
        await refreshDriverDashboard();
      }
    } catch (err) {
      console.error('Failed to toggle duty status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSoundToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.playNewTaskChime();
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await deliveryApi.acceptTask(orderId);
      if (res && res.success && res.order) {
        setActiveDelivery(res.order);
        setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
        setActiveTab('active');
        if (refreshDriverDashboard) {
          await refreshDriverDashboard();
        }
      }
    } catch (err) {
      alert(`Could not accept order: ${err.message}`);
    }
  };

  const handleDeliveryComplete = async () => {
    setActiveDelivery(null);
    await fetchData();
    if (refreshDriverDashboard) {
      await refreshDriverDashboard();
    }
    setActiveTab('dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black text-white tracking-wide">Loading Foodie Fleet...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f17] text-gray-100 flex flex-col pb-24 sm:pb-10 font-sans">
      {/* Top Header inside Foodie App */}
      <header className="sticky top-0 z-40 bg-[#0d111a]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {onBackToCustomer && (
              <button
                onClick={onBackToCustomer}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
                title="Return to Customer Portal"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer App</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bike className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-black text-white tracking-wide block">
                  Foodie Fleet Rider
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  {driver?.name || user?.name || 'Rider Portal'}
                </span>
              </div>
            </div>

            {/* Live Socket Sync status */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px]">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className={isConnected ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
                {isConnected ? 'GPS & DISPATCH LIVE' : 'CONNECTING...'}
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Duty toggle */}
            <button
              onClick={handleStatusToggle}
              disabled={isUpdatingStatus}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-md cursor-pointer ${
                isOnline
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-gray-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`}></span>
              <span>{isUpdatingStatus ? 'UPDATING...' : isOnline ? 'ON DUTY' : 'OFF DUTY'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title={isMuted ? 'Unmute alert sounds' : 'Mute alert sounds'}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              title="Refresh Tasks"
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Socket Alert Toast */}
      <AlertBanner onGoToTasks={() => setActiveTab('tasks')} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Shift & Status Card */}
            <ShiftStatusBar
              onGoToTasks={() => setActiveTab('tasks')}
              onGoToActive={() => setActiveTab('active')}
              hasActiveDelivery={!!activeDelivery}
              availableCount={availableOrders.length}
            />

            {/* Performance & Earnings Metric Cards */}
            <MetricsGrid
              driver={driver}
              activeCount={activeDelivery ? 1 : 0}
              completedCount={completedDeliveries.length}
            />

            {/* Active Delivery Highlight Banner */}
            {activeDelivery && (
              <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-rose-500/10 border border-orange-500/40 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                    Active Food Delivery In Progress
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Order #{activeDelivery.id?.slice(-4).toUpperCase()} • {activeDelivery.restaurant_name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Destination: {activeDelivery.delivery_address}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('active')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-110 text-white font-black text-xs transition shadow-lg shadow-orange-500/25 cursor-pointer whitespace-nowrap"
                >
                  Open Live GPS Navigation Map
                </button>
              </div>
            )}

            {/* Available Tasks Feed */}
            <div className="pt-2">
              <NewTaskList
                orders={availableOrders}
                onAccept={handleAcceptOrder}
                onRefresh={fetchData}
                isRefreshing={isRefreshing}
              />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="animate-in fade-in duration-200">
            <NewTaskList
              orders={availableOrders}
              onAccept={handleAcceptOrder}
              onRefresh={fetchData}
              isRefreshing={isRefreshing}
            />
          </div>
        )}

        {activeTab === 'active' && (
          <div className="animate-in fade-in duration-200">
            <ActiveDeliveryView
              order={activeDelivery}
              onCompleteDelivery={handleDeliveryComplete}
              onRefresh={fetchData}
            />
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="animate-in fade-in duration-200">
            <EarningsView
              driver={driver}
              completedOrders={completedDeliveries}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-200">
            <HistoryView completedOrders={completedDeliveries} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <ProfileView />
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        availableCount={availableOrders.length}
        hasActiveDelivery={!!activeDelivery}
      />
    </div>
  );
};

export default DeliveryDashboard;

