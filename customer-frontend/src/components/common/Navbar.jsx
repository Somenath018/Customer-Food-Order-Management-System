import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSocket } from '../../context/SocketContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Flame,
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({
  onOpenCart,
  onOpenAuth,
  onGoHome,
  onGoOrders,
  activeOrderId,
  onTrackActiveOrder
}) => {
  const { user, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { isConnected } = useSocket();
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Address */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base tracking-wide text-white group-hover:text-brand-400 transition-colors">
                  CraveBite
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/30 font-bold uppercase">
                  Customer
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-gray-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[10px] uppercase font-mono tracking-tight">
                  {isConnected ? 'Real-Time Sync' : 'Connecting'}
                </span>
              </div>
            </div>
          </button>

          {/* Delivery Address Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-850 border border-dark-700/80 text-xs text-gray-300 max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">
              Deliver to: <strong className="text-white">{user?.address || '742 Evergreen Terrace'}</strong>
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Order Pill if there is an order in progress */}
          {activeOrderId && (
            <button
              type="button"
              onClick={() => onTrackActiveOrder(activeOrderId)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition shadow-sm text-xs font-bold animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse"></span>
              <span className="hidden sm:inline">Active Trip In Progress</span>
              <span className="sm:hidden">Track</span>
            </button>
          )}

          {/* Orders History Tab */}
          <button
            type="button"
            onClick={onGoOrders}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 text-xs font-semibold transition"
          >
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Orders</span>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition shadow-md shadow-brand-500/25 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-brand-700 text-[10px] font-black">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Auth / Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-750 transition"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-brand-500/50"
                />
                <span className="hidden md:inline text-xs font-bold text-white max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {userDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-dark-850 border border-dark-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-dark-750">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={onGoOrders}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-750 hover:text-white flex items-center space-x-2 transition"
                  >
                    <Clock className="w-4 h-4 text-brand-400" />
                    <span>My Past Orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-dark-750 flex items-center space-x-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-200 border border-dark-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <User className="w-4 h-4 text-brand-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
