import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';
import { deliveryApi } from './api/deliveryApi';

// Component Imports
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { AlertBanner } from './components/common/AlertBanner';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { ShiftStatusBar } from './components/dashboard/ShiftStatusBar';
import { NewTaskList } from './components/tasks/NewTaskList';
import { ActiveDeliveryView } from './components/active/ActiveDeliveryView';
import { EarningsView } from './components/earnings/EarningsView';
import { HistoryView } from './components/history/HistoryView';
import { ProfileView } from './components/profile/ProfileView';
import { LoginView } from './components/auth/LoginView';

export function AppContent() {
  const { user, driver, loading, refreshDashboard } = useAuth();
  const { incomingAlert } = useSocket();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  }, [fetchData]);

  // When a socket alert arrives for a new task, refresh available orders
  useEffect(() => {
    if (incomingAlert) {
      fetchData();
    }
  }, [incomingAlert, fetchData]);

  // Periodic gentle polling for new available orders every 20 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      deliveryApi.getAvailableDeliveries()
        .then((res) => {
          if (res.success && res.orders) {
            setAvailableOrders(res.orders);
          }
        })
        .catch(() => {});
    }, 20000);
    return () => clearInterval(interval);
  }, [user]);

  // Accept a dispatch order
  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await deliveryApi.acceptTask(orderId);
      if (res.success && res.order) {
        setActiveDelivery(res.order);
        setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
        setActiveTab('active'); // Switch directly to active delivery mode
        await refreshDashboard();
      }
    } catch (err) {
      alert(`Could not accept order: ${err.message}`);
    }
  };

  // Complete delivery handler
  const handleDeliveryComplete = async () => {
    setActiveDelivery(null);
    await fetchData();
    await refreshDashboard();
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-rider-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-400">Loading Rider Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col pb-20 sm:pb-8">
      {/* Top Header */}
      <Header />

      {/* Floating Socket Alert Toast */}
      <AlertBanner onGoToTasks={() => setActiveTab('tasks')} />

      {/* Main Content Area */}
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

            {/* If there is an active delivery, prominent quick banner */}
            {activeDelivery && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                    Trip In Progress
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Order #{activeDelivery.id?.slice(-4).toUpperCase()} • {activeDelivery.restaurant_name}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab('active')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition shadow"
                >
                  View Navigation & Map
                </button>
              </div>
            )}

            {/* Recent available tasks preview on Dashboard */}
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

      {/* Mobile-Friendly Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        availableCount={availableOrders.length}
        hasActiveDelivery={!!activeDelivery}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
