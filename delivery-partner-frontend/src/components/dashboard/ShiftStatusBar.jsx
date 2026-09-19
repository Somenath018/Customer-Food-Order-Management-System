import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Power, Bike, MapPin, ShieldCheck, Zap } from 'lucide-react';

export const ShiftStatusBar = ({ onGoToTasks, onGoToActive, hasActiveDelivery, availableCount }) => {
  const { driver, toggleOnline } = useAuth();
  const isOnline = driver ? driver.is_online : true;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Background glow when online */}
      {isOnline && (
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-rider-500/10 rounded-full blur-3xl pointer-events-none"></div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              isOnline
                ? 'bg-rider-500/20 border-rider-500/40 text-rider-400 shadow-md shadow-rider-500/20'
                : 'bg-dark-700 border-dark-600 text-gray-400'
            }`}
          >
            <Bike className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {driver?.name || 'Alex Rivera'}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-dark-700 text-gray-300 text-xs font-mono border border-dark-600">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Rider</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Vehicle: <strong className="text-gray-200">{driver?.vehicle_type || 'E-Scooter'}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Zone: <strong className="text-gray-200">Downtown NY Hub</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-700">
          {hasActiveDelivery ? (
            <button
              onClick={onGoToActive}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition shadow-lg shadow-amber-500/20 animate-pulse"
            >
              <span>Resume Active Trip</span>
            </button>
          ) : (
            <button
              onClick={onGoToTasks}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rider-600 to-emerald-600 text-white font-bold text-sm hover:from-rider-700 hover:to-emerald-700 transition shadow-lg shadow-rider-500/20"
            >
              <span>Find Deliveries</span>
              {availableCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-extrabold">
                  {availableCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => toggleOnline(!isOnline)}
            title={isOnline ? 'Go Offline' : 'Go Online'}
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
    </div>
  );
};
