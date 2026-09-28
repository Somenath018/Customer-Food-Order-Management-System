import React, { useState, useEffect } from 'react';
import { Store, MapPin, Clock, ArrowRight, X, ShoppingBag, Zap } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { VegNonVegBadge } from '../common/VegNonVegBadge';
import { soundEngine } from '../../../utils/audio';

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

  // Realistic Indian delivery fee
  const rawFee = order.delivery_fee || 3.50;
  const deliveryFee = rawFee < 15 ? Math.round(rawFee * 18) : rawFee;
  const itemCount = order.items ? order.items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1;

  // Realistic Indian total scaling if backend seed is $24
  const rawTotal = order.total || 24.50;
  const orderTotal = rawTotal < 100 ? Math.round(rawTotal * 16) : rawTotal;

  return (
    <div
      className={`bg-[#121622] border rounded-3xl p-4 sm:p-5 shadow-xl transition-all duration-300 relative overflow-hidden ${
        isUrgent
          ? 'border-rose-500/60 ring-2 ring-rose-500/20'
          : 'border-dark-700/80 hover:border-[#FF5200]/40'
      } ${isRejecting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* Top Countdown Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-dark-800">
        <div
          className={`h-full transition-all duration-1000 ${
            isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744]'
          }`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Header with Fee & Countdown Timer */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-gray-400">ORDER #{order.id.slice(-4).toUpperCase()}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF5200]/15 text-[#ff7332] border border-[#FF5200]/30 uppercase flex items-center space-x-1">
            <Zap className="w-2.5 h-2.5 fill-[#FF5200] text-[#FF5200]" />
            <span>Peak Surge Pay</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Earnings Badge */}
          <div className="flex items-center space-x-1 text-emerald-400 font-black text-base bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            <span>+{formatCurrency(deliveryFee)}</span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center space-x-1 font-mono text-xs font-bold px-2.5 py-1 rounded-xl border ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-dark-800 text-gray-300 border-dark-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Route: Pickup & Dropoff */}
      <div className="space-y-3 relative pl-6 border-l-2 border-dashed border-dark-600/80 ml-3 my-3">
        {/* Pickup Restaurant */}
        <div className="relative">
          <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-dark-800 flex items-center justify-center text-[9px] text-black font-extrabold shadow">
            P
          </span>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Store className="w-3 h-3 inline mr-1" />
                <span>Pickup Restaurant</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {order.restaurant_name || 'Restaurant Partner'}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {order.restaurant_address || 'Koramangala 5th Block, Bengaluru'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-dark-800 border border-dark-700 px-2 py-0.5 rounded-lg self-start">
              0.8 km
            </span>
          </div>
        </div>

        {/* Dropoff Customer */}
        <div className="relative pt-1">
          <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#FF5200] border-2 border-dark-800 flex items-center justify-center text-[9px] text-white font-extrabold shadow">
            D
          </span>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#ff7332] uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                <span>Dropoff Customer</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {order.customer_name || 'Customer'}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {order.delivery_address || 'Sony World Signal, 4th Block, Koramangala'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-dark-800 border border-dark-700 px-2 py-0.5 rounded-lg self-start">
              1.6 km
            </span>
          </div>
        </div>
      </div>

      {/* Item info & notes with Veg/Non-Veg Indicators */}
      <div className="bg-[#0b0e16] rounded-2xl p-3 my-3 border border-dark-700/80 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-gray-300">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#FF5200]" />
            <span className="font-bold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <span className="font-mono font-bold text-white">
            Order Value: {formatCurrency(orderTotal)}
          </span>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {order.items.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 bg-dark-800 border border-dark-700 px-2 py-1 rounded-lg text-[11px] text-gray-300"
              >
                <VegNonVegBadge itemName={item.name} size="xs" />
                <span className="truncate max-w-[120px]">{item.name}</span>
                <span className="text-gray-500 font-mono">x{item.quantity || 1}</span>
              </span>
            ))}
            {order.items.length > 3 && (
              <span className="text-[10px] text-gray-500 self-center">
                +{order.items.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Accept & Reject Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          onClick={handleDecline}
          disabled={isAccepting}
          className="col-span-1 flex items-center justify-center space-x-1 py-3 px-3 rounded-2xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white font-bold text-xs transition border border-dark-700"
        >
          <X className="w-4 h-4 text-rose-400" />
          <span>Pass</span>
        </button>

        <button
          onClick={() => onAccept(order.id)}
          disabled={isAccepting}
          className="col-span-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] hover:brightness-110 text-white font-black text-sm transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
        >
          {isAccepting ? (
            <span className="flex items-center space-x-1">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Accepting Order...</span>
            </span>
          ) : (
            <>
              <span>Accept Food Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

