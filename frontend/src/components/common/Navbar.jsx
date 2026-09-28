import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { FoodieLogo } from './FoodieLogo';
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingBag,
  User,
  Clock,
  LogOut,
  Sparkles,
  Store,
  Bike,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export const Navbar = ({
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
  onOpenAuth,
  onOpenProfile,
  onOpenLocation
}) => {
  const { user, role, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { selectedAddress } = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <FoodieLogo
            size="md"
            badgeText={role === 'restaurant' ? 'Kitchen' : role === 'driver' ? 'Fleet' : role === 'admin' ? 'Admin' : ''}
            onClick={() => onViewChange('home')}
          />

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocation}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition text-left cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-[#FF5200] shrink-0 group-hover:animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                <span>{selectedAddress?.tag || 'Location'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
              </span>
              <span className="text-xs text-slate-500 max-w-[170px] truncate font-medium">
                {selectedAddress?.address || 'Select your location'}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Bar (Desktop) */}
        {activeView === 'home' && (
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search for restaurants, biryani, pizza, burgers..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Actions (Cart, Orders, Auth) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Orders History Link (if Customer) */}
          {user && role === 'customer' && (
            <button
              onClick={() => onViewChange('orders')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeView === 'orders'
                  ? 'bg-orange-50 text-[#FF5200] border border-orange-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="View my past and active orders"
            >
              <Clock className="w-4 h-4 text-[#FF5200]" />
              <span className="hidden sm:inline">My Orders</span>
            </button>
          )}

          {/* Cart Floating Button (Customer View) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-105 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#FF5200] flex items-center justify-center font-black text-[11px] shadow-xs">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                <img
                  src={
                    user.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user.name}
                  className="w-7 h-7 rounded-xl object-cover border border-orange-200"
                />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100">
                    <div className="text-xs font-extrabold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF5200]">
                      {user.role}
                    </span>
                  </div>

                  <div className="p-1 space-y-1 text-xs">
                    <button
                      onClick={onOpenProfile}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-left"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                      <span>Edit Profile</span>
                    </button>

                    {role === 'customer' && (
                      <button
                        onClick={() => onViewChange('orders')}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-left"
                      >
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Order History & Receipts</span>
                      </button>
                    )}

                    {role === 'restaurant' && (
                      <button
                        onClick={() => onViewChange('restaurant')}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-left"
                      >
                        <Store className="w-4 h-4 text-slate-500" />
                        <span>Restaurant Dashboard</span>
                      </button>
                    )}

                    {role === 'driver' && (
                      <button
                        onClick={() => onViewChange('driver')}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer text-left"
                      >
                        <Bike className="w-4 h-4 text-slate-500" />
                        <span>Delivery Fleet Dashboard</span>
                      </button>
                    )}

                    {role === 'admin' && (
                      <button
                        onClick={() => onViewChange('admin')}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-purple-700 hover:bg-purple-50 font-semibold cursor-pointer text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="h-px bg-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl border-2 border-[#FF5200] text-[#FF5200] hover:bg-orange-50 font-extrabold text-xs transition cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {activeView === 'home' && (
        <div className="lg:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
};
