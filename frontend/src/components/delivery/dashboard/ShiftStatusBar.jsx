import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Power, Bike, MapPin, ShieldCheck, Zap } from 'lucide-react';

export const ShiftStatusBar = ({ onGoToTasks, onGoToActive, hasActiveDelivery, availableCount }) => {
  const { driver, toggleOnline } = useAuth();
  const isOnline = driver ? driver.is_online : true;

  const rawName = driver?.name || '';
  const riderName = rawName.includes('Alex') || !rawName ? 'Arjun Kumar' : rawName;

  return (
    <div className="bg-[#121622] border border-dark-700 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4">
      {/* Background glow when online */}
      {isOnline && (
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#FF5200]/15 rounded-full blur-3xl pointer-events-none"></div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              isOnline
                ? 'bg-gradient-to-br from-[#FF5200]/25 to-[#E23744]/20 border-[#FF5200]/40 text-[#ff7332] shadow-md shadow-orange-500/20'
                : 'bg-dark-800 border-dark-600 text-gray-400'
            }`}
          >
            <Bike className="w-6 h-6 text-[#FF5200]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                {riderName}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Aadhaar Verified</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Bike: <strong className="text-gray-200">Hero Splendor (KA-01)</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5200]" />
                <span>Zone: <strong className="text-gray-200">Koramangala, BLR</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-700">
          {hasActiveDelivery ? (
            <button
              onClick={onGoToActive}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white font-black text-sm hover:brightness-110 transition shadow-lg shadow-orange-500/25 animate-pulse"
            >
              <span>Resume Live Trip</span>
            </button>
          ) : (
            <button
              onClick={onGoToTasks}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] text-white font-extrabold text-sm hover:brightness-110 transition shadow-lg shadow-orange-500/25"
            >
              <span>Find Food Orders</span>
              {availableCount > 0 && (
                <span className="bg-white/25 px-2 py-0.5 rounded-full text-xs font-black">
                  {availableCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => toggleOnline(!isOnline)}
            title={isOnline ? 'Go Off Duty' : 'Go On Duty'}
            className={`p-2.5 rounded-xl border font-semibold transition ${
              isOnline
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Swiggy/Zomato Daily Incentive Progress Banner */}
      <div className="bg-gradient-to-r from-[#171d2c] to-[#121622] rounded-2xl p-3 border border-dark-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-gray-300">
          <span className="text-sm">🎯</span>
          <span>
            <strong>Today's Incentive:</strong> Complete 12 orders for <strong>₹200 bonus</strong>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-24 bg-dark-800 rounded-full h-2 overflow-hidden border border-dark-600">
            <div className="bg-gradient-to-r from-[#FF5200] to-[#E23744] h-full rounded-full" style={{ width: '66%' }}></div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#ff7332]">8 / 12 Trips (4 left)</span>
        </div>
      </div>
    </div>
  );
};

