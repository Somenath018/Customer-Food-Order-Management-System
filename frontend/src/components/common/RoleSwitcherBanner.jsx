import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Store, Bike, Shield, Sparkles } from 'lucide-react';

export const RoleSwitcherBanner = ({ activeView, onSelectRole }) => {
  const { user, role } = useAuth();

  const normalRoles = [
    {
      id: 'customer',
      label: 'Customer',
      icon: User,
      view: 'home'
    },
    {
      id: 'restaurant',
      label: 'Restaurant Partner',
      icon: Store,
      view: 'restaurant'
    },
    {
      id: 'driver',
      label: 'Delivery Partner',
      icon: Bike,
      view: 'driver'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-3 py-2 border-b border-slate-700/60 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        {/* Left: Active Session & Role */}
        <div className="flex items-center space-x-2.5">
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF5200] to-[#E23744] text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Foodie Ecosystem</span>
          </span>
          <span className="text-slate-300 font-medium">
            Account: <strong className="text-white capitalize">{user ? `${user.name} (${user.role})` : 'Guest'}</strong>
          </span>
        </div>

        {/* Right: Normal Role Options (Customer, Restaurant Partner, Delivery Partner) */}
        <div className="flex items-center space-x-2 flex-wrap justify-center">
          {normalRoles.map((r) => {
            const Icon = r.icon;
            const isCurrentView =
              (r.id === 'customer' && (activeView === 'home' || activeView === 'restaurant-detail' || activeView === 'orders')) ||
              (r.id === 'restaurant' && activeView === 'restaurant') ||
              (r.id === 'driver' && activeView === 'driver');

            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isCurrentView
                    ? 'bg-white text-slate-900 shadow-md ring-2 ring-[#FF5200] font-black'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                }`}
                title={`Switch to ${r.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrentView ? 'text-[#FF5200]' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}

          {/* Visual Divider separating normal role options from separate Admin portal */}
          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Admin Dashboard: Only Admin has a separate dashboard */}
          <button
            onClick={() => onSelectRole('admin')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border ${
              activeView === 'admin'
                ? 'bg-purple-600 text-white font-black ring-2 ring-purple-300 border-purple-500'
                : 'bg-purple-950/70 text-purple-300 hover:bg-purple-900 border-purple-700/60'
            }`}
            title="Open Separate Platform Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcherBanner;
