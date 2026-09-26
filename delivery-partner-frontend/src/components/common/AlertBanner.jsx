import React, { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
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

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <BellRing className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              New Delivery Dispatch!
            </h4>
            <p className="text-sm font-medium text-white line-clamp-1">
              {incomingAlert.restaurantName} • Earn ${incomingAlert.fee || '3.50'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              clearAlert();
              onGoToTasks();
            }}
            className="flex items-center space-x-1 bg-white text-emerald-900 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-emerald-50 transition shadow"
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
