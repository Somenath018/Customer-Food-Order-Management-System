import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useAuth } from '../../../context/AuthContext';
import { Bell, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

export const NewTaskList = ({ orders = [], onAccept, onRefresh, isRefreshing = false }) => {
  const { driver, toggleOnline } = useAuth();
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [acceptingId, setAcceptingId] = useState(null);

  const isOnline = driver ? driver.is_online : true;

  const handleReject = (orderId) => {
    setDismissedIds(prev => new Set(prev).add(orderId));
  };

  const handleAcceptTask = async (orderId) => {
    setAcceptingId(orderId);
    try {
      await onAccept(orderId);
    } finally {
      setAcceptingId(null);
    }
  };

  const visibleOrders = orders.filter(o => !dismissedIds.has(o.id));

  return (
    <div className="space-y-4">
      {/* Offline banner if driver is toggled offline */}
      {!isOnline && (
        <div className="bg-[#FF5200]/10 border border-[#FF5200]/30 rounded-3xl p-4 flex items-center justify-between text-[#ff7332]">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#FF5200] shrink-0" />
            <p className="text-xs sm:text-sm">
              You are currently <strong>Off Duty</strong>. Turn On Duty to start receiving restaurant orders in your zone.
            </p>
          </div>
          <button
            onClick={() => toggleOnline(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:brightness-110 transition shrink-0 ml-2 shadow"
          >
            Go On Duty
          </button>
        </div>
      )}

      {/* Header bar with count & manual refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-black text-base text-white tracking-tight">Available Food Dispatches</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FF5200]/15 text-[#ff7332] border border-[#FF5200]/30">
            {visibleOrders.length} Ready
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-dark-700 text-gray-300 hover:text-white text-xs font-bold border border-dark-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF5200]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Task Cards List or Empty State */}
      {visibleOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleOrders.map((order) => (
            <TaskCard
              key={order.id}
              order={order}
              onAccept={handleAcceptTask}
              onReject={handleReject}
              isAccepting={acceptingId === order.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#121622]/90 border border-dark-700/80 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5200]/10 border border-[#FF5200]/25 flex items-center justify-center text-[#ff7332]">
            <Bell className="w-7 h-7" />
          </div>
          <h4 className="font-extrabold text-base text-white">No New Orders Right Now</h4>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            You're ready! High-priority food orders from nearby partner restaurants will pop up on your screen with audio alerts.
          </p>
          <button
            onClick={onRefresh}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF5200]/15 border border-[#FF5200]/40 text-[#ff7332] hover:bg-[#FF5200]/25 font-bold text-xs transition"
          >
            Check for New Orders
          </button>
        </div>
      )}
    </div>
  );
};

