import React, { useState, useEffect } from 'react';
import { Store, MapPin, DollarSign, Clock, ArrowRight, X, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { soundEngine } from '../../utils/audio';

export const TaskCard = ({ order, onAccept, onReject, isAccepting = false }) => {
  const [timeLeft, setTimeLeft] = useState(45); // 45-second countdown timer
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onReject(order.id);
      return;
    }

    // Play ticking alert sound when time is critical (< 8s)
    if (timeLeft <= 8) {
      soundEngine.playTickSound();
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, order.id, onReject]);

  const progressPercent = (timeLeft / 45) * 100;
  const isUrgent = timeLeft <= 12;

  const handleDecline = () => {
    setIsRejecting(true);
    setTimeout(() => {
      onReject(order.id);
    }, 250);
  };

  const deliveryFee = order.delivery_fee || 3.50;
  const itemCount = order.items ? order.items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1;

  return (
    <div
      className={`bg-dark-800 border rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 relative overflow-hidden ${
        isUrgent ? 'border-rose-500/60 ring-2 ring-rose-500/20' : 'border-dark-700 hover:border-dark-600'
      } ${isRejecting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* Top Countdown Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-dark-700">
        <div
          className={`h-full transition-all duration-1000 ${
            isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-rider-500 to-emerald-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Header with Fee & Countdown Timer */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400">ORDER #{order.id.slice(-4).toUpperCase()}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rider-500/10 text-rider-400 border border-rider-500/30">
            HIGH PAY
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Earnings Badge */}
          <div className="flex items-center space-x-1 text-emerald-400 font-extrabold text-base bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            <span>+{formatCurrency(deliveryFee)}</span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center space-x-1 font-mono text-xs font-bold px-2.5 py-1 rounded-xl border ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-dark-700 text-gray-300 border-dark-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Route: Pickup & Dropoff */}
      <div className="space-y-3 relative pl-6 border-l-2 border-dashed border-dark-600 ml-3 my-3">
        {/* Pickup Restaurant */}
        <div className="relative">
          <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-dark-800 flex items-center justify-center text-[9px] text-black font-bold">
            P
          </span>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Store className="w-3 h-3 inline mr-1" />
                <span>Pickup</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {order.restaurant_name || 'Restaurant Partner'}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {order.restaurant_address || '142 Mulberry Street, Little Italy'}
              </p>
            </div>
            <span className="text-[11px] font-medium text-gray-400 bg-dark-700 px-2 py-0.5 rounded-md self-start">
              0.8 km
            </span>
          </div>
        </div>

        {/* Dropoff Customer */}
        <div className="relative pt-1">
          <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-rider-500 border-2 border-dark-800 flex items-center justify-center text-[9px] text-white font-bold">
            D
          </span>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-rider-400 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                <span>Dropoff</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {order.customer_name || 'Customer Address'}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {order.delivery_address}
              </p>
            </div>
            <span className="text-[11px] font-medium text-gray-400 bg-dark-700 px-2 py-0.5 rounded-md self-start">
              1.8 km
            </span>
          </div>
        </div>
      </div>

      {/* Item info & notes */}
      <div className="bg-dark-900/60 rounded-xl p-3 my-3 flex items-center justify-between border border-dark-700/60 text-xs">
        <div className="flex items-center space-x-2 text-gray-300">
          <ShoppingBag className="w-4 h-4 text-rider-400" />
          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} ({order.items?.map(i => i.name).slice(0, 2).join(', ')})</span>
        </div>
        <span className="font-semibold text-gray-300">
          Total: {formatCurrency(order.total)}
        </span>
      </div>

      {/* Accept & Reject Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <button
          onClick={handleDecline}
          disabled={isAccepting}
          className="col-span-1 flex items-center justify-center space-x-1 py-3 px-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold text-xs transition border border-dark-600"
        >
          <X className="w-4 h-4 text-rose-400" />
          <span>Pass</span>
        </button>

        <button
          onClick={() => onAccept(order.id)}
          disabled={isAccepting}
          className="col-span-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rider-500 to-emerald-600 hover:from-rider-600 hover:to-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-rider-500/20 active:scale-[0.98]"
        >
          {isAccepting ? (
            <span className="flex items-center space-x-1">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Accepting...</span>
            </span>
          ) : (
            <>
              <span>Accept Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
