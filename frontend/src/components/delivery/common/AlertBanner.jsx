import React, { useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { BellRing, ArrowRight, X } from 'lucide-react';

export const AlertBanner = ({ onGoToTasks }) => {
  const { incomingAlert, clearAlert } = useSocket();

  useEffect(() => {
    if (incomingAlert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 10000); // auto dismiss after 10s
      return () => clearTimeout(timer);
    }
  }, [incomingAlert, clearAlert]);

  if (!incomingAlert) return null;

  const rawFee = incomingAlert.fee || 3.50;
  const displayFee = rawFee < 15 ? Math.round(rawFee * 18) : rawFee;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-orange-400/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <BellRing className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-100">
              New Foodie Order Dispatch!
            </h4>
            <p className="text-sm font-black text-white line-clamp-1">
              {incomingAlert.restaurantName} • Earn ₹{displayFee}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              clearAlert();
              onGoToTasks();
            }}
            className="flex items-center space-x-1 bg-white text-[#FF5200] px-3.5 py-1.5 rounded-xl font-black text-xs hover:bg-orange-50 transition shadow cursor-pointer"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearAlert}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

