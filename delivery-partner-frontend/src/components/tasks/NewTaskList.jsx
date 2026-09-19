import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useAuth } from '../../context/AuthContext';
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
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-300">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm">
              You are currently <strong>Offline</strong>. Turn your status Online to receive live order dispatches.
            </p>
          </div>
          <button
            onClick={() => toggleOnline(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition shrink-0 ml-2"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Header bar with count & manual refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-base text-white">Available Dispatch Tasks</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-dark-700 text-gray-300 border border-dark-600">
            {visibleOrders.length}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 text-xs font-semibold border border-dark-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rider-400' : ''}`} />
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
        <div className="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-dark-700/60 border border-dark-600 flex items-center justify-center text-gray-400">
            <Bell className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-base text-white">No New Tasks Available Right Now</h4>
          <p className="text-xs text-gray-400 max-w-sm">
            You're all caught up! New orders appear automatically here as soon as restaurants mark them ready for pickup.
          </p>
          <button
            onClick={onRefresh}
            className="mt-2 px-4 py-2 rounded-xl bg-rider-500/10 border border-rider-500/30 text-rider-400 hover:bg-rider-500/20 font-semibold text-xs transition"
          >
            Check for Orders
          </button>
        </div>
      )}
    </div>
  );
};
