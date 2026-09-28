import React from 'react';
import { LayoutDashboard, Bell, Navigation, IndianRupee, Clock, User, Wallet } from 'lucide-react';

export const BottomNav = ({ activeTab, onTabChange, availableCount = 0, hasActiveDelivery = false }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Orders', icon: Bell, badge: availableCount },
    { id: 'active', label: 'Live Trip', icon: Navigation, isLive: hasActiveDelivery },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e121c]/95 backdrop-blur-md border-t border-dark-700/80 py-2 px-3 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#FF5200] font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#FF5200]' : 'stroke-2'}`} />

                {/* Badge for tasks count */}
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow animate-bounce">
                    {tab.badge}
                  </span>
                )}

                {/* Pulsing indicator if active trip exists */}
                {tab.isLive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF5200] beacon-pulse"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-white' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FF5200] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
